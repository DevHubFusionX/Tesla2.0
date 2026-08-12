import React, { useState, useEffect } from 'react';
import { useUserProfile, useUpdateProfile } from '../../hooks/useUserProfile';
import { toast } from 'sonner';

export const PersonalInformation: React.FC = () => {
  const { data: user } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [locationStr, setLocationStr] = useState(user?.location || '');
  const [currency, setCurrency] = useState(user?.currency || 'USD');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setLocationStr(user.location || '');
      setCurrency(user.currency || 'USD');
    }
  }, [user]);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      { name, email, phone, location: locationStr, currency: currency as any },
      {
        onSuccess: () => {
          toast.success('Profile information updated.');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to update profile.');
        },
      }
    );
  };

  if (!user) return null;

  return (
    <div className="animate-in fade-in duration-300 flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-10">
      
      {/* Left Column: Context / Descriptions */}
      <div className="md:col-span-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">Identity Registry</h3>
        <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
          Your registration details control currency displays, yield statements, and tax report localizations.
        </p>
        <p className="text-[11px] text-[#86868b] mt-3 leading-relaxed font-light hidden md:block">
          To modify verified credentials permanently, authentication checks are triggered.
        </p>
      </div>

      {/* Right Column: Clean Form Layout */}
      <form onSubmit={handleSaveDetails} className="md:col-span-2 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
              className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Phone Number</label>
            <input 
              type="text" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Registered Location</label>
            <input 
              type="text" 
              value={locationStr} 
              onChange={e => setLocationStr(e.target.value)}
              className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Primary Account Currency</label>
            <select 
              value={currency} 
              onChange={e => setCurrency(e.target.value as any)}
              className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer transition-all"
            >
              <option value="USD">United States Dollar (USD - $)</option>
              <option value="EUR">Euro (EUR - €)</option>
              <option value="GBP">British Pound Sterling (GBP - £)</option>
              <option value="CAD">Canadian Dollar (CAD - $)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="bg-[#1d1d1f] hover:bg-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {updateProfile.isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span>Save Parameters</span>
          </button>
        </div>
      </form>

    </div>
  );
};
