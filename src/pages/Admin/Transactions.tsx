import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminTransaction, type PaginatedResponse } from '../../services/adminService';
import { Badge } from '../../components/ui/Badge';

const fmt = (n: number) =>
  `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const statusMap: Record<string, string> = {
  SUCCESS: 'Completed',
  PENDING: 'Pending',
  FAILED: 'Failed',
};

/* ── Review Modal ── */
const ReviewModal: React.FC<{
  txn: AdminTransaction;
  onClose: () => void;
  onSubmit: (status: 'SUCCESS' | 'FAILED', reason?: string) => void;
  loading: boolean;
}> = ({ txn, onClose, onSubmit, loading }) => {
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'SUCCESS' | 'FAILED'>('SUCCESS');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#e5e5e7] shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Review Transaction</p>
          <h2 className="text-sm font-bold mt-1 font-mono">{txn.id.slice(0, 16)}…</h2>
          <p className="text-xs text-[#86868b] font-light mt-0.5">{txn.user.name} · {txn.type} · {fmt(txn.amount)}</p>
        </div>
        <div className="flex gap-2">
          {(['SUCCESS', 'FAILED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setAction(s)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                action === s
                  ? s === 'SUCCESS'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                    : 'bg-red-500/10 border-red-500/30 text-red-700'
                  : 'border-[#e5e5e7] text-[#86868b] hover:bg-black/3'
              }`}
            >
              {s === 'SUCCESS' ? 'Approve' : 'Reject'}
            </button>
          ))}
        </div>
        {action === 'FAILED' && (
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Rejection reason…"
            className="border border-[#e5e5e7] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#c0000a]/40 transition-colors"
          />
        )}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-[#e5e5e7] rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-[#515154] hover:bg-black/3 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(action, reason || undefined)}
            disabled={loading || (action === 'FAILED' && !reason)}
            className="flex-1 bg-[#1d1d1f] text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Filter Pill ── */
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

/* ── Main Page ── */
const AdminTransactions: React.FC = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [reviewTarget, setReviewTarget] = useState<AdminTransaction | null>(null);

  const { data, isLoading } = useQuery<PaginatedResponse<AdminTransaction>>({
    queryKey: ['admin', 'transactions', page, status, type],
    queryFn: () => adminService.getTransactions(page, status || undefined, type || undefined),
    placeholderData: (prev) => prev,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, s, reason }: { id: string; s: 'SUCCESS' | 'FAILED'; reason?: string }) =>
      adminService.reviewTransaction(id, s, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      setReviewTarget(null);
    },
  });

  const txns: AdminTransaction[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col gap-8 font-sans text-[#1d1d1f] select-none">

      {/* Header */}
      <div className="border-b border-[#e5e5e7] pb-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-1">Transaction Management</p>
        <h1 className="text-2xl font-bold tracking-tight">All Transactions</h1>
        <p className="text-xs text-[#86868b] mt-1 font-light">Review and approve pending deposits and withdrawals.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1.5 items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mr-1">Status</span>
          {['', 'PENDING', 'SUCCESS', 'FAILED'].map((s) => (
            <Pill key={s} label={s || 'All'} active={status === s} onClick={() => { setStatus(s); setPage(1); }} />
          ))}
        </div>
        <div className="flex gap-1.5 items-center ml-4">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mr-1">Type</span>
          {['', 'DEPOSIT', 'WITHDRAWAL', 'SYSTEM'].map((t) => (
            <Pill key={t} label={t || 'All'} active={type === t} onClick={() => { setType(t); setPage(1); }} />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbfbfb] border-b border-[#e5e5e7]">
                {['ID', 'User', 'Type', 'Amount', 'Status', 'Date', 'Action'].map((h) => (
                  <th key={h} className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e7]">
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-[#f5f5f7] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : txns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-xs text-[#86868b] font-light">No transactions found.</td>
                </tr>
              ) : txns.map((txn) => (
                <tr key={txn.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 font-mono text-[10px] text-[#86868b]">{txn.id.slice(0, 12)}…</td>
                  <td className="p-4">
                    <p className="text-xs font-semibold">{txn.user.name}</p>
                    <p className="text-[10px] text-[#86868b] font-light">{txn.user.email}</p>
                  </td>
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#515154]">{txn.type}</td>
                  <td className={`p-4 font-mono text-xs font-bold ${txn.amount >= 0 ? 'text-emerald-600' : 'text-[#1d1d1f]'}`}>
                    {txn.amount >= 0 ? '+' : '−'}{fmt(txn.amount)}
                  </td>
                  <td className="p-4">
                    <Badge status={statusMap[txn.status] ?? txn.status} />
                  </td>
                  <td className="p-4 text-[10px] text-[#86868b] font-light">
                    {new Date(txn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    {txn.status === 'PENDING' ? (
                      <button
                        onClick={() => setReviewTarget(txn)}
                        className="text-[9px] font-bold uppercase tracking-wider text-[#c0000a] border border-[#c0000a]/20 bg-red-500/5 px-2.5 py-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-[9px] text-[#86868b]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="bg-[#fbfbfb] border-t border-[#e5e5e7] px-6 py-4 flex items-center justify-between text-[10px] text-[#86868b]">
            <span>{pagination.total} transactions total</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-[#e5e5e7] rounded-lg font-bold uppercase tracking-wider hover:bg-black/3 disabled:opacity-40 transition-colors cursor-pointer">Prev</button>
              <span className="font-mono">{page} / {pagination.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="px-3 py-1 border border-[#e5e5e7] rounded-lg font-bold uppercase tracking-wider hover:bg-black/3 disabled:opacity-40 transition-colors cursor-pointer">Next</button>
            </div>
          </div>
        )}
      </div>

      {reviewTarget && (
        <ReviewModal
          txn={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={(s, reason) => reviewMutation.mutate({ id: reviewTarget.id, s, reason })}
          loading={reviewMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminTransactions;
