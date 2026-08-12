/* ─────────────────────────────────────────────
   useInvestments Hook — manages investment plans,
   portfolio queries, and investment mutations.
   ───────────────────────────────────────────── */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { investmentService } from '../services/investmentService';
import type { InvestmentPlan, PortfolioItem } from '../types';
import type { InvestResponse } from '../services/investmentService';
import { useAppStore } from '../stores/appStore';
// Live-only mode (Mock data bypass removed)

export const usePlans = () => {
  return useQuery<InvestmentPlan[]>({
    queryKey: queryKeys.investments.plans(),
    queryFn: async () => {
      const rawPlans = await investmentService.getPlans();
      return (rawPlans as any).plans ? (rawPlans as any).plans.map((plan: any) => {
        let category: any = 'Stocks';
        const nameLower = plan.name.toLowerCase();
        const descLower = plan.description.toLowerCase();
        if (nameLower.includes('treasury') || nameLower.includes('bond') || descLower.includes('bond')) {
          category = 'Bonds';
        } else if (nameLower.includes('estate') || nameLower.includes('reit') || descLower.includes('property')) {
          category = 'Real Estate';
        } else if (nameLower.includes('crypto') || nameLower.includes('bitcoin') || nameLower.includes('ethereum') || nameLower.includes('stablecoin')) {
          category = 'Crypto';
        } else if (nameLower.includes('forex') || nameLower.includes('currency')) {
          category = 'Forex';
        }

        let risk: any = 'Moderate';
        if (plan.riskLevel === 'LOW') risk = 'Low';
        if (plan.riskLevel === 'HIGH') risk = 'High';

        return {
          id: plan.id,
          name: plan.name,
          category,
          roi: Number((plan.interestRate * 100).toFixed(1)),
          duration: Math.round(plan.durationDays / 30),
          minAmount: plan.minAmount,
          risk,
          status: plan.active ? 'Active' : 'Inactive',
          description: plan.description,
        } as InvestmentPlan;
      }) : [];
    },
  });
};

export const usePortfolio = () => {
  return useQuery<PortfolioItem[]>({
    queryKey: queryKeys.investments.portfolio(),
    queryFn: async () => {
      const raw = await investmentService.getPortfolio();
      const backendInvestments = (raw as any).investments || [];
      return backendInvestments.map((inv: any) => {
        let category: any = 'Stocks';
        const nameLower = (inv.plan?.name || '').toLowerCase();
        const descLower = (inv.plan?.description || '').toLowerCase();
        if (nameLower.includes('treasury') || nameLower.includes('bond') || descLower.includes('bond')) {
          category = 'Bonds';
        } else if (nameLower.includes('estate') || nameLower.includes('reit') || descLower.includes('property')) {
          category = 'Real Estate';
        } else if (nameLower.includes('crypto') || nameLower.includes('bitcoin') || nameLower.includes('ethereum') || nameLower.includes('stablecoin')) {
          category = 'Crypto';
        } else if (nameLower.includes('forex') || nameLower.includes('currency')) {
          category = 'Forex';
        }

        let mappedStatus = 'Active';
        if (inv.status === 'MATURED') mappedStatus = 'Matured';
        if (inv.status === 'WITHDRAWN') mappedStatus = 'Withdrawn';

        return {
          id: inv.id,
          planId: inv.planId,
          planName: inv.plan?.name || 'Investment Plan',
          category,
          invested: inv.amountInvested,
          currentValue: inv.currentValuation,
          startDate: new Date(inv.startDate).toISOString().slice(0, 10),
          maturityDate: new Date(inv.maturityDate).toISOString().slice(0, 10),
          status: mappedStatus,
          roi: inv.plan?.interestRate ? Number((inv.plan.interestRate * 100).toFixed(1)) : undefined,
        } as PortfolioItem;
      });
    },
  });
};

export const useInvest = () => {
  const queryClient = useQueryClient();

  return useMutation<InvestResponse, Error, { planId: string; amount: number }>({
    mutationFn: async ({ planId, amount }) => {
      const response = await investmentService.invest({ planId, amount });
      const rawItem = (response as any).investment || response;
      const newBalance = (response as any).newBalance;
      if (typeof newBalance === 'number') {
        useAppStore.getState().setWalletBalance(newBalance);
      }

      let category: any = 'Stocks';
      const nameLower = (rawItem.plan?.name || '').toLowerCase();
      const descLower = (rawItem.plan?.description || '').toLowerCase();
      if (nameLower.includes('treasury') || nameLower.includes('bond') || descLower.includes('bond')) {
        category = 'Bonds';
      } else if (nameLower.includes('estate') || nameLower.includes('reit') || descLower.includes('property')) {
        category = 'Real Estate';
      } else if (nameLower.includes('crypto') || nameLower.includes('bitcoin') || nameLower.includes('ethereum') || nameLower.includes('stablecoin')) {
        category = 'Crypto';
      } else if (nameLower.includes('forex') || nameLower.includes('currency')) {
        category = 'Forex';
      }

      const mappedItem: PortfolioItem = {
        id: rawItem.id,
        planId: rawItem.planId,
        planName: rawItem.plan?.name || 'Investment Plan',
        category,
        invested: rawItem.amountInvested,
        currentValue: rawItem.currentValuation,
        startDate: new Date(rawItem.startDate).toISOString().slice(0, 10),
        maturityDate: new Date(rawItem.maturityDate).toISOString().slice(0, 10),
        status: rawItem.status === 'MATURED' ? 'Matured' : rawItem.status === 'WITHDRAWN' ? 'Withdrawn' : 'Active',
        roi: rawItem.plan?.interestRate ? Number((rawItem.plan.interestRate * 100).toFixed(1)) : undefined,
      };

      return {
        portfolioItem: mappedItem,
        message: `Successfully invested $${amount.toLocaleString()} into ${mappedItem.planName}`,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<PortfolioItem[]>(queryKeys.investments.portfolio(), (old) => {
        const item = data.portfolioItem;
        return old ? [item, ...old] : [item];
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    },
  });
};
