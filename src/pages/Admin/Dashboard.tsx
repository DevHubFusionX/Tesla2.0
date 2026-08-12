import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Link } from 'react-router-dom';

const fmt = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StatCard: React.FC<{ label: string; value: string | number; sub?: string; accent?: string }> = ({
  label, value, sub, accent = 'text-[#1d1d1f]',
}) => (
  <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">{label}</span>
    <span className={`text-2xl font-extrabold tracking-tight font-mono ${accent}`}>{value}</span>
    {sub && <span className="text-[10px] text-[#86868b] font-medium">{sub}</span>}
  </div>
);

const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: adminService.getOverview,
    refetchInterval: 60_000,
  });

  const quickLinks = [
    { label: 'Manage Users', sub: 'View, activate, adjust balances', to: '/admin/users' },
    { label: 'Review Transactions', sub: 'Approve or reject pending', to: '/admin/transactions' },
    { label: 'KYC Queue', sub: 'Identity verification profiles', to: '/admin/kyc' },
    { label: 'Investment Plans', sub: 'Create, edit, deactivate plans', to: '/admin/plans' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col gap-10 font-sans text-[#1d1d1f] select-none">

      {/* Header */}
      <div className="border-b border-[#e5e5e7] pb-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-1">Control Centre</p>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-xs text-[#86868b] mt-1 font-light">Platform-wide metrics and management access.</p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-[#e5e5e7] rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b] mb-4">Platform Metrics</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={data.totalUsers.toLocaleString()} sub="Registered accounts" />
              <StatCard label="Assets Under Mgmt" value={fmt(data.aum)} sub={`${data.activeInvestmentCount} active investments`} accent="text-[#c0000a]" />
              <StatCard label="Total Deposited" value={fmt(data.totalDeposited)} sub={`${data.totalDepositCount} deposits`} accent="text-emerald-600" />
              <StatCard label="Total Withdrawn" value={fmt(data.totalWithdrawn)} sub={`${data.totalWithdrawalCount} withdrawals`} />
            </div>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b] mb-4">Investment Breakdown</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Investments" value={data.totalInvestments.toLocaleString()} />
              <StatCard label="Active" value={data.activeInvestmentCount.toLocaleString()} accent="text-emerald-600" />
              <StatCard label="Matured" value={data.maturedInvestmentCount.toLocaleString()} accent="text-blue-600" />
              <StatCard
                label="Net Flow"
                value={fmt(data.totalDeposited - data.totalWithdrawn)}
                sub="Deposits minus withdrawals"
                accent={data.totalDeposited - data.totalWithdrawn >= 0 ? 'text-emerald-600' : 'text-red-600'}
              />
            </div>
          </div>
        </>
      ) : null}

      {/* Quick Links */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b] mb-4">Quick Access</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white border border-[#e5e5e7] rounded-2xl p-5 flex items-center justify-between hover:border-[#c0000a]/30 hover:shadow-sm transition-all duration-200 group"
            >
              <div>
                <p className="text-sm font-bold text-[#1d1d1f] group-hover:text-[#c0000a] transition-colors">{link.label}</p>
                <p className="text-[11px] text-[#86868b] mt-0.5 font-light">{link.sub}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#86868b] group-hover:text-[#c0000a] transition-colors shrink-0">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
