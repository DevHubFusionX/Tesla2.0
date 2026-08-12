import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminUser, type PaginatedResponse } from '../../services/adminService';

const fmt = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── Balance Adjust Modal ── */
const AdjustModal: React.FC<{
  user: AdminUser;
  onClose: () => void;
  onSubmit: (amount: number, description: string) => void;
  loading: boolean;
}> = ({ user, onClose, onSubmit, loading }) => {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#e5e5e7] shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Balance Adjustment</p>
          <h2 className="text-base font-bold mt-1">{user.name}</h2>
          <p className="text-xs text-[#86868b] font-light">Current: {fmt(user.balance)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block mb-1.5">Amount (+ deposit / − withdrawal)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500 or -200"
              className="w-full border border-[#e5e5e7] rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#c0000a]/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block mb-1.5">Description</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Reason for adjustment"
              className="w-full border border-[#e5e5e7] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0000a]/40 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 border border-[#e5e5e7] rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-[#515154] hover:bg-black/3 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(parseFloat(amount), desc)}
            disabled={!amount || !desc || loading}
            className="flex-1 bg-[#1d1d1f] text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'Saving…' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminUsers: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [adjustTarget, setAdjustTarget] = useState<AdminUser | null>(null);

  const { data, isLoading } = useQuery<PaginatedResponse<AdminUser>>({
    queryKey: ['admin', 'users', page, search],
    queryFn: () => adminService.getUsers(page, search || undefined),
    placeholderData: (prev) => prev,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { role?: string; isActive?: boolean } }) =>
      adminService.updateUser(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, amount, desc }: { id: string; amount: number; desc: string }) =>
      adminService.adjustBalance(id, amount, desc),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setAdjustTarget(null);
    },
  });

  const users: AdminUser[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col gap-8 font-sans text-[#1d1d1f] select-none">

      {/* Header */}
      <div className="border-b border-[#e5e5e7] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-1">User Management</p>
          <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
          <p className="text-xs text-[#86868b] mt-1 font-light">Manage roles, status, and balances.</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search name or email…"
          className="border border-[#e5e5e7] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#c0000a]/40 transition-colors w-full md:w-64"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbfbfb] border-b border-[#e5e5e7]">
                {['User', 'Balance', 'Investments', 'Role', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="p-4 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e7]">
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-[#f5f5f7] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-[#86868b] font-light">No users found.</td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4">
                    <p className="text-xs font-semibold text-[#1d1d1f]">{u.name}</p>
                    <p className="text-[10px] text-[#86868b] font-light mt-0.5">{u.email}</p>
                  </td>
                  <td className="p-4 font-mono text-xs font-semibold">{fmt(u.balance)}</td>
                  <td className="p-4 text-xs text-[#86868b]">{u._count.investments}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateMutation.mutate({ id: u.id, patch: { role: e.target.value } })}
                      className="text-[10px] font-bold uppercase tracking-wider border border-[#e5e5e7] rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#c0000a]/40 cursor-pointer"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateMutation.mutate({ id: u.id, patch: { isActive: !u.isActive } })}
                      className={`text-[9px] font-bold uppercase tracking-wider border px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        u.isActive
                          ? 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'text-red-700 bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setAdjustTarget(u)}
                      className="text-[9px] font-bold uppercase tracking-wider text-[#515154] hover:text-[#1d1d1f] border border-[#e5e5e7] px-2.5 py-1 rounded-lg hover:bg-black/3 transition-colors cursor-pointer"
                    >
                      Adjust Balance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-[#fbfbfb] border-t border-[#e5e5e7] px-6 py-4 flex items-center justify-between text-[10px] text-[#86868b]">
            <span>{pagination.total} users total</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-[#e5e5e7] rounded-lg font-bold uppercase tracking-wider hover:bg-black/3 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Prev
              </button>
              <span className="font-mono">{page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-[#e5e5e7] rounded-lg font-bold uppercase tracking-wider hover:bg-black/3 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      {adjustTarget && (
        <AdjustModal
          user={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onSubmit={(amount, desc) => adjustMutation.mutate({ id: adjustTarget.id, amount, desc })}
          loading={adjustMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminUsers;
