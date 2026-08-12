import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Tiny SVG chart paths (static placeholder waveforms) ───────────────── */

const CHART_PATH_LEFT =
  'M0,70 C20,65 30,80 50,60 C70,40 80,75 100,55 C120,35 130,70 150,50 C170,30 180,65 200,45 C220,25 235,60 255,40 C275,20 285,55 305,38 C325,20 335,50 355,32 C375,15 385,48 405,30 C425,12 440,45 460,28 C480,10 490,42 510,25';

const CHART_PATH_RIGHT =
  'M0,45 C20,35 35,55 55,30 C75,10 90,45 110,28 C130,12 145,40 165,22 C185,5 200,38 220,20 C240,3 255,35 275,18 C295,2 310,32 330,15 C350,0 365,28 385,12 C405,0 420,25 440,10 C460,0 475,20 495,8 C515,0 520,15 530,8';

/* ── Stock data ─────────────────────────────────────────────────────────── */

const LEFT_TABS = ['Active', 'Gainers', 'Losers'] as const;
type LeftTab = typeof LEFT_TABS[number];

const TIME_RANGES = ['1D', '1M', '3M', '1Y', '5Y', 'All'] as const;
type TimeRange = typeof TIME_RANGES[number];

const STOCKS: Record<LeftTab, { id: string; ticker: string; name: string; price: string; changePct: string; changeAmt: string; positive: boolean; logo: string }[]> = {
  Active: [
    { id: 'nvda', ticker: 'NVDA', name: 'NVIDIA Corporation',     price: '210.96', changePct: '+4.03%', changeAmt: '+8.18',  positive: true,  logo: 'N' },
    { id: 'jzxn', ticker: 'JZXN', name: 'Jiuzi Holdings, Inc.',   price: '2.17',   changePct: '+85.47%',changeAmt: '+1.00',  positive: true,  logo: 'J' },
    { id: 'gmm',  ticker: 'GMM',  name: 'Global MoFy AI Limited', price: '4.57',   changePct: '+147.03%',changeAmt: '+2.72', positive: true,  logo: 'G' },
    { id: 'nu',   ticker: 'NU',   name: 'Nu Holdings Ltd.',       price: '13.76',  changePct: '+0.66%', changeAmt: '+0.09',  positive: true,  logo: 'N' },
  ],
  Gainers: [
    { id: 'gmm',  ticker: 'GMM',  name: 'Global MoFy AI Limited', price: '4.57',   changePct: '+147.03%',changeAmt: '+2.72', positive: true, logo: 'G' },
    { id: 'jzxn', ticker: 'JZXN', name: 'Jiuzi Holdings, Inc.',   price: '2.17',   changePct: '+85.47%',changeAmt: '+1.00', positive: true, logo: 'J' },
    { id: 'nvda', ticker: 'NVDA', name: 'NVIDIA Corporation',     price: '210.96', changePct: '+4.03%', changeAmt: '+8.18', positive: true, logo: 'N' },
    { id: 'nu',   ticker: 'NU',   name: 'Nu Holdings Ltd.',       price: '13.76',  changePct: '+0.66%', changeAmt: '+0.09', positive: true, logo: 'N' },
  ],
  Losers: [
    { id: 'aapl',  ticker: 'AAPL',  name: 'Apple Inc.',     price: '315.32', changePct: '-0.28%', changeAmt: '-0.90', positive: false, logo: 'A' },
    { id: 'googl', ticker: 'GOOGL', name: 'Alphabet Inc.',  price: '357.18', changePct: '-0.48%', changeAmt: '-1.71', positive: false, logo: 'G' },
    { id: 'amzn',  ticker: 'AMZN',  name: 'Amazon.com',     price: '245.24', changePct: '-0.69%', changeAmt: '-1.70', positive: false, logo: 'A' },
    { id: 'msft',  ticker: 'MSFT',  name: 'Microsoft Corp.', price: '385.10', changePct: '-0.19%', changeAmt: '-0.74', positive: false, logo: 'M' },
  ],
};

const RIGHT_STOCKS = [
  { id: 'tsla',  ticker: 'TSLA',  name: 'Tesla',     price: '407.76', changePct: '+0.30%', changeAmt: '+1.21', positive: true,  logo: 'T',  logoColor: '#e31937' },
  { id: 'aapl',  ticker: 'AAPL',  name: 'Apple',     price: '315.32', changePct: '-0.28%', changeAmt: '-0.90', positive: false, logo: '🍎', logoColor: '#555' },
  { id: 'msft',  ticker: 'MSFT',  name: 'Microsoft', price: '385.10', changePct: '+0.19%', changeAmt: '+0.74', positive: true,  logo: 'M',  logoColor: '#00a4ef' },
  { id: 'googl', ticker: 'GOOGL', name: 'Alphabet',  price: '357.18', changePct: '-0.48%', changeAmt: '-1.71', positive: false, logo: 'G',  logoColor: '#4285f4' },
  { id: 'amzn',  ticker: 'AMZN',  name: 'Amazon',    price: '245.24', changePct: '-0.69%', changeAmt: '-1.70', positive: false, logo: 'A',  logoColor: '#ff9900' },
];

