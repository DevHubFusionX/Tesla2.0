import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import { IconBell, IconChevronDown, IconMoon, IconMenu } from '../ui/Icons';

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { walletBalance } = useAppStore();
  const [profileOpen, setProfileOpen] = useState(false);

  // Dynamic breadcrumb mapping
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPageName = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ') 
    : 'Overview';

  if (!user) return null;

  return (
    <header className="h-16 border-b border-[#e5e5e7] bg-white/80 backdrop-blur-md px-6 flex items-center justify-between select-none font-sans relative z-40">
      
      {/* ── Left Side: Hamburger (Mobile) & Breadcrumbs (Desktop) ── */}
      <div className="flex items-center">
        {/* Hamburger Menu for Mobile */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-[#1d1d1f] hover:bg-black/5 p-1.5 rounded-lg mr-2.5 cursor-pointer"
        >
          <IconMenu size={18} />
        </button>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Portal</span>
          <span className="text-[#e5e5e7] text-xs">/</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d1d1f]">{currentPageName}</span>
        </div>
        
        {/* Mobile Page Title */}
        <span className="md:hidden text-xs font-black uppercase tracking-[0.15em] text-[#1d1d1f]">
          {currentPageName}
        </span>
      </div>

      {/* ── Right Side: Balance, Dark Mode Toggle, Notifications, Profile ── */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Simple Balance (Desktop Only) */}
        <div className="hidden md:flex items-baseline gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Wallet</span>
          <span className="text-xs font-semibold tracking-tight text-[#1d1d1f] font-mono">
            ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Divider (Desktop Only) */}
        <div className="hidden md:block w-px h-4 bg-[#e5e5e7]" />

        {/* Dark Mode Moon Icon (Sleek Theme Indicator) */}
        <button className="text-black/40 hover:text-black transition-colors p-1 cursor-pointer">
          <IconMoon size={15} />
        </button>

        {/* Notifications Icon (Sleeker with active badge count) */}
        <button 
          id="topbar-notifications"
          className="relative text-black/40 hover:text-black transition-colors p-1 cursor-pointer"
        >
          <IconBell size={16} />
          <span className="absolute -top-1.5 -right-1.5 bg-[#c0000a] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
            3
          </span>
        </button>

        {/* User profile dropdown trigger */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 py-1 transition-colors text-left"
          >
            {/* Avatar circle */}
            <div className="w-7 h-7 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs">
              {user.initials?.charAt(0) || 'U'}
            </div>
            {/* User Info */}
            <span className="text-xs font-semibold text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors hidden sm:inline-block">
              {user.name.split(' ')[0]} {user.name.split(' ').pop()?.charAt(0)}.
            </span>
            <span className="text-black/30"><IconChevronDown size={12} /></span>
          </button>

          {/* Profile Dropdown Popup */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#e5e5e7] rounded-lg p-1.5 flex flex-col gap-0.5 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-[#e5e5e7] mb-1">
                <p className="text-xs font-semibold text-[#1d1d1f]">{user.name}</p>
                <p className="text-[10px] text-[#86868b] mt-0.5">{user.email}</p>
              </div>
              <Link to="/dashboard/account" onClick={() => setProfileOpen(false)} className="px-3 py-2 text-xs text-[#515154] hover:text-[#1d1d1f] hover:bg-black/3 rounded-md font-bold uppercase tracking-wider transition-colors w-full text-left block">
                My Profile
              </Link>
              <Link to="/dashboard/account" onClick={() => setProfileOpen(false)} className="px-3 py-2 text-xs text-[#515154] hover:text-[#1d1d1f] hover:bg-black/3 rounded-md font-bold uppercase tracking-wider transition-colors w-full text-left block">
                Security Settings
              </Link>
              <button 
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md font-bold uppercase tracking-wider transition-colors w-full text-left border-t border-[#e5e5e7] mt-1 pt-2"
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

export default Topbar;
