import React from 'react';
import { Link } from 'react-router-dom';

/* ── Tesla "T" SVG logo ─────────────────────────────────────────────────── */
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

/* ── Footer link groups ─────────────────────────────────────────────────── */
const LINKS = [
  {
    heading: 'Platform',
    items: [
      { label: 'Dashboard',   to: '/dashboard'              },
      { label: 'Investments', to: '/dashboard/investments'  },
      { label: 'Wallet',      to: '/dashboard/deposit'      },
      { label: 'Inventory',   to: '/dashboard/inventory'    },
    ],
  },
  {
    heading: 'Plans',
    items: [
      { label: 'Beginner',  to: '/signup' },
      { label: 'Standard',  to: '/signup' },
      { label: 'Business',  to: '/signup' },
      { label: 'VIP',       to: '/signup' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About Us', to: '/#about'   },
      { label: 'Contact',  to: '/#contact' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy Policy',   to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Risk Disclosure',  to: '/' },
    ],
  },
] as const;

/* ── Social icons ───────────────────────────────────────────────────────── */
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

/* ── Footer component ───────────────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer
    id="footer"
    className="w-full"
    style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.07)' }}
  >
    {/* Main footer grid */}
    <div className="w-full max-w-7xl mx-auto px-6 pt-16 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr] gap-10 md:gap-12">

        {/* ── Brand column ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Tesla logo + wordmark */}
          <div className="flex items-center gap-4">
            <TeslaLogo />
            <p
              className="text-white font-black text-2xl tracking-widest"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.18em' }}
            >
              TESLA
            </p>
          </div>

          <p
            className="text-white/40 text-sm leading-relaxed max-w-xs"
            style={{ letterSpacing: '0.01em' }}
          >
            All-in-one platform for automated investments, live stock trading,
            crypto wallet management, and premium EV inventory.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            {[
              { id: 'social-x',        icon: <IconX />,        label: 'X (Twitter)' },
              { id: 'social-linkedin', icon: <IconLinkedIn />, label: 'LinkedIn'     },
              { id: 'social-instagram',icon: <IconInstagram />,label: 'Instagram'    },
            ].map(({ id, icon, label }) => (
              <a
                key={id}
                id={id}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40
                           transition-all duration-200 hover:text-white hover:bg-white/8"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Link columns ─────────────────────────────────────────────── */}
        {LINKS.map(({ heading, items }) => (
          <div key={heading} className="flex flex-col gap-4">
            <p
              className="text-white text-xs font-semibold tracking-widest uppercase"
              style={{ letterSpacing: '0.12em' }}
            >
              {heading}
            </p>
            <ul className="flex flex-col gap-2.5">
              {items.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/40 text-sm transition-colors duration-150 hover:text-white/80"
                    style={{ letterSpacing: '0.01em' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* ── Bottom bar ────────────────────────────────────────────────────── */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-full max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/25 text-xs" style={{ letterSpacing: '0.01em' }}>
          © {new Date().getFullYear()} Tesla, Inc. All rights reserved.
        </p>
        <p className="text-white/20 text-xs text-center sm:text-right max-w-md" style={{ letterSpacing: '0.01em' }}>
          Trading involves risk. Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
