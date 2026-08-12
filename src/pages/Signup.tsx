import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

/* ── Tesla Logo ── */
const TeslaLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 342 512"
    className="w-8 h-8 fill-red-500"
    aria-label="Tesla logo"
  >
    <path d="M0 78.3C54.4 61.8 120.6 52 171 52s116.6 9.8 171 26.3C337.6 115 320 155.2 320 155.2c-27.4-9-63-15.4-101.6-18L171 512 123.6 137.2C85 140 49.4 146.4 22 155.4 22 155.4 4.4 115 0 78.3zm171-26.3c25.5 0 50.4 1.6 74 4.6L171 512 97 56.6c23.6-3 48.5-4.6 74-4.6z" />
  </svg>
);

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error: apiError, clearError, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      agreeTerms: false,
    },
  });

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      clearError();
    };
  }, [isAuthenticated, navigate, clearError]);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data.fullName, data.email, data.password);
      toast.success('Account successfully created');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex text-[#1d1d1f] font-sans selection:bg-red-500/10 selection:text-red-600">
      {/* ── Left Column: Text & Content Brand Panel ── */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-[#fbfbfb] p-16 flex-col justify-between relative overflow-hidden"
        style={{ borderRight: '1px solid #e5e5e7' }}
      >
        {/* Background glow */}
        <div 
          className="absolute top-1/4 left-1/4 w-100 h-100 rounded-full filter blur-[150px] opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #e31937 0%, transparent 70%)' }}
        />

        {/* Top: Brand Header */}
        <Link to="/" className="flex items-center gap-3 relative z-10 self-start">
          <TeslaLogo />
          <span className="font-black text-xl tracking-[0.18em] uppercase text-[#1d1d1f]">TESLA</span>
        </Link>

        {/* Middle: Editorial Brand Statement */}
        <div className="max-w-md relative z-10 my-auto py-12">
          <p className="text-red-600 font-semibold tracking-widest text-xs uppercase mb-3">Next Generation Ecosystem</p>
          <h2 className="text-[#1d1d1f] font-bold leading-[1.1] tracking-tight mb-6" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Empower.<br />Diversify.<br />Accelerate.
          </h2>
          <p className="text-[#86868b] text-sm leading-relaxed font-light mb-8">
            Create an institutional-grade account today. Gain access to premium financial products, secure automated plans, real-time analytics, and high-yield vehicles within the ultimate unified portal.
          </p>

          {/* Micro stats block */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#e5e5e7]">
            <div>
              <p className="text-[#1d1d1f] font-semibold text-lg">13K+</p>
              <p className="text-[#86868b] text-xs mt-0.5">Active Investors</p>
            </div>
            <div>
              <p className="text-[#1d1d1f] font-semibold text-lg">10K+</p>
              <p className="text-[#86868b] text-xs mt-0.5">Years Combined Experience</p>
            </div>
          </div>
        </div>

        {/* Bottom: Legal & Links */}
        <div className="flex items-center justify-between text-xs text-black/30 relative z-10">
          <span>© {new Date().getFullYear()} Tesla Finance</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-black/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-black/60 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* ── Right Column: Minimalist Signup Form Panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-16 md:p-20 bg-white">
        
        {/* Top: Mobile Navigation Header */}
        <div className="flex justify-between items-center lg:justify-end">
          <Link to="/" className="flex items-center gap-3 lg:hidden">
            <TeslaLogo />
            <span className="font-black text-lg tracking-[0.18em] uppercase text-[#1d1d1f]">TESLA</span>
          </Link>
          <p className="text-xs text-[#86868b]">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 hover:text-red-500 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Middle: Signup Form Card */}
        <div className="max-w-105 w-full mx-auto my-auto py-8">
          <div className="mb-6">
            <h1 className="text-[#1d1d1f] font-bold text-2xl tracking-tight mb-2">Create Account</h1>
            <p className="text-[#86868b] text-sm font-light">Join thousands of global members managing their asset ecosystem.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg font-medium">
                {apiError}
              </div>
            )}

            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-[#86868b] text-xs font-semibold uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={`w-full bg-[#f5f5f7] border ${errors.fullName ? 'border-red-500/50 focus:border-red-500' : 'border-[#e5e5e7] focus:border-red-500/50'} rounded-lg px-4 py-3 text-sm text-[#1d1d1f] placeholder-black/20 focus:outline-none focus:bg-white transition-all`}
                {...register('fullName')}
              />
              {errors.fullName && (
                <span className="text-red-600 text-xs font-medium mt-0.5">{errors.fullName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[#86868b] text-xs font-semibold uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-[#f5f5f7] border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-[#e5e5e7] focus:border-red-500/50'} rounded-lg px-4 py-3 text-sm text-[#1d1d1f] placeholder-black/20 focus:outline-none focus:bg-white transition-all`}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-red-600 text-xs font-medium mt-0.5">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[#86868b] text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`w-full bg-[#f5f5f7] border ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-[#e5e5e7] focus:border-red-500/50'} rounded-lg px-4 py-3 text-sm text-[#1d1d1f] placeholder-black/20 focus:outline-none focus:bg-white transition-all`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-red-600 text-xs font-medium mt-0.5">{errors.password.message}</span>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex flex-col gap-1 mt-1 select-none">
              <div className="flex items-start gap-2.5">
                <input
                  id="agree"
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#e5e5e7] accent-red-600 bg-[#f5f5f7] mt-0.5 cursor-pointer focus:ring-0"
                  {...register('agreeTerms')}
                />
                <label htmlFor="agree" className="text-black/40 text-xs leading-normal cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-black/60 hover:text-black underline transition-colors">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-black/60 hover:text-black underline transition-colors">Privacy Policy</a>.
                </label>
              </div>
              {errors.agreeTerms && (
                <span className="text-red-600 text-xs font-medium mt-1">{errors.agreeTerms.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#c0000a] text-white text-sm font-semibold py-3.5 rounded-lg mt-2 transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none shadow-md shadow-red-600/10 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing Up...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>
        </div>

        {/* Bottom footer for mobile */}
        <div className="text-center text-[10px] text-black/30 lg:hidden">
          © {new Date().getFullYear()} Tesla Finance. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Signup;
