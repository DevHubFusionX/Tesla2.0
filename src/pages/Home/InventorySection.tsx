import React from 'react';
import { Link } from 'react-router-dom';

/* ── Inventory data ─────────────────────────────────────────────────────── */

const INVENTORY = [
  {
    id: 'inv-model-x',
    name: 'Tesla Model X',
    price: '$36,000.00*',
    img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    to: '/inventory/model-x',
  },
  {
    id: 'inv-model-3',
    name: 'Tesla Model 3 Long Range',
    price: '$47,240.00*',
    img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    to: '/inventory/model-3',
  },
  {
    id: 'inv-model-x-plaid',
    name: 'Tesla Model X Plaid',
    price: '$94,990.00*',
    img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
    to: '/inventory/model-x-plaid',
  },
] as const;

/* ── Component ──────────────────────────────────────────────────────────── */

const InventorySection: React.FC = () => {
  return (
    <section
      id="inventory"
      className="w-full"
      style={{ background: '#0d0d0d' }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 pb-20">

        {/* ── Header row ─────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="text-white font-bold"
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                letterSpacing: '-0.02em',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Available Inventory
            </h2>
            <p
              className="mt-1 text-red-500 text-sm font-normal"
              style={{ letterSpacing: '0.01em' }}
            >
              Explore a curated selection ready for delivery.
            </p>
          </div>

          <Link
            to="/inventory"
            id="inventory-view-all"
            className="text-red-500 text-sm font-medium hover:text-red-400 transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
            style={{ letterSpacing: '0.01em' }}
          >
            View all <span aria-hidden>→</span>
          </Link>
        </div>

        {/* ── Cards grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INVENTORY.map(({ id, name, price, img }) => (
            <div
              key={id}
              id={id}
              className="flex flex-col rounded-xl overflow-hidden"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Image */}
              <div className="w-full aspect-video overflow-hidden">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 px-5 pt-5 pb-5 gap-4">

                {/* Name */}
                <p
                  className="text-white font-bold leading-tight"
                  style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                    letterSpacing: '-0.01em',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {name}
                </p>

                {/* Pricing */}
                <div>
                  <p className="text-white/40 text-xs mb-0.5" style={{ letterSpacing: '0.02em' }}>
                    Starting at
                  </p>
                  <p
                    className="text-white font-bold"
                    style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)', letterSpacing: '-0.02em' }}
                  >
                    {price}
                  </p>
                  <p className="text-white/35 text-xs mt-0.5" style={{ letterSpacing: '0.01em' }}>
                    After Est. Gas Savings
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    to="/dashboard/inventory"
                    id={`${id}-learn`}
                    className="flex-1 text-center text-white/80 text-sm font-medium py-2.5 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Learn
                  </Link>
                  <Link
                    to="/signup"
                    id={`${id}-order`}
                    className="flex-1 text-center text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 hover:bg-red-700 active:scale-[0.97]"
                    style={{ background: '#c0000a' }}
                  >
                    Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InventorySection;
