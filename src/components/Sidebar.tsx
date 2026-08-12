import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white p-4 h-screen">
      <h2 className="text-xl font-bold mb-6">Aegis Wealth</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/portfolio" className="hover:underline">Portfolio</Link>
        <Link to="/transactions" className="hover:underline">Transactions</Link>
        <Link to="/market" className="hover:underline">Market Watch</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
