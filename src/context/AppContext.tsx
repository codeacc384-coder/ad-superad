import React, {
  createContext,
  useState,
  useEffect
} from 'react';

import {
  Company,
  SubscriptionPlan,
  Invoice,
  PaymentTransaction,
  PlatformUser,
  SupportTicket,
  PlatformService,
  AuditLog,
  AdminSession,
  ApiKeyItem,
  SecurityEvent,
  PlatformFeature,
  NotificationItem,
  ToastMessage,
  SubscriptionPlanTier,
  TicketPriority,
  TicketStatus,
  HealthStatus,
  PlatformRole,
  PermissionItem,
  PermissionAction
} from '../types';

import {
  INITIAL_COMPANIES,
  INITIAL_PLANS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_USERS,
  INITIAL_TICKETS,
  INITIAL_SERVICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SESSIONS,
  INITIAL_API_KEYS,
  INITIAL_SECURITY_EVENTS,
  INITIAL_FEATURES,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';


/* ============================================================
   NAVIGATION
   ============================================================ */

export type NavTab =
  | 'dashboard'
  | 'leads'
  | 'companies'
  | 'company-detail'
  | 'subscriptions'
  | 'billing'
  | 'payments'
  | 'users'

  // Customer / tenant support
  | 'support'

  // Platform helpdesk
  | 'helpdesk'

  // Super admin profile
  | 'admin-profile'

  | 'health'
  | 'security'
  | 'features'
  | 'audit'
  | 'analytics'
  | 'notifications'
  | 'announcements'
  | 'settings'
  | 'reports'
  | 'data-management'
  | 'roles'
  | 'integrations';


/* ============================================================
   PLATFORM SETTINGS
   ============================================================ */

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  defaultCurrency: string;
  defaultTimezone: string;
  taxPercentage: number;
  invoicePrefix: string;
  autoRenewByDefault: boolean;
  mfaRequired: boolean;
  sessionTimeoutMins: number;
  passwordMinLength: number;
  emailNotifications: boolean;
  systemAlerts: boolean;
  billingAlerts: boolean;
}


/* ============================================================
   APP CONTEXT TYPE
   ============================================================ */

interface AppContextType {

  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  activeCompanyId: string | null;
  setActiveCompanyId: (id: string | null) => void;

  activeTicketId: string | null;
  setActiveTicketId: (id: string | null) => void;

  activeInvoiceId: string | null;
  setActiveInvoiceId: (id: string | null) => void;

  companyFilterStatus: string | null;
  setCompanyFilterStatus: (status: string | null) => void;

  viewCompanyProfile: (companyId: string) => void;

  sidebarMobileOpen: boolean;
  setSidebarMobileOpen: (open: boolean) => void;


  // Dialogs
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;

  quickActionsOpen: boolean;
  setQuickActionsOpen: (open: boolean) => void;

  addCompanyOpen: boolean;
  setAddCompanyOpen: (open: boolean) => void;


  // Impersonation
  impersonation: {
    isImpersonating: boolean;
    company: Company | null;
    adminName: string;
  };

  startImpersonation: (companyId: string) => void;
  exitImpersonation: () => void;


