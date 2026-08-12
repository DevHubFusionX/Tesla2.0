/* ─────────────────────────────────────────────
   Query Client — TanStack Query client configuration.
   ───────────────────────────────────────────── */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
      retry: 1,                 // Retry failing queries once
      refetchOnWindowFocus: false, // Disable refetch on window focus for consistency
    },
  },
});
