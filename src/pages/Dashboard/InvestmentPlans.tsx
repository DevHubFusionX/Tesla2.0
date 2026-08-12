import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '../../components/ui/Icons';

const IconCpu = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

export const InvestmentPlans: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-[#e5e5e7] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-red-600"><IconCpu /></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d1d1f]">Featured Investment Plans</span>
          <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-widest text-red-600 bg-red-500/5 border border-red-500/10 px-1.5 py-0.5 rounded">Live</span>
        </div>
        <Link to="/dashboard/investments" className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors">View All Plans →</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Tesla Growth Fund', subtitle: 'Tesla-Focused', risk: 'High', riskColor: 'text-red-600 bg-red-50 border-red-200', nav: '$35.5000', return1y: '+9.23%', minInvest: '$100.00', category: 'equities' },
          { name: 'Stablecoin Arbitrage', subtitle: 'High-Frequency', risk: 'High', riskColor: 'text-red-600 bg-red-50 border-red-200', nav: '$50.0000', return1y: '+24.20%', minInvest: '$1,000.00', category: 'crypto' },
          { name: 'Supercharger Network', subtitle: 'Real Estate', risk: 'Low', riskColor: 'text-emerald-600 bg-emerald-50 border-emerald-200', nav: '$18.7500', return1y: '+8.40%', minInvest: '$2,500.00', category: 'realestate' },
        ].map((plan) => (
          <div key={plan.name} className="bg-white border border-[#e5e5e7] rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-[#1d1d1f] leading-tight">{plan.name}</h3>
                  <span className="text-[11px] text-[#86868b] font-medium mt-0.5 block">{plan.subtitle}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${plan.riskColor} shrink-0 ml-3`}>{plan.risk}</span>
              </div>
              <div className="flex flex-col gap-2 mt-3 border-t border-[#f5f5f7] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#86868b]">Current NAV</span>
                  <span className="text-[11px] font-semibold font-mono text-[#1d1d1f]">{plan.nav}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#86868b]">1Y Return</span>
                  <span className="text-[11px] font-bold font-mono text-emerald-600">{plan.return1y}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#86868b]">Min Investment</span>
                  <span className="text-[11px] font-semibold font-mono text-[#1d1d1f]">{plan.minInvest}</span>
                </div>
              </div>
            </div>
            <div className="px-5 pb-4 flex items-center gap-3">
              <Link to="/dashboard/investments" state={{ tab: 'plans', category: plan.category }} className="flex items-center gap-1 text-[11px] font-bold text-[#c0000a] hover:text-red-700 transition-colors">
                View Details <IconArrowRight size={14} />
              </Link>
              <div className="flex-1" />
              <Link to="/dashboard/investments" state={{ tab: 'plans', category: plan.category }} className="flex-1 text-center bg-[#1d1d1f] hover:bg-black text-white text-[11px] font-bold py-2 px-3 rounded-xl transition-colors">
                Invest Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