  // Data States
  companies: Company[];
  plans: SubscriptionPlan[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  users: PlatformUser[];
  tickets: SupportTicket[];
  services: PlatformService[];
  auditLogs: AuditLog[];
  sessions: AdminSession[];
  apiKeys: ApiKeyItem[];
  securityEvents: SecurityEvent[];
  features: PlatformFeature[];
  notifications: NotificationItem[];
  settings: PlatformSettings;

  updateSettings: (
    newSettings: Partial<PlatformSettings>
  ) => void;


  // Company Actions
  addCompany: (
    newCompany: Omit<
      Company,
      'id' | 'tenantId' | 'registrationDate'
    >
  ) => void;

  updateCompany: (
    id: string,
    updates: Partial<Company>
  ) => void;

  suspendCompany: (
    id: string,
    reason?: string
  ) => void;

  activateCompany: (
    id: string
  ) => void;

  changeCompanyPlan: (
    id: string,
    newPlan: SubscriptionPlanTier,
    newPrice?: number
  ) => void;

  deleteCompany: (
    id: string
  ) => void;


  // Plan Actions
  addPlan: (
    newPlan: Omit<
      SubscriptionPlan,
      | 'id'
      | 'subscribedCompaniesCount'
      | 'revenueMonthly'
      | 'activeSubscriptions'
      | 'trialSubscriptions'
      | 'churnRate'
    >
  ) => void;

  updatePlan: (
    id: string,
    updates: Partial<SubscriptionPlan>
  ) => void;

  duplicatePlan: (
    id: string
  ) => void;

  archivePlan: (
    id: string
  ) => void;


  // Invoice & Payment Actions
  markInvoicePaid: (
    id: string
  ) => void;

  refundInvoice: (
    id: string,
    reason?: string
  ) => void;

  resendInvoice: (
    id: string
  ) => void;


  // User Actions
  addUser: (
    newUser: Omit<
      PlatformUser,
      'id' | 'createdDate'
    >
  ) => void;

  updateUserStatus: (
    id: string,
    status: 'Active' | 'Suspended' | 'Invited'
  ) => void;

  resetUserPassword: (
    id: string
  ) => void;


  // Ticket Actions
  addTicketMessage: (
    ticketId: string,
    content: string,
    isInternal: boolean
  ) => void;

  updateTicketStatus: (
    ticketId: string,
    status: TicketStatus
  ) => void;

  updateTicketPriority: (
    ticketId: string,
    priority: TicketPriority
  ) => void;

  assignTicket: (
    ticketId: string,
    assignee: string
  ) => void;


  // Health Actions
  toggleServiceStatus: (
    serviceId: string,
    status: HealthStatus
  ) => void;


  // Security Actions
  revokeSession: (
    sessionId: string
  ) => void;

  createApiKey: (
    name: string,
    companyName: string,
    scope: ApiKeyItem['scope']
  ) => void;

  revokeApiKey: (
    keyId: string
  ) => void;


  // Feature Actions
  updateFeatureStatus: (
    featureId: string,
    status: PlatformFeature['status']
  ) => void;

  toggleFeaturePlanTier: (
    featureId: string,
    tier: SubscriptionPlanTier
  ) => void;


  // Notification Actions
  markNotificationRead: (
    id: string
  ) => void;

  markAllNotificationsRead: () => void;


  // ==========================================================
  // ROLES & PERMISSIONS
  // ==========================================================

  roles: PlatformRole[];

  addRole: (
    role: Omit<
      PlatformRole,
      'id' | 'usersCount' | 'permissionsCount' | 'createdDate'
    >
  ) => void;

  updateRole: (
    id: string,
    updates: Partial<PlatformRole>
  ) => void;

  deleteRole: (
    id: string
  ) => void;

  toggleRoleStatus: (
    id: string
  ) => void;

  updateRolePermissions: (
    id: string,
    permissions: PermissionItem[]
  ) => void;

  togglePermissionAction: (
    roleId: string,
    permissionId: string,
    action: PermissionAction
  ) => void;


  // Toasts
  toasts: ToastMessage[];

  addToast: (
    title: string,
    description?: string,
    type?: ToastMessage['type']
  ) => void;

  removeToast: (
    id: string
  ) => void;
}


/* ============================================================
   CONTEXT
   ============================================================ */

export const AppContext =
  createContext<AppContextType | undefined>(undefined);


/* ============================================================
   PROVIDER
   ============================================================ */

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {


  /* ==========================================================
     NAVIGATION STATE
     ========================================================== */

  const [activeTab, setActiveTab] =
    useState<NavTab>('dashboard');

  const [activeCompanyId, setActiveCompanyId] =
    useState<string | null>(null);

  const [activeTicketId, setActiveTicketId] =
    useState<string | null>(null);

  const [activeInvoiceId, setActiveInvoiceId] =
    useState<string | null>(null);

  const [companyFilterStatus, setCompanyFilterStatus] =
    useState<string | null>(null);

  const [sidebarMobileOpen, setSidebarMobileOpen] =
    useState(false);


  /* ==========================================================
     DIALOG STATE
     ========================================================== */

  const [globalSearchOpen, setGlobalSearchOpen] =
    useState(false);

  const [quickActionsOpen, setQuickActionsOpen] =
    useState(false);

  const [addCompanyOpen, setAddCompanyOpen] =
    useState(false);


  /* ==========================================================
     IMPERSONATION
     ========================================================== */

  const [impersonation, setImpersonation] = useState<{
    isImpersonating: boolean;
    company: Company | null;
    adminName: string;
  }>({
    isImpersonating: false,
    company: null,
    adminName: ''
  });


  /* ==========================================================
     DATA COLLECTIONS
     ========================================================== */

  const [companies, setCompanies] =
    useState<Company[]>(INITIAL_COMPANIES);

  const [plans, setPlans] =
    useState<SubscriptionPlan[]>(INITIAL_PLANS);

  const [invoices, setInvoices] =
    useState<Invoice[]>(INITIAL_INVOICES);

  const [payments, setPayments] =
    useState<PaymentTransaction[]>(INITIAL_PAYMENTS);

  const [users, setUsers] =
    useState<PlatformUser[]>(INITIAL_USERS);

  const [tickets, setTickets] =
    useState<SupportTicket[]>(INITIAL_TICKETS);

  const [services, setServices] =
    useState<PlatformService[]>(INITIAL_SERVICES);

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [sessions, setSessions] =
    useState<AdminSession[]>(INITIAL_SESSIONS);

  const [apiKeys, setApiKeys] =
    useState<ApiKeyItem[]>(INITIAL_API_KEYS);

  const [securityEvents, setSecurityEvents] =
    useState<SecurityEvent[]>(INITIAL_SECURITY_EVENTS);

  const [features, setFeatures] =
    useState<PlatformFeature[]>(INITIAL_FEATURES);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);


  /* ==========================================================
     ROLES & PERMISSIONS DATA
     ========================================================== */

