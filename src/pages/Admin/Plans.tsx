import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminPlan } from '../../services/adminService';

const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];

const emptyForm = {
  name: '',
  description: '',
  minAmount: '',
  maxAmount: '',
  roiPercent: '',
  durationDays: '',
  riskLevel: 'LOW',
  active: true,
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block mb-1.5">{label}</label>
    {children}
  </div>
);

/* ── Plan Form Modal ── */
const PlanModal: React.FC<{
  initial?: AdminPlan | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}> = ({ initial, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          minAmount: String(initial.minAmount),
          maxAmount: initial.maxAmount != null ? String(initial.maxAmount) : '',
          roiPercent: String(initial.roiPercent),
          durationDays: String(initial.durationDays),
          riskLevel: initial.riskLevel,
          active: initial.active,
        }
      : emptyForm
  );

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    onSubmit({
      name: form.name,
      description: form.description,
      minAmount: parseFloat(form.minAmount),
      maxAmount: form.maxAmount ? parseFloat(form.maxAmount) : null,
      roiPercent: parseFloat(form.roiPercent),
      durationDays: parseInt(form.durationDays),
      riskLevel: form.riskLevel,
      active: form.active,
    });
  };

  const inputCls = "w-full border border-[#e5e5e7] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#c0000a]/40 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs overflow-y-auto py-8">
      <div className="bg-white rounded-2xl border border-[#e5e5e7] shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">
            {initial ? 'Edit Plan' : 'New Investment Plan'}
          </p>
          <h2 className="text-base font-bold mt-1">{initial ? initial.name : 'Create Plan'}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Plan Name">
            <input className={`${inputCls} col-span-2`} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Growth Fund" />
          </Field>
          <Field label="ROI % (annual)">
            <input className={inputCls} type="number" value={form.roiPercent} onChange={(e) => set('roiPercent', e.target.value)} placeholder="12.5" />
          </Field>
          <Field label="Duration (days)">
            <input className={inputCls} type="number" value={form.durationDays} onChange={(e) => set('durationDays', e.target.value)} placeholder="365" />
          </Field>
          <Field label="Min Amount ($)">
            <input className={inputCls} type="number" value={form.minAmount} onChange={(e) => set('minAmount', e.target.value)} placeholder="500" />
          </Field>
          <Field label="Max Amount ($)">
            <input className={inputCls} type="number" value={form.maxAmount} onChange={(e) => set('maxAmount', e.target.value)} placeholder="Optional" />
          </Field>
          <Field label="Risk Level">
            <select className={inputCls} value={form.riskLevel} onChange={(e) => set('riskLevel', e.target.value)}>
              {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={String(form.active)} onChange={(e) => set('active', e.target.value === 'true')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </Field>
        </div>

        <Field label="Description">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Brief description of this investment plan…"
          />
        </Field>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 border border-[#e5e5e7] rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-[#515154] hover:bg-black/3 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.roiPercent || !form.durationDays || !form.minAmount || loading}
            className="flex-1 bg-[#1d1d1f] text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'Saving…' : initial ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminPlans: React.FC = () => {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | AdminPlan | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: adminService.getPlans,
  });

  const plans: AdminPlan[] = (data as any)?.plans ?? [];

  const createMutation = useMutation({
    mutationFn: adminService.createPlan,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'plans'] }); setModal(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updatePlan(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'plans'] }); setModal(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deletePlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  });

  const riskColor: Record<string, string> = {
    LOW: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20',
    MEDIUM: 'text-amber-700 bg-amber-500/10 border-amber-500/20',
    HIGH: 'text-red-700 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col gap-8 font-sans text-[#1d1d1f] select-none">

      {/* Header */}
      <div className="border-b border-[#e5e5e7] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-1">Plan Management</p>
          <h1 className="text-2xl font-bold tracking-tight">Investment Plans</h1>
          <p className="text-xs text-[#86868b] mt-1 font-light">Create, edit, and manage available investment plans.</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="bg-[#1d1d1f] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black/80 transition-colors cursor-pointer shrink-0"
        >
          + New Plan
        </button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#e5e5e7] rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white border border-[#e5e5e7] rounded-2xl p-12 text-center">
          <p className="text-xs text-[#86868b] font-light">No investment plans yet.</p>
          <button onClick={() => setModal('create')} className="mt-4 text-xs font-bold text-[#c0000a] hover:underline cursor-pointer">Create the first plan →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white border border-[#e5e5e7] rounded-2xl p-5 flex flex-col gap-4 shadow-xs hover:shadow-sm transition-shadow">
              {/* Plan Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f]">{plan.name}</h3>
                  <p className="text-[11px] text-[#86868b] font-light mt-0.5 line-clamp-2">{plan.description}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full shrink-0 ${plan.active ? 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20' : 'text-[#86868b] bg-[#f5f5f7] border-[#e5e5e7]'}`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Plan Stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'ROI', value: `${plan.roiPercent}%` },
                  { label: 'Duration', value: `${plan.durationDays}d` },
                  { label: 'Min', value: `$${plan.minAmount.toLocaleString()}` },
                  { label: 'Risk', value: plan.riskLevel },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#f9f9f9] rounded-xl p-2.5 text-center">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-[#86868b]">{label}</p>
                    <p className={`text-xs font-bold mt-0.5 ${label === 'Risk' ? (riskColor[value]?.split(' ')[0] ?? 'text-[#1d1d1f]') : 'text-[#1d1d1f]'}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-[#e5e5e7]">
                <button
                  onClick={() => setModal(plan)}
                  className="flex-1 text-[9px] font-bold uppercase tracking-wider text-[#515154] border border-[#e5e5e7] py-2 rounded-xl hover:bg-black/3 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${plan.name}"?`)) deleteMutation.mutate(plan.id); }}
                  className="flex-1 text-[9px] font-bold uppercase tracking-wider text-red-600 border border-red-500/20 bg-red-500/5 py-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  {deleteMutation.isPending ? 'Removing…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <PlanModal
          initial={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSubmit={(formData) => {
            if (modal === 'create') {
              createMutation.mutate(formData);
            } else {
              updateMutation.mutate({ id: (modal as AdminPlan).id, data: formData });
            }
          }}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminPlans;
