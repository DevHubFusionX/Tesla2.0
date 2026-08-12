import React from 'react';
import type { Plan } from './InvestDrawer';
import { PlanCard } from './PlanCard';

type Risk = 'Low' | 'Moderate' | 'High';

const IconFilter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconChevronDown = ({ open }: { open: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CATEGORY_TABS = [
  { value: 'all',        label: 'All Plans' },
  { value: 'equities',   label: '📈 Equities' },
  { value: 'crypto',     label: '₿ Crypto' },
  { value: 'realestate', label: '🏗️ Real Estate' },
];

interface ExplorePlansProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  filterOpen: boolean;
  setFilterOpen: (val: boolean) => void;
  activeRisk: Risk[];
  toggleRisk: (r: Risk) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  hasFilters: boolean;
  clearFilters: () => void;
  filteredPlans: Plan[];
  setInvestPlan: (p: Plan | null) => void;
}

export const ExplorePlans: React.FC<ExplorePlansProps> = ({
  activeTab,
  setActiveTab,
  filterOpen,
  setFilterOpen,
  activeRisk,
  toggleRisk,
  sortBy,
  setSortBy,
  hasFilters,
  clearFilters,
  filteredPlans,
  setInvestPlan,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Category Tabs */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 text-[11px] font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                  : 'bg-white text-[#86868b] border-[#e5e5e7] hover:border-[#86868b]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mx-4 mt-3 bg-white rounded-2xl border border-[#e5e5e7] overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-transparent border-none cursor-pointer text-left font-sans"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-[#1d1d1f]">
            <span className="text-[#86868b]"><IconFilter /></span>
            Filters &amp; Sort
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-[#c0000a] inline-block" />}
          </span>
          <span className="text-[#86868b]"><IconChevronDown open={filterOpen} /></span>
        </button>

        {filterOpen && (
          <div className="px-4 pb-4 pt-3 border-t border-[#f0f0f0] flex flex-col gap-4">
            {/* Risk */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mb-2">Risk Level</p>
              <div className="flex gap-2">
                {(['Low', 'Moderate', 'High'] as Risk[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRisk(r)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      activeRisk.includes(r)
                        ? r === 'Low' ? 'bg-emerald-600 text-white border-emerald-600'
                          : r === 'Moderate' ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-[#c0000a] text-white border-[#c0000a]'
                        : 'bg-white text-[#86868b] border-[#e5e5e7]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mb-2">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs font-semibold text-[#1d1d1f] bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="return_high">Highest Return</option>
                  <option value="min_low">Lowest Minimum</option>
                </select>
              </div>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 text-[10px] font-bold text-[#c0000a] hover:underline whitespace-nowrap bg-transparent border-none cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Plans List */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-[#1d1d1f]">
            {CATEGORY_TABS.find(t => t.value === activeTab)?.label ?? 'All Plans'}
          </h2>
          <span className="text-[11px] text-[#86868b] font-semibold">{filteredPlans.length} plans</span>
        </div>

        {filteredPlans.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onInvest={setInvestPlan} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#e5e5e7] rounded-2xl gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] text-xl">⚠</div>
            <div>
              <p className="text-sm font-bold text-[#1d1d1f]">No plans match your filters</p>
              <p className="text-xs text-[#86868b] mt-1">Try adjusting the risk level or sort options.</p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-[#c0000a] hover:underline bg-transparent border-none cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
