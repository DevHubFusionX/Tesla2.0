/* ─────────────────────────────────────────────
   ProtectedRoute — protects authenticated routes.
   Redirects unauthenticated users to `/login`.
   ───────────────────────────────────────────── */

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Run auth validation on mount
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#f9f9f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Verifying Identity</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
