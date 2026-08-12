import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { IconArrowUpRight } from '../../components/ui/Icons';
import type { Transaction } from '../../types';

const IconArrowDownLeft = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
    <line x1="17" y1="7" x2="7" y2="17" />
    <polyline points="17 17 7 17 7 7" />
  </svg>
);

interface TransactionTableProps {
  filteredTxns: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ filteredTxns }) => {
  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fbfbfb] border-b border-[#e5e5e7]">
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Txn ID / Ref</th>
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Timestamp</th>
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Description</th>
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b] text-right">Amount</th>
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b] text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e7] text-xs font-mono">
            {filteredTxns.length > 0 ? (
              filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-black/1 transition-colors">
                  {/* ID & Reference */}
                  <td className="p-4 font-semibold text-[#1d1d1f]">
                    <div>{txn.id}</div>
                    <div className="text-[9px] text-[#86868b] font-light mt-0.5">{txn.destination || txn.gateway}</div>
                  </td>
                  
                  {/* Timestamp */}
                  <td className="p-4 text-[#86868b] font-light font-sans">{txn.date}</td>
                  
                  {/* Description */}
                  <td className="p-4 text-[#1d1d1f] font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#f5f5f7] border border-[#e5e5e7] flex items-center justify-center shrink-0">
                        {txn.type === 'Deposit' ? <IconArrowDownLeft /> : <IconArrowUpRight size={12} />}
                      </span>
                      <span className="font-semibold">{txn.type} ({txn.gateway})</span>
                    </div>
                  </td>
                  
                  {/* Amount */}
                  <td className={`p-4 text-right font-bold ${txn.type === 'Deposit' ? 'text-green-600' : 'text-[#1d1d1f]'}`}>
                    {txn.type === 'Deposit' ? `+$${txn.amount.toFixed(2)}` : `-$${txn.amount.toFixed(2)}`}
                  </td>
                  
                  {/* Status badge */}
                  <td className="p-4 text-center font-sans">
                    <Badge status={txn.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-[#86868b] font-sans font-light">
                  No transactions match the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer info */}
      <div className="bg-[#fbfbfb] border-t border-[#e5e5e7] px-6 py-4 flex items-center justify-between text-[10px] text-[#86868b] font-sans font-light">
        <span>Showing {filteredTxns.length} transactions</span>
        <span>Ledger synced: Just now</span>
      </div>
    </div>
  );
};
