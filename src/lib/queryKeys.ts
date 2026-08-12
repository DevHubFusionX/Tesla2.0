/* ─────────────────────────────────────────────
   Query Keys — central dictionary for query keys.
   ───────────────────────────────────────────── */

export const queryKeys = {
  transactions: {
    all: () => ['transactions'] as const,
  },
  user: {
    profile: () => ['user', 'profile'] as const,
    sessions: () => ['user', 'sessions'] as const,
  },
  investments: {
    plans: () => ['investments', 'plans'] as const,
    portfolio: () => ['investments', 'portfolio'] as const,
  },
  inventory: {
    vehicles: () => ['inventory', 'vehicles'] as const,
  },
} as const;
