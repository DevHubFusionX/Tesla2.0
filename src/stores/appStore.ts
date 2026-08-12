/* ─────────────────────────────────────────────
   App Store — Zustand store for local UI & wallet state.
   ───────────────────────────────────────────── */

import { create } from 'zustand';

interface AppState {
  walletBalance: number;
  sidebarOpen: boolean;
  
  // Actions
  setWalletBalance: (balance: number) => void;
  adjustWalletBalance: (amount: number, type: 'Deposit' | 'Withdrawal') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  walletBalance: 0,
  sidebarOpen: false,

  setWalletBalance: (balance) => set({ walletBalance: balance }),
  
  adjustWalletBalance: (amount, type) =>
    set((state) => {
      if (type === 'Deposit') {
        return { walletBalance: state.walletBalance + amount };
      } else {
        return { walletBalance: Math.max(0, state.walletBalance - amount) };
      }
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
