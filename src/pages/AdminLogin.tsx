import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

const TeslaLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 512" className="w-6 h-6 fill-white" aria-label="Tesla logo">
    <path d="M0 78.3C54.4 61.8 120.6 52 171 52s116.6 9.8 171 26.3C337.6 115 320 155.2 320 155.2c-27.4-9-63-15.4-101.6-18L171 512 123.6 137.2C85 140 49.4 146.4 22 155.4 22 155.4 4.4 115 0 78.3zm171-26.3c25.5 0 50.4 1.6 74 4.6L171 512 97 56.6c23.6-3 48.5-4.6 74-4.6z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: apiError, clearError, isAuthenticated, user } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      navigate('/admin');
    } else if (isAuthenticated && user?.role !== 'ADMIN') {
      navigate('/dashboard');
    }
    return () => clearError();
  }, [isAuthenticated, user, navigate, clearError]);

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
      const role = useAuthStore.getState().user?.role;
      if (role !== 'ADMIN') {
        useAuthStore.getState().logout();
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      toast.success('Admin access granted');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white font-sans selection:bg-red-500/20 selection:text-red-400">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden border-r border-white/[0.06]">

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Red glow */}
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(192,0,10,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 relative z-10 self-start">
          <TeslaLogo />
          <span className="font-black text-sm tracking-[0.25em] uppercase text-white/90">TESLA FINANCE</span>
        </Link>

        {/* Editorial */}
        <div className="max-w-sm relative z-10 my-auto py-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-px h-8 bg-red-500/60" />
            <p className="text-red-500 font-bold tracking-[0.2em] text-[10px] uppercase">Restricted Access</p>
          </div>
          <h2 className="font-bold leading-[1.1] tracking-tight mb-5 text-white" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            Admin<br />Control<br />Centre
          </h2>
          <p className="text-white/40 text-sm leading-relaxed font-light">
            Authorised personnel only. All access attempts are logged and monitored.
          </p>

          <div className="mt-10 pt-8 border-t border-white/[0.08] grid grid-cols-2 gap-6">
            {[
              { label: 'Audit Logging', value: 'Enabled' },
              { label: 'Session Timeout', value: '7 days' },
              { label: 'Access Level', value: 'Full' },
              { label: 'Encryption', value: 'AES-256' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest">{label}</p>
                <p className="text-white/70 text-xs font-semibold mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-white/20 relative z-10">
          <span>© {new Date().getFullYear()} Tesla Finance</span>
          <Link to="/login" className="hover:text-white/50 transition-colors">User Login →</Link>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-16 md:p-20 bg-[#0d0d0d]">

        {/* Top */}
        <div className="flex justify-between items-center lg:justify-end">
          <Link to="/" className="flex items-center gap-2.5 lg:hidden">
            <TeslaLogo />
            <span className="font-black text-sm tracking-[0.2em] uppercase">TESLA</span>
          </Link>
          <Link to="/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            User Login →
          </Link>
        </div>

        {/* Form */}
        <div className="max-w-sm w-full mx-auto my-auto py-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-8">
            <ShieldIcon />
            <span>Admin Portal</span>
          </div>

          <h1 className="text-white font-bold text-2xl tracking-tight mb-1.5">Administrator Sign In</h1>
          <p className="text-white/35 text-sm font-light mb-8">Restricted to authorised admin accounts only.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl font-medium">
                {apiError}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@tesla.com"
                className={`w-full bg-white/[0.04] border ${errors.email ? 'border-red-500/40' : 'border-white/[0.08] focus:border-white/20'} rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 focus:outline-none transition-all`}
                {...register('email')}
              />
              {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white/[0.04] border ${errors.password ? 'border-red-500/40' : 'border-white/[0.08] focus:border-white/20'} rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 focus:outline-none transition-all`}
                {...register('password')}
              />
              {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#c0000a] hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-xl mt-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <ShieldIcon />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <p className="text-white/20 text-[10px] text-center mt-8 leading-relaxed">
            Unauthorised access attempts are logged and may result in account suspension.
          </p>
        </div>

        {/* Mobile footer */}
        <div className="text-center text-[10px] text-white/15 lg:hidden">
          © {new Date().getFullYear()} Tesla Finance. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
