import React from 'react';

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/35">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

interface TransactionFiltersProps {
  filterType: string;
  setFilterType: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {['All', 'Deposit', 'Withdrawal'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              filterType === type
                ? 'bg-red-500/5 border-red-500/20 text-red-600'
                : 'bg-white border-[#e5e5e7] hover:bg-black/3 text-[#86868b]'
            }`}
          >
            {type}s
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <IconSearch />
        </span>
        <input
          type="text"
          placeholder="Search gateway, txn ID, ref..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-[#e5e5e7] rounded-lg pl-9 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-black/20 focus:outline-none focus:border-red-500/50 transition-colors"
        />
      </div>

    </div>
  );
};
