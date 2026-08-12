import type { PortfolioItem } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc, 
  runTransaction
} from 'firebase/firestore';

export interface InvestPayload {
  planId: string;
  amount: number;
}

export interface InvestResponse {
  portfolioItem: PortfolioItem;
  message: string;
}

const DEFAULT_PLANS = [
  {
    id: 'plan-1',
    name: 'Tesla Giga Stocks',
    description: 'Direct equity placement focusing on Tesla manufacturing and AI compute infrastructure.',
    minAmount: 500,
    maxAmount: 100000,
    roiPercent: 18.5,
    durationDays: 180,
    riskLevel: 'MODERATE',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'plan-2',
    name: 'Bitcoin Node Yield',
    description: 'High-yield yield farming backed by multi-sig Bitcoin lighting network routing node liquidity.',
    minAmount: 1000,
    maxAmount: 9999999, // default max
    roiPercent: 24.2,
    durationDays: 360,
    riskLevel: 'HIGH',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'plan-3',
    name: 'Giga Austin Real Estate REIT',
    description: 'Commercial real estate portfolio tracking industrial properties surrounding Gigafactory Texas.',
    minAmount: 2500,
    maxAmount: 250000,
    roiPercent: 9.8,
    durationDays: 720,
    riskLevel: 'LOW',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'plan-4',
    name: 'Tesla Energy Bonds',
    description: 'Fixed-income bonds supporting solar roof and Megapack deployment projects worldwide.',
    minAmount: 100,
    maxAmount: 50000,
    roiPercent: 6.5,
    durationDays: 90,
    riskLevel: 'LOW',
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const investmentService = {
  /** Fetch all available investment plans from Firestore, auto-seeding if empty. */
  async getPlans(): Promise<any> {
    const plansCol = collection(db, 'plans');
    const plansSnap = await getDocs(plansCol);

    if (plansSnap.empty) {
      // Seed default plans into Firestore database
      for (const plan of DEFAULT_PLANS) {
        await setDoc(doc(db, 'plans', plan.id), plan);
      }
      return { plans: DEFAULT_PLANS };
    }

    const plans = plansSnap.docs.map(doc => doc.data());
    return { plans };
  },

  /** Fetch the user's active portfolio from Firestore. */
  async getPortfolio(): Promise<any> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return { investments: [] };
    }

    const q = query(
      collection(db, 'investments'),
      where('userId', '==', firebaseUser.uid)
    );
    const snap = await getDocs(q);
    const investments = snap.docs.map(doc => doc.data());

    return { investments };
  },

  /** Deploy capital into a plan using a Firestore transaction. */
  async invest(data: InvestPayload): Promise<any> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('User not authenticated.');
    }

    const userId = firebaseUser.uid;
    const planRef = doc(db, 'plans', data.planId);
    const userRef = doc(db, 'users', userId);

    const investmentId = `inv-${Math.random().toString(36).substr(2, 9)}`;
    const transactionId = `tx-${Math.random().toString(36).substr(2, 9)}`;

    const result = await runTransaction(db, async (tx) => {
      const planDoc = await tx.get(planRef);
      const userDoc = await tx.get(userRef);

      if (!planDoc.exists()) {
        throw new Error('Investment plan not found.');
      }
      if (!userDoc.exists()) {
        throw new Error('User profile not found.');
      }

      const plan = planDoc.data();
      const user = userDoc.data();

      if (user.balance < data.amount) {
        throw new Error('Insufficient balance to invest');
      }

      if (data.amount < plan.minAmount) {
        throw new Error(`Minimum investment amount is $${plan.minAmount}`);
      }

      const newBalance = user.balance - data.amount;
      const currentCount = user._count || { investments: 0, transactions: 0 };

      // Update user document balance and count
      tx.update(userRef, {
        balance: newBalance,
        '_count.investments': (currentCount.investments || 0) + 1,
        updatedAt: new Date().toISOString()
      });

      // Calculate dates
      const startDate = new Date();
      const maturityDate = new Date();
      maturityDate.setDate(startDate.getDate() + plan.durationDays);

      // Create investment item
      const roiPercent = plan.roiPercent || (plan.interestRate * 100) || 10;
      const expectedReturn = data.amount + (data.amount * (roiPercent / 100) * (plan.durationDays / 365));

      const portfolioItem = {
        id: investmentId,
        userId: userId,
        planId: plan.id,
        amountInvested: data.amount,
        currentValuation: data.amount,
        expectedReturn: Number(expectedReturn.toFixed(4)),
        startDate: startDate.toISOString(),
        maturityDate: maturityDate.toISOString(),
        status: 'ACTIVE',
        plan: {
          name: plan.name,
          description: plan.description,
          interestRate: roiPercent / 100,
          durationDays: plan.durationDays
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const invRef = doc(db, 'investments', investmentId);
      tx.set(invRef, portfolioItem);

      // Create transaction log
      const txItem = {
        id: transactionId,
        userId: userId,
        type: 'INVESTMENT',
        amount: -data.amount,
        status: 'COMPLETED',
        description: `Capital deployment into ${plan.name} plan`,
        createdAt: new Date().toISOString()
      };

      const txRef = doc(db, 'transactions', transactionId);
      tx.set(txRef, txItem);

      return {
        investment: portfolioItem,
        newBalance
      };
    });

    return result;
  },
};
