/* ─────────────────────────────────────────────
   AdminRoute — protects administrative routes.
   Redirects unauthorized users to `/dashboard`.
   ───────────────────────────────────────────── */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#f9f9f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Verifying Permissions</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
