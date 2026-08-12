import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  runTransaction
} from 'firebase/firestore';

export interface AdminOverview {
  totalUsers: number;
  totalInvestments: number;
  aum: number;
  activeInvestmentCount: number;
  maturedInvestmentCount: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalDepositCount: number;
  totalWithdrawalCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { investments: number; transactions: number };
}

export interface AdminTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export interface AdminKyc {
  id: string;
  userId: string;
  status: string;
  documentType: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export interface AdminPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number | null;
  roiPercent: number;
  durationDays: number;
  riskLevel: string;
  active: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const paginateList = <T>(list: T[], page: number, limit = 20): PaginatedResponse<T> => {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(totalPages, Math.max(1, page));
  const startIndex = (currentPage - 1) * limit;
  const data = list.slice(startIndex, startIndex + limit);

  return {
    data,
    pagination: {
      total,
      page: currentPage,
      limit,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    }
  };
};

export const adminService = {
  /** Get overview analytics statistics aggregated across Firestore collections. */
  getOverview: async (): Promise<AdminOverview> => {
    const usersSnap = await getDocs(collection(db, 'users'));
    const investmentsSnap = await getDocs(collection(db, 'investments'));
    const transactionsSnap = await getDocs(collection(db, 'transactions'));

    const users = usersSnap.docs.map(d => d.data());
    const investments = investmentsSnap.docs.map(d => d.data());
    const transactions = transactionsSnap.docs.map(d => d.data());

    const activeInvestments = investments.filter(p => p.status === 'ACTIVE');
    const maturedInvestments = investments.filter(p => p.status === 'MATURED');
    
    const completedDeposits = transactions.filter(t => t.type === 'DEPOSIT' && (t.status === 'COMPLETED' || t.status === 'SUCCESS'));
    const completedWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && (t.status === 'COMPLETED' || t.status === 'SUCCESS'));

    const aum = activeInvestments.reduce((sum, item) => sum + (item.amountInvested || 0), 0);
    const totalDeposited = completedDeposits.reduce((sum, item) => sum + Math.abs(item.amount || 0), 0);
    const totalWithdrawn = completedWithdrawals.reduce((sum, item) => sum + Math.abs(item.amount || 0), 0);

    return {
      totalUsers: users.length,
      totalInvestments: investments.length,
      aum,
      activeInvestmentCount: activeInvestments.length,
      maturedInvestmentCount: maturedInvestments.length,
      totalDeposited,
      totalWithdrawn,
      totalDepositCount: completedDeposits.length,
      totalWithdrawalCount: completedWithdrawals.length,
    };
  },

  /** Get users list from Firestore. */
  getUsers: async (page = 1, search?: string): Promise<PaginatedResponse<AdminUser>> => {
    const snap = await getDocs(collection(db, 'users'));
    let users = snap.docs.map(d => d.data() as AdminUser);

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
    }

