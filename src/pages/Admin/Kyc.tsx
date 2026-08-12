import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService, type AdminKyc, type PaginatedResponse } from '../../services/adminService';
import { Badge } from '../../components/ui/Badge';

const kycStatusMap: Record<string, string> = {
  APPROVED: 'Completed',
  PENDING: 'Pending',
  REJECTED: 'Failed',
  UNDER_REVIEW: 'Processing',
};

const Pill: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
      active
        ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
        : 'border-[#e5e5e7] text-[#515154] hover:bg-black/3'
    }`}
  >
    {label}
  </button>
);

const AdminKycPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery<PaginatedResponse<AdminKyc>>({
    queryKey: ['admin', 'kyc', page, status],
    queryFn: () => adminService.getKyc(page, status || undefined),
    placeholderData: (prev) => prev,
  });

  const profiles: AdminKyc[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col gap-8 font-sans text-[#1d1d1f] select-none">

      {/* Header */}
      <div className="border-b border-[#e5e5e7] pb-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-1">Identity Verification</p>
        <h1 className="text-2xl font-bold tracking-tight">KYC Profiles</h1>
        <p className="text-xs text-[#86868b] mt-1 font-light">Review submitted identity verification documents.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {['', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((s) => (
          <Pill key={s} label={s || 'All'} active={status === s} onClick={() => { setStatus(s); setPage(1); }} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbfbfb] border-b border-[#e5e5e7]">
                {['User', 'Document Type', 'Status', 'Submitted'].map((h) => (
                  <th key={h} className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e7]">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-[#f5f5f7] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-xs text-[#86868b] font-light">No KYC profiles found.</td>
                </tr>
              ) : profiles.map((kyc) => (
                <tr key={kyc.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4">
                    <p className="text-xs font-semibold">{kyc.user.name}</p>
                    <p className="text-[10px] text-[#86868b] font-light mt-0.5">{kyc.user.email}</p>
                  </td>
                  <td className="p-4 text-xs text-[#515154] font-medium">{kyc.documentType ?? '—'}</td>
                  <td className="p-4">
                    <Badge status={kycStatusMap[kyc.status] ?? kyc.status} />
                  </td>
                  <td className="p-4 text-[10px] text-[#86868b] font-light">
                    {new Date(kyc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="bg-[#fbfbfb] border-t border-[#e5e5e7] px-6 py-4 flex items-center justify-between text-[10px] text-[#86868b]">
            <span>{pagination.total} profiles total</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-[#e5e5e7] rounded-lg font-bold uppercase tracking-wider hover:bg-black/3 disabled:opacity-40 transition-colors cursor-pointer">Prev</button>
              <span className="font-mono">{page} / {pagination.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="px-3 py-1 border border-[#e5e5e7] rounded-lg font-bold uppercase tracking-wider hover:bg-black/3 disabled:opacity-40 transition-colors cursor-pointer">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKycPage;
