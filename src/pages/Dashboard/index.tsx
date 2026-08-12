import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import { WelcomeBanner } from './WelcomeBanner';
import { MetricsGrid } from './MetricsGrid';
import { InvestmentPlans } from './InvestmentPlans';
import { LedgerActivity } from './LedgerActivity';
import { IconArrowRight } from '../../components/ui/Icons';

const IconShieldAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const walletBalance = useAppStore((state) => state.walletBalance);

  if (!user) return null;

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-6 md:gap-10 select-none font-sans text-[#1d1d1f]">
      
      {/* Welcome Banner Card (Premium Deep Crimson/Red Gradient) */}
      <WelcomeBanner user={user} walletBalance={walletBalance} navigate={navigate} />

      {/* Metrics Grid */}
      <MetricsGrid />

      {/* Featured Investment Plans */}
      <InvestmentPlans />

      {/* Category Navigation */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#e5e5e7] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d1d1f]">Browse by Category</span>
          <Link to="/dashboard/investments" className="text-[10px] font-bold uppercase tracking-wider text-[#86868b] hover:text-[#1d1d1f] transition-colors">All Plans →</Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Equities', sub: 'Stock Market', icon: '📈', category: 'equities', from: 'from-blue-50', to: 'to-indigo-50', border: 'border-blue-200/60', text: 'text-blue-700' },
            { label: 'Crypto', sub: 'Digital Assets', icon: '₿', category: 'crypto', from: 'from-amber-50', to: 'to-orange-50', border: 'border-orange-200/60', text: 'text-orange-700' },
            { label: 'Real Estate', sub: 'Physical Assets', icon: '🏗️', category: 'realestate', from: 'from-emerald-50', to: 'to-green-50', border: 'border-emerald-200/60', text: 'text-emerald-700' },
          ].map((cat) => (
            <Link key={cat.label} to="/dashboard/investments" state={{ tab: 'plans', category: cat.category }} className={`flex flex-col items-center text-center p-4 rounded-2xl bg-linear-to-br ${cat.from} ${cat.to} border ${cat.border} hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5`}>
              <span className="text-2xl mb-2">{cat.icon}</span>
              <span className={`text-[11px] font-bold ${cat.text}`}>{cat.label}</span>
              <span className="text-[9px] text-[#86868b] mt-0.5">{cat.sub}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Ledger & Partner Network referrals */}
      <LedgerActivity />

      {/* Bottom Banner: Verification & KYC */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <IconShieldAlert />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">Identity Verification Required</h4>
            <p className="text-xs text-[#86868b] font-light mt-1">
              Your account currently has restricted access. Complete your KYC/Identity Verification to unlock premium packages, uncap deposit limits, and activate fast payouts.
            </p>
          </div>
        </div>

        <button className="bg-[#c0000a] hover:bg-red-700 text-white flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-sm shadow-red-600/10 cursor-pointer border-none">
          <span>Complete Verification</span>
          <IconArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
