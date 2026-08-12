import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const TeslaLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 512" className="w-4 h-4 fill-[#c0000a]" aria-label="Tesla logo">
    <path d="M0 78.3C54.4 61.8 120.6 52 171 52s116.6 9.8 171 26.3C337.6 115 320 155.2 320 155.2c-27.4-9-63-15.4-101.6-18L171 512 123.6 137.2C85 140 49.4 146.4 22 155.4 22 155.4 4.4 115 0 78.3zm171-26.3c25.5 0 50.4 1.6 74 4.6L171 512 97 56.6c23.6-3 48.5-4.6 74-4.6z" />
  </svg>
);

const NAV = [
  {
    group: 'Overview',
    items: [
      {
        label: 'Dashboard',
        to: '/admin',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'Management',
    items: [
      {
        label: 'Users',
        to: '/admin/users',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        label: 'Transactions',
        to: '/admin/transactions',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" />
            <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" />
          </svg>
        ),
      },
      {
        label: 'KYC',
        to: '/admin/kyc',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
      },
      {
        label: 'Investment Plans',
        to: '/admin/plans',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        ),
      },
    ],
  },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (to: string) =>
    to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);

  return (
    <aside className="w-full h-full bg-white flex flex-col justify-between select-none font-sans border-r border-[#e5e5e7]">

      {/* Brand */}
      <div>
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#e5e5e7]">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={onClose}>
            <TeslaLogo />
            <div>
              <span className="text-[#1d1d1f] font-black text-xs tracking-[0.18em] uppercase block leading-none">Tesla Finance</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#c0000a] leading-none mt-0.5 block">Admin Panel</span>
            </div>
          </Link>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-lg cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="p-4 flex flex-col gap-6">
          {NAV.map((group) => (
            <div key={group.group} className="flex flex-col gap-0.5">
              <p className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b] mb-1">{group.group}</p>
              {group.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                      active
                        ? 'bg-red-500/5 border border-red-500/10 text-[#c0000a]'
                        : 'text-[#515154] hover:text-[#1d1d1f] border border-transparent hover:bg-black/3'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={active ? 'text-[#c0000a]' : 'text-black/25'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#c0000a] shadow-sm shadow-red-500/50" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: user info + exit */}
      <div className="p-4 border-t border-[#e5e5e7] flex flex-col gap-2">
        {/* Admin badge */}
        <div className="px-3 py-2.5 rounded-lg bg-[#f9f9f9] border border-[#e5e5e7] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#c0000a]/10 border border-[#c0000a]/20 flex items-center justify-center text-[#c0000a] font-black text-[10px] shrink-0">
            {user?.initials?.charAt(0) ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1d1d1f] truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#c0000a]">Administrator</p>
          </div>
        </div>

        {/* Back to user dashboard */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/3 border border-transparent transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          User Dashboard
        </Link>

        {/* Sign out */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-500/5 border border-transparent transition-colors cursor-pointer w-full text-left"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