  const [roles, setRoles] = useState<PlatformRole[]>([
    {
      id: 'role-super-admin',
      name: 'Super Admin',
      description:
        'Full access to all platform administration features.',
      usersCount: 3,
      permissionsCount: 24,
      status: 'Active',
      createdDate: 'Jan 10, 2026',
      isSystemRole: true,
      permissions: [
        {
          id: 'dashboard',
          module: 'Dashboard',
          actions: ['View']
        },
        {
          id: 'tenant-management',
          module: 'Tenant Management',
          actions: [
            'View',
            'Create',
            'Edit',
            'Delete',
            'Export'
          ]
        },
        {
          id: 'finance-billing',
          module: 'Finance & Billing',
          actions: [
            'View',
            'Create',
            'Edit',
            'Delete',
            'Export'
          ]
        },
        {
          id: 'subscriptions',
          module: 'Subscriptions & Plans',
          actions: [
            'View',
            'Create',
            'Edit',
            'Delete',
            'Export'
          ]
        },
        {
          id: 'platform-users',
          module: 'Platform Users',
          actions: [
            'View',
            'Create',
            'Edit',
            'Delete',
            'Export'
          ]
        },
        {
          id: 'analytics',
          module: 'Platform Analytics',
          actions: [
            'View',
            'Export'
          ]
        }
      ]
    },

    {
      id: 'role-platform-admin',
      name: 'Platform Admin',
      description:
        'Manages tenants, users and day-to-day platform operations.',
      usersCount: 8,
      permissionsCount: 18,
      status: 'Active',
      createdDate: 'Jan 18, 2026',
      isSystemRole: true,
      permissions: [
        {
          id: 'dashboard',
          module: 'Dashboard',
          actions: ['View']
        },
        {
          id: 'tenant-management',
          module: 'Tenant Management',
          actions: [
            'View',
            'Create',
            'Edit',
            'Export'
          ]
        },
        {
          id: 'platform-users',
          module: 'Platform Users',
          actions: [
            'View',
            'Create',
            'Edit'
          ]
        },
        {
          id: 'analytics',
          module: 'Platform Analytics',
          actions: [
            'View',
            'Export'
          ]
        },
        {
          id: 'support',
          module: 'Support Center',
          actions: [
            'View',
            'Create',
            'Edit'
          ]
        }
      ]
    },

    {
      id: 'role-support-admin',
      name: 'Support Admin',
      description:
        'Handles customer support tickets and company assistance.',
      usersCount: 12,
      permissionsCount: 10,
      status: 'Active',
      createdDate: 'Feb 02, 2026',
      isSystemRole: true,
      permissions: [
        {
          id: 'dashboard',
          module: 'Dashboard',
          actions: ['View']
        },
        {
          id: 'tenant-management',
          module: 'Tenant Management',
          actions: ['View']
        },
        {
          id: 'support',
          module: 'Support Center',
          actions: [
            'View',
            'Create',
            'Edit',
            'Export'
          ]
        }
      ]
    },

    {
      id: 'role-finance-admin',
      name: 'Finance Admin',
      description:
        'Manages billing, invoices, payments and subscriptions.',
      usersCount: 5,
      permissionsCount: 8,
      status: 'Active',
      createdDate: 'Feb 15, 2026',
      isSystemRole: true,
      permissions: [
        {
          id: 'dashboard',
          module: 'Dashboard',
          actions: ['View']
        },
        {
          id: 'finance-billing',
          module: 'Finance & Billing',
          actions: [
            'View',
            'Create',
            'Edit',
            'Export'
          ]
        },
        {
          id: 'subscriptions',
          module: 'Subscriptions & Plans',
          actions: [
            'View',
            'Edit'
          ]
        }
      ]
    },

    {
      id: 'role-security-admin',
      name: 'Security Admin',
      description:
        'Manages platform security, sessions, keys and audit activity.',
      usersCount: 4,
      permissionsCount: 12,
      status: 'Active',
      createdDate: 'Mar 01, 2026',
      isSystemRole: true,
      permissions: [
        {
          id: 'dashboard',
          module: 'Dashboard',
          actions: ['View']
        },
        {
          id: 'security',
          module: 'Security Center',
          actions: [
            'View',
            'Create',
            'Edit',
            'Delete'
          ]
        },
        {
          id: 'audit',
          module: 'Audit Logs',
          actions: [
            'View',
            'Export'
          ]
        },
        {
          id: 'configuration',
          module: 'Configuration',
          actions: [
            'View',
            'Edit'
          ]
        }
      ]
    },

    {
      id: 'role-hr-admin',
      name: 'HR Admin',
      description:
        'Manages HR administration and employee-related platform access.',
      usersCount: 15,
      permissionsCount: 14,
      status: 'Active',
      createdDate: 'Mar 10, 2026',
      isSystemRole: false,
      permissions: [
        {
          id: 'dashboard',
          module: 'Dashboard',
          actions: ['View']
        },
        {
          id: 'tenant-management',
          module: 'Tenant Management',
          actions: ['View']
        },
        {
          id: 'platform-users',
          module: 'Platform Users',
          actions: [
            'View',
            'Create',
            'Edit'
          ]
        }
      ]
    }
  ]);


  /* ==========================================================
     PLATFORM SETTINGS
     ========================================================== */

  const [settings, setSettings] =
    useState<PlatformSettings>({
      platformName: 'CoreHR Enterprise SaaS',
      supportEmail: 'support@corehr-platform.com',
      defaultCurrency: 'USD ($)',
      defaultTimezone: 'UTC-5 (Eastern Time)',
      taxPercentage: 8.5,
      invoicePrefix: 'INV-2026-',
      autoRenewByDefault: true,
      mfaRequired: true,
      sessionTimeoutMins: 30,
      passwordMinLength: 12,
      emailNotifications: true,
      systemAlerts: true,
      billingAlerts: true
    });


