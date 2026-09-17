import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Building,
  Check,
  ChevronDown,
  Layers,
  Shield,
  Clock,
  Menu,
  X
} from 'lucide-react';

interface TenantOption {
  id: string;
  name: string;
  brandName: string;
  domain: string;
  currency: string;
  status: string;
}

interface TopNavBarProps {
  currentModuleTitle: string;
  tenants: TenantOption[];
  activeTenantId: string;
  onSwitchTenant: (tenantId: string) => void;
  onOpenAudit: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentModuleTitle,
  tenants,
  activeTenantId,
  onSwitchTenant,
  onOpenAudit,
  onToggleMobileMenu
}) => {
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  return (
    <header
      id="top-navbar"
      className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-[#c6c6cd]/50 px-4 md:px-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
    >
      {/* Left: Mobile menu toggle + Breadcrumb Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#505f76] hover:text-black hover:bg-[#f6f3f5]"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[#76777d] hidden sm:inline">
            Enterprise Admin
          </span>
          <span className="text-[#c6c6cd] hidden sm:inline">/</span>
          <h2 className="text-[16px] font-bold text-[#1b1b1d] tracking-tight">
            {currentModuleTitle}
          </h2>
        </div>
      </div>

      {/* Center/Search (Desktop) */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d] pointer-events-none" />
        <input
          id="global-search-input"
          type="text"
          placeholder="Search settings, tax registrations, policies, holidays..."
          className="w-full pl-9 pr-4 py-1.5 text-[13.5px] bg-[#f6f3f5] border border-transparent focus:border-[#000000] focus:bg-white focus:outline-none rounded-lg transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Multi-Tenant Switcher (Crucial for SaaS Tenant Isolation Verification) */}
        <div className="relative">
          <button
            id="tenant-switcher-btn"
            onClick={() => setShowTenantDropdown(!showTenantDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#c6c6cd]/60 bg-white hover:bg-[#f6f3f5] text-[13px] font-medium text-[#1b1b1d] transition-colors shadow-sm"
          >
            <Building className="w-3.5 h-3.5 text-[#505f76]" />
            <span className="max-w-[130px] truncate">{activeTenant?.name || 'TechNova'}</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#dae2fd] text-[#131b2e]">
              Tenant
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#76777d]" />
          </button>

          {showTenantDropdown && (
            <div
              id="tenant-dropdown-menu"
              className="absolute right-0 mt-2 w-72 bg-white border border-[#c6c6cd] rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
            >
              <div className="px-2.5 py-2 border-b border-[#c6c6cd]/40 mb-1">
                <p className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                  Select Tenant Workspace
                </p>
                <p className="text-[11px] text-[#505f76] mt-0.5">
                  Multi-tenant isolation ensures zero cross-company leakage.
                </p>
              </div>

              <div className="space-y-1">
                {tenants.map((t) => {
                  const isCurrent = t.id === activeTenantId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSwitchTenant(t.id);
                        setShowTenantDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-[13px] ${
                        isCurrent
                          ? 'bg-[#131b2e] text-white font-semibold'
                          : 'hover:bg-[#f6f3f5] text-[#1b1b1d]'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className={`text-[11px] ${isCurrent ? 'text-white/80' : 'text-[#505f76]'}`}>
                          {t.domain} • {t.currency}
                        </p>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Audit Log Quick Trigger */}
        <button
          id="quick-audit-btn"
          onClick={onOpenAudit}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f3f5] hover:bg-[#eae7e9] text-[#1b1b1d] text-[13px] font-medium rounded-lg transition-colors border border-[#c6c6cd]/50"
          title="View System Audit Trail"
        >
          <Clock className="w-3.5 h-3.5 text-[#505f76]" />
          <span>Audit Trail</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotificationModal(!showNotificationModal)}
            className="p-2 rounded-lg text-[#505f76] hover:text-black hover:bg-[#f6f3f5] transition-colors relative"
            title="System Alerts & Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotificationModal && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#c6c6cd] rounded-xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#c6c6cd]/40">
                <p className="text-[13px] font-bold text-[#1b1b1d]">Statutory & System Alerts</p>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  2 Pending
                </span>
              </div>
              <div className="py-2 space-y-2 text-[12.5px]">
                <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/60">
                  <p className="font-semibold text-amber-900">PF Return Filing Due Soon</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Statutory Monthly Challan submission deadline in 5 days.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-200/60">
                  <p className="font-semibold text-blue-900">Payroll Cycle Pre-check Active</p>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    Monthly cut-off configured for the 25th.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
