import React from 'react';
import { IconCheck, IconCopy, IconInfo } from '../../components/ui/Icons';
import { CRYPTO_ADDRESSES } from '../../constants';

interface InfoPanelProps {
  activeTab: 'deposit' | 'withdraw';
  gateway: string;
  copied: boolean;
  handleCopy: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  activeTab,
  gateway,
  copied,
  handleCopy,
}) => {
  return (
    <div className="lg:col-span-1 flex flex-col gap-6">
      
      {/* Dynamic Address Box (For Deposits Only) */}
      {activeTab === 'deposit' && (
        <div className="bg-neutral-50/50 border border-[#e5e5e7] rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-300">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">Funding Address</h3>
            <p className="text-[10px] text-[#86868b] mt-1">Send your selected cryptocurrency to the address below to settle ledger.</p>
          </div>

          <div className="bg-white border border-[#e5e5e7]/80 rounded-xl p-3.5 flex flex-col items-center gap-4 shadow-2xs">
            {/* QR Code Placeholder Graphic */}
            <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center border border-[#e5e5e7]/50 relative overflow-hidden">
              <div className="absolute inset-2 border-2 border-dashed border-[#86868b]/30 rounded flex flex-col items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#86868b]/40">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <rect x="7" y="7" width="3" height="3" />
                  <rect x="14" y="7" width="3" height="3" />
                  <rect x="7" y="14" width="3" height="3" />
                </svg>
                <span className="text-[8px] font-bold text-[#86868b]/50 tracking-wider mt-2.5 uppercase">QR Code</span>
              </div>
            </div>

            <div className="w-full flex items-center justify-between gap-2.5 bg-neutral-50 rounded-lg px-3 py-2 border border-[#e5e5e7]/60">
              <span className="text-[9px] font-mono text-neutral-800 break-all leading-relaxed flex-1 select-all">
                {CRYPTO_ADDRESSES[gateway] || 'Loading...'}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded bg-white hover:bg-neutral-100 border border-[#e5e5e7] text-neutral-600 transition-all shrink-0 cursor-pointer"
              >
                {copied ? <IconCheck size={13} className="text-emerald-500" /> : <IconCopy size={13} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Funding Registry Guidelines */}
      <div className="bg-neutral-50/50 border border-[#e5e5e7] rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">Funding Instructions</h3>
          <p className="text-[10px] text-[#86868b] mt-1">Review ledger requirements for assets verification cycles.</p>
        </div>

        <ol className="flex flex-col gap-3 text-[11px] text-[#86868b] leading-relaxed">
          <li className="flex gap-2">
            <span className="font-bold text-neutral-900">01.</span>
            <span>{activeTab === 'deposit' ? 'Submit deposit request and allocate funds to the provided ledger address.' : 'Ensure the payout address matches the requested network network standard.'}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-neutral-900">02.</span>
            <span>{activeTab === 'deposit' ? 'Payments are verified within 1 to 3 blockchain network updates.' : 'A security checking threshold checks all major payouts for regulatory standards.'}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-neutral-900">03.</span>
            <span>{activeTab === 'deposit' ? 'Balances clear instantly following confirmed blockchain transactions.' : 'Funds settle directly to your verified target wallets/bank accounts.'}</span>
          </li>
        </ol>
      </div>

      {/* Secure Badge Info Panel */}
      <div className="flex gap-3 bg-neutral-50/30 border border-[#e5e5e7]/60 rounded-xl p-4">
        <div className="text-[#86868b] shrink-0 mt-0.5"><IconInfo size={12} /></div>
        <p className="text-[10px] text-[#86868b] leading-normal font-light">
          We secure ledger keys and assets in cold vaults. Never reveal passwords or private keys to third parties.
        </p>
      </div>

    </div>
  );
};
