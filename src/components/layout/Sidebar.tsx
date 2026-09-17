import React from 'react';
import { useApp } from '../../context/useApp';

import {
  LayoutDashboard,
  Building2,
  UserRoundSearch,
  CreditCard,
  Layers,
  Sliders,
  ShieldCheck,
  Puzzle,
  Settings,
  HelpCircle,
  LogOut,
  Activity,
  Users,
  LifeBuoy,
  FileSpreadsheet,
  FileBarChart,
  Database,
  X,
  Megaphone,
  Plug,
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarMobileOpen,
    setSidebarMobileOpen,
    tickets,
    companies,
  } = useApp();

  /* ============================================================
     COUNTS
     ============================================================ */

  const openTicketsCount = tickets.filter(
    (t) => t.status === 'Open' || t.status === 'In Progress'
  ).length;

  const pendingCompaniesCount = companies.filter(
    (c) => c.status === 'Pending' || c.status === 'Trial'
  ).length;

  /* ============================================================
     NAVIGATION ITEMS
     ============================================================ */

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },

    {
      id: 'leads',
      label: 'Leads',
      icon: UserRoundSearch,
    },

    {
      id: 'companies',
      label: 'Tenant Management',
      icon: Building2,
      badge: pendingCompaniesCount,
      badgeColor: 'bg-indigo-500/20 text-indigo-200',
    },

    {
      id: 'billing',
      label: 'Finance & Billing',
      icon: CreditCard,
    },

    {
      id: 'subscriptions',
      label: 'Subscriptions & Plans',
      icon: Layers,
    },

    {
      id: 'users',
      label: 'Platform Users',
      icon: Users,
    },

    {
      id: 'analytics',
      label: 'Platform Analytics',
      icon: Activity,
    },

    {
      id: 'reports',
      label: 'Reports & Reporting Center',
      icon: FileBarChart,
    },

    {
      id: 'data-management',
      label: 'Data Management',
      icon: Database,
    },

    /* ==========================================================
       SUPPORT CENTER
       Customer/company support tickets
    ========================================================== */

    {
      id: 'support',
      label: 'Support Center',
      icon: LifeBuoy,
      badge: openTicketsCount,
      badgeColor: 'bg-rose-500/30 text-rose-200',
    },

    {
      id: 'health',
      label: 'Operations & Health',
      icon: Sliders,
    },

    {
      id: 'security',
      label: 'Security Center',
      icon: ShieldCheck,
    },

    {
      id: 'roles',
      label: 'Roles & Permissions',
      icon: ShieldCheck,
    },

    {
      id: 'features',
      label: 'Feature Access',
      icon: Puzzle,
    },

    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
    },

    {
      id: 'audit',
      label: 'Audit Logs',
      icon: FileSpreadsheet,
    },

    {
      id: 'announcements',
      label: 'System Announcements',
      icon: Megaphone,
    },

    {
      id: 'settings',
      label: 'Configuration',
      icon: Settings,
    },
  ];

  /* ============================================================
     SIGN OUT
     ============================================================ */

  const handleSignOut = () => {
    localStorage.removeItem('corehr_auth_token');
    window.location.reload();
  };

  /* ============================================================
     NAVIGATION
     ============================================================ */

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId as any);
    setSidebarMobileOpen(false);
  };

  /* ============================================================
     SIDEBAR CONTENT
     ============================================================ */

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full w-full bg-[#131B2E] text-white">

      {/* ========================================================
         BRAND HEADER
      ======================================================== */}

      <div className="p-5 sm:p-6 flex items-center justify-between border-b border-white/10 shrink-0">

        <div className="flex items-center gap-3">

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-[#4B41E1]
              flex
              items-center
              justify-center
              text-white
              font-black
              text-xl
              shadow-md
              shrink-0
              ring-2
              ring-indigo-400/20
            "
          >
            C
          </div>

          <div className="overflow-hidden">

            <h1 className="font-bold text-base text-white leading-tight tracking-tight">
              CoreHR Admin
            </h1>

            <p className="text-[11px] text-[#7C839B] font-medium">
              Enterprise Console
            </p>

          </div>
        </div>

        {isMobile && (
          <button
            onClick={() => setSidebarMobileOpen(false)}
            className="
              p-1.5
              rounded-lg
              text-slate-400
              hover:text-white
              hover:bg-white/10
              transition-colors
            "
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ========================================================
         NAVIGATION
      ======================================================== */}

      <nav
        className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
          custom-scrollbar
          px-3
          py-4
          space-y-1
        "
      >

        {navItems.map((item) => {

          const Icon = item.icon;

          const isActive =
            activeTab === item.id ||
            (
              item.id === 'companies' &&
              activeTab === 'company-detail'
            );

          return (
            <button
              key={item.id}
              id={`nav-${item.id}${isMobile ? '-mobile' : ''}`}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full
                flex
                items-center
                justify-between
                px-3
                py-2.5
                rounded-xl
                text-xs
                font-medium
                transition-all
                duration-150
                text-left
                group
                relative
                cursor-pointer

                ${
                  isActive
                    ? 'bg-[#4B41E1] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 opacity-85 hover:opacity-100'
                }
              `}
            >

              {isActive && (
                <span
                  className="
                    absolute
                    left-0
                    top-1.5
                    bottom-1.5
                    w-1
                    bg-[#645EFB]
                    rounded-r-full
                  "
                />
              )}

              <div className="flex items-center gap-2.5 min-w-0">

                <Icon
                  className={`
                    w-4
                    h-4
                    shrink-0
                    transition-transform
                    duration-150
                    group-hover:scale-110

                    ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-white'
                    }
                  `}
                />

                <span className="truncate">
                  {item.label}
                </span>

              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`
                    text-[10px]
                    font-bold
                    px-2
                    py-0.5
                    rounded-full
                    shrink-0
                    ml-1

                    ${
                      item.badgeColor ||
                      'bg-white/20 text-white'
                    }
                  `}
                >
                  {item.badge}
                </span>
              )}

            </button>
          );
        })}

      </nav>

      {/* ========================================================
         FOOTER
      ======================================================== */}

      <div
        className="
          p-3
          border-t
          border-white/10
          shrink-0
          bg-[#0F172A]/70
          space-y-1
        "
      >

        {/* ======================================================
           SUPPORT & HELPDESK
           This is intentionally different from Support Center.
        ====================================================== */}

        <button
          onClick={() => handleNavClick('helpdesk')}
          className="
            w-full
            flex
            items-center
            gap-2.5
            px-3
            py-2
            text-slate-300
            hover:text-white
            hover:bg-white/5
            rounded-lg
            text-xs
            font-medium
            transition-colors
            cursor-pointer
          "
        >
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />

          <span className="truncate">
            Support & Helpdesk
          </span>
        </button>

        {/* ======================================================
           SIGN OUT
        ====================================================== */}

        <button
          onClick={handleSignOut}
          className="
            w-full
            flex
            items-center
            gap-2.5
            px-3
            py-2
            text-rose-300/90
            hover:text-rose-200
            hover:bg-rose-500/10
            rounded-lg
            text-xs
            font-medium
            transition-colors
            cursor-pointer
          "
        >
          <LogOut className="w-4 h-4 text-rose-400 shrink-0" />

          <span>
            Sign Out
          </span>
        </button>

      </div>
    </div>
  );

  /* ============================================================
     RETURN SIDEBAR
     ============================================================ */

  return (
    <>
      {/* ========================================================
         DESKTOP SIDEBAR
      ======================================================== */}

      <aside
        id="super-admin-sidebar"
        className="
          hidden
          md:flex
          flex-col
          shrink-0
          w-64
          lg:w-[260px]
          h-full
          bg-[#131B2E]
          text-white
          select-none
          border-r
          border-slate-800/80
          z-30
        "
      >
        {renderSidebarContent(false)}
      </aside>

      {/* ========================================================
         MOBILE SIDEBAR
      ======================================================== */}

      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">

          <div
            className="
              fixed
              inset-0
              bg-slate-950/60
              backdrop-blur-xs
              transition-opacity
              duration-200
              animate-in
              fade-in
            "
            onClick={() => setSidebarMobileOpen(false)}
          />

          <aside
            className="
              relative
              w-[280px]
              max-w-[85vw]
              h-full
              bg-[#131B2E]
              text-white
              shadow-2xl
              z-10
              flex
              flex-col
              animate-in
              slide-in-from-left
              duration-200
            "
          >
            {renderSidebarContent(true)}
          </aside>

        </div>
      )}
    </>
  );
};