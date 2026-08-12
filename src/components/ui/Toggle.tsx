/* ─────────────────────────────────────────────
   Reusable toggle switch component.
   Usage:
     <Toggle enabled={twoFa} onToggle={() => setTwoFa(v => !v)} />
   ───────────────────────────────────────────── */

import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onToggle, size = 'md' }) => {
  const track = size === 'sm'
    ? 'w-8 h-4'
    : 'w-9 h-5';
  const thumb = size === 'sm'
    ? 'w-3 h-3'
    : 'w-4 h-4';
  const translate = size === 'sm'
    ? (enabled ? 'translate-x-4' : 'translate-x-0')
    : (enabled ? 'translate-x-4' : 'translate-x-0');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`${track} rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer shrink-0 ${
        enabled ? 'bg-[#1d1d1f]' : 'bg-[#e5e5e7]'
      }`}
    >
      <div
        className={`${thumb} rounded-full bg-white shadow-xs transition-transform ${translate}`}
      />
    </button>
  );
};
