import React, { useState } from 'react';

import { AppProvider, useApp } from './context/AppContext';

/* ============================================================
   GLOBAL UI STYLES

   This loads the centralized UI styling once for the entire
   application. Individual pages do not need to import it.
   ============================================================ */
import './components/ui/UiStyles';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ImpersonationBanner } from './components/layout/ImpersonationBanner';

import { DashboardView } from './components/dashboard/DashboardView';

import { CompaniesView } from './components/companies/CompaniesView';
import { CompanyProfileView } from './components/companies/CompanyProfileView';

import { SubscriptionsView } from './components/subscriptions/SubscriptionsView';
import { BillingView } from './components/billing/BillingView';

import { UsersView } from './components/users/UsersView';

import { SupportView } from './components/support/SupportView';
import { HelpdeskView } from './components/helpdesk/HelpdeskView';

import { AnalyticsView } from './components/analytics/AnalyticsView';
import { HealthView } from './components/health/HealthView';
import { AuditView } from './components/audit/AuditView';
import { SecurityView } from './components/security/SecurityView';

import { RolesPermissionsView } from './components/Roles/RolesPermissionsView';
import { FeaturesView } from './components/features/FeaturesView';
import { ReportsView } from './components/reports/ReportsView';

import DataManagementView from './components/datamanagement/DataManagementView';

import { SettingsView } from './components/settings/SettingsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';

import { AdminProfileView } from './components/profile/AdminProfileView';

import Login from './components/Login';

import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { QuickActionsModal } from './components/common/QuickActionsModal';
import { AddCompanyModal } from './components/companies/AddCompanyModal';
import { LeadsView } from './components/leads/LeadsView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';


/* ============================================================
   APP CONTENT
   ============================================================ */

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('corehr_auth_token'));
  });


  /* ============================================================
     LOGIN
     ============================================================ */

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };


  /* ============================================================
     LOGIN SCREEN
     ============================================================ */

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }


  /* ============================================================
     ACTIVE VIEW
     ============================================================ */

  const renderActiveView = () => {
    switch (activeTab) {

      /* ======================================================
         DASHBOARD
      ====================================================== */

      case 'dashboard':
        return <DashboardView />;


      /* ======================================================
         COMPANY MANAGEMENT
      ====================================================== */

      case 'leads':
        return <LeadsView />;

      case 'companies':
        return <CompaniesView />;

      case 'company-detail':
        return <CompanyProfileView />;


      /* ======================================================
         SUBSCRIPTIONS & BILLING
      ====================================================== */

      case 'subscriptions':
        return <SubscriptionsView />;

      case 'billing':
        return <BillingView />;

      case 'payments':
        return <BillingView />;


      /* ======================================================
         USERS
      ====================================================== */

      case 'users':
        return <UsersView />;


      /* ======================================================
         SUPPORT CENTER
         
         Customer/company support tickets.
      ====================================================== */

      case 'support':
        return <SupportView />;


      /* ======================================================
         SUPPORT & HELPDESK
         
         Internal/platform help and assistance.
      ====================================================== */

      case 'helpdesk':
        return <HelpdeskView />;


      /* ======================================================
         ADMIN PROFILE
      ====================================================== */

      case 'admin-profile':
        return <AdminProfileView />;


      /* ======================================================
         ANALYTICS
      ====================================================== */

      case 'analytics':
        return <AnalyticsView />;


      /* ======================================================
         REPORTS
      ====================================================== */

      case 'reports':
        return <ReportsView />;


      /* ======================================================
         DATA MANAGEMENT
      ====================================================== */

      case 'data-management':
        return <DataManagementView />;


      /* ======================================================
         PLATFORM HEALTH
      ====================================================== */

      case 'health':
        return <HealthView />;


      /* ======================================================
         SECURITY
      ====================================================== */

      case 'security':
        return <SecurityView />;


      /* ======================================================
         FEATURES
      ====================================================== */

      case 'features':
        return <FeaturesView />;


      /* ======================================================
         AUDIT
      ====================================================== */

      case 'audit':
        return <AuditView />;


      /* ======================================================
         NOTIFICATIONS
      ====================================================== */

      case 'notifications':
        return <DashboardView />;

      case 'announcements':
        return <AnnouncementsView />;


      /* ======================================================
         ROLES & PERMISSIONS
      ====================================================== */

      case 'roles':
        return <RolesPermissionsView />;


      /* ======================================================
         INTEGRATIONS
      ====================================================== */

      case 'integrations':
        return <IntegrationsView />;


      /* ======================================================
         SETTINGS / CONFIGURATION
      ====================================================== */

      case 'settings':
        return <SettingsView />;


      /* ======================================================
         FALLBACK
      ====================================================== */

      default:
        return <DashboardView />;
    }
  };


  /* ============================================================
     MAIN APPLICATION LAYOUT
     ============================================================ */

  return (
    <div
      className="
        flex
        h-screen
        w-screen
        overflow-hidden
        bg-slate-50
        text-slate-800
        font-sans
        antialiased
        selection:bg-indigo-500
        selection:text-white
      "
    >

      {/* ======================================================
         SIDEBAR
      ====================================================== */}

      <Sidebar />


      {/* ======================================================
         MAIN CONTENT AREA
      ====================================================== */}

      <div
        className="
          flex
          h-full
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-slate-50
        "
      >

        {/* ====================================================
           IMPERSONATION BANNER
        ==================================================== */}

        <ImpersonationBanner />


        {/* ====================================================
           HEADER
        ==================================================== */}

        <Header />


        {/* ====================================================
           PAGE CONTENT
        ==================================================== */}

        <main
          className="
            custom-scrollbar
            flex-1
            min-h-0
            overflow-x-hidden
            overflow-y-auto
            bg-slate-50
            p-4
            sm:p-6
            lg:p-8
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              space-y-6
            "
          >
            {renderActiveView()}
          </div>

        </main>

      </div>


      {/* ======================================================
         GLOBAL MODALS
      ====================================================== */}

      <GlobalSearchModal />

      <QuickActionsModal />

      <AddCompanyModal />

      <ToastContainer />

    </div>
  );
};


/* ============================================================
   ROOT APP
   ============================================================ */

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}