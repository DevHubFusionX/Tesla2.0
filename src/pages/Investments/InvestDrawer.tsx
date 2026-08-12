import React, { useState } from 'react';
import { useInvest } from '../../hooks/useInvestments';
import { toast } from 'sonner';

type Risk = 'Low' | 'Moderate' | 'High';
type Category = 'equities' | 'crypto' | 'realestate';

export interface Plan {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  risk: Risk;
  nav: string;
  return1y: string;
  apy: number;
  minAmount: number;
  term: string;
  description: string;
  featured?: boolean;
}

const IconArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const RISK_COLORS: Record<Risk, string> = {
  Low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Moderate: 'text-orange-600 bg-orange-50 border-orange-200',
  High: 'text-red-600 bg-red-50 border-red-200',
};

interface InvestDrawerProps {
  plan: Plan;
  onClose: () => void;
}

export const InvestDrawer: React.FC<InvestDrawerProps> = ({ plan, onClose }) => {
  const [amount, setAmount] = useState<number>(plan.minAmount);
  const investMutation = useInvest();
  
  const valid = amount >= plan.minAmount;
  const estReturn = (amount * (plan.apy / 100)).toFixed(2);

  const handleDeploy = () => {
    if (!valid) return;
    investMutation.mutate(
      { planId: plan.id, amount },
      {
        onSuccess: (data: any) => {
          toast.success(data.message || `Successfully invested $${amount.toLocaleString()} into ${plan.name}`);
          onClose();
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to deploy capital.');
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">Invest in</p>
            <h2 className="text-[17px] font-bold text-[#1d1d1f] mt-0.5">{plan.name}</h2>
            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1.5 ${RISK_COLORS[plan.risk]}`}>
              {plan.risk} Risk
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f5f7] hover:bg-[#e8e8e8] transition-colors text-[#86868b] text-lg border-none cursor-pointer">
            ×
          </button>
        </div>

        {/* Plan details */}
        <div className="bg-[#f9f9f9] border border-[#e5e5e7] rounded-2xl p-4 mb-5 flex flex-col gap-2.5">
          {[
            { label: 'Current NAV', value: plan.nav },
            { label: '1Y Return', value: plan.return1y, green: true },
            { label: 'Expected APY', value: `${plan.apy}%`, red: true },
            { label: 'Lock-up Term', value: plan.term },
          ].map(({ label, value, green, red }) => (
            <div key={label} className="flex justify-between items-center text-xs border-t border-black/5 first:border-0 pt-2 first:pt-0">
              <span className="text-[#86868b]">{label}</span>
              <strong className={`font-mono ${green ? 'text-emerald-600' : red ? 'text-[#c0000a]' : 'text-[#1d1d1f]'}`}>{value}</strong>
            </div>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868b] block mb-1.5">
            Investment Amount (USD)
          </label>
          <input
            type="number"
            min={plan.minAmount}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl px-4 py-3 text-sm font-mono text-[#1d1d1f] focus:outline-none focus:border-[#c0000a]/50 transition-colors"
          />
          {!valid && (
            <p className="text-[10px] text-red-600 font-bold mt-1">Minimum is ${plan.minAmount.toLocaleString()}</p>
          )}
        </div>

        {/* Est. return */}
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/70">Est. Annual Return</p>
            <p className="text-xl font-bold text-emerald-600 font-mono mt-0.5">+${estReturn}</p>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 bg-white px-2.5 py-1 rounded-full border border-emerald-200">Verified</span>
        </div>

        <button
          onClick={handleDeploy}
          disabled={!valid || investMutation.isPending}
          className="w-full bg-[#c0000a] hover:bg-red-700 disabled:bg-[#e5e5e7] disabled:text-[#86868b] disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm border-none cursor-pointer"
        >
          {investMutation.isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Deploy Capital</span>
              <IconArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
