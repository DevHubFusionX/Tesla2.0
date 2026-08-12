import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { toast } from 'sonner';

export const DevPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setMockRole } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!user) return null;

  const handleRoleSwitch = (role: 'USER' | 'ADMIN') => {
    setMockRole(role);
    queryClient.invalidateQueries();
    
    if (role === 'ADMIN') {
      toast.success('Switched to Admin Role');
      navigate('/admin');
    } else {
      toast.success('Switched to User Role');
      navigate('/dashboard');
    }
    setIsOpen(false);
  };

  const handleAddFunds = async () => {
    try {
      await adminService.adjustBalance(user.id, 25000, 'Dev Panel Quick Funding Injection');
      // Invalidate queries to refresh balance
      queryClient.invalidateQueries();
      toast.success('Added $25,000 mock funds successfully');
    } catch (err) {
      toast.error('Failed to add funds');
    }
  };

  const handleResetDb = () => {
    if (window.confirm('Are you sure you want to reset all mock data to defaults?')) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Mock database reset! Reloading...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans select-none">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-[#1d1d1f] hover:bg-[#c0000a] text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:shadow-red-600/20 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/[0.08]"
        title="Toggle Demo Controls"
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        )}
      </button>

      {/* Popover Control Panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-[#1d1d1f]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 text-white shadow-2xl flex flex-col gap-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="border-b border-white/[0.08] pb-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#86868b] mb-0.5">Sandbox Console</h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-bold truncate max-w-[150px]">{user.name}</span>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {user.role}
              </span>
            </div>
            {user.role !== 'ADMIN' && (
              <p className="text-[10px] font-mono text-emerald-400 mt-1">
                Balance: ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Actions Group */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#86868b]">Switch Roles</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRoleSwitch('USER')}
                disabled={user.role === 'USER'}
                className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  user.role === 'USER'
                    ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30 cursor-not-allowed'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-transparent'
                }`}
              >
                As User
              </button>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                disabled={user.role === 'ADMIN'}
                className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  user.role === 'ADMIN'
                    ? 'bg-red-600/30 text-red-400 border border-red-500/30 cursor-not-allowed'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-transparent'
                }`}
              >
                As Admin
              </button>
            </div>
          </div>

          {/* Quick Sandbox Controls */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#86868b]">Developer Actions</span>
            
            {user.role === 'USER' && (
              <button
                onClick={handleAddFunds}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950/20"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add $25k Demo Cash
              </button>
            )}

            <button
              onClick={handleResetDb}
              className="w-full bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/[0.05]"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Reset Mock Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
