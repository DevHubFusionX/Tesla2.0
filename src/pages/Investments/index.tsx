import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InvestDrawer } from './InvestDrawer';
import type { Plan } from './InvestDrawer';
import { ExplorePlans } from './ExplorePlans';
import { MyPortfolio } from './MyPortfolio';
import { PerformanceHistory } from './PerformanceHistory';
import { usePlans } from '../../hooks/useInvestments';

type Risk = 'Low' | 'Moderate' | 'High';

export const Investments: React.FC = () => {
  const location = useLocation();
  const { data: plansData = [] } = usePlans();

  // Top tabs
  const [activeTab, setActiveTab] = useState<'plans' | 'portfolio' | 'performance'>('plans');

  // Sub-tab / Categories (inside "plans")
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter & Sort panel (inside "plans")
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeRisk, setActiveRisk] = useState<Risk[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Deployment Drawer State
  const [investPlan, setInvestPlan] = useState<Plan | null>(null);

  // Parse location state for redirects
  useEffect(() => {
    if (location.state) {
      const state = location.state as any;
      if (state.tab === 'plans') {
        setActiveTab('plans');
        if (state.category) {
          setActiveCategory(state.category);
        }
      }
    }
  }, [location.state]);

  const toggleRisk = (risk: Risk) => {
    setActiveRisk(prev =>
      prev.includes(risk) ? prev.filter(r => r !== risk) : [...prev, risk]
    );
  };

  const clearFilters = () => {
    setActiveRisk([]);
    setSortBy('featured');
    setActiveCategory('all');
  };

  const hasFilters = activeRisk.length > 0 || sortBy !== 'featured' || activeCategory !== 'all';

  const mapCategoryToUi = (cat: string): 'equities' | 'crypto' | 'realestate' => {
    if (cat === 'Stocks' || cat === 'equities') return 'equities';
    if (cat === 'Crypto' || cat === 'crypto') return 'crypto';
    return 'realestate';
  };

  const allPlansMapped = useMemo(() => {
    if (!plansData || plansData.length === 0) return [];
    return plansData.map((p: any) => {
      const days = (p.duration || 12) * 30;
      return {
        id: p.id,
        name: p.name,
        subtitle: p.category === 'Crypto' ? 'High-Frequency Yield Node' : `${p.name} Yield Allocation`,
        category: mapCategoryToUi(p.category),
        risk: p.risk,
        nav: `$${(p.minAmount / 10).toFixed(4)}`,
        return1y: `+${(p.roi || p.apy || 0).toFixed(2)}%`,
        apy: p.roi || p.apy || 0,
        minAmount: p.minAmount,
        term: `${days} Days`,
        description: p.description,
      };
    });
  }, [plansData]);

  const filteredPlans = useMemo(() => {
    let plans = allPlansMapped.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesRisk = activeRisk.length === 0 || activeRisk.includes(p.risk);
      return matchesCategory && matchesRisk;
    });

    if (sortBy === 'return_high') {
      plans = [...plans].sort((a, b) => b.apy - a.apy);
    } else if (sortBy === 'min_low') {
      plans = [...plans].sort((a, b) => a.minAmount - b.minAmount);
    }

    return plans;
  }, [allPlansMapped, activeCategory, activeRisk, sortBy]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans pb-16 select-none antialiased flex flex-col gap-6">
      
      {/* Header */}
      <div className="bg-white border-b border-[#e5e5e7]/80">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Placements</p>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1">
            Investment Portfolio
          </h1>
          <p className="text-xs text-[#86868b] mt-1 font-light">
            Deploy capital, check active nodes, and track historical yield charts.
          </p>

          {/* Navigation Links / Section Header Tabs */}
          <div className="flex gap-8 border-b border-[#e5e5e7]/80 pb-3 mt-8 -mb-10">
            {[
              { id: 'plans', label: 'Explore Plans' },
              { id: 'portfolio', label: 'My Portfolio' },
              { id: 'performance', label: 'Performance History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer -mb-3.75 ${
                  activeTab === tab.id
                    ? 'border-neutral-900 text-[#1d1d1f]'
                    : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        {/* Explore Plans Tab */}
        {activeTab === 'plans' && (
          <ExplorePlans
            activeTab={activeCategory}
            setActiveTab={setActiveCategory}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            activeRisk={activeRisk}
            toggleRisk={toggleRisk}
            sortBy={sortBy}
            setSortBy={setSortBy}
            hasFilters={hasFilters}
            clearFilters={clearFilters}
            filteredPlans={filteredPlans}
            setInvestPlan={setInvestPlan}
          />
        )}

        {/* My Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <MyPortfolio />
        )}

        {/* Performance History Tab */}
        {activeTab === 'performance' && (
          <PerformanceHistory />
        )}
      </div>

      {/* Invest Capital Drawer */}
      {investPlan && (
        <InvestDrawer plan={investPlan} onClose={() => setInvestPlan(null)} />
      )}

    </div>
  );
};

export default Investments;
