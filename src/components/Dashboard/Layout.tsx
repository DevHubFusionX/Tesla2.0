import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import {
  IconDashboard,
  IconStatement,
  IconInvestments,
  IconCar,
  IconVIP,
} from '../ui/Icons';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', to: '/dashboard', icon: <IconDashboard /> },
    { label: 'Wallet', to: '/dashboard/statement', icon: <IconStatement /> },
    { label: 'Invest', to: '/dashboard/investments', icon: <IconInvestments /> },
    { label: 'Garage', to: '/dashboard/inventory', icon: <IconCar /> },
    { label: 'VIP', to: '/dashboard/vip', icon: <IconVIP /> }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9f9f9] text-[#1d1d1f] font-sans selection:bg-red-500/10 selection:text-red-600">
      
      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex h-full w-64 shrink-0 border-r border-[#e5e5e7]">
        <Sidebar />
      </div>

      {/* ── Mobile Drawer Sidebar ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Sidebar Drawer Container */}
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-[#fbfbfb] shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main Content Container ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Inner Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f9f9f9] pb-16 md:pb-0">
          {children}
        </main>

        {/* ── Mobile Bottom Navigation Bar ── */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#e5e5e7] flex items-center justify-around px-2 z-40">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${
                  active 
                    ? 'text-[#c0000a]' 
                    : 'text-[#86868b]'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                  active ? 'bg-red-500/10 text-[#c0000a] scale-110' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}>
                  {item.icon}
                </div>
                <span className="text-[8px] font-black uppercase tracking-wider mt-0.5 scale-90">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Layout;
