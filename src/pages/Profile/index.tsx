import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { PersonalInformation } from './PersonalInformation';
import { SecuritySettings } from './SecuritySettings';
import { SessionDirectory } from './SessionDirectory';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'details' | 'security'>('details');

  if (!user) return null;

  return (
    <div className="min-h-full bg-[#fcfcfd] font-sans pb-16 select-none antialiased">
      
      {/* ─── Editorial Header ─── */}
      <div className="border-b border-[#e5e5e7]/80 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-7 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white font-semibold text-base md:text-lg tracking-wider shadow-xs shrink-0">
              {user.initials || 'U'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#1d1d1f]">{user.name}</h1>
                <span className="text-[9px] font-bold tracking-widest text-[#86868b] border border-[#e5e5e7] px-2 py-0.5 rounded-full uppercase bg-[#f5f5f7]">
                  {user.tier}
                </span>
              </div>
              <p className="text-xs text-[#86868b] mt-1 truncate">{user.email} — ID: <span className="font-mono">{user.clientId}</span></p>
            </div>
          </div>

          <div className="flex gap-6 border-t md:border-t-0 border-[#e5e5e7]/60 pt-4 md:pt-0">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Security</span>
              <span className="text-xs font-semibold text-neutral-900 mt-1 block">Max (2FA)</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#86868b] block">Status</span>
              <span className="text-xs font-semibold text-emerald-600 mt-1 block">Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-7 md:mt-10">
        
        {/* Navigation Tabs */}
        <div className="flex gap-6 md:gap-8 border-b border-[#e5e5e7]/80 mb-8">
          {[
            { id: 'details', label: 'Personal Information', labelShort: 'Personal' },
            { id: 'security', label: 'Security & Sessions', labelShort: 'Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer -mb-px ${
                activeTab === tab.id
                  ? 'border-[#1d1d1f] text-[#1d1d1f]'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.labelShort}</span>
            </button>
          ))}
        </div>

        {/* Tab content area */}
        <div>
          
          {/* TAB 1: Personal Details */}
          {activeTab === 'details' && (
            <PersonalInformation />
          )}

          {/* TAB 2: Security & Access */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-12">
              <SecuritySettings />
              <hr className="border-[#e5e5e7]/50" />
              <SessionDirectory />
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Profile;
