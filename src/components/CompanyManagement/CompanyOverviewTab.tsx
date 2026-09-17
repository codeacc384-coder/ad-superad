import React from 'react';
import {
  Building2,
  ShieldCheck,
  Calendar,
  CreditCard,
  Clock,
  MapPin,
  Users2,
  Palmtree,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { CompanyCompletePayload } from '../../types';
import { CompanyTabType } from './CompanyHeader';

interface CompanyOverviewTabProps {
  data: CompanyCompletePayload;
  onNavigateTab: (tab: CompanyTabType) => void;
}

export const CompanyOverviewTab: React.FC<CompanyOverviewTabProps> = ({
  data,
  onNavigateTab,
}) => {
  const { company, addresses, contacts, financialYear, payrollConfig, workingDays, holidays } = data;

  const workingDaysCount = workingDays.weeklySchedule.filter((d) => d.isWorkingDay).length;

  return (
    <div className="space-y-6">
      {/* SaaS Context & Next Phase Connection Notice */}
      <div className="bg-[#dae2fd]/40 border border-[#dae2fd] rounded-2xl p-5 text-[#131b2e] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#131b2e] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#131b2e]">
              Phase 1: Company Management Active
            </h3>
            <p className="text-[13px] text-[#3f465c] mt-0.5 max-w-3xl leading-relaxed">
              All company-level statutory configurations, working calendar, payroll cycle dates, and address records configured below feed directly into upcoming modules (Organization Structure, Attendance, and Payroll Processing).
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('profile')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#131b2e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#131b2e]/90 transition-all shadow-sm shrink-0"
        >
          <span>Edit Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Statutory Registrations */}
        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm hover:border-[#131b2e]/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
              Statutory IDs
            </span>
            <div className="p-2 rounded-xl bg-[#dae2fd] text-[#131b2e]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[20px] font-bold text-[#1b1b1d]">Verified</p>
            <p className="text-[12.5px] text-[#505f76] mt-0.5">
              PAN, GSTIN, CIN, PF & ESI configured
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            className="mt-4 text-[12px] font-semibold text-[#131b2e] hover:underline flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Financial Year & Currency */}
        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm hover:border-[#131b2e]/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
              Financial Year
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[20px] font-bold text-[#1b1b1d]">{financialYear.currentFYName}</p>
            <p className="text-[12.5px] text-[#505f76] mt-0.5">
              Currency: {financialYear.currencyCode} ({financialYear.currencySymbol})
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('financial_year')}
            className="mt-4 text-[12px] font-semibold text-[#131b2e] hover:underline flex items-center gap-1"
          >
            Manage FY & Currency <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Payroll Cycle */}
        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm hover:border-[#131b2e]/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
              Payroll Cycle
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[20px] font-bold text-[#1b1b1d]">
              Cut-off: {payrollConfig.cutOffDay}th
            </p>
            <p className="text-[12.5px] text-[#505f76] mt-0.5">
              Disbursement on {payrollConfig.payDay}th ({payrollConfig.payFrequency})
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('payroll_config')}
            className="mt-4 text-[12px] font-semibold text-[#131b2e] hover:underline flex items-center gap-1"
          >
            Configure Cycle <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Working Days & Schedule */}
        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm hover:border-[#131b2e]/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
              Working Schedule
            </span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[20px] font-bold text-[#1b1b1d]">
              {workingDaysCount} Days / Week
            </p>
            <p className="text-[12.5px] text-[#505f76] mt-0.5">
              {workingDays.defaultShiftStartTime} - {workingDays.defaultShiftEndTime} Standard Shift
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('working_days')}
            className="mt-4 text-[12px] font-semibold text-[#131b2e] hover:underline flex items-center gap-1"
          >
            Adjust Schedule <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Profile Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Legal and Entity Information Card */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#c6c6cd]/40">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#131b2e]" />
                <h3 className="text-[16px] font-bold text-[#1b1b1d]">Corporate Legal Entity</h3>
              </div>
              <button
                onClick={() => onNavigateTab('profile')}
                className="text-[13px] font-semibold text-[#131b2e] hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 pt-4 text-[13.5px]">
              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  Company Legal Name
                </p>
                <p className="font-semibold text-[#1b1b1d] mt-0.5">{company.legalName}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  Corporate Identity No. (CIN)
                </p>
                <p className="font-mono font-medium text-[#1b1b1d] mt-0.5">{company.cinNumber}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  Income Tax PAN
                </p>
                <p className="font-mono font-medium text-[#1b1b1d] mt-0.5">{company.panNumber}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  GST Registration (GSTIN)
                </p>
                <p className="font-mono font-medium text-[#1b1b1d] mt-0.5">{company.gstinNumber}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  Provident Fund (PF) Code
                </p>
                <p className="font-mono font-medium text-[#1b1b1d] mt-0.5">
                  {company.pfRegistrationNumber || 'KN/BLR/1098765/000'}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  ESIC Registration Code
                </p>
                <p className="font-mono font-medium text-[#1b1b1d] mt-0.5">
                  {company.esiRegistrationNumber || '53000987650001001'}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  Incorporation Date
                </p>
                <p className="font-medium text-[#1b1b1d] mt-0.5">{company.foundedDate}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  Official Website & Domain
                </p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline mt-0.5 flex items-center gap-1"
                >
                  {company.domain} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Address Book Summary */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#c6c6cd]/40">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#131b2e]" />
                <h3 className="text-[16px] font-bold text-[#1b1b1d]">
                  Locations & Addresses ({addresses.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('addresses')}
                className="text-[13px] font-semibold text-[#131b2e] hover:underline"
              >
                Manage Addresses
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-xl bg-[#fcf8fa] border border-[#c6c6cd]/50 text-[13px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e]">
                      {addr.type.replace('_', ' ')}
                    </span>
                    {addr.isPrimary && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Primary HQ
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-[#1b1b1d]">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="text-[#505f76]">{addr.addressLine2}</p>}
                  <p className="text-[#505f76] mt-1">
                    {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Readiness Checklist & Key Contacts */}
        <div className="space-y-6">
          {/* Readiness Checklist */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-[#c6c6cd]/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-[15px] font-bold text-[#1b1b1d]">Module Readiness Checklist</h3>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#1b1b1d] font-medium">1. Corporate Legal Identity</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  100% Ready
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#1b1b1d] font-medium">2. Registered HQ Address</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Configured
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#1b1b1d] font-medium">3. Key Compliance Officers</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  4 Assigned
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#1b1b1d] font-medium">4. Financial Year & Currency</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {financialYear.currencyCode} (Active)
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#1b1b1d] font-medium">5. Payroll Cycle & Cut-off</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Day {payrollConfig.cutOffDay}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#1b1b1d] font-medium">6. Working Shift & Schedule</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Mon-Fri 8h
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#1b1b1d] font-medium">7. Annual Holiday Calendar</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {holidays.length} Holidays
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c6c6cd]/40">
              <div className="flex items-center gap-2 text-[12px] text-[#505f76]">
                <Info className="w-4 h-4 text-[#131b2e]" />
                <span>All parameters ready for Phase 2: Organization Hierarchy.</span>
              </div>
            </div>
          </div>

          {/* Key Contacts Card */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/40">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-[#131b2e]" />
                <h3 className="text-[15px] font-bold text-[#1b1b1d]">Key Stakeholders</h3>
              </div>
              <button
                onClick={() => onNavigateTab('contacts')}
                className="text-[12.5px] font-semibold text-[#131b2e] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="py-3 space-y-3">
              {contacts.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#131b2e] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {c.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-[#1b1b1d] truncate">
                      {c.fullName}
                    </p>
                    <p className="text-[11.5px] text-[#505f76] truncate">{c.designation}</p>
                    <p className="text-[11px] text-[#76777d] truncate">{c.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
