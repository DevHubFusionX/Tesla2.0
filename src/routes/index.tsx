/* ─────────────────────────────────────────────
   Centralized route configuration.
   All pages are lazy-loaded via React.lazy + Suspense,
   so each route's JS is only fetched when first visited.

   AppShell wraps all authenticated routes in the
   sidebar/topbar layout + AppProvider.
   ───────────────────────────────────────────── */

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/Layout';
import AdminLayout from '../components/Admin/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

/* ── Lazy page imports ── */
const Home           = React.lazy(() => import('../pages/Home'));
const Login          = React.lazy(() => import('../pages/Login'));
const Signup         = React.lazy(() => import('../pages/Signup'));
const Dashboard      = React.lazy(() => import('../pages/Dashboard'));
const Investments    = React.lazy(() => import('../pages/Investments'));
const Transactions   = React.lazy(() => import('../pages/Transactions'));
const Inventory      = React.lazy(() => import('../pages/Inventory'));
const VipCards       = React.lazy(() => import('../pages/VipCards'));
const Profile        = React.lazy(() => import('../pages/Profile'));
const DepositWithdraw = React.lazy(() => import('../pages/DepositWithdraw'));
const AdminLogin      = React.lazy(() => import('../pages/AdminLogin'));

/* ── Lazy Admin page imports ── */
const AdminDashboard    = React.lazy(() => import('../pages/Admin/Dashboard'));
const AdminTransactions = React.lazy(() => import('../pages/Admin/Transactions'));
const AdminKyc          = React.lazy(() => import('../pages/Admin/Kyc'));
const AdminUsers        = React.lazy(() => import('../pages/Admin/Users'));
const AdminPlans        = React.lazy(() => import('../pages/Admin/Plans'));

/* ── Minimal loading fallback ── */
const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#f9f9f9]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
      <span className="text-[9px] font-bold uppercase tracking-widest text-[#86868b]">Loading</span>
    </div>
  </div>
);

/* ── Authenticated shell: sidebar layout wraps all dashboard routes ── */
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const ProtectedAppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <AppShell>{children}</AppShell>
  </ProtectedRoute>
);

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  </ProtectedRoute>
);

/* ── Route registry ── */
export const AppRoutes: React.FC = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      {/* Public routes */}
      <Route path="/"            element={<Home />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/signup"      element={<Signup />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Authenticated routes */}
      <Route path="/dashboard"            element={<ProtectedAppShell><Dashboard /></ProtectedAppShell>} />
      <Route path="/dashboard/statement"  element={<ProtectedAppShell><Transactions /></ProtectedAppShell>} />
      <Route path="/dashboard/inventory"  element={<ProtectedAppShell><Inventory /></ProtectedAppShell>} />
      <Route path="/dashboard/vip"        element={<ProtectedAppShell><VipCards /></ProtectedAppShell>} />
      <Route path="/dashboard/account"    element={<ProtectedAppShell><Profile /></ProtectedAppShell>} />
      <Route path="/dashboard/deposit"    element={<ProtectedAppShell><DepositWithdraw /></ProtectedAppShell>} />
      <Route path="/dashboard/investments" element={<ProtectedAppShell><Investments /></ProtectedAppShell>} />

      {/* Admin routes — own layout */}
      <Route path="/admin"              element={<AdminShell><AdminDashboard /></AdminShell>} />
      <Route path="/admin/transactions" element={<AdminShell><AdminTransactions /></AdminShell>} />
      <Route path="/admin/kyc"          element={<AdminShell><AdminKyc /></AdminShell>} />
      <Route path="/admin/users"        element={<AdminShell><AdminUsers /></AdminShell>} />
      <Route path="/admin/plans"        element={<AdminShell><AdminPlans /></AdminShell>} />

      {/* Legacy alias */}
      <Route path="/transactions" element={<ProtectedAppShell><Transactions /></ProtectedAppShell>} />
    </Routes>
  </Suspense>
);
