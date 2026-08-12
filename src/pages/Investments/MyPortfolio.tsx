import React from 'react';
import { usePortfolio } from '../../hooks/useInvestments';
import type { PortfolioItem } from '../../types';

export interface Position {
  id: string;
  name: string;
  category: string;
  principal: number;
  yieldEarned: number;
  progress: number;
  termRemaining: string;
  status: string;
}

export const MyPortfolio: React.FC = () => {
  const { data: portfolio = [], isLoading } = usePortfolio();

  const mapPortfolioToPosition = (item: PortfolioItem): Position => {
    const start = new Date(item.startDate).getTime();
    const end = new Date(item.maturityDate).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    const progressPercent = total > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))) : 100;
    
    const remainingMs = end - now;
    const remainingDays = Math.max(0, Math.round(remainingMs / (1000 * 60 * 60 * 24)));
    const yieldEarned = Math.max(0, item.currentValue - item.invested);

    return {
      id: item.id,
      name: item.planName,
      category: item.category,
      principal: item.invested,
      yieldEarned: yieldEarned,
      progress: progressPercent,
      termRemaining: `${remainingDays} Days`,
      status: item.status === 'Active' ? 'Active Yielding' : item.status
    };
  };

  const positions = portfolio.map(mapPortfolioToPosition);
  const totalYield = positions.reduce((sum, pos) => sum + pos.yieldEarned, 0);
  const activeCount = positions.filter(pos => pos.status === 'Active Yielding').length;

  const activeRates = portfolio.filter(item => item.status === 'Active' && typeof item.roi === 'number');
  const avgReturn = activeRates.length > 0
    ? activeRates.reduce((sum, item) => sum + (item.roi || 0), 0) / activeRates.length
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <div className="w-6 h-6 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 animate-in fade-in duration-300 flex flex-col gap-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 shadow-xs">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Active Allocations</span>
          <p className="text-lg font-bold font-mono mt-1 text-[#1d1d1f]">
            {activeCount} {activeCount === 1 ? 'Node' : 'Nodes'} Deployed
          </p>
        </div>
        <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 shadow-xs">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Accrued Yield</span>
          <p className="text-lg font-bold font-mono mt-1 text-green-600">
            +${totalYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 shadow-xs">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Avg. Return Rate</span>
          <p className="text-lg font-bold font-mono mt-1 text-red-600">
            {avgReturn > 0 ? `${avgReturn.toFixed(1)}% APY` : '0.0% APY'}
          </p>
        </div>
      </div>

      {/* List of positions */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#86868b]">Active Placements</h2>
        {positions.map((pos: Position) => (
          <div key={pos.id} className="bg-white border border-[#e5e5e7] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-all">
            
            {/* Position Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-red-500/5 text-red-600 border border-red-500/10 px-2 py-0.5 rounded">
                  {pos.category}
                </span>
                <span className="text-[10px] text-[#86868b] font-mono">{pos.id}</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1d1d1f] mt-3">{pos.name}</h3>
              
              {/* Progress Bar */}
              <div className="mt-4 max-w-md">
                <div className="flex justify-between text-[9px] font-bold text-[#86868b] uppercase tracking-wider mb-1">
                  <span>Maturity Cycle</span>
                  <span>{pos.progress}% Completed</span>
                </div>
                <div className="w-full h-1 bg-[#f5f5f7] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-500" 
                    style={{ width: `${pos.progress}%` }} 
                  />
                </div>
                <span className="text-[9px] text-[#86868b] font-light block mt-1.5">{pos.termRemaining} remaining</span>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="flex gap-8 md:gap-12 items-center shrink-0 border-t md:border-t-0 border-[#f5f5f7] pt-4 md:pt-0">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Allocated Capital</span>
                <span className="text-sm font-bold font-mono text-[#1d1d1f] mt-0.5 block">${pos.principal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Accrued Yield</span>
                <span className="text-sm font-bold font-mono text-green-600 mt-0.5 block">+${pos.yieldEarned.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Status</span>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-green-500/5 text-green-600 border border-green-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {pos.status}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
export default MyPortfolio;
