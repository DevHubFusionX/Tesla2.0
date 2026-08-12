import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { TransactionStats } from './TransactionStats';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const Transactions: React.FC = () => {
  const { data: transactions = [], isLoading } = useTransactions();
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exporting, setExporting] = useState(false);

  // Filter & Search Logic
  const filteredTxns = transactions.filter((txn) => {
    const matchesType = filterType === 'All' || txn.type === filterType;
    const matchesSearch = 
      txn.gateway.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.destination && txn.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      txn.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8 select-none font-sans text-[#1d1d1f]">
      
      {/* ── Header & Action Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5e5e7]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Ledger Journal</p>
          <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1">
            Account Statement
          </h1>
          <p className="text-xs text-[#86868b] mt-1 font-light">
            Comprehensive audit logs of all node placement deposits, yield payouts, and withdrawals.
          </p>
        </div>

        <button 
          onClick={handleExport}
          className="bg-white hover:bg-black/3 text-[#1d1d1f] flex items-center justify-center gap-1.5 px-4 py-2 border border-[#e5e5e7] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
        >
          <IconDownload />
          <span>{exporting ? 'Exporting...' : 'Export Statement'}</span>
        </button>
      </div>

      {/* Stats Widgets */}
      <TransactionStats />

      {/* Filters & Search Controls */}
      <TransactionFilters
        filterType={filterType}
        setFilterType={setFilterType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Transaction Ledger Table */}
      <TransactionTable filteredTxns={filteredTxns} />

    </div>
  );
};

export default Transactions;
