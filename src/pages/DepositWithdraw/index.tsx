import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransactions, useCreateDeposit, useCreateWithdrawal } from '../../hooks/useTransactions';
import { CRYPTO_ADDRESSES } from '../../constants';
import { DepositWithdrawForm } from './DepositWithdrawForm';
import { InfoPanel } from './InfoPanel';
import { ActivityRegistry } from './ActivityRegistry';
import { toast } from 'sonner';

export const DepositWithdraw: React.FC = () => {
  const location = useLocation();
  const { data: transactions = [] } = useTransactions();
  const createDeposit = useCreateDeposit();
  const createWithdrawal = useCreateWithdrawal();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  // Input states
  const [amount, setAmount] = useState<string>('');
  const [gateway, setGateway] = useState<string>('USDT (TRC20)');
  const [address, setAddress] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  
  // App states
  const [copied, setCopied] = useState<boolean>(false);

  // Check router state to switch tabs automatically
  useEffect(() => {
    if (location.state && (location.state as any).mode) {
      const mode = (location.state as any).mode;
      if (mode === 'deposit' || mode === 'withdraw') {
        setActiveTab(mode);
      }
    }
  }, [location.state]);

  // Sync default gateway based on tab
  useEffect(() => {
    if (activeTab === 'deposit') {
      setGateway('USDT (TRC20)');
      setTxHash('');
    } else {
      setGateway('USDT Address');
      setAddress('');
    }
    setAmount('');
  }, [activeTab]);

  const handleCopy = () => {
    const textToCopy = CRYPTO_ADDRESSES[gateway] || '0xAddressPlaceholder';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (activeTab === 'deposit') {
      createDeposit.mutate(
        { amount: numAmount, gateway, txHash },
        {
          onSuccess: () => {
            setAmount('');
            setTxHash('');
            toast.success('Deposit pipeline initialized. Awaiting network validation.');
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to initialize deposit.');
          },
        }
      );
    } else {
      createWithdrawal.mutate(
        { amount: numAmount, gateway, address },
        {
          onSuccess: () => {
            setAmount('');
            setAddress('');
            toast.success('Withdrawal authorization requested. Awaiting approval.');
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to request withdrawal.');
          },
        }
      );
    }
  };

  const isSubmitting = createDeposit.isPending || createWithdrawal.isPending;

  // Show only deposit/withdraw transactions for the activity registry
  const recentTransactions = transactions.filter(
    tx => tx.type === 'Deposit' || tx.type === 'Withdrawal'
  ).slice(0, 5);

  return (
    <div className="min-h-full bg-[#fcfcfd] font-sans pb-16 select-none antialiased">
      
      {/* ─── Header ─── */}
      <div className="border-b border-[#e5e5e7]/80 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-12">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Capital Flow</p>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1.5">Fund Your Account</h1>
          <p className="text-xs text-[#86868b] mt-1 font-light">Initiate secure ledger deposits or process wallet withdrawals.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ─── Left & Middle: Form Box ─── */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Tab Selector */}
          <div className="flex gap-8 border-b border-[#e5e5e7]/80 pb-3">
            {[
              { id: 'deposit', label: 'Make a Deposit' },
              { id: 'withdraw', label: 'Request Withdrawal' },
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

          <DepositWithdrawForm
            activeTab={activeTab}
            amount={amount}
            setAmount={setAmount}
            gateway={gateway}
            setGateway={setGateway}
            address={address}
            setAddress={setAddress}
            txHash={txHash}
            setTxHash={setTxHash}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            handleQuickAmount={handleQuickAmount}
          />

        </div>

        {/* ─── Right: Side Info Panel ─── */}
        <InfoPanel
          activeTab={activeTab}
          gateway={gateway}
          copied={copied}
          handleCopy={handleCopy}
        />

      </div>

      {/* ─── Bottom Section: Active Requests Registry ─── */}
      <ActivityRegistry recentTransactions={recentTransactions} />

    </div>
  );
};

export default DepositWithdraw;
