import React from 'react';
import { Link } from 'react-router-dom';

const IconDiamond = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20" /><path d="M6 3l4 6m8-6l-4 6" />
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FEATURES = [
  'Full access to all instrument types',
  'All trading assets available',
  '24/7 live support',
  'Full education centre access',
];

const PLANS = [
  { id: 'plan-test',     name: 'Test',          range: '$500 – $2,999'              },
  { id: 'plan-beginner', name: 'Beginner',       range: '$100 – $25,000'             },
  { id: 'plan-standard', name: 'Standard',       range: '$25,000 – $100,000'         },
  { id: 'plan-business', name: 'Business',       range: '$100,000 – $1,000,000'      },
  { id: 'plan-gold',     name: 'Gold',           range: '$1M – $5M'                  },
  { id: 'plan-platinum', name: 'Platinum',       range: '$5M – $10M'                 },
  { id: 'plan-elite',    name: 'Elite',          range: '$10M – $50M'                },
  { id: 'plan-vip',      name: 'VIP',            range: '$50M+'                      },
] as const;

const InvestmentPlansSection: React.FC = () => (
  <section id="investment-plans" className="w-full" style={{ background: '#0d0d0d' }}>
    <div className="w-full max-w-7xl mx-auto px-5 pb-20">

      <div className="text-center mb-10">
        <h2 className="text-white font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.025em' }}>
          Investment Plans
        </h2>
        <p className="mt-2 text-white/40 text-sm">Choose a plan that fits your financial goals</p>
      </div>

      {/* Horizontal scroll on mobile, grid on larger screens */}
      <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide">
        {PLANS.map(({ id, name, range }) => (
          <div
            key={id}
            id={id}
            className="flex flex-col rounded-xl px-5 py-6 gap-5 shrink-0 w-[240px] md:w-auto snap-start"
            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex justify-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-red-500" style={{ background: 'rgba(192,0,10,0.15)' }}>
                <IconDiamond />
              </div>
            </div>

            <div className="text-center">
              <p className="text-white font-bold text-base">{name}</p>
              <p className="text-red-500 font-bold mt-1 text-sm leading-tight">{range}</p>
            </div>

            <ul className="flex flex-col gap-2 flex-1">
              {FEATURES.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0"><IconCheck /></span>
                  <span className="text-white/60 text-xs leading-snug">{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className="block text-center text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 hover:bg-red-700 active:scale-[0.97]"
              style={{ background: '#c0000a' }}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default InvestmentPlansSection;
