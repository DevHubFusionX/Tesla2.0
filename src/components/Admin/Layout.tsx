import React, { useState } from 'react';
import AdminSidebar from './Sidebar';
import AdminTopbar from './Topbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9f9f9] text-[#1d1d1f] font-sans selection:bg-red-500/10 selection:text-red-600">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-white shadow-2xl">
            <AdminSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[#f9f9f9]">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
