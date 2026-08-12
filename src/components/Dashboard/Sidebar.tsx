import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  IconDashboard,
  IconStatement,
  IconInvestments,
  IconCar,
  IconVIP,
  IconGiveaways,
  IconTrading,
  IconAccount,
  IconDeposit,
  IconChevronDown,
} from '../ui/Icons';

/* ── Tesla Logo ── */
const TeslaLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 342 512"
    className="w-5 h-5 fill-red-500"
    aria-label="Tesla logo"
  >
    <path d="M0 78.3C54.4 61.8 120.6 52 171 52s116.6 9.8 171 26.3C337.6 115 320 155.2 320 155.2c-27.4-9-63-15.4-101.6-18L171 512 123.6 137.2C85 140 49.4 146.4 22 155.4 22 155.4 4.4 115 0 78.3zm171-26.3c25.5 0 50.4 1.6 74 4.6L171 512 97 56.6c23.6-3 48.5-4.6 74-4.6z" />
  </svg>
);

/* ── Menu List ── */
interface SubMenuItem {
  label: string;
  to: string;
}

interface MenuItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  subItems?: SubMenuItem[];
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

const MENU_ITEMS: MenuGroup[] = [
  { group: 'Overview', items: [
    { label: 'Dashboard', to: '/dashboard', icon: <IconDashboard /> },
    { label: 'Account Statement', to: '/dashboard/statement', icon: <IconStatement /> },
  ]},
  { group: 'Wealth', items: [
    { label: 'Investments', to: '/dashboard/investments', icon: <IconInvestments /> },
    { label: 'Car Inventory', to: '/dashboard/inventory', icon: <IconCar /> },
    { label: 'VIP Cards', to: '/dashboard/vip', icon: <IconVIP /> },
  ]},
  { group: 'Capital', items: [
    { label: 'Deposit & Withdraw', to: '/dashboard/deposit', icon: <IconDeposit /> },
    { label: 'Giveaways', to: '/dashboard/giveaways', icon: <IconGiveaways /> },
    { label: 'Trading', to: '/dashboard/trading', icon: <IconTrading /> },
    { label: 'Account', to: '/dashboard/account', icon: <IconAccount /> },
  ]}
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const allGroups = MENU_ITEMS;
  const [langOpen, setLangOpen] = useState(false);

  // Track open state for submenus. Key is the item label.
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    MENU_ITEMS.forEach(group => {
      group.items.forEach(item => {
        if (item.subItems) {
          // If the path starts with the base path (e.g. /dashboard/investments), keep it open
          const hasActiveSub = location.pathname.startsWith(item.to);
          initial[item.label] = hasActiveSub;
        }
      });
    });
    return initial;
  });

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <aside 
      className="w-full h-full bg-[#fbfbfb] flex flex-col justify-between select-none font-sans"
    >
      {/* Top: Branding */}
      <div>
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#e5e5e7]">
          <div className="flex items-center gap-3">
            <TeslaLogo />
            <span className="text-[#1d1d1f] font-black text-sm tracking-[0.2em] uppercase">TESLA FINANCE</span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-lg cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Categories */}
        <nav className="p-4 flex flex-col gap-6">
          {allGroups.map((group) => (
            <div key={group.group} className="flex flex-col gap-1">
              {/* Group Label */}
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#86868b] mb-1">
                {group.group}
              </p>
              
              {/* Group Links */}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const hasSubItems = !!item.subItems;
                  const isExpanded = !!openSubmenus[item.label];
                  
                  // For items with subItems, the main link itself is active if current path is one of the sub-items, or if it matches the parent 'to'
                  const isParentActive = location.pathname === item.to || (item.subItems?.some(sub => location.pathname === sub.to) ?? false);

                  if (hasSubItems) {
                    return (
                      <div key={item.label} className="flex flex-col">
                        {/* Parent Toggle Button */}
                        <button
                          onClick={() => toggleSubmenu(item.label)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer w-full text-left ${
                            isParentActive 
                              ? 'bg-red-500/5 border border-red-500/10 text-red-600' 
                              : 'text-[#515154] hover:text-[#1d1d1f] border border-transparent hover:bg-black/3'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`transition-colors duration-200 ${isParentActive ? 'text-red-600' : 'text-black/30'}`}>
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          
                          {/* Chevron Icon indicating expand/collapse */}
                          <span className={`transition-transform duration-200 opacity-70 ${isExpanded ? 'rotate-180' : ''}`}>
                            <IconChevronDown size={12} />
                          </span>
                        </button>
                        
                        {/* Sub-menu Items */}
                        {isExpanded && (
                          <div className="pl-6 mt-1 flex flex-col gap-0.5 border-l border-[#e5e5e7] ml-5">
                            {item.subItems?.map((sub) => {
                              const subActive = location.pathname === sub.to;
                              return (
                                <Link
                                  key={sub.label}
                                  to={sub.to}
                                  onClick={onClose}
                                  className={`flex items-center justify-between px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-150 ${
                                    subActive 
                                      ? 'text-red-600 bg-red-500/5' 
                                      : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/3'
                                  }`}
                                >
                                  <span>{sub.label}</span>
                                  {subActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-lg shadow-red-500/50" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const active = location.pathname === item.to || (item.to === '/dashboard' && location.pathname === '/dashboard');
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 group ${
                        active 
                          ? 'bg-red-500/5 border border-red-500/10 text-red-600' 
                          : 'text-[#515154] hover:text-[#1d1d1f] border border-transparent hover:bg-black/3'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`transition-colors duration-200 ${active ? 'text-red-600' : 'text-black/30'}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      
                      {/* Active Dot Indicator */}
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-lg shadow-red-500/50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Admin shortcut + Language Selector */}
      <div className="p-4 border-t border-[#e5e5e7] relative flex flex-col gap-2">
        {/* Admin panel shortcut — only for admins */}
        {user?.role === 'ADMIN' && (
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#c0000a] bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin Panel
          </Link>
        )}
        <button 
          onClick={() => setLangOpen(!langOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#515154] hover:text-[#1d1d1f] hover:bg-black/3 transition-colors border border-[#e5e5e7]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🇺🇸</span>
            <span>English (US)</span>
          </div>
          <span className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>
            <IconChevronDown size={12} />
          </span>
        </button>

        {/* Dropdown popup */}
        {langOpen && (
          <div className="absolute bottom-16 left-4 right-4 bg-white border border-[#e5e5e7] rounded-lg p-1.5 flex flex-col gap-0.5 shadow-xl z-50">
            <button className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#1d1d1f] hover:bg-black/3 rounded-md font-bold uppercase tracking-wider transition-colors w-full text-left">
              <span>🇺🇸</span> English (US)
            </button>
            <button className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#515154] hover:text-[#1d1d1f] hover:bg-black/3 rounded-md font-bold uppercase tracking-wider transition-colors w-full text-left">
              <span>🇫🇷</span> Français (FR)
            </button>
            <button className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#515154] hover:text-[#1d1d1f] hover:bg-black/3 rounded-md font-bold uppercase tracking-wider transition-colors w-full text-left">
              <span>🇩🇪</span> Deutsch (DE)
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
