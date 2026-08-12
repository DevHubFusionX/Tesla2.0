import React from 'react';
import { useSessions, useRevokeSession } from '../../hooks/useUserProfile';
import { IconLaptop, IconSmartphone } from '../../components/ui/Icons';
import { toast } from 'sonner';

export const SessionDirectory: React.FC = () => {
  const { data: sessions = [], isLoading } = useSessions();
  const revokeMutation = useRevokeSession();

  const handleRevoke = (id: string) => {
    revokeMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Platform session terminated.');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Failed to terminate session.');
      },
    });
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-10">
      
      {/* Left Column */}
      <div className="md:col-span-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">Session Directory</h3>
        <p className="text-xs text-[#86868b] mt-2.5 leading-relaxed">
          Review other terminals holding dynamic verification cookies for this profile.
        </p>
      </div>

      {/* Right Column: Sessions table */}
      <div className="md:col-span-2 border border-[#e5e5e7]/80 rounded-xl overflow-hidden divide-y divide-[#e5e5e7]/80 bg-white">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="w-5 h-5 border-2 border-[#e5e5e7] border-t-[#1d1d1f] rounded-full animate-spin" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map(sess => (
            <div key={sess.id} className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-neutral-50/50 transition-colors">
              <div className="flex gap-3 items-center min-w-0">
                <div className="text-[#86868b] shrink-0">
                  {sess.type === 'desktop' ? <IconLaptop size={14} /> : <IconSmartphone size={14} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#1d1d1f] truncate max-w-40 sm:max-w-none">{sess.device}</span>
                    {sess.current && (
                      <span className="text-[7.5px] font-bold text-neutral-800 bg-neutral-100 border border-neutral-200 px-1.5 rounded uppercase tracking-wider shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#86868b] mt-0.5 block truncate">
                    {sess.location} • <span className="font-mono">{sess.ip}</span>
                  </span>
                </div>
              </div>

              {!sess.current && (
                <button
                  type="button"
                  onClick={() => handleRevoke(sess.id)}
                  disabled={revokeMutation.isPending}
                  className="text-[10px] font-bold text-[#c0000a] hover:underline cursor-pointer shrink-0 disabled:opacity-50"
                >
                  Revoke
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-[#86868b] font-light">No sessions detected.</div>
        )}
      </div>

    </div>
  );
};
