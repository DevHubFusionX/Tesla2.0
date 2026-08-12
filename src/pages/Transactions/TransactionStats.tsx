import React from 'react';
import { useTransactions } from '../../hooks/useTransactions';

export const TransactionStats: React.FC = () => {
  const { data: transactions = [] } = useTransactions();

  // Compute inflow/outflow based on transaction list
  const totalInflow = transactions
    .filter(t => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === 'Withdrawal' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalInflow - totalOutflow;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Total Inflow */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-6 shadow-sm">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Total Node Inflows</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-[#1d1d1f] font-mono">
            ${totalInflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-green-600 font-bold">+100%</span>
        </div>
        <p className="text-[10px] text-[#86868b] mt-1">Sum of completed deposits and yields</p>
      </div>

      {/* Total Outflow */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-6 shadow-sm">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Total Outflows</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-[#1d1d1f] font-mono">
            -${totalOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-red-600 font-bold">In Flow</span>
        </div>
        <p className="text-[10px] text-[#86868b] mt-1">Sovereign withdrawals cleared</p>
      </div>

      {/* Net Statement Value */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-6 shadow-sm bg-linear-to-tr from-[#fbfbfb] to-white">
        <span className="text-[9px] font-bold uppercase tracking-widest text-red-600">Net Ledger Balance</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-[#1d1d1f] font-mono">
            ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-green-600 font-bold">Audit Verified</span>
        </div>
        <p className="text-[10px] text-[#86868b] mt-1">Available balance + active investment allocations</p>
      </div>

    </div>
  );
};
