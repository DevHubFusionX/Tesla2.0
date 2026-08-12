import React from 'react';

export interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  type: string;
  color: string;
  mileage: string;
  range: string;
  available: boolean;
  img: string;
}

interface GridCardProps {
  car: Car;
}

export const GridCard: React.FC<GridCardProps> = ({ car }) => (
  <div className="bg-white rounded-2xl border border-[#e5e5e7] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5">
    {/* Image */}
    <div className="relative w-full aspect-[16/9] bg-[#f0f0f0] overflow-hidden">
      <img
        src={car.img}
        alt={car.name}
        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/800x450/f0f0f0/86868b?text=${encodeURIComponent(car.name)}`;
        }}
      />
      {/* Status Badge */}
      {!car.available ? (
        <span className="absolute top-3 right-3 bg-[#c0000a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
          Sold Out
        </span>
      ) : (
        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
          Available
        </span>
      )}
      {/* Type Tag */}
      <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
        {car.type}
      </span>
    </div>

    {/* Info */}
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-[14px] font-bold text-[#1d1d1f] leading-tight">{car.name}</h3>
        <span className="text-[10px] text-[#86868b] font-medium shrink-0">{car.year}</span>
      </div>
      <p className="text-[11px] text-[#86868b] mb-3">{car.color} · {car.range} range</p>

      {/* Price */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[9px] text-[#86868b] uppercase tracking-wider">Starting at</p>
          <p className="text-[16px] font-bold text-[#1d1d1f] font-mono leading-tight">
            ${car.price.toLocaleString()}
          </p>
        </div>
        <p className="text-[10px] text-[#86868b]">{car.mileage}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 text-[11px] font-bold text-[#515154] bg-[#f5f5f7] hover:bg-[#e8e8e8] rounded-xl border border-[#e5e5e7] transition-colors">
          Details
        </button>
        <button
          disabled={!car.available}
          className={`flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-colors ${
            car.available
              ? 'bg-[#1d1d1f] hover:bg-black text-white'
              : 'bg-[#e5e5e7] text-[#86868b] cursor-not-allowed'
          }`}
        >
          {car.available ? 'Reserve' : 'Notify Me'}
        </button>
      </div>
    </div>
  </div>
);
