import React from 'react';
import { useApp } from '../../context/useApp';
import { ShieldAlert, LogOut } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { impersonation, exitImpersonation, viewCompanyProfile } = useApp();

  if (!impersonation.isImpersonating || !impersonation.company) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 sm:px-6 py-2.5 shadow-md flex items-center justify-between z-30 shrink-0 w-full">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-white/20 rounded-md">
          <ShieldAlert className="w-4 h-4 text-white" />
        </div>
        <div className="text-xs">
          <span className="font-bold">IMPERSONATION MODE ACTIVE:</span> You are currently viewing the platform as{' '}
          <span className="underline font-semibold">{impersonation.adminName}</span> (Company Admin for{' '}
          <button
            onClick={() => viewCompanyProfile(impersonation.company!.id)}
            className="font-bold underline hover:text-amber-200 cursor-pointer"
          >
            {impersonation.company.name}
          </button>
          ). All admin audit logs will track this session.
        </div>
      </div>

      <button
        onClick={exitImpersonation}
        className="flex items-center gap-1.5 bg-white text-amber-800 hover:bg-amber-50 active:scale-95 px-3 py-1 rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Exit Impersonation</span>
      </button>
    </div>
  );
};
