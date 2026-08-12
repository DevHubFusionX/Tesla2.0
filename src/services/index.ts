/* ─────────────────────────────────────────────
   Services barrel export — clean import paths.
   
   Usage:
   import { authService, userService } from '../services';
   ───────────────────────────────────────────── */

export { api, getToken, clearTokens, setTokens, isAuthenticated } from './api';
export { authService } from './auth';
export { userService } from './userService';
export { transactionService } from './transactionService';
export { investmentService } from './investmentService';
export { inventoryService } from './inventoryService';
export { adminService } from './adminService';
export type { AdminOverview, AdminUser, AdminTransaction, AdminKyc, AdminPlan } from './adminService';

/* Re-export payload/response types for convenience */
export type { AuthResponse, LoginPayload, SignupPayload } from './auth';
export type { UpdateProfilePayload, UpdatePasswordPayload } from './userService';
export type { DepositPayload, WithdrawalPayload } from './transactionService';
export type { InvestPayload, InvestResponse } from './investmentService';
export type { Vehicle, ReserveResponse } from './inventoryService';
