import type { AdminUser, AdminPlan, AdminOverview, AdminKyc } from './adminService';
import type { Vehicle } from './inventoryService';

const USERS_KEY = 'mock_users';
const PLANS_KEY = 'mock_plans';
const PORTFOLIO_KEY = 'mock_portfolio';
const TRANSACTIONS_KEY = 'mock_transactions';
const KYC_KEY = 'mock_kyc';
const VEHICLES_KEY = 'mock_vehicles';

const initialUsers: AdminUser[] = [
  {
    id: 'usr-frank',
    name: 'Frank Tesla',
    email: 'frank@tesla.com',
    role: 'USER',
    balance: 52450.00,
    isActive: true,
    createdAt: '2026-07-01T12:00:00Z',
    updatedAt: '2026-07-31T12:00:00Z',
    _count: { investments: 2, transactions: 4 }
  },
  {
    id: 'usr-admin',
    name: 'Admin Tesla',
    email: 'admin@tesla.com',
    role: 'ADMIN',
    balance: 1500000.00,
    isActive: true,
    createdAt: '2026-01-01T12:00:00Z',
    updatedAt: '2026-07-31T12:00:00Z',
    _count: { investments: 0, transactions: 1 }
  }
];

const initialPlans: AdminPlan[] = [
  {
    id: 'plan-1',
    name: 'Tesla Giga Stocks',
    description: 'Direct equity placement focusing on Tesla manufacturing and AI compute infrastructure.',
    minAmount: 500,
    maxAmount: 100000,
    roiPercent: 18.5,
    durationDays: 180,
    riskLevel: 'MODERATE',
    active: true,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'plan-2',
    name: 'Bitcoin Node Yield',
    description: 'High-yield yield farming backed by multi-sig Bitcoin lighting network routing node liquidity.',
    minAmount: 1000,
    maxAmount: null,
    roiPercent: 24.2,
    durationDays: 360,
    riskLevel: 'HIGH',
    active: true,
    createdAt: '2026-02-10T10:30:00Z'
  },
  {
    id: 'plan-3',
    name: 'Giga Austin Real Estate REIT',
    description: 'Commercial real estate portfolio tracking industrial properties surrounding Gigafactory Texas.',
    minAmount: 2500,
    maxAmount: 250000,
    roiPercent: 9.8,
    durationDays: 720,
    riskLevel: 'LOW',
    active: true,
    createdAt: '2026-03-01T08:00:00Z'
  },
  {
    id: 'plan-4',
    name: 'Tesla Energy Bonds',
    description: 'Fixed-income bonds supporting solar roof and Megapack deployment projects worldwide.',
    minAmount: 100,
    maxAmount: 50000,
    roiPercent: 6.5,
    durationDays: 90,
    riskLevel: 'LOW',
    active: true,
    createdAt: '2026-04-05T11:00:00Z'
  }
];

const initialPortfolio: any[] = [
  {
    id: 'inv-1',
    planId: 'plan-1',
    amountInvested: 15000,
    currentValuation: 16250,
    startDate: '2026-07-05T12:00:00Z',
    maturityDate: '2027-01-01T12:00:00Z',
    status: 'ACTIVE',
    plan: {
      name: 'Tesla Giga Stocks',
      description: 'Direct equity placement focusing on Tesla manufacturing and AI compute infrastructure.',
      interestRate: 0.185
    }
  },
  {
    id: 'inv-2',
    planId: 'plan-3',
    amountInvested: 25000,
    currentValuation: 25200,
    startDate: '2026-07-20T12:00:00Z',
    maturityDate: '2028-07-19T12:00:00Z',
    status: 'ACTIVE',
    plan: {
      name: 'Giga Austin Real Estate REIT',
      description: 'Commercial real estate portfolio tracking industrial properties surrounding Gigafactory Texas.',
      interestRate: 0.098
    }
  }
];

const initialTransactions: any[] = [
  {
    id: 'tx-1',
    userId: 'usr-frank',
    type: 'DEPOSIT',
    amount: 50000,
    status: 'COMPLETED',
    description: 'Deposit via Bank Transfer to main wallet',
    createdAt: '2026-07-02T14:30:00Z'
  },
  {
    id: 'tx-2',
    userId: 'usr-frank',
    type: 'INVESTMENT',
    amount: -15000,
    status: 'COMPLETED',
    description: 'Capital deployment into Tesla Giga Stocks plan',
    createdAt: '2026-07-05T12:00:00Z'
  },
  {
    id: 'tx-3',
    userId: 'usr-frank',
    type: 'INVESTMENT',
    amount: -25000,
    status: 'COMPLETED',
    description: 'Capital deployment into Giga Austin Real Estate REIT plan',
    createdAt: '2026-07-20T12:00:00Z'
  },
  {
    id: 'tx-4',
    userId: 'usr-frank',
    type: 'DEPOSIT',
    amount: 42450,
    status: 'COMPLETED',
    description: 'Deposit via USDT (TRC20) to main wallet',
    createdAt: '2026-07-28T09:15:00Z'
  }
];