const X_LABELS = ['Aug', 'Oct', '2026', 'Mar', 'May', 'Jul'];

/* ── Sub-components ─────────────────────────────────────────────────────── */

const MiniChart: React.FC<{ path: string }> = ({ path }) => (
  <div className="w-full" style={{ height: '90px' }}>
    <svg
      viewBox="0 0 530 80"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {/* Area fill */}
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0000a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c0000a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={path + ' L530,80 L0,80 Z'}
        fill="url(#chartGrad)"
      />
      <path
        d={path}
        fill="none"
        stroke="#e31937"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const XAxis: React.FC = () => (
  <div className="flex justify-between mt-1 px-0.5">
    {X_LABELS.map((l) => (
      <span key={l} className="text-white/30 text-[10px]" style={{ letterSpacing: '0.02em' }}>
        {l}
      </span>
    ))}
  </div>
);

const TimeRangeBar: React.FC<{ active: TimeRange; onSelect: (r: TimeRange) => void }> = ({ active, onSelect }) => (
  <div className="flex items-center gap-0.5 mt-3">
    {TIME_RANGES.map((r) => (
      <button
        key={r}
        onClick={() => onSelect(r)}
        className="px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150"
        style={{
          color: active === r ? '#fff' : 'rgba(255,255,255,0.35)',
          background: active === r ? 'rgba(192,0,10,0.55)' : 'transparent',
          letterSpacing: '0.02em',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {r}
      </button>
    ))}
  </div>
);

const StockRow: React.FC<{
  ticker: string; name: string; price: string;
  changePct: string; changeAmt: string; positive: boolean;
  logo: string; logoColor?: string;
}> = ({ ticker, name, price, changePct, changeAmt, positive, logo, logoColor }) => (
  <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    {/* Logo */}
    <div
      className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
      style={{ background: logoColor ?? 'rgba(255,255,255,0.1)', fontSize: '13px' }}
    >
      {logo}
    </div>

    {/* Name */}
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-semibold truncate" style={{ letterSpacing: '-0.01em' }}>
        {ticker}
        <span className="text-yellow-400 text-[9px] align-super ml-0.5">D•</span>
      </p>
      <p className="text-white/35 text-[11px] truncate">{name}</p>
    </div>

    {/* Price */}
    <p className="text-white/80 text-sm font-medium tabular-nums w-14 text-right" style={{ letterSpacing: '-0.01em' }}>
      {price}
    </p>

    {/* Change */}
    <div className="text-right w-20">
      <p className={`text-xs font-semibold tabular-nums ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {changePct}
      </p>
      <p className={`text-xs tabular-nums ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {changeAmt}
      </p>
    </div>
  </div>
);

/* ── Main Component ─────────────────────────────────────────────────────── */

const StockMarketsSection: React.FC = () => {
  const [leftTab, setLeftTab] = useState<LeftTab>('Active');
  const [leftRange, setLeftRange] = useState<TimeRange>('1Y');
  const [rightRange, setRightRange] = useState<TimeRange>('1Y');

  return (
    <section id="stock-markets" className="w-full" style={{ background: '#0d0d0d' }}>
      <div className="w-full max-w-7xl mx-auto px-6 pb-20">

        {/* ── Header ─────────────────────────────────────────────────────── */}
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
              Stock Markets
            </h2>
            <p className="mt-1 text-white/45 text-sm">
              Featured picks, top gainers, losers, and most active.
            </p>
          </div>
          <Link
            to="/markets"
            id="markets-view-all"
            className="text-red-500 text-sm font-medium hover:text-red-400 transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
          >
            Open markets <span aria-hidden>→</span>
          </Link>
        </div>

        {/* ── Two-panel grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Left panel ─────────────────────────────────────────────── */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Tabs */}
            <div className="flex items-center gap-5 mb-3">
              {LEFT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  className="text-sm font-medium pb-1 transition-colors duration-150"
                  style={{
                    color: leftTab === tab ? '#fff' : 'rgba(255,255,255,0.35)',
                    borderBottom: leftTab === tab ? '2px solid #e31937' : '2px solid transparent',
                    letterSpacing: '0.01em',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <MiniChart path={CHART_PATH_LEFT} />
            <XAxis />
            <TimeRangeBar active={leftRange} onSelect={setLeftRange} />

            {/* Stock rows */}
            <div className="mt-2">
              {STOCKS[leftTab].map((s) => (
                <StockRow key={s.id} {...s} />
              ))}
            </div>
          </div>

          {/* ── Right panel ────────────────────────────────────────────── */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <MiniChart path={CHART_PATH_RIGHT} />
            <XAxis />
            <TimeRangeBar active={rightRange} onSelect={setRightRange} />

            {/* Stock rows */}
            <div className="mt-2">
              {RIGHT_STOCKS.map((s) => (
                <StockRow key={s.id} {...s} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StockMarketsSection;
