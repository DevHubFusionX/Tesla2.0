import React from 'react';
import { usePortfolio } from '../../hooks/useInvestments';

export const PerformanceHistory: React.FC = () => {
  const { data: portfolio = [], isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <div className="w-6 h-6 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate stats
  const completedYields = portfolio.map(item => ({
    name: item.planName,
    yield: Math.max(0, item.currentValue - item.invested),
    date: item.startDate,
    status: item.status,
  }));

  return (
    <div className="px-4 animate-in fade-in duration-300 flex flex-col gap-6">
      {/* Chart */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-6 shadow-xs">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Monthly Yield Inflow Tracker</span>
        
        {completedYields.length === 0 ? (
          <div className="h-40 flex items-center justify-center border-b border-[#e5e5e7] pb-2 text-xs text-[#86868b] font-light">
            No yield entries recorded yet.
          </div>
        ) : (
          <div className="mt-8 flex items-end justify-around h-40 border-b border-[#e5e5e7] pb-2 font-mono">
            {completedYields.map((item, index) => {
              // Calculate percentage height relative to max yield or simple height
              const maxYield = Math.max(...completedYields.map(i => i.yield), 10);
              const heightPct = Math.max(10, Math.min(100, (item.yield / maxYield) * 100));
              
              return (
                <div key={index} className="flex flex-col items-center gap-2.5 w-1/4">
                  <span className="text-[10px] font-bold text-[#86868b]">${item.yield.toFixed(2)}</span>
                  <div 
                    className="w-10 bg-red-600/10 border-t-2 border-red-600 rounded-t-sm transition-all duration-500 hover:bg-red-600/20" 
                    style={{ height: `${heightPct * 0.8}px` }}
                  />
                  <span className="text-[9px] font-sans uppercase tracking-wider text-[#86868b] mt-1 truncate max-w-20">
                    {item.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payouts Table */}
      <div className="flex flex-col gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#86868b]">Maturity Ledger Accounts</span>
        
        <div className="bg-white border border-[#e5e5e7] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fbfbfb] border-b border-[#e5e5e7]">
                  <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Billing Period / Plan</th>
                  <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b] text-right">Total Yield</th>
                  <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b] text-center">Settlement Date</th>
                  <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e7] text-xs font-mono">
                {completedYields.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs text-[#86868b] font-sans font-light">
                      No historical placements found.
                    </td>
                  </tr>
                ) : (
                  completedYields.map((row, index) => (
                    <tr key={index} className="hover:bg-[#fbfbfb] transition-colors">
                      <td className="p-4 font-bold text-[#1d1d1f] font-sans">{row.name}</td>
                      <td className="p-4 text-right font-bold text-green-600">
                        {row.yield > 0 ? `+$${row.yield.toFixed(2)}` : '$0.00'}
                      </td>
                      <td className="p-4 text-center text-[#86868b] font-sans">{row.date}</td>
                      <td className="p-4 text-center font-sans">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          row.status === 'Active' 
                            ? 'bg-green-500/5 text-green-600 border border-green-500/10'
                            : 'bg-neutral-500/5 text-neutral-600 border border-neutral-500/10'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Active' ? 'bg-green-500' : 'bg-neutral-500'}`} />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PerformanceHistory;
