import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, runTransaction } from 'firebase/firestore';

/**
 * Calculates current real-time valuation of an active investment based on time progress.
 */
export function calculateCurrentValuation(amountInvested: number, expectedReturn: number, startDateStr: string, maturityDateStr: string): number {
  const now = new Date().getTime();
  const start = new Date(startDateStr).getTime();
  const end = new Date(maturityDateStr).getTime();

  if (now <= start) {
    return amountInvested;
  }
  if (now >= end) {
    return expectedReturn;
  }

  const progress = (now - start) / (end - start);
  const profit = expectedReturn - amountInvested;
  const valuation = amountInvested + profit * progress;
  return Number(valuation.toFixed(4));
}

/**
 * Scans the current authenticated user's ACTIVE investments.
 * Updates valuations in real time, and for any investment that is past its maturity date:
 * - Atomically marks the status as MATURED.
 * - Adds expected return to the user's wallet balance.
 * - Logs a RETURN transaction in the ledger.
 */
export async function syncUserInvestments(userId: string): Promise<{ maturedCount: number; updatedCount: number }> {
  let maturedCount = 0;
  let updatedCount = 0;

  try {
    // 1. Fetch user's active investments
    const q = query(
      collection(db, 'investments'),
      where('userId', '==', userId),
      where('status', '==', 'ACTIVE')
    );
    const snap = await getDocs(q);
    const now = new Date();

    for (const d of snap.docs) {
      const data = d.data();
      const startDate = data.startDate;
      const maturityDate = data.maturityDate;
      const amountInvested = data.amountInvested;
      
      // Calculate expected return if not stored
      const interestRate = data.plan?.interestRate || 0;
      const durationDays = data.plan?.durationDays || 30;
      const expectedReturn = data.expectedReturn || (amountInvested + (amountInvested * interestRate * (durationDays / 365)));

      const maturityTime = new Date(maturityDate).getTime();

      if (now.getTime() >= maturityTime) {
        // Investment has matured! Run a transaction to execute payout atomically
        await runTransaction(db, async (transaction) => {
          const userRef = doc(db, 'users', userId);
          const userDoc = await transaction.get(userRef);

          if (!userDoc.exists()) {
            throw new Error('User document does not exist.');
          }

          const currentBalance = userDoc.data().balance || 0;
          const newBalance = currentBalance + expectedReturn;

          // Update investment status to MATURED and set valuation to expected return
          const invRef = doc(db, 'investments', d.id);
          transaction.update(invRef, {
            status: 'MATURED',
            currentValuation: expectedReturn,
            updatedAt: now.toISOString()
          });

          // Update user wallet balance
          transaction.update(userRef, {
            balance: newBalance,
            updatedAt: now.toISOString()
          });

          // Log transaction record
          const txRef = doc(collection(db, 'transactions'));
          transaction.set(txRef, {
            id: txRef.id,
            userId,
            type: 'RETURN',
            amount: expectedReturn,
            status: 'COMPLETED',
            description: `Maturity Payout for ${data.plan?.name || 'Investment Plan'}`,
            createdAt: now.toISOString()
          });
        });

        maturedCount++;
      } else {
        // Investment is still active; update its live valuation estimate
        const currentVal = calculateCurrentValuation(amountInvested, expectedReturn, startDate, maturityDate);
        
        // Update document (no strict transaction required for standard valuation updates)
        const invRef = doc(db, 'investments', d.id);
        await runTransaction(db, async (transaction) => {
          transaction.update(invRef, {
            currentValuation: currentVal,
            updatedAt: now.toISOString()
          });
        });
        
        updatedCount++;
      }
    }
  } catch (error) {
    console.error('Failed to sync user investments & valuations:', error);
  }

  return { maturedCount, updatedCount };
}
