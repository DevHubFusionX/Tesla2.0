import React from 'react';
import { MockCard } from './MockCard';

export interface CardTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  featured: boolean;
  perks: string[];
  gradient: string;
  textClass: string;
  cardName: string;
}

interface MembershipTierCardProps {
  tier: CardTier;
}

export const MembershipTierCard: React.FC<MembershipTierCardProps> = ({ tier }) => {
  return (
    <div 
      className={`bg-white border rounded-3xl p-6 flex flex-col justify-between group hover:shadow-md transition-all duration-200 ${
        tier.featured 
          ? 'border-red-500/30 ring-1 ring-red-500/10 shadow-sm relative' 
          : 'border-[#e5e5e7]'
      }`}
    >
      {/* Featured Badge */}
      {tier.featured && (
        <span className="absolute -top-3 right-6 bg-[#c0000a] text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded shadow-md z-10">
          Most Popular
        </span>
      )}

      <div>
        {/* Card Mockup Visual */}
        <div className="mb-6">
          <MockCard tier={tier.cardName} gradient={tier.gradient} textClass={tier.textClass} />
        </div>

        {/* Title & Description */}
        <div className="pb-4 border-b border-[#f5f5f7]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1d1d1f]">
            {tier.name}
          </h3>
          <p className="text-[11px] text-[#86868b] font-light mt-1 leading-relaxed">
            {tier.description}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="py-4">
          <span className="text-[9px] text-[#86868b] uppercase tracking-wider block">Membership Fee</span>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-black font-mono text-[#1d1d1f]">
              {tier.price}
            </span>
            <span className="text-xs text-[#86868b] ml-1 font-light">
              {tier.period}
            </span>
          </div>
        </div>

        {/* Perks List */}
        <div className="pt-4 border-t border-[#f5f5f7] flex flex-col gap-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">
            Included Perks
          </span>
          <ul className="flex flex-col gap-2.5">
            {tier.perks.map((perk, index) => (
              <li key={index} className="flex items-start gap-2 text-xs">
                {/* Checkmark Icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600 shrink-0 mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-xs text-[#515154] font-medium leading-tight">
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Selection Button */}
      <div className="mt-8 pt-4 border-t border-[#e5e5e7]">
        <button
          type="button"
          className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
            tier.featured
              ? 'bg-[#c0000a] hover:bg-red-700 text-white shadow-md shadow-red-600/10'
              : 'bg-[#f5f5f7] hover:bg-black/5 text-[#515154] hover:text-[#1d1d1f] border border-[#e5e5e7]'
          }`}
        >
          Choose {tier.cardName}
        </button>
      </div>

    </div>
  );
};
