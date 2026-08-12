import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { IconMenu, IconChevronDown } from '../ui/Icons';

const BREADCRUMB_MAP: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/users': 'Users',
  '/admin/transactions': 'Transactions',
  '/admin/kyc': 'KYC',
  '/admin/plans': 'Investment Plans',
};

interface AdminTopbarProps {
  onMenuClick: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const pageName = BREADCRUMB_MAP[location.pathname] ?? 'Admin';

  if (!user) return null;

  return (
    <header className="h-16 border-b border-[#e5e5e7] bg-white px-6 flex items-center justify-between select-none font-sans relative z-40 shrink-0">

      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-[#1d1d1f] hover:bg-black/5 p-1.5 rounded-lg cursor-pointer">
          <IconMenu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Admin</span>
          <span className="text-[#e5e5e7]">/</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d1d1f]">{pageName}</span>
        </div>
      </div>

      {/* Right: admin badge + profile */}
      <div className="flex items-center gap-4">

        {/* Admin role pill */}
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#c0000a]/5 border border-[#c0000a]/15 text-[#c0000a] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c0000a] animate-pulse" />
          Administrator
        </span>

        <div className="w-px h-4 bg-[#e5e5e7]" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#c0000a]/10 border border-[#c0000a]/20 flex items-center justify-center text-[#c0000a] font-black text-[10px]">
              {user.initials?.charAt(0) ?? 'A'}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-[#1d1d1f]/80">
              {user.name.split(' ')[0]}
            </span>
            <span className="text-black/30"><IconChevronDown size={12} /></span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#e5e5e7] rounded-xl p-1.5 flex flex-col gap-0.5 shadow-xl z-50">
              <div className="px-3 py-2.5 border-b border-[#e5e5e7] mb-1">
                <p className="text-xs font-bold text-[#1d1d1f]">{user.name}</p>
                <p className="text-[10px] text-[#86868b] mt-0.5">{user.email}</p>
                <span className="inline-block mt-1.5 text-[8px] font-bold uppercase tracking-widest text-[#c0000a] bg-[#c0000a]/5 border border-[#c0000a]/15 px-2 py-0.5 rounded-full">
                  Administrator
                </span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="px-3 py-2 text-xs text-[#515154] hover:text-[#1d1d1f] hover:bg-black/3 rounded-lg font-bold uppercase tracking-wider transition-colors block"
              >
                ← User Dashboard
              </Link>
              <button
                onClick={() => { setProfileOpen(false); logout(); }}
                className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold uppercase tracking-wider transition-colors w-full text-left border-t border-[#e5e5e7] mt-1 pt-2 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
