import React from 'react';
import { Link } from 'react-router-dom';

const IconWallet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconTrendingUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-4h8l3 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="17.5" r="2.5" />
  </svg>
);
const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const CARDS = [
  { id: 'card-wallet',      to: '/dashboard/deposit',      icon: <IconWallet />,     label: 'Wallet',      sub: 'Fund or withdraw'    },
  { id: 'card-investments', to: '/dashboard/investments',  icon: <IconTrendingUp />, label: 'Investments', sub: 'Create a plan'       },
  { id: 'card-inventory',   to: '/dashboard/inventory',    icon: <IconCar />,        label: 'Inventory',   sub: 'Browse vehicles'     },
  { id: 'card-portfolio',   to: '/dashboard',              icon: <IconChart />,      label: 'Portfolio',   sub: 'Track performance'   },
] as const;

const FeatureSection: React.FC = () => (
  <section id="features" className="relative" style={{ background: '#0d0d0d' }}>
    <div className="w-full max-w-7xl mx-auto px-5 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ id, to, icon, label, sub }) => (
          <Link
            key={id}
            id={id}
            to={to}
            className="group flex items-center justify-between rounded-xl px-5 py-6 border border-white/6 transition-all duration-300 hover:border-red-700/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
          >
            <div>
              <p className="text-white font-semibold text-base leading-tight">{label}</p>
              <p className="text-white/45 text-sm mt-0.5">{sub}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full text-red-500 group-hover:text-red-400 transition-colors duration-300 shrink-0"
              style={{ background: 'rgba(139,0,0,0.18)' }}>
              {icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureSection;
