import React from 'react';
import { IconLock } from '../../components/ui/Icons';

interface DepositWithdrawFormProps {
  activeTab: 'deposit' | 'withdraw';
  amount: string;
  setAmount: (val: string) => void;
  gateway: string;
  setGateway: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  txHash: string;
  setTxHash: (val: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleQuickAmount: (val: number) => void;
}

export const DepositWithdrawForm: React.FC<DepositWithdrawFormProps> = ({
  activeTab,
  amount,
  setAmount,
  gateway,
  setGateway,
  address,
  setAddress,
  txHash,
  setTxHash,
  isSubmitting,
  handleSubmit,
  handleQuickAmount,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Quick Amount Options (Deposits Only) */}
      {activeTab === 'deposit' && (
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Quick amounts</span>
          <div className="flex flex-wrap gap-2.5">
            {[100, 500, 1000, 5000].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-[#e5e5e7] hover:border-neutral-900 text-neutral-800 transition-all cursor-pointer shadow-xs"
              >
                ${val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector: Payout/Payment Gateway */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">
          {activeTab === 'deposit' ? 'Payment Method / Gateway' : 'Payout Method'}
        </label>
        {activeTab === 'deposit' ? (
          <select
            value={gateway}
            onChange={e => setGateway(e.target.value)}
            className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer transition-all"
          >
            <option value="USDT (TRC20)">USDT — TRC-20 (TRON Network)</option>
            <option value="USDT (ERC20)">USDT — ERC-20 (Ethereum)</option>
            <option value="Ethereum (ETH)">Ethereum (ETH)</option>
            <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
          </select>
        ) : (
          <select
            value={gateway}
            onChange={e => setGateway(e.target.value)}
            className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer transition-all"
          >
            <option value="USDT Address">USDT (TRC20/ERC20) Wallet</option>
            <option value="Ethereum Address">Ethereum (ETH) Wallet</option>
            <option value="Bitcoin Address">Bitcoin (BTC) Wallet</option>
            <option value="Bank Account">Bank Wire Account</option>
          </select>
        )}
      </div>

      {/* Input: Transaction Hash (Deposits Only) */}
      {activeTab === 'deposit' && (
        <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">
            Transaction Hash (TxHash / TxID)
          </label>
          <input
            type="text"
            required
            value={txHash}
            onChange={e => setTxHash(e.target.value)}
            placeholder="Enter the blockchain transaction hash"
            className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
          />
        </div>
      )}

      {/* Input: Destination Address (Withdrawals Only) */}
      {activeTab === 'withdraw' && (
        <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">
            {gateway === 'Bank Account' ? 'Bank Account Details (IBAN/Routing & Account No.)' : 'Destination Wallet Address'}
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder={gateway === 'Bank Account' ? 'DE89 3704 0044 0532...' : 'Enter exact network address'}
            className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
          />
        </div>
      )}

      {/* Large Typography Currency Input */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Amount to {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}</label>
        <div className="flex items-baseline border-b border-[#e5e5e7] py-1 focus-within:border-neutral-900 transition-colors">
          <span className="text-2xl font-light text-[#86868b] mr-1.5">$</span>
          <input
            type="number"
            step="any"
            required
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-transparent text-3xl font-light text-[#1d1d1f] focus:outline-none w-full border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <span className="text-[10px] text-[#86868b]">
          {activeTab === 'deposit' ? 'Minimum deposit is $50.00' : `Daily withdrawal allowance: $10,000.00 remaining`}
        </span>
      </div>

      {/* Submit Action Button */}
      <div className="mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs border-none"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <IconLock size={12} />
          )}
          <span>
            {activeTab === 'deposit' ? 'Proceed with Deposit' : 'Confirm Withdrawal Request'}
          </span>
        </button>
      </div>

    </form>
  );
};