const initialKyc: AdminKyc[] = [
  {
    id: 'kyc-1',
    userId: 'usr-frank',
    status: 'PENDING',
    documentType: 'Passport',
    createdAt: '2026-07-29T10:00:00Z',
    user: { id: 'usr-frank', name: 'Frank Tesla', email: 'frank@tesla.com' }
  }
];

const initialVehicles: Vehicle[] = [
  {
    id: 'veh-1',
    name: 'Model S Plaid',
    make: 'Tesla',
    model: 'S Plaid',
    year: 2026,
    price: 89990,
    type: 'Sedan',
    color: 'Solid Black',
    mileage: '1,200 mi',
    range: '359 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'veh-2',
    name: 'Cybertruck Cyberbeast',
    make: 'Tesla',
    model: 'Cybertruck',
    year: 2026,
    price: 99990,
    type: 'Truck',
    color: 'Stainless Steel',
    mileage: '450 mi',
    range: '320 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1698778573682-346d219402b5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'veh-3',
    name: 'Model X Plaid',
    make: 'Tesla',
    model: 'X Plaid',
    year: 2025,
    price: 94990,
    type: 'SUV',
    color: 'Ultra Red',
    mileage: '4,500 mi',
    range: '326 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'veh-4',
    name: 'Model 3 Performance',
    make: 'Tesla',
    model: '3 Performance',
    year: 2026,
    price: 54990,
    type: 'Sedan',
    color: 'Deep Blue Metallic',
    mileage: '150 mi',
    range: '296 mi',
    available: false,
    img: 'https://images.unsplash.com/photo-1561580119-2d90630b3511?auto=format&fit=crop&w=600&q=80'
  }
];

export const getFromStorage = <T>(key: string, initial: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initial;
  }
};

export const saveToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockDb = {
  getUsers: () => getFromStorage<AdminUser[]>(USERS_KEY, initialUsers),
  saveUsers: (users: AdminUser[]) => saveToStorage(USERS_KEY, users),

  getPlans: () => getFromStorage<AdminPlan[]>(PLANS_KEY, initialPlans),
  savePlans: (plans: AdminPlan[]) => saveToStorage(PLANS_KEY, plans),

  getPortfolio: () => getFromStorage<any[]>(PORTFOLIO_KEY, initialPortfolio),
  savePortfolio: (portfolio: any[]) => saveToStorage(PORTFOLIO_KEY, portfolio),

  getTransactions: () => getFromStorage<any[]>(TRANSACTIONS_KEY, initialTransactions),
  saveTransactions: (txs: any[]) => saveToStorage(TRANSACTIONS_KEY, txs),

  getKyc: () => getFromStorage<AdminKyc[]>(KYC_KEY, initialKyc),
  saveKyc: (kyc: AdminKyc[]) => saveToStorage(KYC_KEY, kyc),

  getVehicles: () => getFromStorage<Vehicle[]>(VEHICLES_KEY, initialVehicles),
  saveVehicles: (vehicles: Vehicle[]) => saveToStorage(VEHICLES_KEY, vehicles),

  getCurrentUser: (email: string): AdminUser | null => {
    const users = mockDb.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getOverview: (): AdminOverview => {
    const users = mockDb.getUsers();
    const portfolio = mockDb.getPortfolio();
    const transactions = mockDb.getTransactions();

    const activeInvestments = portfolio.filter(p => p.status === 'ACTIVE');
    const maturedInvestments = portfolio.filter(p => p.status === 'MATURED');
    
    const completedDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED');
    const completedWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED');

    const aum = activeInvestments.reduce((sum, item) => sum + item.amountInvested, 0);
    const totalDeposited = completedDeposits.reduce((sum, item) => sum + Math.abs(item.amount), 0);
    const totalWithdrawn = completedWithdrawals.reduce((sum, item) => sum + Math.abs(item.amount), 0);

    return {
      totalUsers: users.length,
      totalInvestments: portfolio.length,
      aum,
      activeInvestmentCount: activeInvestments.length,
      maturedInvestmentCount: maturedInvestments.length,
      totalDeposited,
      totalWithdrawn,
      totalDepositCount: completedDeposits.length,
      totalWithdrawalCount: completedWithdrawals.length,
    };
  }
};
