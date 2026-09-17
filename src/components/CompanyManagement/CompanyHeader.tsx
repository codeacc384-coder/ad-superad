import React from 'react';
import {
  Building2,
  FileText,
  MapPin,
  Users2,
  Calendar,
  CreditCard,
  Clock,
  Palmtree,
  History,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { TenantCompany } from '../../types';

export type CompanyTabType =
  | 'overview'
  | 'profile'
  | 'addresses'
  | 'contacts'
  | 'financial_year'
  | 'payroll_config'
  | 'working_days'
  | 'holidays'
  | 'audit_logs';

interface CompanyHeaderProps {
  company: TenantCompany;
  activeTab: CompanyTabType;
  onTabChange: (tab: CompanyTabType) => void;
  auditCount: number;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company,
  activeTab,
  onTabChange,
  auditCount,
}) => {
  const tabs = [
    { id: 'overview', label: 'Company Overview', icon: Building2 },
    { id: 'profile', label: 'Profile & Legal', icon: FileText },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'contacts', label: 'Key Contacts', icon: Users2 },
    { id: 'financial_year', label: 'Financial Year & Currency', icon: Calendar },
    { id: 'payroll_config', label: 'Payroll Cycle Config', icon: CreditCard },
    { id: 'working_days', label: 'Working Days & Shift', icon: Clock },
    { id: 'holidays', label: 'Statutory Holidays', icon: Palmtree },
    { id: 'audit_logs', label: `Audit Trail (${auditCount})`, icon: History },
  ];

  return (
    <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm mb-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-[#c6c6cd]/40">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#131b2e] text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
            {company.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#1b1b1d] tracking-tight">{company.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                {company.status === 'ACTIVE' ? 'Active & Compliant' : company.status}
              </span>
              <span className="text-[12px] font-mono bg-[#f6f3f5] text-[#505f76] px-2.5 py-0.5 rounded-md border border-[#c6c6cd]/50">
                Tenant: {company.id}
              </span>
            </div>
            <p className="text-[14px] text-[#505f76] mt-1">
              <span className="font-medium text-[#1b1b1d]">{company.legalName}</span> • {company.industry}
            </p>
          </div>
        </div>

        {/* High-level quick stats */}
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <div className="px-4 py-2 bg-[#fcf8fa] rounded-xl border border-[#c6c6cd]/40 min-w-[120px]">
            <p className="text-[11px] font-semibold text-[#76777d] uppercase tracking-wider">
              Base Currency
            </p>
            <p className="text-[15px] font-bold text-[#1b1b1d] mt-0.5">{company.currency}</p>
          </div>
          <div className="px-4 py-2 bg-[#fcf8fa] rounded-xl border border-[#c6c6cd]/40 min-w-[140px]">
            <p className="text-[11px] font-semibold text-[#76777d] uppercase tracking-wider">
              PAN / Tax ID
            </p>
            <p className="text-[14px] font-mono font-bold text-[#1b1b1d] mt-0.5">{company.panNumber}</p>
          </div>
          <div className="px-4 py-2 bg-[#fcf8fa] rounded-xl border border-[#c6c6cd]/40 min-w-[140px]">
            <p className="text-[11px] font-semibold text-[#76777d] uppercase tracking-wider">
              GSTIN
            </p>
            <p className="text-[13px] font-mono font-bold text-[#1b1b1d] mt-0.5 truncate max-w-[120px]">
              {company.gstinNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs Scrollable */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pt-4 -mb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`company-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id as CompanyTabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#131b2e] text-white font-semibold shadow-sm'
                  : 'text-[#505f76] hover:text-[#1b1b1d] hover:bg-[#f6f3f5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#76777d]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
