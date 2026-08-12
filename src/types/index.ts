/* ─────────────────────────────────────────────
   Shared TypeScript interfaces for the entire app
   ───────────────────────────────────────────── */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  isActive: boolean;
  phone: string;
  location: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
  tier: string;
  clientId: string;
  initials: string;
  memberSince: string;
}

export type TransactionStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';
export type TransactionType = 'Deposit' | 'Withdrawal';

export interface Transaction {
  id: string;
  type: TransactionType;
  gateway: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  destination?: string;
}

export type SessionDevice = 'desktop' | 'mobile';

export interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  type: SessionDevice;
  current?: boolean;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High';
export type PlanCategory = 'Stocks' | 'Crypto' | 'Real Estate' | 'Bonds' | 'Forex';
export type PlanStatus = 'Active' | 'Inactive' | 'Sold Out';

export interface InvestmentPlan {
  id: string;
  name: string;
  category: PlanCategory;
  roi: number;       // annual % return
  duration: number;  // months
  minAmount: number;
  risk: RiskLevel;
  status: PlanStatus;
  description: string;
}

export interface PortfolioItem {
  id: string;
  planId: string;
  planName: string;
  category: PlanCategory;
  invested: number;
  currentValue: number;
  startDate: string;
  maturityDate: string;
  status: 'Active' | 'Matured' | 'Withdrawn';
  roi?: number;
}
