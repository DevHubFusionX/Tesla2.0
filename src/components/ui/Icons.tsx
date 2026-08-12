/* ─────────────────────────────────────────────
   Centralized SVG icon library.
   All icons are exported by name. Import only what you need:

   import { IconUser, IconShield } from '../components/ui/Icons';
   ───────────────────────────────────────────── */

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

const icon = (paths: React.ReactNode, size = 18, extras = '') =>
  ({ size: s = size, className = '' }: IconProps = {}) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${extras} ${className}`.trim()}
    >
      {paths}
    </svg>
  );

// ── Navigation ──────────────────────────────────────────────────────────────
export const IconDashboard = icon(
  <><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>
);

export const IconInvestments = icon(
  <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>
);

export const IconStatement = icon(
  <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>
);

export const IconCar = icon(
  <><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6" /></>
);

export const IconVIP = icon(
  <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>
);

export const IconGiveaways = icon(
  <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></>
);

export const IconTrading = icon(
  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
);

export const IconDeposit = icon(
  <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M12 12v4M9 14l3 3 3-3" /><path d="M2 10h20" /></>
);

// ── User & Identity ─────────────────────────────────────────────────────────
export const IconUser = icon(
  <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>
);

export const IconAccount = icon(
  <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>
);

// ── Security ────────────────────────────────────────────────────────────────
export const IconShield = icon(
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);

export const IconLock = icon(
  <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  16
);

export const IconKey = icon(
  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3" />,
  16
);

// ── Devices ─────────────────────────────────────────────────────────────────
export const IconLaptop = icon(
  <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="20" x2="22" y2="20" /></>,
  16
);

export const IconSmartphone = icon(
  <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
  16
);

// ── Actions & UI ────────────────────────────────────────────────────────────
export const IconPlus = icon(
  <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  16
);

export const IconArrowUpRight = icon(
  <><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>,
  16
);

export const IconArrowRight = icon(
  <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  14
);

export const IconCopy = icon(
  <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  14
);

export const IconCheck = icon(
  <polyline points="20 6 9 17 4 12" />,
  14
);

export const IconChevronDown = icon(
  <polyline points="6 9 12 15 18 9" />,
  14
);

export const IconBell = icon(
  <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
  16
);

export const IconInfo = icon(
  <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  14
);

export const IconWallet = icon(
  <><rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><path d="M16 11h.01M22 10v4" /></>
);

export const IconTrendUp = icon(
  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
);

export const IconMoon = icon(
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
);

export const IconMenu = icon(
  <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </>,
  20
);
