import React, { useState, useMemo } from 'react';
import { GridCard } from './GridCard';
import type { Car } from './GridCard';
import { ListCard } from './ListCard';
import { FilterPanel } from './FilterPanel';

/* ─── Icons ─── */
const IconGrid = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconList = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconClose = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CAR_INVENTORY: Car[] = [
  {
    id: 'tesla-model-x-plaid',
    name: 'Tesla Model X Plaid',
    make: 'Tesla',
    model: 'Model X',
    year: 2024,
    price: 94990,
    type: 'SUV',
    color: 'Pearl White',
    mileage: '12 mi',
    range: '333 mi',
    available: false,
    img: 'https://images.unsplash.com/photo-1617704548623-340376564e68?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tesla-model-3-lr',
    name: 'Tesla Model 3 Long Range',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    price: 47240,
    type: 'Sedan',
    color: 'Midnight Silver',
    mileage: '0 mi',
    range: '358 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tesla-model-s',
    name: 'Tesla Model S',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    price: 74990,
    type: 'Sedan',
    color: 'Obsidian Black',
    mileage: '240 mi',
    range: '405 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'lucid-air-pure',
    name: 'Lucid Air Pure',
    make: 'Lucid',
    model: 'Air',
    year: 2024,
    price: 69900,
    type: 'Sedan',
    color: 'Zenith Red',
    mileage: '0 mi',
    range: '410 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'rivian-r1s',
    name: 'Rivian R1S Launch Edition',
    make: 'Rivian',
    model: 'R1S',
    year: 2024,
    price: 84000,
    type: 'SUV',
    color: 'Forest Green',
    mileage: '55 mi',
    range: '321 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
  },
];

const MAKES = ['All Makes', 'Tesla', 'Lucid', 'Rivian'];
const TYPES = ['All Types', 'Sedan', 'SUV'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'range_desc', label: 'Longest Range' },
  { value: 'available', label: 'Available First' },
];

export const Inventory: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('All Makes');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('default');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredCars = useMemo(() => {
    let cars = CAR_INVENTORY.filter((car) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        car.name.toLowerCase().includes(q) ||
        car.make.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.type.toLowerCase().includes(q);
      const matchesMake = selectedMake === 'All Makes' || car.make === selectedMake;
      const matchesType = selectedType === 'All Types' || car.type === selectedType;
      const matchesAvail = !showAvailableOnly || car.available;
      return matchesSearch && matchesMake && matchesType && matchesAvail;
    });

    if (sortBy === 'price_asc') cars = [...cars].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') cars = [...cars].sort((a, b) => b.price - a.price);
    else if (sortBy === 'range_desc') cars = [...cars].sort((a, b) => parseInt(b.range) - parseInt(a.range));
    else if (sortBy === 'available') cars = [...cars].sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));

    return cars;
  }, [searchQuery, selectedMake, selectedType, sortBy, showAvailableOnly]);

  const hasActiveFilters = selectedMake !== 'All Makes' || selectedType !== 'All Types' || showAvailableOnly || sortBy !== 'default';

  const clearFilters = () => {
    setSelectedMake('All Makes');
    setSelectedType('All Types');
    setSortBy('default');
    setShowAvailableOnly(false);
  };

  return (
    <div className="min-h-full bg-[#f5f5f7] font-sans select-none">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #111 0%, #1a1a1a 50%, #2a1a1a 100%)' }}>
        {/* Decorative glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, #c0000a 0%, transparent 65%)' }}
        />

        <div className="px-5 pt-10 pb-14 relative z-10 text-center">
          <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-tight">
            Browse Inventory
          </h1>
          <p className="text-[13px] text-white/60 mt-2 font-light max-w-xs mx-auto leading-relaxed">
            Explore premium electric vehicles ready for immediate delivery.
          </p>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: '40px' }}>
          <svg viewBox="0 0 360 40" preserveAspectRatio="none" className="w-full h-full" fill="#f5f5f7">
            <path d="M0,40 C60,0 120,40 180,20 C240,0 300,40 360,20 L360,40 Z" />
          </svg>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="px-4 -mt-1">
        <div className="bg-white rounded-2xl border border-[#e5e5e7] shadow-sm overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f0f0f0]">
            <span className="text-[#86868b] shrink-0"><IconSearch /></span>
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-[#1d1d1f] bg-transparent focus:outline-none placeholder-[#86868b]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#86868b] hover:text-[#1d1d1f] transition-colors shrink-0 bg-transparent border-none p-0 cursor-pointer">
                <IconClose />
              </button>
            )}
          </div>

          {/* Filter Panel subcomponent */}
          <FilterPanel
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            selectedMake={selectedMake}
            setSelectedMake={setSelectedMake}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showAvailableOnly={showAvailableOnly}
            setShowAvailableOnly={setShowAvailableOnly}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            makes={MAKES}
            types={TYPES}
            sortOptions={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* ── Results Header ── */}
      <div className="px-4 mt-5 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#1d1d1f]">Available Vehicles</h2>
            <p className="text-[12px] text-[#86868b] mt-0.5">
              Showing 1–{filteredCars.length} of {filteredCars.length} vehicle{filteredCars.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#86868b] mr-1 font-medium">View:</span>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all border-none cursor-pointer ${view === 'grid' ? 'text-[#1d1d1f] bg-white shadow-sm border border-[#e5e5e7]' : 'text-[#86868b] hover:text-[#1d1d1f] bg-transparent'}`}
            >
              <IconGrid />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all border-none cursor-pointer ${view === 'list' ? 'text-[#1d1d1f] bg-white shadow-sm border border-[#e5e5e7]' : 'text-[#86868b] hover:text-[#1d1d1f] bg-transparent'}`}
            >
              <IconList />
            </button>
          </div>
        </div>
      </div>

      {/* ── Vehicle Cards ── */}
      <div className="px-4 pb-8">
        {filteredCars.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCars.map((car) => (
                <GridCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredCars.map((car) => (
                <ListCard key={car.id} car={car} />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#e5e5e7] rounded-2xl gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-[#f5f5f7] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">No Vehicles Found</h3>
              <p className="text-xs text-[#86868b] mt-1">Try adjusting your filters or search query.</p>
            </div>
            <button onClick={clearFilters} className="text-xs font-bold text-[#c0000a] hover:underline mt-1 bg-transparent border-none cursor-pointer">
              Clear filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Inventory;
