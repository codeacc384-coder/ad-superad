import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  ChevronRight,
  CheckCheck,
  Shield,
  CreditCard,
  Building2,
  Menu,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeCompanyId,
    companies,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setGlobalSearchOpen,
    viewCompanyProfile,
    setSidebarMobileOpen,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeCompany = companies.find(
    (company) => company.id === activeCompanyId
  );

  /* ============================================================
     BREADCRUMBS
     ============================================================ */

  const getBreadcrumbs = () => {
    if (activeTab === 'company-detail' && activeCompany) {
      return (
        <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium min-w-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="hover:text-[#4F46E5] transition-colors truncate"
          >
            Super Admin
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <button
            onClick={() => setActiveTab('companies')}
            className="hover:text-[#4F46E5] transition-colors truncate"
          >
            Companies
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <span className="text-slate-900 font-semibold truncate">
            {activeCompany.name}
          </span>
        </div>
      );
    }

    if (activeTab === 'analytics') {
      return (
        <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium min-w-0">
          <span className="text-slate-700 truncate">Admin Console</span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <span className="text-[#4F46E5] font-semibold truncate">
            Platform Analytics
          </span>
        </div>
      );
    }

    const tabTitles: Record<string, string> = {
      dashboard: 'Platform Overview',
      leads: 'Leads',
      companies: 'Companies & Tenants',
      billing: 'Finance & Billing',
      subscriptions: 'Subscriptions & Plans',
      users: 'Platform User Directory',

      // Separate support areas
      support: 'Support Center',
      helpdesk: 'Support & Helpdesk',

      health: 'Operations & Health',
      security: 'Security Center',
      features: 'Feature Management',
      audit: 'Audit Event Logs',
      reports: 'Reports & Reporting Center',
      'data-management': 'Data Management',
      roles: 'Roles & Permissions',
      integrations: 'Integrations',
      announcements: 'System Announcements',

      // Admin profile
      'admin-profile': 'Admin Profile',

      // Configuration
      settings: 'Platform Configuration',
    };

    return (
      <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium min-w-0">
        <span className="text-slate-700 hidden sm:inline truncate">
          HRMS Super Admin
        </span>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />

        <span className="text-[#4F46E5] font-semibold truncate">
          {tabTitles[activeTab] || 'Console'}
        </span>
      </div>
    );
  };

  return (
    <header
      id="super-admin-header"
      className="
        h-16
        shrink-0
        z-20
        bg-white
        border-b
        border-slate-200/80
        shadow-2xs
        flex
        items-center
        justify-between
        px-4
        sm:px-6
        lg:px-8
        w-full
        min-w-0
      "
    >
      {/* ========================================================
         LEFT AREA
      ======================================================== */}

      <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
        <button
          onClick={() => setSidebarMobileOpen(true)}
          className="
            md:hidden
            p-2
            -ml-1.5
            rounded-lg
            text-slate-600
            hover:text-indigo-600
            hover:bg-slate-100
            transition-colors
          "
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold text-sm text-slate-900 hidden lg:inline shrink-0">
            CoreHR Platform
          </span>

          <div className="h-4 w-px bg-slate-200 hidden lg:inline shrink-0" />

          {getBreadcrumbs()}
        </div>
      </div>

      {/* ========================================================
         RIGHT AREA
      ======================================================== */}

      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">

        {/* ======================================================
           GLOBAL SEARCH
        ====================================================== */}

        <button
          id="btn-global-search-header"
          onClick={() => setGlobalSearchOpen(true)}
          className="
            flex
            items-center
            gap-2
            bg-slate-100/80
            hover:bg-slate-100
            border
            border-slate-200/80
            rounded-full
            py-1.5
            pl-3
            pr-3
            sm:pr-4
            text-xs
            text-slate-500
            hover:text-slate-800
            transition-all
            duration-150
            group
            cursor-pointer
            w-36
            sm:w-52
            md:w-60
          "
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />

          <span className="truncate hidden sm:inline">
            Search platform...
          </span>

          <span className="truncate sm:hidden">
            Search...
          </span>

          <kbd
            className="
              ml-auto
              text-[10px]
              bg-white
              text-slate-500
              font-mono
              px-1.5
              py-0.5
              rounded-sm
              border
              border-slate-200
              shadow-2xs
              hidden
              sm:inline
            "
          >
            ⌘K
          </kbd>
        </button>

        {/* ======================================================
           ACTION ICONS
        ====================================================== */}

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2.5 sm:pr-3">

          {/* ====================================================
             NOTIFICATIONS
          ==================================================== */}

          <div className="relative" ref={dropdownRef}>
            <button
              id="btn-notifications-toggle"
              onClick={() =>
                setNotifDropdownOpen(!notifDropdownOpen)
              }
              className="
                p-2
                text-slate-500
                hover:text-[#4F46E5]
                hover:bg-slate-100
                rounded-full
                transition-colors
                relative
                cursor-pointer
              "
              title="Notifications"
            >
              <Bell className="w-4 h-4" />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    top-1.5
                    right-1.5
                    w-2
                    h-2
                    bg-rose-500
                    rounded-full
                    ring-2
                    ring-white
                    animate-pulse
                  "
                />
              )}
            </button>

            {notifDropdownOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-80
                  sm:w-96
                  bg-white
                  rounded-2xl
                  shadow-xl
                  border
                  border-slate-200
                  py-3
                  z-50
                  animate-in
                  fade-in
                  zoom-in-95
                  duration-150
                "
              >
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900">
                      Notifications
                    </h4>

                    {unreadCount > 0 && (
                      <span
                        className="
                          bg-[#4F46E5]/10
                          text-[#4F46E5]
                          text-[10px]
                          font-bold
                          px-2
                          py-0.5
                          rounded-full
                        "
                      >
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="
                        text-xs
                        text-[#4F46E5]
                        hover:underline
                        flex
                        items-center
                        gap-1
                        font-medium
                        cursor-pointer
                      "
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);

                          if (n.linkTab) {
                            if (
                              n.linkTab === 'companies' &&
                              n.linkId
                            ) {
                              viewCompanyProfile(n.linkId);
                            } else {
                              setActiveTab(n.linkTab as any);
                            }

                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`
                          p-3
                          text-left
                          hover:bg-slate-50
                          transition-colors
                          cursor-pointer
                          flex
                          gap-3
                          ${!n.read ? 'bg-indigo-50/40' : ''}
                        `}
                      >
                        <div
                          className={`
                            w-7
                            h-7
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            shrink-0
                            mt-0.5
                            ${
                              n.category === 'payment'
                                ? 'bg-rose-100 text-rose-600'
                                : n.category === 'security'
                                ? 'bg-amber-100 text-amber-600'
                                : n.category === 'subscription'
                                ? 'bg-purple-100 text-purple-600'
                                : n.category === 'support'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-emerald-100 text-emerald-600'
                            }
                          `}
                        >
                          {n.category === 'payment' ? (
                            <CreditCard className="w-3.5 h-3.5" />
                          ) : n.category === 'security' ? (
                            <Shield className="w-3.5 h-3.5" />
                          ) : n.category === 'subscription' ? (
                            <Building2 className="w-3.5 h-3.5" />
                          ) : (
                            <Bell className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-bold text-xs text-slate-900 truncate">
                              {n.title}
                            </p>

                            <span className="text-[10px] text-slate-400 shrink-0">
                              {n.timestamp}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 px-4 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('audit');
                      setNotifDropdownOpen(false);
                    }}
                    className="
                      text-xs
                      font-semibold
                      text-[#4F46E5]
                      hover:underline
                      cursor-pointer
                    "
                  >
                    View System Audit Stream →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ====================================================
             SUPPORT & HELPDESK
          ==================================================== */}

          <button
            id="btn-chat-header"
            onClick={() => setActiveTab('helpdesk' as any)}
            className="
              p-2
              text-slate-500
              hover:text-[#4F46E5]
              hover:bg-slate-100
              rounded-full
              transition-colors
              cursor-pointer
            "
            title="Support & Helpdesk"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* ====================================================
             CONFIGURATION
          ==================================================== */}

          <button
            id="btn-settings-header"
            onClick={() => setActiveTab('settings')}
            className="
              p-2
              text-slate-500
              hover:text-[#4F46E5]
              hover:bg-slate-100
              rounded-full
              transition-colors
              cursor-pointer
            "
            title="Platform Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* ======================================================
           ADMIN PROFILE
        ====================================================== */}

        <div
          onClick={() => setActiveTab('admin-profile' as any)}
          className="
            flex
            items-center
            gap-2.5
            pl-1
            cursor-pointer
            group
            select-none
          "
          title="Open Admin Profile"
        >
          <div className="text-right hidden sm:block">
            <div
              className="
                text-xs
                font-bold
                text-slate-900
                group-hover:text-[#4F46E5]
                transition-colors
                leading-tight
              "
            >
              Admin User
            </div>

            <div className="text-[10px] text-slate-500 font-medium">
              HRMS Super Admin
            </div>
          </div>

          <div
            className="
              w-8
              h-8
              rounded-full
              ring-2
              ring-[#4F46E5]/20
              overflow-hidden
              border
              border-slate-200
              shrink-0
              group-hover:ring-[#4F46E5]
              transition-all
            "
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Super Admin Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};