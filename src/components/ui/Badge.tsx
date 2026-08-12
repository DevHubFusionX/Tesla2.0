/* ─────────────────────────────────────────────
   Reusable status badge component.
   Usage:
     <Badge status="Completed" />
     <Badge status="Pending" />
     <Badge status="Processing" />
   ───────────────────────────────────────────── */

import React from 'react';
import type { TransactionStatus } from '../../types';

interface BadgeProps {
  status: TransactionStatus | string;
  pulse?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  Completed: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20',
  Pending:   'text-amber-700   bg-amber-500/10   border-amber-500/20',
  Processing:'text-blue-700    bg-blue-500/10    border-blue-500/20',
  Failed:    'text-red-700     bg-red-500/10     border-red-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ status, pulse }) => {
  const styles = BADGE_STYLES[status] ?? 'text-neutral-600 bg-neutral-100 border-neutral-200';
  const isAnimated = pulse ?? (status === 'Pending' || status === 'Processing');

  return (
    <span
      className={`inline-block text-[8.5px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${styles} ${
        isAnimated ? 'animate-pulse' : ''
      }`}
    >
      {status}
    </span>
  );
};
