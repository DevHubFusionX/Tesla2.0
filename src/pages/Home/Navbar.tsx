import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',      to: '/' },
  { label: 'Inventory', to: '/dashboard/inventory' },
  { label: 'Invest',    to: '/dashboard/investments' },
  { label: 'About',     to: '/#about' },
  { label: 'Contact',   to: '/#contact' },
];

const TeslaLogo: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 512" className="w-6 h-6 fill-[#c0000a]" aria-label="Tesla logo">
    <path d="M0 78.3C54.4 61.8 120.6 52 171 52s116.6 9.8 171 26.3C337.6 115 320 155.2 320 155.2c-27.4-9-63-15.4-101.6-18L171 512 123.6 137.2C85 140 49.4 146.4 22 155.4 22 155.4 4.4 115 0 78.3zm171-26.3c25.5 0 50.4 1.6 74 4.6L171 512 97 56.6c23.6-3 48.5-4.6 74-4.6z" />
  </svg>
);

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const bg = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-black/10'
    : 'bg-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-black/6 ${bg}`}>
      <div className="max-w-7xl mx-auto px-5 h-[60px] flex items-center justify-between relative">

        {/* ── Left: hamburger (mobile) / nav links (desktop) ── */}
        <div className="flex items-center min-w-[40px]">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 relative py-1 group ${
                    active ? 'text-[#1d1d1f]' : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  {label}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#c0000a] transition-all duration-200 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-[5px] p-2 -ml-1"
          >
            <span className={`block w-5 h-0.5 bg-[#1d1d1f] rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#1d1d1f] rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#1d1d1f] rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        {/* ── Center: Tesla logo (always centered) ── */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 select-none group">
          <TeslaLogo />
          <span className="text-[#1d1d1f] font-black text-sm tracking-[0.2em] uppercase group-hover:text-[#c0000a] transition-colors">
            Tesla
          </span>
        </Link>

        {/* ── Right: CTA buttons ── */}
        <div className="flex items-center gap-3 min-w-[40px] justify-end">
          <Link
            to="/login"
            className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-[#86868b] hover:text-[#1d1d1f] transition-colors px-2 py-1.5"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-[11px] font-bold uppercase tracking-widest bg-[#c0000a] hover:bg-red-700 active:scale-[0.97] text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-black/6 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-5 py-4 gap-1">
          {NAV_LINKS.map(({ label, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors ${
                  active ? 'text-[#c0000a] bg-red-500/5' : 'text-[#515154] hover:text-[#1d1d1f] hover:bg-black/3'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="flex gap-2 pt-3 mt-1 border-t border-black/6">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center text-sm font-semibold text-[#515154] border border-[#e5e5e7] py-2.5 rounded-lg hover:bg-black/3 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center text-sm font-semibold bg-[#c0000a] hover:bg-red-700 text-white py-2.5 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