  /* ==========================================================
     KEYBOARD SHORTCUT
     ========================================================== */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === 'k'
      ) {
        e.preventDefault();

        setGlobalSearchOpen(prev => !prev);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
  }, []);


  /* ==========================================================
     TOAST HELPERS
     ========================================================== */

  const addToast = (
    title: string,
    description?: string,
    type: ToastMessage['type'] = 'success'
  ) => {

    const id =
      `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 5)}`;

    setToasts(prev => [
      ...prev,
      {
        id,
        title,
        description,
        type
      }
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };


  const removeToast = (id: string) => {
    setToasts(prev =>
      prev.filter(t => t.id !== id)
    );
  };


  /* ==========================================================
     AUDIT LOGGER
     ========================================================== */

  const logAudit = (
    action: string,
    details: string,
    companyName?: string,
    companyId?: string,
    status: AuditLog['status'] = 'Success'
  ) => {

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,

      timestamp: 'Just now',

      actor: {
        name:
          impersonation.isImpersonating
            ? `Super Admin (Impersonating ${impersonation.adminName})`
            : 'Super Admin User',

        email: 'admin@corehr-platform.com',

        role: 'Super Admin'
      },

      action,

      companyName:
        companyName || 'Platform Console',

      companyId,

      ipAddress: '192.168.1.104',

      resource: 'Admin Console',

      status,

      details
    };

    setAuditLogs(prev => [
      newLog,
      ...prev
    ]);
  };


  /* ==========================================================
     SETTINGS
     ========================================================== */

  const updateSettings = (
    newSettings: Partial<PlatformSettings>
  ) => {

    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));

    logAudit(
      'Configuration Updated',
      'Super Admin updated global platform system settings'
    );

    addToast(
      'Settings Saved',
      'Platform configuration updated successfully.',
      'success'
    );
  };


  /* ==========================================================
     COMPANY ACTIONS
     ========================================================== */

  const viewCompanyProfile = (
    companyId: string
  ) => {

    setActiveCompanyId(companyId);
    setActiveTab('company-detail');
  };


  const startImpersonation = (
    companyId: string
  ) => {

    const target =
      companies.find(c => c.id === companyId);

    if (target) {

      setImpersonation({
        isImpersonating: true,
        company: target,
        adminName: target.admin.name
      });

      logAudit(
        'Admin Impersonation Started',
        `Started session impersonating ${target.admin.name} for ${target.name}`,
        target.name,
        target.id
      );

      addToast(
        `Impersonating ${target.admin.name}`,
        `You are now viewing ${target.name} as Company Admin.`,
        'info'
      );
    }
  };


  const exitImpersonation = () => {

    if (impersonation.company) {

      logAudit(
        'Admin Impersonation Ended',
        `Exited impersonation mode for ${impersonation.company.name}`,
        impersonation.company.name,
        impersonation.company.id
      );
    }

    setImpersonation({
      isImpersonating: false,
      company: null,
      adminName: ''
    });

    addToast(
      'Exited Impersonation',
      'Returned to Super Admin Console mode.',
      'info'
    );
  };


  const addCompany = (
    newCompData: Omit<
      Company,
      'id' | 'tenantId' | 'registrationDate'
    >
  ) => {

    const id = `comp-${Date.now()}`;

    const code =
      newCompData.name
        .replace(/[^a-zA-Z]/g, '')
        .substring(0, 3)
        .toUpperCase() || 'TEN';

    const rand =
      Math.floor(
        1000 + Math.random() * 9000
      );

    const tenantId =
      `${code}-${rand}-X`;

    const today =
      new Date().toLocaleDateString(
        'en-US',
        {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }
      );

    const newCompany: Company = {
      ...newCompData,
      id,
      tenantId,
      registrationDate: today
    };

    setCompanies(prev => [
      newCompany,
      ...prev
    ]);


    const newAdminUser: PlatformUser = {

      id: `usr-${Date.now()}`,

      name: newCompany.admin.name,

      email: newCompany.admin.email,

      companyId: id,

      companyName: newCompany.name,

      role: 'Company Admin',

      status: 'Active',

      lastLogin: 'Just now',

      createdDate: today,

      avatar: newCompany.admin.avatar,

      phone: newCompany.admin.phone,

      department: 'Executive HR',

      location: newCompany.location
    };

    setUsers(prev => [
      newAdminUser,
      ...prev
    ]);


    setPlans(prev =>
      prev.map(p =>
        p.tier === newCompany.plan
          ? {
              ...p,
              subscribedCompaniesCount:
                p.subscribedCompaniesCount + 1,
              activeSubscriptions:
                p.activeSubscriptions + 1
            }
          : p
      )
    );


    logAudit(
      'Company Created',
      `New tenant registered: ${newCompany.name} (${newCompany.plan} Plan)`,
      newCompany.name,
      id
    );

    addToast(
      'Company Created Successfully',
      `${newCompany.name} is now provisioned on the platform.`,
      'success'
    );
  };


  const updateCompany = (
    id: string,
    updates: Partial<Company>
  ) => {

    setCompanies(prev =>
      prev.map(c => {

        if (c.id === id) {

          const updated = {
            ...c,
            ...updates
          };

          logAudit(
            'Company Details Updated',
            `Updated profile information for ${updated.name}`,
            updated.name,
            id
          );

          return updated;
        }

        return c;
      })
    );

    addToast(
      'Company Updated',
      'Company profile details updated successfully.',
      'success'
    );
  };


  const suspendCompany = (
    id: string,
    reason?: string
  ) => {

    setCompanies(prev =>
      prev.map(c => {

        if (c.id === id) {

          logAudit(
            'Company Suspended',
            `Tenant access revoked: ${c.name}. Reason: ${
              reason || 'Administrative action'
            }`,
            c.name,
            id,
            'Warning'
          );

          return {
            ...c,
            status: 'Suspended'
          };
        }

        return c;
      })
    );


    setUsers(prev =>
      prev.map(u =>
        u.companyId === id
          ? {
              ...u,
              status: 'Suspended'
            }
          : u
      )
    );


    addToast(
      'Company Suspended',
      'Access for this company and all its users has been suspended.',
      'warning'
    );
  };


  const activateCompany = (
    id: string
  ) => {

    setCompanies(prev =>
      prev.map(c => {

        if (c.id === id) {

          logAudit(
            'Company Activated',
            `Tenant access restored: ${c.name}`,
            c.name,
            id
          );

          return {
            ...c,
            status: 'Active'
          };
        }

        return c;
      })
    );


    setUsers(prev =>
      prev.map(u =>
        u.companyId === id
          ? {
              ...u,
              status: 'Active'
            }
          : u
      )
    );


    addToast(
      'Company Activated',
      'Company and all associated users are now Active.',
      'success'
    );
  };


  const changeCompanyPlan = (
    id: string,
    newPlan: SubscriptionPlanTier,
    newPrice?: number
  ) => {

    setCompanies(prev =>
      prev.map(c => {

        if (c.id === id) {

          const price =
            newPrice !== undefined
              ? newPrice
              : newPlan === 'Enterprise'
              ? 4500
              : newPlan === 'Professional'
              ? 1800
              : newPlan === 'Starter'
              ? 350
              : 0;

          logAudit(
            'Plan Changed',
            `Changed subscription for ${c.name} from ${c.plan} to ${newPlan}`,
            c.name,
            id
          );

          return {
            ...c,
            plan: newPlan,
            monthlyPrice: price
          };
        }

        return c;
      })
    );


    addToast(
      'Subscription Plan Changed',
      `Company upgraded to ${newPlan} plan.`,
      'success'
    );
  };


  const deleteCompany = (
    id: string
  ) => {

    const target =
      companies.find(c => c.id === id);

    if (target) {

      setCompanies(prev =>
        prev.filter(c => c.id !== id)
      );

      setUsers(prev =>
        prev.filter(
          u => u.companyId !== id
        )
      );

      logAudit(
        'Company Deleted',
        `Permanently purged tenant ${target.name}`,
        target.name,
        id,
        'Failed'
      );

      addToast(
        'Company Deleted',
        `${target.name} was removed from the platform.`,
        'error'
      );

      if (activeCompanyId === id) {

        setActiveTab('companies');

        setActiveCompanyId(null);
      }
    }
  };


  /* ==========================================================
     PLAN MANAGEMENT
     ========================================================== */

  const addPlan = (
    newPlanData: Omit<
      SubscriptionPlan,
      | 'id'
      | 'subscribedCompaniesCount'
      | 'revenueMonthly'
      | 'activeSubscriptions'
      | 'trialSubscriptions'
      | 'churnRate'
    >
  ) => {

    const id =
      `plan-${Date.now()}`;

    const plan: SubscriptionPlan = {

      ...newPlanData,

      id,

      subscribedCompaniesCount: 0,

      revenueMonthly: 0,

      activeSubscriptions: 0,

      trialSubscriptions: 0,

      churnRate: 0
    };

    setPlans(prev => [
      ...prev,
      plan
    ]);

    logAudit(
      'Plan Created',
      `Created new subscription tier: ${plan.name} ($${plan.monthlyPrice}/mo)`
    );

    addToast(
      'Plan Created',
      `Tier ${plan.name} has been published.`,
      'success'
    );
  };


  const updatePlan = (
    id: string,
    updates: Partial<SubscriptionPlan>
  ) => {

    setPlans(prev =>
      prev.map(p => {

        if (p.id === id) {

          logAudit(
            'Plan Updated',
            `Modified configurations for ${p.name} tier`
          );

          return {
            ...p,
            ...updates
          };
        }

        return p;
      })
    );

    addToast(
      'Plan Updated',
      'Subscription plan configuration saved.',
      'success'
    );
  };


  const duplicatePlan = (
    id: string
  ) => {

    const source =
      plans.find(p => p.id === id);

    if (source) {

      const dup: SubscriptionPlan = {

        ...source,

        id: `plan-${Date.now()}`,

        name:
          `${source.name} (Copy)` as SubscriptionPlanTier,

        subscribedCompaniesCount: 0,

        revenueMonthly: 0,

        activeSubscriptions: 0,

        trialSubscriptions: 0
      };

      setPlans(prev => [
        ...prev,
        dup
      ]);

      logAudit(
        'Plan Duplicated',
        `Duplicated ${source.name} as new tier`
      );

      addToast(
        'Plan Duplicated',
        `Created duplicate copy of ${source.name}.`,
        'info'
      );
    }
  };


  const archivePlan = (
    id: string
  ) => {

    setPlans(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status: 'Archived'
            }
          : p
      )
    );

    addToast(
      'Plan Archived',
      'Plan is now archived and hidden from new signups.',
      'info'
    );
  };


  /* ==========================================================
     INVOICE & PAYMENT
     ========================================================== */

  const markInvoicePaid = (
    id: string
  ) => {

    setInvoices(prev =>
      prev.map(inv => {

        if (inv.id === id) {

          const updated: Invoice = {

            ...inv,

            status: 'Paid',

            paidDate: 'Just now'
          };


          logAudit(
            'Invoice Marked Paid',
            `Invoice ${inv.invoiceNumber} ($${inv.total.toLocaleString()}) marked paid manually`,
            inv.companyName,
            inv.companyId
          );


          const newTxn: PaymentTransaction = {

            id: `pay-${Date.now()}`,

            transactionId:
              `TXN-MAN-${Math.floor(
                100000 +
                Math.random() * 900000
              )}`,

            companyId:
              inv.companyId,

            companyName:
              inv.companyName,

            amount:
              inv.total,

            paymentMethod:
              'Wire Transfer',

            date:
              'Just now',

            status:
              'Success',

            invoiceId:
              inv.id,

            gatewayReference:
              'MANUAL-SUPERADMIN-OVERRIDE',

            feeAmount:
              0
          };

          setPayments(p => [
            newTxn,
            ...p
          ]);

          return updated;
        }

        return inv;
      })
    );


    addToast(
      'Invoice Paid',
      'Invoice marked as paid and transaction record generated.',
      'success'
    );
  };


  const refundInvoice = (
    id: string,
    reason?: string
  ) => {

    setInvoices(prev =>
      prev.map(inv => {

        if (inv.id === id) {

          logAudit(
            'Invoice Refunded',
            `Refunded $${inv.total.toLocaleString()} for ${inv.companyName}. Reason: ${
              reason || 'Admin refund'
            }`,
            inv.companyName,
            inv.companyId,
            'Warning'
          );

          return {
            ...inv,
            status: 'Refunded'
          };
        }

        return inv;
      })
    );


    setPayments(prev =>
      prev.map(pay =>
        pay.invoiceId === id
          ? {
              ...pay,
              status: 'Refunded'
            }
          : pay
      )
    );


    addToast(
      'Payment Refunded',
      'Invoice and corresponding gateway transaction marked Refunded.',
      'warning'
    );
  };


  const resendInvoice = (
    id: string
  ) => {

    const inv =
      invoices.find(i => i.id === id);

    if (inv) {

      logAudit(
        'Invoice Resent',
        `Emailed copy of invoice ${inv.invoiceNumber} to ${inv.companyName}`,
        inv.companyName,
        inv.companyId
      );

      addToast(
        'Invoice Resent',
        `Invoice ${inv.invoiceNumber} dispatched to company billing email.`,
        'info'
      );
    }
  };


  /* ==========================================================
     USER ACTIONS
     ========================================================== */

  const addUser = (
    newUserData: Omit<
      PlatformUser,
      'id' | 'createdDate'
    >
  ) => {

    const id =
      `usr-${Date.now()}`;

    const today =
      new Date().toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }
      );

    const user: PlatformUser = {
      ...newUserData,
      id,
      createdDate: today
    };

    setUsers(prev => [
      user,
      ...prev
    ]);

    logAudit(
      'User Created',
      `Created user account for ${user.name} (${user.role}) at ${user.companyName}`,
      user.companyName,
      user.companyId
    );

    addToast(
      'User Added',
      `${user.name} was added to ${user.companyName}.`,
      'success'
    );
  };


  const updateUserStatus = (
    id: string,
    status: 'Active' | 'Suspended' | 'Invited'
  ) => {

    setUsers(prev =>
      prev.map(u => {

        if (u.id === id) {

          logAudit(
            'User Status Changed',
            `Set account status of ${u.name} to ${status}`,
            u.companyName,
            u.companyId
          );

          return {
            ...u,
            status
          };
        }

        return u;
      })
    );

    addToast(
      'User Status Updated',
      `Account status set to ${status}.`,
      'info'
    );
  };


  const resetUserPassword = (
    id: string
  ) => {

    const target =
      users.find(u => u.id === id);

    if (target) {

      logAudit(
        'Password Reset Dispatched',
        `Triggered secure password reset link for ${target.email}`,
        target.companyName,
        target.companyId
      );

      addToast(
        'Password Reset Sent',
        `Temporary credentials and reset link sent to ${target.email}.`,
        'success'
      );
    }
  };


  /* ==========================================================
     TICKET ACTIONS
     ========================================================== */

  const addTicketMessage = (
    ticketId: string,
    content: string,
    isInternal: boolean
  ) => {

    const msgId =
      `msg-${Date.now()}`;

    const newMsg = {

      id: msgId,

      senderName:
        impersonation.isImpersonating
          ? impersonation.adminName
          : 'Super Admin (You)',

      senderEmail:
        impersonation.isImpersonating
          ? impersonation.company?.contactEmail ||
            'admin@company.com'
          : 'admin@corehr-platform.com',

      senderRole:
        impersonation.isImpersonating
          ? 'Company Admin'
          : 'Super Admin',

      timestamp:
        'Just now',

      content,

      isInternal
    };


    setTickets(prev =>
      prev.map(t => {

        if (t.id === ticketId) {

          const updated = {

            ...t,

            updatedDate:
              'Just now',

            status:
              isInternal
                ? t.status
                : (
                    t.status === 'Open'
                      ? 'In Progress' as TicketStatus
                      : t.status
                  ),

            messages: [
              ...t.messages,
              newMsg
            ]
          };


          logAudit(
            'Ticket Updated',
            `Replied to ticket ${t.ticketNumber} (${isInternal ? 'Internal Note' : 'Public Reply'})`,
            t.companyName,
            t.companyId
          );

          return updated;
        }

        return t;
      })
    );


    addToast(
      isInternal
        ? 'Internal Note Saved'
        : 'Reply Sent to Requester',
      undefined,
      'success'
    );
  };


  const updateTicketStatus = (
    ticketId: string,
    status: TicketStatus
  ) => {

    setTickets(prev =>
      prev.map(t => {

        if (t.id === ticketId) {

          logAudit(
            'Ticket Status Changed',
            `Ticket ${t.ticketNumber} status changed to ${status}`,
            t.companyName,
            t.companyId
          );

          return {
            ...t,
            status,
            updatedDate: 'Just now'
          };
        }

        return t;
      })
    );

    addToast(
      `Ticket Status: ${status}`,
      undefined,
      'info'
    );
  };


  const updateTicketPriority = (
    ticketId: string,
    priority: TicketPriority
  ) => {

    setTickets(prev =>
      prev.map(t => {

        if (t.id === ticketId) {

          logAudit(
            'Ticket Priority Changed',
            `Ticket ${t.ticketNumber} priority changed to ${priority}`,
            t.companyName,
            t.companyId
          );

          return {
            ...t,
            priority,
            updatedDate: 'Just now'
          };
        }

        return t;
      })
    );

    addToast(
      `Ticket Priority: ${priority}`,
      undefined,
      'info'
    );
  };


  const assignTicket = (
    ticketId: string,
    assignee: string
  ) => {

    setTickets(prev =>
      prev.map(t => {

        if (t.id === ticketId) {

          logAudit(
            'Ticket Assigned',
            `Ticket ${t.ticketNumber} assigned to ${assignee}`,
            t.companyName,
            t.companyId
          );

          return {
            ...t,
            assignedTo: assignee,
            updatedDate: 'Just now'
          };
        }

        return t;
      })
    );

    addToast(
      `Ticket Assigned to ${assignee}`,
      undefined,
      'success'
    );
  };


  /* ==========================================================
     HEALTH
     ========================================================== */

  const toggleServiceStatus = (
    serviceId: string,
    status: HealthStatus
  ) => {

    setServices(prev =>
      prev.map(s => {

        if (s.id === serviceId) {

          logAudit(
            'Platform Health Override',
            `Service ${s.name} status overridden to ${status}`,
            'System Health',
            undefined,
            status === 'Operational'
              ? 'Success'
              : 'Warning'
          );

          return {
            ...s,
            status
          };
        }

        return s;
      })
    );

    addToast(
      'Service Health Updated',
      `${status} status applied.`,
      'info'
    );
  };


  /* ==========================================================
     SECURITY
     ========================================================== */

  const revokeSession = (
    sessionId: string
  ) => {

    setSessions(prev =>
      prev.filter(
        s => s.id !== sessionId
      )
    );

    logAudit(
      'Admin Session Terminated',
      `Super Admin terminated active web session ID: ${sessionId}`,
      'Security Center',
      undefined,
      'Warning'
    );

    addToast(
      'Session Revoked',
      'The selected admin session token was invalidated.',
      'warning'
    );
  };


  const createApiKey = (
    name: string,
    companyName: string,
    scope: ApiKeyItem['scope']
  ) => {

    const newKey: ApiKeyItem = {

      id: `key-${Date.now()}`,

      name,

      keyPrefix:
        `pk_live_sec_${Math.random()
          .toString(36)
          .substring(2, 8)}...`,

      companyName,

      createdDate:
        'Today',

      lastUsedDate:
        'Never',

      status:
        'Active',

      scope
    };

    setApiKeys(prev => [
      newKey,
      ...prev
    ]);

    logAudit(
      'API Key Created',
      `Created API key '${name}' for ${companyName} (${scope})`,
      companyName
    );

    addToast(
      'API Key Generated',
      'Store key safely — it grants programmatic platform access.',
      'success'
    );
  };


  const revokeApiKey = (
    keyId: string
  ) => {

    setApiKeys(prev =>
      prev.map(k =>
        k.id === keyId
          ? {
              ...k,
              status: 'Revoked'
            }
          : k
      )
    );

    logAudit(
      'API Key Revoked',
      `Revoked token key ID: ${keyId}`,
      'Security Center',
      undefined,
      'Warning'
    );

    addToast(
      'API Key Revoked',
      'Programmatic token has been permanently disabled.',
      'error'
    );
  };


  /* ==========================================================
     FEATURES
     ========================================================== */

  const updateFeatureStatus = (
    featureId: string,
    status: PlatformFeature['status']
  ) => {

    setFeatures(prev =>
      prev.map(f => {

        if (f.id === featureId) {

          logAudit(
            'Feature Flag Toggled',
            `Feature '${f.name}' flag updated to ${status}`
          );

          return {
            ...f,
            status
          };
        }

        return f;
      })
    );

    addToast(
      'Feature Flag Updated',
      `Feature status set to ${status}.`,
      'info'
    );
  };


  const toggleFeaturePlanTier = (
    featureId: string,
    tier: SubscriptionPlanTier
  ) => {

    setFeatures(prev =>
      prev.map(f => {

        if (f.id === featureId) {

          const exists =
            f.planTiers.includes(tier);

          const newTiers =
            exists
              ? f.planTiers.filter(
                  t => t !== tier
                )
              : [
                  ...f.planTiers,
                  tier
                ];

          logAudit(
            'Feature Plan Matrix Updated',
            `Updated plan tier access for '${f.name}'`
          );

          return {
            ...f,
            planTiers: newTiers
          };
        }

        return f;
      })
    );

    addToast(
      'Plan Feature Matrix Updated',
      undefined,
      'success'
    );
  };


  /* ==========================================================
     NOTIFICATIONS
     ========================================================== */

  const markNotificationRead = (
    id: string
  ) => {

    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              read: true
            }
          : n
      )
    );
  };


  const markAllNotificationsRead = () => {

    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        read: true
      }))
    );

    addToast(
      'All Notifications Marked as Read',
      undefined,
      'info'
    );
  };


  /* ==========================================================
     ROLES & PERMISSIONS ACTIONS
     ========================================================== */

  const addRole = (
    roleData: Omit<
      PlatformRole,
      'id' |
      'usersCount' |
      'permissionsCount' |
      'createdDate'
    >
  ) => {

    const id =
      `role-${Date.now()}`;

    const permissionsCount =
      roleData.permissions.reduce(
        (total, permission) =>
          total + permission.actions.length,
        0
      );

    const today =
      new Date().toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }
      );

    const newRole: PlatformRole = {

      ...roleData,

      id,

      usersCount: 0,

      permissionsCount,

      createdDate: today
    };

    setRoles(prev => [
      ...prev,
      newRole
    ]);

    logAudit(
      'Role Created',
      `Created platform role '${newRole.name}'`
    );

    addToast(
      'Role Created',
      `${newRole.name} has been created successfully.`,
      'success'
    );
  };


  const updateRole = (
    id: string,
    updates: Partial<PlatformRole>
  ) => {

    setRoles(prev =>
      prev.map(role => {

        if (role.id !== id) {
          return role;
        }

        const updatedRole = {
          ...role,
          ...updates
        };

        const permissionsCount =
          updatedRole.permissions.reduce(
            (total, permission) =>
              total + permission.actions.length,
            0
          );

        updatedRole.permissionsCount =
          permissionsCount;

        logAudit(
          'Role Updated',
          `Updated platform role '${updatedRole.name}'`
        );

        return updatedRole;
      })
    );

    addToast(
      'Role Updated',
      'Role configuration has been updated successfully.',
      'success'
    );
  };


  const deleteRole = (
    id: string
  ) => {

    const role =
      roles.find(r => r.id === id);

    if (!role) {
      return;
    }

    if (role.isSystemRole) {

      addToast(
        'System Role Protected',
        'System roles cannot be deleted.',
        'warning'
      );

      return;
    }

    setRoles(prev =>
      prev.filter(
        r => r.id !== id
      )
    );

    logAudit(
      'Role Deleted',
      `Deleted platform role '${role.name}'`,
      undefined,
      undefined,
      'Warning'
    );

    addToast(
      'Role Deleted',
      `${role.name} has been removed.`,
      'success'
    );
  };


  const toggleRoleStatus = (
    id: string
  ) => {

    setRoles(prev =>
      prev.map(role => {

        if (role.id !== id) {
          return role;
        }

        const newStatus =
          role.status === 'Active'
            ? 'Inactive'
            : 'Active';

        logAudit(
          'Role Status Changed',
          `Role '${role.name}' changed to ${newStatus}`,
          undefined,
          undefined,
          newStatus === 'Active'
            ? 'Success'
            : 'Warning'
        );

        return {
          ...role,
          status: newStatus
        };
      })
    );

    addToast(
      'Role Status Updated',
      'Role status has been updated.',
      'info'
    );
  };


  const updateRolePermissions = (
    id: string,
    permissions: PermissionItem[]
  ) => {

    const permissionsCount =
      permissions.reduce(
        (total, permission) =>
          total + permission.actions.length,
        0
      );

    setRoles(prev =>
      prev.map(role =>
        role.id === id
          ? {
              ...role,
              permissions,
              permissionsCount
            }
          : role
      )
    );

    const role =
      roles.find(r => r.id === id);

    logAudit(
      'Role Permissions Updated',
      `Updated permissions for role '${role?.name || id}'`
    );

    addToast(
      'Permissions Updated',
      'Role permissions have been saved successfully.',
      'success'
    );
  };


  const togglePermissionAction = (
    roleId: string,
    permissionId: string,
    action: PermissionAction
  ) => {

    setRoles(prev =>
      prev.map(role => {

        if (role.id !== roleId) {
          return role;
        }

        const updatedPermissions =
          role.permissions.map(permission => {

            if (permission.id !== permissionId) {
              return permission;
            }

            const hasAction =
              permission.actions.includes(action);

            const actions =
              hasAction
                ? permission.actions.filter(
                    item => item !== action
                  )
                : [
                    ...permission.actions,
                    action
                  ];

            return {
              ...permission,
              actions
            };
          });

        const permissionsCount =
          updatedPermissions.reduce(
            (total, permission) =>
              total + permission.actions.length,
            0
          );

        return {
          ...role,
          permissions:
            updatedPermissions,
          permissionsCount
        };
      })
    );

    const role =
      roles.find(r => r.id === roleId);

    logAudit(
      'Permission Changed',
      `Updated '${action}' permission for role '${role?.name || roleId}'`
    );
  };


  /* ==========================================================
     CONTEXT PROVIDER
     ========================================================== */

  return (
    <AppContext.Provider
      value={{

        /* Navigation */
        activeTab,
        setActiveTab,

        activeCompanyId,
        setActiveCompanyId,

        activeTicketId,
        setActiveTicketId,

        activeInvoiceId,
        setActiveInvoiceId,

        companyFilterStatus,
        setCompanyFilterStatus,

        viewCompanyProfile,

        sidebarMobileOpen,
        setSidebarMobileOpen,


        /* Dialogs */
        globalSearchOpen,
        setGlobalSearchOpen,

        quickActionsOpen,
        setQuickActionsOpen,

        addCompanyOpen,
        setAddCompanyOpen,


        /* Impersonation */
        impersonation,
        startImpersonation,
        exitImpersonation,


        /* Data */
        companies,
        plans,
        invoices,
        payments,
        users,
        tickets,
        services,
        auditLogs,
        sessions,
        apiKeys,
        securityEvents,
        features,
        notifications,
        settings,
        updateSettings,


        /* Company */
        addCompany,
        updateCompany,
        suspendCompany,
        activateCompany,
        changeCompanyPlan,
        deleteCompany,


        /* Plans */
        addPlan,
        updatePlan,
        duplicatePlan,
        archivePlan,


        /* Invoice */
        markInvoicePaid,
        refundInvoice,
        resendInvoice,


        /* Users */
        addUser,
        updateUserStatus,
        resetUserPassword,


        /* Tickets */
        addTicketMessage,
        updateTicketStatus,
        updateTicketPriority,
        assignTicket,


        /* Health */
        toggleServiceStatus,


        /* Security */
        revokeSession,
        createApiKey,
        revokeApiKey,


        /* Features */
        updateFeatureStatus,
        toggleFeaturePlanTier,


        /* Notifications */
        markNotificationRead,
        markAllNotificationsRead,


        /* Roles */
        roles,
        addRole,
        updateRole,
        deleteRole,
        toggleRoleStatus,
        updateRolePermissions,
        togglePermissionAction,


        /* Toasts */
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


/* ============================================================
   useApp HOOK
   ============================================================ */

export const useApp = (): AppContextType => {

  const context =
    React.useContext(AppContext);

  if (!context) {

    throw new Error(
      'useApp must be used inside an AppProvider'
    );
  }

  return context;
};