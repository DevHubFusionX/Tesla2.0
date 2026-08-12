import React from 'react';
import { MembershipTierCard } from './MembershipTierCard';
import type { CardTier } from './MembershipTierCard';

const MEMBERSHIPS: CardTier[] = [
  {
    id: 'silver',
    name: 'Tesla Silver Card',
    cardName: 'Silver',
    price: '$499.00',
    period: '/ 1 Month',
    description: 'Essential perks for investors starting their journey with automated yield.',
    featured: false,
    gradient: 'from-[#f1f5f9] via-[#cbd5e1] to-[#94a3b8]',
    textClass: 'text-slate-900',
    perks: [
      'Priority customer support (Email/Chat)',
      'Basic market signal access',
      '5% discount on auto-trading fees',
      'Monthly detailed performance reports',
      'Early access to new yield plans'
    ]
  },
  {
    id: 'gold',
    name: 'Tesla Gold Card',
    cardName: 'Gold',
    price: '$1,499.00',
    period: '/ 3 Months',
    description: 'Enhanced benefits designed for serious wealth builders seeking an edge.',
    featured: true,
    gradient: 'from-[#fef08a] via-[#facc15] to-[#ca8a04]',
    textClass: 'text-yellow-950',
    perks: [
      'Everything in Silver',
      'Premium market signals (Real-time)',
      '15% discount on auto-trading fees',
      'Dedicated personal account manager',
      'Exclusive quarterly analyst webinars',
      'Priority withdrawal processing (under 2 hours)'
    ]
  },
  {
    id: 'platinum',
    name: 'Tesla Platinum Card',
    cardName: 'Platinum',
    price: '$4,999.00',
    period: '/ 6 Months',
    description: 'Elite-tier access with maximum advantages and bespoke services.',
    featured: false,
    gradient: 'from-[#334155] via-[#1e293b] to-[#0f172a]',
    textClass: 'text-white',
    perks: [
      'Everything in Gold',
      'Zero-fee automated rebalancing',
      '30% discount on auto-trading fees',
      'Direct line to Senior Wealth Advisory',
      'Tailored yield structuring',
      'Invite-only Tesla ecosystem events (Gigafactory Tours)'
    ]
  }
];

export const VipCards: React.FC = () => {
  return (
    <div className="bg-[#f9f9f9] text-[#1d1d1f] min-h-screen p-6 md:p-10 select-none font-sans flex flex-col gap-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#e5e5e7]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Exclusive Tiers</p>
        <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1">
          VIP Card Memberships
        </h1>
        <p className="text-xs text-[#86868b] mt-1 font-light">
          Unlock exclusive yield rates, trading fee discounts, and priority ecosystem events.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MEMBERSHIPS.map((tier) => (
          <MembershipTierCard key={tier.id} tier={tier} />
        ))}
      </div>

    </div>
  );
};

export default VipCards;
