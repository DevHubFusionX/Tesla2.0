import React from 'react';
import type { Plan } from './InvestDrawer';

const IconArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const RISK_COLORS = {
  Low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Moderate: 'text-orange-600 bg-orange-50 border-orange-200',
  High: 'text-red-600 bg-red-50 border-red-200',
};

interface PlanCardProps {
  plan: Plan;
  onInvest: (p: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onInvest }) => (
  <div className="bg-white rounded-2xl border border-[#e5e5e7] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
    <div className="px-5 pt-5 pb-4">
      {/* Title row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-[#1d1d1f] leading-tight truncate pr-2">{plan.name}</h3>
          <span className="text-[11px] text-[#86868b] font-medium mt-0.5 block">{plan.subtitle}</span>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${RISK_COLORS[plan.risk]} shrink-0`}>
          {plan.risk}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-2 border-t border-[#f5f5f7] pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#86868b]">Current NAV</span>
          <span className="text-xs font-semibold font-mono text-[#1d1d1f]">{plan.nav}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#86868b]">1Y Return</span>
          <span className="text-xs font-bold font-mono text-emerald-600">{plan.return1y}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#86868b]">Min Investment</span>
          <span className="text-xs font-semibold font-mono text-[#1d1d1f]">${plan.minAmount.toLocaleString()}.00</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#86868b]">Term</span>
          <span className="text-xs font-semibold text-[#1d1d1f]">{plan.term}</span>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="px-5 pb-5 flex items-center gap-3 border-t border-[#f5f5f7] pt-3">
      <button
        onClick={() => onInvest(plan)}
        className="flex items-center gap-1 text-[11px] font-bold text-[#c0000a] hover:text-red-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
      >
        <span>View Details</span>
        <IconArrowRight />
      </button>
      <div className="flex-1" />
      <button
        onClick={() => onInvest(plan)}
        className="flex-1 text-center bg-[#1d1d1f] hover:bg-black text-white text-[11px] font-bold py-2.5 px-4 rounded-xl transition-colors duration-200 border-none cursor-pointer"
      >
        Invest Now
      </button>
    </div>
  </div>
);
