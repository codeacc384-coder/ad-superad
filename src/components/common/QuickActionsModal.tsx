import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Layers,
  CreditCard,
  Key,
  Shield,
  FileSpreadsheet,
  Zap,
  UserPlus,
  UserRoundSearch,
  Sliders,
  X
} from 'lucide-react';

export const QuickActionsModal: React.FC = () => {
  const {
    quickActionsOpen,
    setQuickActionsOpen,
    setAddCompanyOpen,
    setActiveTab,
    addToast
  } = useApp();

  if (!quickActionsOpen) return null;

  const handleAction = (callback: () => void) => {
    setQuickActionsOpen(false);
    callback();
  };

  const exportAuditCSV = () => {
    addToast('Audit Log Exported', 'Full platform compliance report downloaded as CSV.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Super Admin Quick Actions</h3>
              <p className="text-[11px] text-slate-500">Fast platform shortcuts and administrative tasks</p>
            </div>
          </div>
          <button
            onClick={() => setQuickActionsOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[70vh] overflow-y-auto">
          {/* Add Company */}
          <button
            onClick={() => handleAction(() => setAddCompanyOpen(true))}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">Provision New Tenant</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Register new company & setup primary admin</p>
            </div>
          </button>

          {/* Leads */}
          <button
            onClick={() => handleAction(() => setActiveTab('leads'))}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserRoundSearch className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">Review Leads</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Review website submissions and verify prospects</p>
            </div>
          </button>

          {/* Add User */}
          <button
            onClick={() => handleAction(() => setActiveTab('users'))}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600">Add Platform User</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Create admin or manager user seat</p>
            </div>
          </button>

          {/* Create Plan */}
          <button
            onClick={() => handleAction(() => setActiveTab('subscriptions'))}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-purple-600">Manage Pricing Tiers</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Configure feature limits and pricing</p>
            </div>
          </button>

          {/* Issue Invoice */}
          <button
            onClick={() => handleAction(() => setActiveTab('billing'))}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">Invoices & Billing</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Track collections, refunds & payouts</p>
            </div>
          </button>

          {/* Security & API Keys */}
          <button
            onClick={() => handleAction(() => setActiveTab('security'))}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600">API Keys & Tokens</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Issue scim keys or revoke tokens</p>
            </div>
          </button>

          {/* Operations Health */}
          <button
            onClick={() => handleAction(() => setActiveTab('health'))}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-600">System Health Status</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Inspect microservices & uptime</p>
            </div>
          </button>

          {/* Export Audit Log */}
          <button
            onClick={() => handleAction(exportAuditCSV)}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all group cursor-pointer sm:col-span-2"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Export Full Audit Log</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Download comprehensive platform activity logs in CSV format</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
