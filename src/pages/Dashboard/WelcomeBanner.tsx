import React from 'react';
import type { User } from '../../types';
import { IconWallet, IconPlus, IconArrowUpRight } from '../../components/ui/Icons';

interface WelcomeBannerProps {
  user: User;
  walletBalance: number;
  navigate: (path: string, options?: any) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, walletBalance, navigate }) => {
  return (
    <div className="bg-linear-to-br from-[#90000a] via-[#750007] to-[#400003] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Glow accent overlay */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

      <div className="z-10 max-w-xl">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50">Overview</p>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-1.5">
          Welcome back, {user.name}
        </h1>
        <p className="text-[11px] text-white/70 mt-1 font-light leading-relaxed">
          Track your investments, manage your portfolio, and explore opportunities.
        </p>
      </div>

      {/* Available Balance Box inside Welcome Banner */}
      <div className="z-10 w-full md:w-auto min-w-70 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Available Balance</span>
            <p className="text-2xl md:text-3xl font-extrabold tracking-tight mt-0.5">
              ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          {/* Wallet Icon wrapper */}
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/10 text-white shrink-0">
            <IconWallet size={18} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/dashboard/deposit', { state: { mode: 'deposit' } })}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white text-[#90000a] hover:bg-white/90 transition-colors shadow-sm cursor-pointer border-none"
          >
            <IconPlus size={14} />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/deposit', { state: { mode: 'withdraw' } })}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <IconArrowUpRight size={14} />
            <span>Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  );
};
