import React from 'react';
import type { Transaction } from '../../types';
import { Badge } from '../../components/ui/Badge';

interface ActivityRegistryProps {
  recentTransactions: Transaction[];
}

export const ActivityRegistry: React.FC<ActivityRegistryProps> = ({ recentTransactions }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-12">
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">Activity Registry</h2>
        <p className="text-[10px] text-[#86868b] mt-1">Review history of recent funding assets settlements.</p>
      </div>

      <div className="border border-[#e5e5e7]/80 rounded-2xl overflow-hidden divide-y divide-[#e5e5e7]/80 bg-white shadow-2xs">
        {recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#86868b]">No transactions recorded yet.</div>
        ) : (
          recentTransactions.map(tx => (
            <div key={tx.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#fcfcfd] transition-colors">
              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1d1d1f]">{tx.type}</span>
                    <span className="text-[9.5px] font-mono text-[#86868b]">{tx.id}</span>
                  </div>
                  <span className="text-[10px] text-[#86868b] mt-0.5 block">{tx.date} • {tx.gateway}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="font-bold text-[#1d1d1f] font-mono">
                  {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                
                <Badge status={tx.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