    // Sort by creation date
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return paginateList(users, page, 20);
  },

  /** Update a user profile role or active status. */
  updateUser: async (userId: string, data: { role?: string; isActive?: boolean }): Promise<{ user: AdminUser }> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await getDoc(userRef);
    return { user: updatedDoc.data() as AdminUser };
  },

  /** Adjust a user's wallet balance using a Firestore transaction. */
  adjustBalance: async (userId: string, amount: number, description: string): Promise<any> => {
    const userRef = doc(db, 'users', userId);
    const txId = `tx-${Math.random().toString(36).substr(2, 9)}`;

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error('User not found.');
      }

      const user = userDoc.data();
      const currentBalance = user.balance || 0;
      const currentCount = user._count || { investments: 0, transactions: 0 };

      // Update balance
      transaction.update(userRef, {
        balance: currentBalance + amount,
        '_count.transactions': (currentCount.transactions || 0) + 1,
        updatedAt: new Date().toISOString()
      });

      // Write transaction record
      const txRef = doc(db, 'transactions', txId);
      transaction.set(txRef, {
        id: txId,
        userId,
        type: amount >= 0 ? 'DEPOSIT' : 'WITHDRAWAL',
        amount: amount,
        status: 'COMPLETED',
        description: description || `Balance adjustment by Admin`,
        createdAt: new Date().toISOString()
      });
    });

    return { success: true };
  },

  /** Query system-wide transactions mapping corresponding user profiles. */
  getTransactions: async (page = 1, status?: string, type?: string): Promise<PaginatedResponse<AdminTransaction>> => {
    const txsSnap = await getDocs(collection(db, 'transactions'));
    const usersSnap = await getDocs(collection(db, 'users'));

    const txs = txsSnap.docs.map(d => d.data());
    const users = usersSnap.docs.map(d => d.data());

    let mappedTxs: AdminTransaction[] = txs.map(tx => {
      const userProfile = users.find(u => u.id === tx.userId) || { id: tx.userId, name: 'Unknown User', email: 'unknown@tesla.com' };
      return {
        ...tx,
        user: { id: userProfile.id, name: userProfile.name || 'Unknown User', email: userProfile.email || '' }
      } as AdminTransaction;
    });

    if (status) {
      const qStatus = status.toUpperCase();
      mappedTxs = mappedTxs.filter(t => t.status === qStatus || (qStatus === 'SUCCESS' && t.status === 'COMPLETED'));
    }

    if (type) {
      const qType = type.toUpperCase();
      mappedTxs = mappedTxs.filter(t => t.type === qType);
    }

    // Sort transactions by date descending
    mappedTxs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return paginateList(mappedTxs, page, 20);
  },

  /** Approve or reject a deposit/withdrawal transaction. Reverses balance if failed. */
  reviewTransaction: async (transactionId: string, status: 'SUCCESS' | 'FAILED', rejectionReason?: string): Promise<any> => {
    const txRef = doc(db, 'transactions', transactionId);

    await runTransaction(db, async (dbTx) => {
      const txDoc = await dbTx.get(txRef);
      if (!txDoc.exists()) {
        throw new Error('Transaction not found.');
      }

      const tx = txDoc.data();
      const oldStatus = tx.status;
      const nextStatus = status === 'SUCCESS' ? 'COMPLETED' : 'FAILED';

      let description = tx.description;
      if (rejectionReason && nextStatus === 'FAILED') {
        description += ` (Rejected: ${rejectionReason})`;
      }

      // Update transaction status
      dbTx.update(txRef, {
        status: nextStatus,
        description
      });

      // Reverse balance if a pending transaction is failed
      if (oldStatus === 'PENDING' && nextStatus === 'FAILED') {
        const userRef = doc(db, 'users', tx.userId);
        const userDoc = await dbTx.get(userRef);

        if (userDoc.exists()) {
          const user = userDoc.data();
          const currentBalance = user.balance || 0;
          // Reversing: subtract the deposit amount (positive) OR add back withdrawal amount (negative)
          dbTx.update(userRef, {
            balance: Math.max(0, currentBalance - tx.amount),
            updatedAt: new Date().toISOString()
          });
        }
      }
    });

    return { success: true };
  },

  /** Fetch KYC compliance verification profiles from Firestore, seeding dummy profile if empty. */
  getKyc: async (page = 1, status?: string): Promise<PaginatedResponse<AdminKyc>> => {
    const kycCol = collection(db, 'kyc');
    const kycSnap = await getDocs(kycCol);
    const usersSnap = await getDocs(collection(db, 'users'));

    const users = usersSnap.docs.map(d => d.data());

    if (kycSnap.empty) {
      // Seed a default KYC profile if database is blank to make testing easier
      const defaultUser = users.find(u => u.email === 'frank@tesla.com') || users[0];
      if (defaultUser) {
        const seedKyc = {
          id: 'kyc-seed-1',
          userId: defaultUser.id,
          status: 'PENDING',
          documentType: 'Passport',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'kyc', seedKyc.id), seedKyc);
        const seedKycMapped: AdminKyc = {
          ...seedKyc,
          user: { id: defaultUser.id, name: defaultUser.name || 'Frank Tesla', email: defaultUser.email || '' }
        };
        return paginateList([seedKycMapped], page, 20);
      }
    }

    const kycList = kycSnap.docs.map(d => d.data());
    let mappedKyc: AdminKyc[] = kycList.map(k => {
      const userProfile = users.find(u => u.id === k.userId) || { id: k.userId, name: 'Unknown User', email: 'unknown@tesla.com' };
      return {
        ...k,
        user: { id: userProfile.id, name: userProfile.name || 'Unknown User', email: userProfile.email || '' }
      } as AdminKyc;
    });

    if (status) {
      const q = status.toUpperCase();
      mappedKyc = mappedKyc.filter(k => k.status === q);
    }

    mappedKyc.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return paginateList(mappedKyc, page, 20);
  },

  /** Get plans. */
  getPlans: async (): Promise<{ plans: AdminPlan[] }> => {
    const snap = await getDocs(collection(db, 'plans'));
    const plans = snap.docs.map(d => d.data() as AdminPlan);
    return { plans };
  },

  /** Create an investment plan inside Firestore. */
  createPlan: async (data: Omit<AdminPlan, 'id' | 'createdAt'>): Promise<{ plan: AdminPlan }> => {
    const id = `plan-${Math.random().toString(36).substr(2, 9)}`;
    const newPlan: AdminPlan = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'plans', id), newPlan);
    return { plan: newPlan };
  },

  /** Update an investment plan inside Firestore. */
  updatePlan: async (planId: string, data: Partial<AdminPlan>): Promise<{ plan: AdminPlan }> => {
    const planRef = doc(db, 'plans', planId);
    await updateDoc(planRef, data);

    const updatedDoc = await getDoc(planRef);
    return { plan: updatedDoc.data() as AdminPlan };
  },

  /** Delete an investment plan from Firestore. */
  deletePlan: async (planId: string): Promise<any> => {
    const planRef = doc(db, 'plans', planId);
    await deleteDoc(planRef);
    return { success: true };
  },
};
