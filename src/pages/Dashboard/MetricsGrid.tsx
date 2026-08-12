import React from 'react';
import { usePortfolio } from '../../hooks/useInvestments';
import { useAppStore } from '../../stores/appStore';
import { IconTrendUp } from '../../components/ui/Icons';

export const MetricsGrid: React.FC = () => {
  const { data: portfolio = [], isLoading } = usePortfolio();
  const walletBalance = useAppStore((state) => state.walletBalance);

  const activeInvestments = portfolio.filter((item) => item.status === 'Active');
  
  const totalInvested = activeInvestments.reduce((sum, item) => sum + item.invested, 0);
  const totalCurrentValue = activeInvestments.reduce((sum, item) => sum + item.currentValue, 0);
  const portfolioValue = totalCurrentValue + walletBalance;

  const stockHoldings = activeInvestments
    .filter((item) => item.category === 'Stocks' || item.category === 'Bonds')
    .reduce((sum, item) => sum + item.currentValue, 0);

  const stockPositionsCount = activeInvestments.filter(
    (item) => item.category === 'Stocks' || item.category === 'Bonds'
  ).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e5e5e7] rounded-2xl p-4 md:p-5 h-28 flex items-center justify-center shadow-xs">
            <div className="w-5 h-5 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  const profitPercentage = totalInvested > 0 
    ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      {/* Card 1: Portfolio Value */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Portfolio Value</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base md:text-xl font-extrabold tracking-tight font-mono">
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-green-600 shrink-0"><IconTrendUp size={16} /></span>
          </div>
        </div>
        <span className="text-[10px] text-green-600 font-bold tracking-wide mt-3 block">
          +{profitPercentage.toFixed(1)}% all-time yield
        </span>
      </div>

      {/* Card 2: Investments */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Investments</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base md:text-xl font-extrabold tracking-tight font-mono">
              ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#c0000a] shrink-0">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
        </div>
        <span className="text-[10px] text-[#c0000a] font-bold tracking-wide mt-3 block">
          {activeInvestments.length} active {activeInvestments.length === 1 ? 'plan' : 'plans'}
        </span>
      </div>

      {/* Card 3: Stock Holdings */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Stock Holdings</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base md:text-xl font-extrabold tracking-tight font-mono">
              ${stockHoldings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-600 shrink-0">
              <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
            </svg>
          </div>
        </div>
        <span className="text-[10px] text-purple-600 font-bold tracking-wide mt-3 block">
          {stockPositionsCount} stock {stockPositionsCount === 1 ? 'position' : 'positions'}
        </span>
      </div>

      {/* Card 4: Tesla Vehicles */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Tesla Vehicles</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base md:text-xl font-extrabold tracking-tight">0</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#c0000a] shrink-0">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
              <path d="M9 17h6" />
            </svg>
          </div>
        </div>
        <span className="text-[10px] text-[#c0000a] font-bold tracking-wide mt-3 block">
          Electric fleet
        </span>
      </div>

    </div>
  );
};
