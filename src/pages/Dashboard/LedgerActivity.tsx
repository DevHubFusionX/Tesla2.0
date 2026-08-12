import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { IconCopy } from '../../components/ui/Icons';

export const LedgerActivity: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://teslafinance.co/ref/franklin';
  const { data: transactions = [], isLoading } = useTransactions();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      
      {/* Activity Ledger Column */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between border-b border-[#e5e5e7] pb-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#86868b]">Ledger Activity</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">View Ledger</span>
          </div>

          <div className="flex flex-col gap-3 font-mono">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-4 h-4 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((txn, index) => (
                <div key={txn.id} className={`flex items-center justify-between py-1 text-xs ${index > 0 ? 'border-t border-black/5 pt-3' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#1d1d1f] font-semibold">{txn.type} ({txn.gateway})</span>
                    <span className="text-[9px] text-[#86868b] font-light mt-0.5">{txn.date}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold font-mono ${txn.type === 'Deposit' ? 'text-green-600' : 'text-[#1d1d1f]'}`}>
                      {txn.type === 'Deposit' ? `+$${txn.amount.toLocaleString()}` : `-$${txn.amount.toLocaleString()}`}
                    </span>
                    <span className={`text-[8px] rounded px-1 ml-1.5 font-sans font-bold uppercase ${
                      txn.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                      txn.status === 'Failed' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-[#86868b] font-light">No ledger activity found.</span>
            )}
          </div>
        </div>
      </div>

      {/* Referrals Network Node */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between border-b border-[#e5e5e7] pb-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#86868b]">Partner Network</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-500/5 border border-red-500/10 px-1.5 py-0.25 rounded">Active Node</span>
          </div>

          <p className="text-xs text-[#86868b] font-light leading-relaxed">
            Invite associates to join Tesla Finance. Earn a flat <strong>5% reward</strong> on their direct asset deposits. No deposit required to qualify.
          </p>

          <div className="mt-6 flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Your Node Referral Link</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={referralLink} 
                className="flex-1 bg-[#f5f5f7] border border-[#e5e5e7] rounded-lg px-3 py-2 text-xs font-mono text-[#1d1d1f] focus:outline-none select-all"
              />
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-[#c0000a] hover:bg-red-700 text-white font-bold uppercase text-[10px] tracking-wider px-3.5 py-2 rounded-lg transition-colors shrink-0 shadow-sm shadow-red-600/10 cursor-pointer border-none"
              >
                <IconCopy size={14} />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
