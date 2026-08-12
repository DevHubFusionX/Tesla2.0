/* ─────────────────────────────────────────────
   useTransactions Hook — manages transactions queries
   and mutations using TanStack Query.
   ───────────────────────────────────────────── */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { transactionService } from '../services/transactionService';
import type { Transaction } from '../types';
import { useAppStore } from '../stores/appStore';
const mapBackendTransaction = (tx: any): Transaction => {
  let type: 'Deposit' | 'Withdrawal' = 'Deposit';
  if (tx.type === 'WITHDRAWAL' || tx.type === 'INVESTMENT') {
    type = 'Withdrawal';
  }

  let gateway = 'USDT (TRC20)';
  let destination: string | undefined = undefined;

  const desc = tx.description || '';
  if (desc.includes('via ')) {
    const parts = desc.split('via ');
    const viaPart = parts[1] || '';
    if (viaPart.includes(' to ')) {
      const subParts = viaPart.split(' to ');
      gateway = subParts[0].trim();
      destination = subParts[1].trim();
    } else {
      gateway = viaPart.trim();
    }
  } else if (tx.type === 'INVESTMENT') {
    gateway = 'Node Escrow';
  } else if (tx.type === 'RETURN') {
    gateway = 'Yield Accrual';
  }

  let status: any = 'Completed';
  if (tx.status === 'PENDING') status = 'Pending';
  if (tx.status === 'PROCESSING') status = 'Processing';
  if (tx.status === 'FAILED') status = 'Failed';

  const date = tx.createdAt
    ? new Date(tx.createdAt).toISOString().replace('T', ' ').slice(0, 16)
    : new Date().toISOString().replace('T', ' ').slice(0, 16);

  return {
    id: tx.id,
    type,
    gateway,
    amount: Math.abs(tx.amount),
    date,
    status,
    destination,
  };
};

export const useTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: queryKeys.transactions.all(),
    queryFn: async () => {
      const raw = await transactionService.getTransactions();
      const txList = Array.isArray(raw) ? raw : (raw as any).data || [];
      return txList.map(mapBackendTransaction);
    },
  });
};

export const useCreateDeposit = () => {
  const queryClient = useQueryClient();
  const adjustWalletBalance = useAppStore((state) => state.adjustWalletBalance);

  return useMutation<Transaction, Error, { amount: number; gateway: string; txHash: string }>({
    mutationFn: async ({ amount, gateway, txHash }) => {
      const response = await transactionService.createDeposit({ amount, gateway, txHash });
      const rawTx = (response as any).transaction || response;
      const newBalance = (response as any).newBalance;
      if (typeof newBalance === 'number') {
        useAppStore.getState().setWalletBalance(newBalance);
      }
      return mapBackendTransaction(rawTx);
    },
    onSuccess: (newTx) => {
      queryClient.setQueryData<Transaction[]>(queryKeys.transactions.all(), (old) => {
        return old ? [newTx, ...old] : [newTx];
      });
      adjustWalletBalance(newTx.amount, 'Deposit');
    },
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  const adjustWalletBalance = useAppStore((state) => state.adjustWalletBalance);

  return useMutation<Transaction, Error, { amount: number; gateway: string; address: string }>({
    mutationFn: async ({ amount, gateway, address }) => {
      const response = await transactionService.createWithdrawal({ amount, gateway, address });
      const rawTx = (response as any).transaction || response;
      const newBalance = (response as any).newBalance;
      if (typeof newBalance === 'number') {
        useAppStore.getState().setWalletBalance(newBalance);
      }
      return mapBackendTransaction(rawTx);
    },
    onSuccess: (newTx) => {
      queryClient.setQueryData<Transaction[]>(queryKeys.transactions.all(), (old) => {
        return old ? [newTx, ...old] : [newTx];
      });
      adjustWalletBalance(newTx.amount, 'Withdrawal');
    },
  });
};
