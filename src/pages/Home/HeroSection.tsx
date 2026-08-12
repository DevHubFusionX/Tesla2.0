import React from 'react';
import { Link } from 'react-router-dom';

const IconTrendingUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-4h8l3 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="17.5" r="2.5" />
  </svg>
);

const IconWallet = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const FEATURES = [
  { id: 'investments', icon: <IconTrendingUp />, label: 'Investments', sub: 'Automated', desc: 'Flexible plans, recurring contributions.' },
  { id: 'stocks',      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>, label: 'Stocks', sub: 'Realtime', desc: 'Quotes, news, and watchlists.' },
  { id: 'wallet',      icon: <IconWallet />,     label: 'Wallet',      sub: 'Crypto',   desc: 'Deposit and withdraw easily.' },
  { id: 'marketplace', icon: <IconCar />,        label: 'Marketplace', sub: 'Tesla',    desc: 'Curated EV selection.' },
] as const;

const BADGES = [
  { id: 'badge-stocks', icon: <IconTrendingUp />, text: 'Live Stocks', tag: 'Realtime' },
  { id: 'badge-wallet', icon: <IconWallet />,     text: 'Wallet',      tag: 'Crypto'   },
  { id: 'badge-ev',     icon: <IconCar />,        text: 'EV Inventory', tag: 'Premium' },
] as const;

const HeroSection: React.FC = () => (
  <section
    id="hero"
    className="relative min-h-screen flex items-center overflow-hidden pt-[60px]"
    style={{ background: 'radial-gradient(ellipse 120% 90% at 30% 40%, #c0000a 0%, #8b0000 45%, #5a0000 75%, #1a0000 100%)' }}
  >
    {/* noise overlay */}
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
    />
    {/* bottom fade */}
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
      style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.35))' }}
    />

    <div className="relative z-10 w-full max-w-7xl mx-auto px-5 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-0">

      {/* ── Left column ── */}
      <div className="flex-1 flex flex-col items-start w-full">
        <h1 className="select-none flex flex-col items-start" style={{ lineHeight: 1 }}>
          <span className="text-white/70 font-black tracking-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)' }}>
            Invest.
          </span>
          <span className="text-white font-black tracking-tighter my-1" style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)', textShadow: '0 0 60px rgba(255,80,80,0.35)' }}>
            Trade.
          </span>
          <span className="text-white/70 font-black tracking-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)' }}>
            Drive.
          </span>
        </h1>

        <p className="mt-5 text-white/65 font-light leading-relaxed max-w-sm text-sm md:text-base">
          All-in-one platform for crypto wallet funding, automated investments, live stocks, and premium EV inventory.
        </p>

        {/* CTA buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 bg-white text-[#8b0000] font-bold px-6 py-3.5 rounded-lg text-sm transition-all duration-200 hover:bg-white/90 active:scale-[0.97] shadow-lg shadow-black/30"
          >
            <IconTrendingUp />
            Start Investing
          </Link>
          <Link
            to="/dashboard/inventory"
            className="flex items-center justify-center gap-2 border border-white/30 text-white font-medium px-6 py-3.5 rounded-lg text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/50 active:scale-[0.97]"
          >
            <IconCar />
            View Inventory
          </Link>
        </div>

        {/* Badges */}
        <div className="mt-6 flex flex-wrap gap-2">
          {BADGES.map(({ id, icon, text, tag }) => (
            <div key={id} className="flex items-center gap-1.5 bg-black/20 border border-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="text-white/50">{icon}</span>
              {text}
              <span className="text-white/40 mx-0.5">·</span>
              <span className="text-white/55">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column — feature grid ── */}
      <div className="flex-1 flex justify-center lg:justify-end w-full">
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm md:max-w-md">
          {FEATURES.map(({ id, icon, label, sub, desc }) => (
            <div
              key={id}
              className="group relative overflow-hidden rounded-xl p-4 md:p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white mb-3">
                {icon}
              </div>
              <p className="text-white font-semibold text-sm leading-tight">{label}</p>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-0.5 mb-1.5">{sub}</p>
              <p className="text-white/45 text-xs leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default HeroSection;
