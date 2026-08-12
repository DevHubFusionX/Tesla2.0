import React from 'react';
import type { Car } from './GridCard';

const IconArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

interface ListCardProps {
  car: Car;
}

export const ListCard: React.FC<ListCardProps> = ({ car }) => (
  <div className="bg-white rounded-2xl border border-[#e5e5e7] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex group">
    {/* Image */}
    <div className="relative w-36 sm:w-48 shrink-0 bg-[#f0f0f0] overflow-hidden">
      <img
        src={car.img}
        alt={car.name}
        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/800x450/f0f0f0/86868b?text=${encodeURIComponent(car.name)}`;
        }}
      />
      {!car.available && (
        <span className="absolute top-2 right-2 bg-[#c0000a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          Sold Out
        </span>
      )}
    </div>

    {/* Info */}
    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[13px] font-bold text-[#1d1d1f] leading-tight">{car.name}</h3>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            car.available ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-red-600 bg-red-50 border border-red-200'
          }`}>
            {car.available ? 'Available' : 'Sold Out'}
          </span>
        </div>
        <p className="text-[10px] text-[#86868b] mt-0.5">{car.color} · {car.type} · {car.year}</p>

        <div className="flex gap-4 mt-2">
          <div>
            <p className="text-[8px] text-[#86868b] uppercase tracking-wider">Range</p>
            <p className="text-[11px] font-semibold text-[#1d1d1f]">{car.range}</p>
          </div>
          <div>
            <p className="text-[8px] text-[#86868b] uppercase tracking-wider">Mileage</p>
            <p className="text-[11px] font-semibold text-[#1d1d1f]">{car.mileage}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-[15px] font-bold text-[#1d1d1f] font-mono">${car.price.toLocaleString()}</p>
        <button
          disabled={!car.available}
          className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors ${
            car.available
              ? 'bg-[#1d1d1f] hover:bg-black text-white'
              : 'bg-[#e5e5e7] text-[#86868b] cursor-not-allowed'
          }`}
        >
          <span>{car.available ? 'Reserve' : 'Notify Me'}</span>
          {car.available && <IconArrowRight />}
        </button>
      </div>
    </div>
  </div>
);
