import React, { useState } from "react";

import { Sidebar } from "./components/Sidebar";
import { TopNavBar } from "./components/TopNavBar";

import { DashboardPage } from "./components/Dashboard/DashboardPage";

import { EmployeeManagementPage } from "./components/EmployeeManagement/EmployeeManagementPage";

import UserManagementPage from "./components/UserManagement/UserManagementPage";

import AttendanceLeavePage from "./components/AttendanceLeave/AttendanceLeavePage";

import PayrollPage from "./components/Payroll/PayrollPage";

import { SalaryStructure } from "./components/SalaryStructure/SalaryStructure";

import { OTPage } from "./components/OT/OT";

import { IncrementsPage } from "./components/Increments/IncrementsPage";

import { CompliancePage } from "./components/Compliance/CompliancePage";

import { AnalyticsPage } from "./components/Analytics/AnalyticsPage";

import { AssetsPage } from "./components/Assets/AssetsPage";

import { WorkflowsPage } from "./components/Workflows/WorkflowsPage";

import {
  RulesRegulationsPage,
} from "./components/RulesRegulations/RulesRegulations";

import { OnboardingPage } from "./components/Onboarding/OnboardingPage";

import { HelpPage } from "./components/Help/HelpPage";

import {
  ToastContainer,
  ToastMessage,
} from "./components/Toast";


/* ============================================================
   ADMIN USER
============================================================ */

const ADMIN_USER = {
  id: "admin-001",
  name: "HR Administrator",
  email: "admin@technomold.com",
  role: "ADMIN",
  roleLabel: "Company Admin",
};


/* ============================================================
   TENANTS
============================================================ */

const tenants = [
  {
    id: "comp_technova_01",
    name: "TechNova Solutions",
    brandName: "TechNova Enterprise HRMS",
    domain: "technova.io",
    currency: "INR (₹)",
    status: "ACTIVE",
  },
  {
    id: "comp_apex_02",
    name: "Apex Global Systems",
    brandName: "Apex Global",
    domain: "apexglobal.com",
    currency: "USD ($)",
    status: "ACTIVE",
  },
];


/* ============================================================
   MODULE TYPES
============================================================ */

type ModuleId =
  | "dashboard"
  | "organization"
  | "user_management"
  | "employee_management"
  | "onboarding"
  | "attendance_leave"
  | "payroll"
  | "salary_structure"
  | "ot"
  | "increments"
  | "compliance"
  | "analytics"
  | "assets"
  | "workflows"
  | "rules_regulations"
  | "help";


/* ============================================================
   APP
============================================================ */

