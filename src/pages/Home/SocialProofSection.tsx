import React from 'react';

/* ── Stats data ─────────────────────────────────────────────────────────── */

const STATS = [
  { id: 'stat-countries', value: '89+',  label: 'Countries Served',   sub: 'Our clients currently come from' },
  { id: 'stat-accuracy',  value: '90%',  label: 'Signal Accuracy',    sub: 'High probability signals'        },
  { id: 'stat-followers', value: '13K+', label: 'Active Followers',   sub: 'And counting daily'              },
  { id: 'stat-experience',value: '10K+', label: 'Years Experience',   sub: 'Combined team expertise'         },
] as const;

/* ── Testimonials data ──────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    id: 'review-james',
    initial: 'J',
    name: 'James W.',
    role: 'Professional Trader',
    quote: '"The platform has transformed the way I manage my investments. The automated tools and real-time data are exceptional."',
  },
  {
    id: 'review-sarah',
    initial: 'S',
    name: 'Sarah M.',
    role: 'Investor',
    quote: '"Outstanding customer support and the car marketplace is a game changer. I purchased my EV and manage my portfolio all in one place."',
  },
  {
    id: 'review-david',
    initial: 'D',
    name: 'David K.',
    role: 'Day Trader',
    quote: '"The live stock data and signal accuracy are unmatched. I\'ve grown my portfolio significantly since joining."',
  },
  {
    id: 'review-amara',
    initial: 'A',
    name: 'Amara O.',
    role: 'Portfolio Manager',
    quote: '"Seamless experience from wallet funding to stock trading. This is the all-in-one platform I\'ve always wanted."',
  },
] as const;

/* ── Component ──────────────────────────────────────────────────────────── */

const SocialProofSection: React.FC = () => {
  return (
    <section id="social-proof" className="w-full" style={{ background: '#0d0d0d' }}>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div
        className="w-full"
        style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ id, value, label, sub }) => (
            <div key={id} id={id} className="flex flex-col">
              <span
                className="text-red-500 font-black leading-none"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.03em',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                {value}
              </span>
              <span
                className="text-white font-semibold mt-2 text-sm"
                style={{ letterSpacing: '0.01em' }}
              >
                {label}
              </span>
              <span
                className="text-white/35 text-xs mt-0.5"
                style={{ letterSpacing: '0.01em' }}
              >
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-white font-bold"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              letterSpacing: '-0.025em',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            What Our Clients Say
          </h2>
          <p className="mt-2 text-white/40 text-sm" style={{ letterSpacing: '0.01em' }}>
            Trusted by thousands of investors worldwide
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map(({ id, initial, name, role, quote }) => (
            <div
              key={id}
              id={id}
              className="flex flex-col gap-4 rounded-xl px-6 py-6"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: 'rgba(192,0,10,0.5)' }}
                >
                  {initial}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ letterSpacing: '-0.01em' }}>
                    {name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{role}</p>
                </div>
              </div>

              {/* Quote */}
              <p
                className="text-white/60 text-sm leading-relaxed"
                style={{ letterSpacing: '0.01em', fontStyle: 'italic' }}
              >
                {quote}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SocialProofSection;
