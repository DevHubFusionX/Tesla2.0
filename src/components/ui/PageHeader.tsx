/* ─────────────────────────────────────────────
   Reusable editorial page header component.
   Usage:
     <PageHeader
       eyebrow="Capital Flow"
       title="Fund Your Account"
       subtitle="Initiate secure deposits or process withdrawals."
     />
   ───────────────────────────────────────────── */

import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Optional right-side content (e.g., metrics, badges) */
  aside?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, subtitle, aside }) => (
  <div className="border-b border-[#e5e5e7]/80 bg-white">
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-7 md:py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1d1d1f]">{title}</h1>
        {subtitle && (
          <p className="text-xs text-[#86868b] mt-1 font-light">{subtitle}</p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  </div>
);
