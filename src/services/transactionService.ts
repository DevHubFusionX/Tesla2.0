import { auth, db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  runTransaction
} from 'firebase/firestore';

export interface DepositPayload {
  amount: number;
  gateway: string;
  txHash: string;
}

export interface WithdrawalPayload {
  amount: number;
  gateway: string;
  address: string;
}

export const transactionService = {
  /** Fetch all transactions for the authenticated user from Firestore. */
  async getTransactions(): Promise<any> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return [];

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', firebaseUser.uid)
    );
    const snap = await getDocs(q);
    const txs = snap.docs.map(doc => doc.data());
    
    // Sort in-memory to prevent missing Firestore index errors
    return txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /** Submit a new deposit request. */
  async createDeposit(data: DepositPayload): Promise<any> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('User not authenticated.');
    }

    const userId = firebaseUser.uid;
    const userRef = doc(db, 'users', userId);
    const txId = `tx-${Math.random().toString(36).substr(2, 9)}`;

    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error('User profile not found.');
      }

      const user = userDoc.data();
      const newBalance = user.balance + data.amount;
      const currentCount = user._count || { investments: 0, transactions: 0 };

      // Update user wallet balance and tx count
      transaction.update(userRef, {
        balance: newBalance,
        '_count.transactions': (currentCount.transactions || 0) + 1,
        updatedAt: new Date().toISOString()
      });

      // Write deposit transaction log
      const tx = {
        id: txId,
        userId: userId,
        type: 'DEPOSIT',
        amount: data.amount,
        status: 'PENDING',
        description: `Deposit via ${data.gateway} to main wallet (txHash: ${data.txHash})`,
        createdAt: new Date().toISOString()
      };

      const txRef = doc(db, 'transactions', txId);
      transaction.set(txRef, tx);

      return {
        transaction: tx,
        newBalance
      };
    });

    return result;
  },

  /** Submit a new withdrawal request. */
  async createWithdrawal(data: WithdrawalPayload): Promise<any> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('User not authenticated.');
    }

    const userId = firebaseUser.uid;
    const userRef = doc(db, 'users', userId);
    const txId = `tx-${Math.random().toString(36).substr(2, 9)}`;

    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error('User profile not found.');
      }

      const user = userDoc.data();

      if (user.balance < data.amount) {
        throw new Error('Insufficient balance');
      }

      const newBalance = Math.max(0, user.balance - data.amount);
      const currentCount = user._count || { investments: 0, transactions: 0 };

      // Update user wallet balance and tx count
      transaction.update(userRef, {
        balance: newBalance,
        '_count.transactions': (currentCount.transactions || 0) + 1,
        updatedAt: new Date().toISOString()
      });

      // Write withdrawal transaction log
      const tx = {
        id: txId,
        userId: userId,
        type: 'WITHDRAWAL',
        amount: -data.amount,
        status: 'PENDING',
        description: `Withdrawal via ${data.gateway} to ${data.address}`,
        createdAt: new Date().toISOString()
      };

      const txRef = doc(db, 'transactions', txId);
      transaction.set(txRef, tx);

      return {
        transaction: tx,
        newBalance
      };
    });

    return result;
  },
};