const App: React.FC = () => {

  /* ==========================================================
     CURRENT MODULE
  ========================================================== */

  const [currentModule, setCurrentModule] =
    useState<ModuleId>("dashboard");


  /* ==========================================================
     ACTIVE TENANT
  ========================================================== */

  const [activeTenantId, setActiveTenantId] =
    useState<string>("comp_technova_01");


  /* ==========================================================
     TOAST STATE
  ========================================================== */

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);


  /* ==========================================================
     ADD TOAST
  ========================================================== */

  const addToast = (
    type: "success" | "error" | "info",
    title: string,
    message?: string
  ) => {

    const id =
      `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    const toast: ToastMessage = {
      id,
      type,
      title,
      message,
    };

    setToasts((previous) => [
      ...previous,
      toast,
    ]);

    window.setTimeout(() => {

      setToasts((previous) =>
        previous.filter(
          (item) =>
            item.id !== id
        )
      );

    }, 5000);
  };


  /* ==========================================================
     REMOVE TOAST
  ========================================================== */

  const removeToast = (
    id: string
  ) => {

    setToasts((previous) =>
      previous.filter(
        (item) =>
          item.id !== id
      )
    );

  };


  /* ==========================================================
     MODULE NAVIGATION
  ========================================================== */

  const handleSelectModule = (
    module: string
  ) => {

    const validModules: ModuleId[] = [
      "dashboard",
      "organization",
      "user_management",
      "employee_management",
      "onboarding",
      "attendance_leave",
      "payroll",
      "salary_structure",
      "ot",
      "increments",
      "compliance",
      "analytics",
      "assets",
      "workflows",
      "rules_regulations",
      "help",
    ];

    if (
      validModules.includes(
        module as ModuleId
      )
    ) {

      setCurrentModule(
        module as ModuleId
      );

    } else {

      console.warn(
        "Unknown module:",
        module
      );

    }

  };


  /* ==========================================================
     TENANT SWITCH
  ========================================================== */

  const handleSwitchTenant = (
    tenantId: string
  ) => {

    setActiveTenantId(
      tenantId
    );

  };


  /* ==========================================================
     CURRENT TENANT
  ========================================================== */

  const activeTenant =
    tenants.find(
      (tenant) =>
        tenant.id === activeTenantId
    ) || tenants[0];


  /* ==========================================================
     MODULE TITLE
  ========================================================== */

  const getModuleTitle = () => {

    switch (currentModule) {

      case "dashboard":
        return "Executive HR & Payroll Dashboard";

      case "organization":
        return "Company & Organization Management";

      case "user_management":
        return "Workforce Management & User Permissions";

      case "employee_management":
        return "Employee Directory & Master Profiles";

      case "onboarding":
        return "Employee Onboarding Management";

      case "attendance_leave":
        return "Attendance & Leave Management";

      case "payroll":
        return "Monthly Payroll Processing & Payouts";

      case "salary_structure":
        return "Salary Structure & Compensation Management";

      case "ot":
        return "Overtime & Bonus Management";

      case "increments":
        return "Compensation Revisions & Appraisals";

      case "compliance":
        return "Statutory Compliance & Legal Filings";

      case "analytics":
        return "Workforce Intelligence & BI Analytics";

      case "assets":
        return "Hardware Inventory & IT Asset Fleet";

      case "workflows":
        return "Automated Event Triggers & Escalations";

      case "rules_regulations":
        return "Rules & Regulations Management";

      case "help":
        return "HRMS Knowledge Base & Enterprise Help";

      default:
        return "Enterprise Admin Panel";
    }

  };


  /* ============================================================
     MAIN UI
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#f6f3f5] text-[#1b1b1d] flex font-sans">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        tenantName={activeTenant.name}
        userName={ADMIN_USER.name}
        userRole={ADMIN_USER.roleLabel}
      />


      {/* ======================================================
          MAIN CONTENT AREA
      ====================================================== */}

      <div className="flex-1 md:ml-[280px] min-w-0 flex flex-col">

        {/* ====================================================
            TOP NAVIGATION
        ==================================================== */}

        <TopNavBar
          currentModuleTitle={getModuleTitle()}
          tenants={tenants}
          activeTenantId={activeTenantId}
          onSwitchTenant={handleSwitchTenant}
          onOpenAudit={() => {
            setCurrentModule("organization");
          }}
          onToggleMobileMenu={() => {
            console.log("Mobile menu toggled");
          }}
        />


        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">

          {/* ==================================================
              DASHBOARD
          ================================================== */}

          {currentModule === "dashboard" && (
            <DashboardPage
              onNavigateModule={handleSelectModule}
              tenantName={activeTenant.name}
            />
          )}


          {/* ==================================================
              COMPANY & ORGANIZATION
              
              Temporary safe page because the actual
              CompanyOrganizationPage file is currently missing.
          ================================================== */}

          {currentModule === "organization" && (
            <CompanyOrganizationFallback
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              WORKFORCE MANAGEMENT
          ================================================== */}

          {currentModule === "user_management" && (
            <UserManagementPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              EMPLOYEE MANAGEMENT
          ================================================== */}

          {currentModule === "employee_management" && (
            <EmployeeManagementPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              ONBOARDING
          ================================================== */}

          {currentModule === "onboarding" && (
            <OnboardingPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              ATTENDANCE & LEAVE
          ================================================== */}

          {currentModule === "attendance_leave" && (
            <AttendanceLeavePage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              PAYROLL
          ================================================== */}

          {currentModule === "payroll" && (
            <PayrollPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              SALARY STRUCTURE
          ================================================== */}

          {currentModule === "salary_structure" && (
            <SalaryStructure />
          )}


          {/* ==================================================
              OVERTIME & BONUS
          ================================================== */}

          {currentModule === "ot" && (
            <OTPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              INCREMENTS
          ================================================== */}

          {currentModule === "increments" && (
            <IncrementsPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              COMPLIANCE
          ================================================== */}

          {currentModule === "compliance" && (
            <CompliancePage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              ANALYTICS
          ================================================== */}

          {currentModule === "analytics" && (
            <AnalyticsPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              ASSETS
          ================================================== */}

          {currentModule === "assets" && (
            <AssetsPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              WORKFLOWS
          ================================================== */}

          {currentModule === "workflows" && (
            <WorkflowsPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              RULES & REGULATIONS
          ================================================== */}

          {currentModule === "rules_regulations" && (
            <RulesRegulationsPage
              onShowToast={addToast}
            />
          )}


          {/* ==================================================
              HELP
          ================================================== */}

          {currentModule === "help" && (
            <HelpPage
              onShowToast={addToast}
            />
          )}

        </main>

      </div>


      {/* ======================================================
          TOAST CONTAINER
      ====================================================== */}

      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />

    </div>
  );
};


/* ============================================================
   COMPANY ORGANIZATION FALLBACK
============================================================ */

/*
   IMPORTANT:

   Your current project does NOT contain:

   src/components/CompanyManagement/CompanyOrganizationPage.tsx

   Therefore App.tsx must NOT import that missing file.

   This fallback keeps the application compiling and lets the
   Company & Org menu work until that page is added.
*/

const CompanyOrganizationFallback: React.FC<{
  onShowToast: (
    type: "success" | "error" | "info",
    title: string,
    message?: string
  ) => void;
}> = ({
  onShowToast,
}) => {

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#131b2e] text-white">
                <span className="text-lg font-bold">
                  T
                </span>
              </div>

              <div>

                <h1 className="text-[21px] font-bold text-gray-900">
                  Company & Organization
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage company information,
                  organization structure and
                  enterprise settings.
                </p>

              </div>

            </div>

          </div>

          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
            ACTIVE
          </span>

        </div>

      </div>


      {/* COMPANY CARD */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-bold uppercase text-gray-500">
            Company
          </p>

          <p className="mt-2 text-lg font-bold">
            TechNova Solutions
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Enterprise HRMS
          </p>

        </div>


        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-bold uppercase text-gray-500">
            Locations
          </p>

          <p className="mt-2 text-lg font-bold">
            2
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Bangalore • Hyderabad
          </p>

        </div>


        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-bold uppercase text-gray-500">
            Plan
          </p>

          <p className="mt-2 text-lg font-bold">
            Enterprise
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Active subscription
          </p>

        </div>

      </div>


      {/* NOTICE */}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

        <p className="font-semibold text-amber-900">
          Company Management page
        </p>

        <p className="mt-1 text-sm text-amber-800">
          The CompanyOrganizationPage.tsx file is
          currently missing from the project. The
          application is using this temporary view
          so the rest of the Admin Portal can run
          without an import error.
        </p>

      </div>

    </div>
  );
};


export default App;