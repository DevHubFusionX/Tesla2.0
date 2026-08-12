import React from 'react';

interface MockCardProps {
  tier: string;
  gradient: string;
  textClass: string;
}

export const MockCard: React.FC<MockCardProps> = ({ tier, gradient, textClass }) => {
  return (
    <div 
      className={`w-full aspect-[1.586/1] rounded-2xl p-5 relative flex flex-col justify-between overflow-hidden shadow-lg border border-black/5 bg-linear-to-br ${gradient} transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-xl`}
    >
      {/* Gloss reflection overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
      
      {/* Top row: Logo and Chip */}
      <div className="flex justify-between items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 342 512"
          className={`w-6 h-6 ${tier.toLowerCase() === 'silver' ? 'fill-slate-800/40' : tier.toLowerCase() === 'gold' ? 'fill-yellow-950/40' : 'fill-white/30'}`}
        >
          <path d="M0 78.3C54.4 61.8 120.6 52 171 52s116.6 9.8 171 26.3C337.6 115 320 155.2 320 155.2c-27.4-9-63-15.4-101.6-18L171 512 123.6 137.2C85 140 49.4 146.4 22 155.4 22 155.4 4.4 115 0 78.3zm171-26.3c25.5 0 50.4 1.6 74 4.6L171 512 97 56.6c23.6-3 48.5-4.6 74-4.6z" />
        </svg>
        
        {/* Metallic Chip */}
        <div className="w-8 h-6 rounded bg-linear-to-br from-yellow-100 via-yellow-300 to-yellow-400 border border-yellow-500/20 relative overflow-hidden">
          <div className="absolute inset-x-2 inset-y-1 border-r border-b border-black/10" />
          <div className="absolute inset-x-1 inset-y-2 border-t border-b border-black/10" />
        </div>
      </div>
      
      {/* Bottom row: Card Name and Member Info */}
      <div className="z-10">
        <div className={`text-[8px] font-black tracking-[0.25em] uppercase ${textClass} opacity-60`}>
          Tesla Finance
        </div>
        <div className={`text-base font-bold tracking-widest uppercase ${textClass} mt-1`}>
          {tier} Card
        </div>
        <div className="flex justify-between items-end mt-4">
          <span className={`text-[9px] font-mono ${textClass} opacity-60`}>•••• •••• •••• 8829</span>
          <span className={`text-[8px] font-mono uppercase ${textClass} opacity-60`}>Val 12/28</span>
        </div>
      </div>
    </div>
  );
};
