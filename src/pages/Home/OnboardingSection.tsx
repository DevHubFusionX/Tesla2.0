import React from 'react';
import { Link } from 'react-router-dom';

const IconUserPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const STEPS = [
  { id: 'step-register', num: '1', label: 'Register', sub: 'Create your free account in minutes'    },
  { id: 'step-fund',     num: '2', label: 'Fund',     sub: 'Deposit with crypto or bank transfer'   },
  { id: 'step-trade',    num: '3', label: 'Trade',    sub: 'Start investing and trading immediately' },
] as const;

const OnboardingSection: React.FC = () => (
  <section
    id="onboarding"
    className="w-full py-16 md:py-20 px-5"
    style={{ background: 'radial-gradient(ellipse 120% 100% at 50% 50%, #e31937 0%, #a00018 45%, #6e0010 100%)' }}
  >
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 text-center">

      <h2 className="text-white font-bold leading-tight" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', letterSpacing: '-0.025em' }}>
        Fast account opening in 3 simple steps
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
        {STEPS.map(({ id, num, label, sub }) => (
          <div key={id} id={id} className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              {num}
            </div>
            <p className="text-white font-bold text-base">{label}</p>
            <p className="text-white/70 text-sm leading-snug max-w-[160px]">{sub}</p>
          </div>
        ))}
      </div>

      <Link
        to="/signup"
        className="inline-flex items-center gap-2 bg-white text-red-600 font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-200 hover:bg-white/90 active:scale-[0.97] shadow-xl shadow-black/20"
      >
        <IconUserPlus />
        Create Account
      </Link>

    </div>
  </section>
);

export default OnboardingSection;
