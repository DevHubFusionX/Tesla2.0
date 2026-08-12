import React from 'react';

const IconFilter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface FilterPanelProps {
  filterOpen: boolean;
  setFilterOpen: (val: boolean) => void;
  selectedMake: string;
  setSelectedMake: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (val: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  makes: string[];
  types: string[];
  sortOptions: Array<{ value: string; label: string }>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filterOpen,
  setFilterOpen,
  selectedMake,
  setSelectedMake,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  showAvailableOnly,
  setShowAvailableOnly,
  hasActiveFilters,
  clearFilters,
  makes,
  types,
  sortOptions,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e7] shadow-sm overflow-hidden">
      {/* Filters & Sort toggle */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-[#1d1d1f] hover:bg-[#fafafa] transition-colors border-none bg-transparent text-left cursor-pointer"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-[#86868b]"><IconFilter /></span>
          Filters &amp; Sort
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0000a] inline-block" />
          )}
        </span>
        <span className="text-[#86868b]"><IconChevronDown open={filterOpen} /></span>
      </button>

      {/* Expanded Filters */}
      {filterOpen && (
        <div className="px-4 pb-4 border-t border-[#f0f0f0] pt-4 flex flex-col gap-4">
          {/* Make + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Make</p>
              <div className="flex flex-wrap gap-1.5">
                {makes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMake(m)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      selectedMake === m
                        ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                        : 'bg-white text-[#86868b] border-[#e5e5e7] hover:border-[#86868b]/40'
                    }`}
                  >
                    {m === 'All Makes' ? 'All' : m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Type</p>
              <div className="flex flex-wrap gap-1.5">
                {types.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      selectedType === t
                        ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                        : 'bg-white text-[#86868b] border-[#e5e5e7] hover:border-[#86868b]/40'
                    }`}
                  >
                    {t === 'All Types' ? 'All' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort + Available toggle */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Sort By</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-[#1d1d1f] bg-[#f5f5f7] border border-[#e5e5e7] rounded-lg px-3 py-2 focus:outline-none w-full cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Status</p>
              <button
                type="button"
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className={`text-[10px] font-bold px-3 py-2 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  showAvailableOnly
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-[#86868b] border-[#e5e5e7]'
                }`}
              >
                Available Only
              </button>
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] font-bold text-[#c0000a] hover:underline self-start bg-transparent border-none p-0 cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
