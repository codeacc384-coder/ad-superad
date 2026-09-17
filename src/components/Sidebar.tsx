import React from "react";

import {
  Building2,
  Users,
  UserCheck,
  UserPlus,
  CalendarCheck,
  CreditCard,
  WalletCards,
  Clock3,
  TrendingUp,
  Scale,
  BarChart3,
  Package,
  GitFork,
  HelpCircle,
  ShieldCheck,
  BookOpenCheck,
} from "lucide-react";


/* ============================================================
   TYPES
============================================================ */

interface SidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  tenantName: string;
  userName: string;
  userRole: string;
}


/* ============================================================
   SIDEBAR
============================================================ */

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  tenantName,
  userName,
  userRole,
}) => {


  /* ==========================================================
     NAVIGATION ITEMS
  ========================================================== */

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },

    {
      id: "organization",
      label: "Company & Org",
      icon: Building2,
      badge: "PHASE 1",
    },

    {
      id: "user_management",
      label: "Workforce Management",
      icon: Users,
    },

    {
      id: "employee_management",
      label: "Employee Management",
      icon: UserCheck,
    },

    {
      id: "onboarding",
      label: "Onboarding",
      icon: UserPlus,
    },

    {
      id: "attendance_leave",
      label: "Attendance & Leave",
      icon: CalendarCheck,
    },

    {
      id: "payroll",
      label: "Payroll",
      icon: CreditCard,
    },

    {
      id: "salary_structure",
      label: "Salary Structure",
      icon: WalletCards,
    },

    {
      id: "ot",
      label: "Overtime & Bonus",
      icon: Clock3,
    },

    {
      id: "increments",
      label: "Increments",
      icon: TrendingUp,
    },

    {
      id: "compliance",
      label: "Compliance",
      icon: Scale,
    },

    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },

    {
      id: "assets",
      label: "Assets",
      icon: Package,
    },

    {
      id: "workflows",
      label: "Workflows",
      icon: GitFork,
    },

    {
      id: "rules_regulations",
      label: "Rules & Regulations",
      icon: BookOpenCheck,
    },
  ];


  /* ==========================================================
     HELP
  ========================================================== */

  const handleHelp = () => {
    onSelectModule("help");
  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <aside
      id="sidebar-main"
      className="
        hidden
        md:flex
        flex-col
        h-screen
        fixed
        left-0
        top-0
        w-[280px]
        bg-white
        border-r
        border-[#c6c6cd]/50
        z-50
        select-none
        shadow-[1px_0_4px_rgba(0,0,0,0.02)]
      "
    >

      {/* ======================================================
          BRAND / ORGANIZATION HEADER
      ====================================================== */}

      <div className="p-6 border-b border-[#c6c6cd]/40">

        <div className="flex items-center gap-3">

          {/* Company Icon */}

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-[#131b2e]
              text-white
              flex
              items-center
              justify-center
              shadow-sm
              shrink-0
            "
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>


          {/* Company Name */}

          <div className="min-w-0">

            <h1
              className="
                text-[17px]
                font-bold
                text-[#1b1b1d]
                truncate
                tracking-tight
              "
            >
              {tenantName || "TechNova Solutions"}
            </h1>


            {/* Enterprise HRMS */}

            <div className="flex items-center gap-1.5 mt-0.5">

              <span
                className="
                  inline-block
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-emerald-500
                "
              />

              <p
                className="
                  text-[11px]
                  font-semibold
                  text-[#505f76]
                  tracking-wider
                  uppercase
                "
              >
                Enterprise HRMS
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          flex-1
          overflow-y-auto
          custom-scrollbar
          p-3
          space-y-1
        "
      >

        {/* Section title */}

        <div
          className="
            px-3
            py-1.5
            text-[10px]
            font-bold
            text-[#76777d]
            uppercase
            tracking-wider
          "
        >
          Core Modules
        </div>


        {/* Navigation Items */}

        {navigationItems.map((item) => {

          const Icon = item.icon;

          const isSelected =
            currentModule === item.id;


          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              type="button"
              onClick={() =>
                onSelectModule(item.id)
              }
              aria-current={
                isSelected
                  ? "page"
                  : undefined
              }
              className={`
                w-full
                flex
                items-center
                justify-between
                px-3.5
                py-2.5
                rounded-lg
                text-[13.5px]
                font-medium
                transition-all
                text-left
                group

                ${
                  isSelected
                    ? `
                      bg-[#f6f3f5]
                      text-[#000000]
                      font-semibold
                      border-r-[3px]
                      border-[#000000]
                      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                    `
                    : `
                      text-[#505f76]
                      hover:text-[#000000]
                      hover:bg-[#f6f3f5]/70
                    `
                }
              `}
            >

              {/* Icon + Label */}

              <div className="flex items-center gap-3 min-w-0">

                <Icon
                  className={`
                    w-[18px]
                    h-[18px]
                    shrink-0
                    transition-transform
                    group-hover:scale-105

                    ${
                      isSelected
                        ? "text-[#000000]"
                        : "text-[#76777d] group-hover:text-[#000000]"
                    }
                  `}
                />

                <span className="truncate">
                  {item.label}
                </span>

              </div>


              {/* Badge */}

              {item.badge && (
                <span
                  className="
                    ml-2
                    shrink-0
                    text-[9px]
                    uppercase
                    font-bold
                    tracking-wider
                    px-2
                    py-0.5
                    rounded-full
                    bg-black
                    text-white
                  "
                >
                  {item.badge}
                </span>
              )}

            </button>
          );

        })}

      </nav>


      {/* ======================================================
          FOOTER / ACCOUNT
      ====================================================== */}

      <div
        className="
          p-3
          border-t
          border-[#c6c6cd]/40
          space-y-2
          bg-[#fcf8fa]
        "
      >

        {/* Help */}

        <button
          type="button"
          onClick={handleHelp}
          className="
            w-full
            flex
            items-center
            gap-3
            px-3.5
            py-2
            rounded-lg
            text-[13px]
            text-[#505f76]
            hover:text-[#000000]
            hover:bg-[#f6f3f5]
            transition-colors
          "
        >

          <HelpCircle
            className="
              w-[18px]
              h-[18px]
              text-[#76777d]
              shrink-0
            "
          />

          <span>
            Help & Documentation
          </span>

        </button>


        {/* Divider */}

        <div
          className="
            pt-2
            border-t
            border-[#c6c6cd]/30
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              px-2
            "
          >

            {/* User */}

            <div
              className="
                flex
                items-center
                gap-2.5
                min-w-0
              "
            >

              {/* Avatar */}

              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-[#131b2e]
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-xs
                  ring-2
                  ring-white
                  shadow-sm
                  shrink-0
                "
              >
                {userName
                  ? userName
                      .split(" ")
                      .map(
                        (name) =>
                          name[0]
                      )
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "JA"}
              </div>


              {/* User Information */}

              <div className="min-w-0">

                <p
                  className="
                    text-[13px]
                    font-semibold
                    text-[#1b1b1d]
                    truncate
                  "
                >
                  {userName || "Admin"}
                </p>


                <p
                  className="
                    text-[11px]
                    text-[#505f76]
                    truncate
                    flex
                    items-center
                    gap-1
                  "
                >

                  <ShieldCheck
                    className="
                      w-3
                      h-3
                      text-emerald-600
                      shrink-0
                    "
                  />

                  <span className="truncate">
                    {userRole || "Company Administrator"}
                  </span>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </aside>
  );
};


export default Sidebar;