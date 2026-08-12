/* ─────────────────────────────────────────────
   Auth Store — Zustand store for authentication via Firebase.
   ───────────────────────────────────────────── */

import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/auth';
import { clearTokens } from '../services/api';
import { useAppStore } from './appStore';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { syncUserInvestments } from '../utils/valuationHelper';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setMockRole: (role: 'USER' | 'ADMIN') => Promise<void>;
}

const enhanceUser = (user: any): User | null => {
  if (!user) return null;
  
  const initials = user.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const clientId = user.id ? `CL-${user.id.slice(-5).toUpperCase()}` : 'CL-99827';
  
  let memberSince = 'August 2026';
  if (user.createdAt) {
    try {
      const date = new Date(user.createdAt);
      memberSince = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      // fallback
    }
  }

  const enhanced = {
    ...user, // preserve original fields like id, role, balance, isActive, etc.
    name: user.name || 'User',
    email: user.email || '',
    phone: (user.phone !== undefined && user.phone !== null) ? user.phone : '+44 7911 123456',
    location: (user.location !== undefined && user.location !== null) ? user.location : 'London, United Kingdom',
    currency: user.currency || 'USD',
    tier: user.role === 'ADMIN' ? 'Admin Elite' : 'Tier 1 Elite',
    clientId,
    initials,
    memberSince,
  };

  if (typeof enhanced.balance === 'number') {
    // Schedule updating balance on next tick to avoid React batch state update issues during render
    setTimeout(() => {
      useAppStore.getState().setWalletBalance(enhanced.balance);
    }, 0);
  }

  return enhanced;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  setUser: (user: User | null) => set({ user: enhanceUser(user), isAuthenticated: !!user }),

  initialize: async () => {
    set({ isLoading: true });

    // Set up real-time observer for Firebase Auth state changes
    auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 1. Sync calculations and process matured investments
          await syncUserInvestments(firebaseUser.uid);

          // 2. Fetch updated profile from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({ user: enhanceUser(userData), isAuthenticated: true });
          } else {
            // Document missing, trigger logout to clean session
            clearTokens();
            set({ user: null, isAuthenticated: false });
          }
        } catch (err) {
          console.error('Error during auth initialization:', err);
          clearTokens();
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      } else {
        clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await authService.login({ email, password });
      set({ user: enhanceUser(response.user), isAuthenticated: true });
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.message || 'Invalid credentials. Please try again.';
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await authService.signup({ name, email, password });
      set({ user: enhanceUser(response.user), isAuthenticated: true });
    } catch (err: any) {
      console.error('Signup error:', err);
      const message = err.message || 'Registration failed. Please try again.';
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    authService.logout();
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),

  setMockRole: async (role: 'USER' | 'ADMIN') => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userRef, { 
          role,
          updatedAt: new Date().toISOString()
        });
        
        // Retrieve and set the updated user doc
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          set({ user: enhanceUser(userDoc.data()) });
        }
      } catch (err) {
        console.error('Failed to update user role in Firestore:', err);
      }
    }
  }
}));
