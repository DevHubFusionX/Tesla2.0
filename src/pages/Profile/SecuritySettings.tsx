import React, { useState } from 'react';
import { IconKey, IconLock } from '../../components/ui/Icons';
import { Toggle } from '../../components/ui/Toggle';
import { toast } from 'sonner';
import { userService } from '../../services/userService';

export const SecuritySettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [notifyLogin, setNotifyLogin] = useState(true);
  const [notifyYield, setNotifyYield] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsSaving(true);
    try {
      await userService.updatePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Security credentials updated successfully.');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update credentials.';
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 flex flex-col gap-12">
      
      {/* Credentials & Password */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-[#1d1d1f]">
            <IconKey size={14} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Access Codes</h3>
          </div>
          <p className="text-xs text-[#86868b] mt-2.5 leading-relaxed">
            Update your node credentials. Use a strong, unique, and encrypted password pattern.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="md:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-mono text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-mono text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-b border-[#e5e5e7] py-2 text-xs font-mono text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newPassword || newPassword !== confirmPassword || isSaving}
              className="bg-[#1d1d1f] hover:bg-black disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all cursor-pointer"
            >
              Update Passkey
            </button>
          </div>
        </form>
      </div>

      <hr className="border-[#e5e5e7]/50" />

      {/* Two-Factor Authentication & Broadcast Alerts */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-[#1d1d1f]">
            <IconLock size={14} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Verification</h3>
          </div>
          <p className="text-xs text-[#86868b] mt-2.5 leading-relaxed">
            Protect details and transactions using secondary validation devices or alert registers.
          </p>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Two-Factor Authentication Switch */}
          <div className="flex items-center justify-between border-b border-[#e5e5e7]/40 pb-5">
            <div>
              <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">Two-Factor Authentication</h4>
              <p className="text-[11px] text-[#86868b] mt-1 leading-relaxed">Secures account access via dynamic temporal passcodes.</p>
            </div>
            <Toggle enabled={twoFactorEnabled} onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)} />
          </div>

          {/* Notify Sign-in Switch */}
          <div className="flex items-center justify-between border-b border-[#e5e5e7]/40 pb-5">
            <div>
              <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">Security Alerts</h4>
              <p className="text-[11px] text-[#86868b] mt-1 leading-relaxed">Broadcast warnings instantly upon authentication requests.</p>
            </div>
            <Toggle enabled={notifyLogin} onToggle={() => setNotifyLogin(!notifyLogin)} />
          </div>

          {/* Notify Yield Accruals Switch */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">Yield Receipts</h4>
              <p className="text-[11px] text-[#86868b] mt-1 leading-relaxed">Deposit release confirmation notices via digital statement channels.</p>
            </div>
            <Toggle enabled={notifyYield} onToggle={() => setNotifyYield(!notifyYield)} />
          </div>
        </div>
      </div>

    </div>
  );
};
