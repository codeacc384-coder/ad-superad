import React, { useMemo, useState } from 'react';

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode2,
  Globe,
  KeyRound,
  Link2,
  Mail,
  MessageSquare,
  MoreVertical,
  Package,
  Pause,
  Play,
  Plug,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Users,
  Webhook,
  X,
  Zap,
} from 'lucide-react';

/* ============================================================
   INTEGRATION DATA
   ============================================================ */

const initialIntegrations = [
  {
    id: 1,
    name: 'Google Workspace',
    description:
      'Connect Google services for employee accounts, calendars, email and productivity.',
    category: 'Productivity',
    status: 'Connected',
    icon: 'G',
    color: 'bg-red-50 text-red-600',
    connectedCompanies: 42,
    lastSync: '2 minutes ago',
    syncFrequency: 'Every 15 minutes',
    version: 'v3.2',
    endpoint: 'https://admin.googleapis.com',
    apiStatus: 'Healthy',
    enabled: true,
    dataSync: [
      'Employee accounts',
      'Calendar',
      'Email',
      'Organization units',
    ],
  },

  {
    id: 2,
    name: 'Microsoft 365',
    description:
      'Connect Microsoft services for enterprise productivity, identity and employee management.',
    category: 'Productivity',
    status: 'Connected',
    icon: 'M',
    color: 'bg-blue-50 text-blue-600',
    connectedCompanies: 36,
    lastSync: '5 minutes ago',
    syncFrequency: 'Every 30 minutes',
    version: 'v2.8',
    endpoint: 'https://graph.microsoft.com',
    apiStatus: 'Healthy',
    enabled: true,
    dataSync: [
      'Employee accounts',
      'Microsoft Teams',
      'Calendar',
      'Directory',
    ],
  },

  {
    id: 3,
    name: 'Slack',
    description:
      'Send HR notifications, employee updates and workflow alerts to Slack.',
    category: 'Communication',
    status: 'Connected',
    icon: 'S',
    color: 'bg-purple-50 text-purple-600',
    connectedCompanies: 28,
    lastSync: '8 minutes ago',
    syncFrequency: 'Every 15 minutes',
    version: 'v4.1',
    endpoint: 'https://slack.com/api',
    apiStatus: 'Healthy',
    enabled: true,
    dataSync: [
      'Notifications',
      'Employee events',
      'HR alerts',
      'Workflow events',
    ],
  },

  {
    id: 4,
    name: 'Microsoft Teams',
    description:
      'Connect Teams for employee communication, HR notifications and collaboration.',
    category: 'Communication',
    status: 'Connected',
    icon: 'T',
    color: 'bg-indigo-50 text-indigo-600',
    connectedCompanies: 21,
    lastSync: '12 minutes ago',
    syncFrequency: 'Every 30 minutes',
    version: 'v3.4',
    endpoint: 'https://graph.microsoft.com/teams',
    apiStatus: 'Healthy',
    enabled: true,
    dataSync: [
      'Notifications',
      'Employee events',
      'Teams messages',
    ],
  },

  {
    id: 5,
    name: 'Stripe',
    description:
      'Manage platform billing, subscriptions and payment processing through Stripe.',
    category: 'Payments',
    status: 'Connected',
    icon: '$',
    color: 'bg-violet-50 text-violet-600',
    connectedCompanies: 64,
    lastSync: '1 minute ago',
    syncFrequency: 'Real-time',
    version: 'v12.1',
    endpoint: 'https://api.stripe.com',
    apiStatus: 'Healthy',
    enabled: true,
    dataSync: [
      'Subscriptions',
      'Payments',
      'Invoices',
      'Customer records',
    ],
  },

  {
    id: 6,
    name: 'SendGrid',
    description:
      'Send transactional emails, verification emails and platform notifications.',
    category: 'Email',
    status: 'Available',
    icon: 'S',
    color: 'bg-cyan-50 text-cyan-600',
    connectedCompanies: 0,
    lastSync: 'Never',
    syncFrequency: 'Every 15 minutes',
    version: 'v3.0',
    endpoint: 'https://api.sendgrid.com',
    apiStatus: 'Available',
    enabled: false,
    dataSync: [
      'Transactional emails',
      'Notification emails',
      'Delivery status',
    ],
  },

  {
    id: 7,
    name: 'Webhooks',
    description:
      'Send real-time CoreHR platform events to external applications and services.',
    category: 'Developer',
    status: 'Available',
    icon: 'W',
    color: 'bg-orange-50 text-orange-600',
    connectedCompanies: 0,
    lastSync: 'Never',
    syncFrequency: 'Real-time',
    version: 'v1.0',
    endpoint: 'Custom endpoint',
    apiStatus: 'Available',
    enabled: false,
    dataSync: [
      'Company events',
      'User events',
      'Subscription events',
      'Security events',
    ],
  },

  {
    id: 8,
    name: 'REST API',
    description:
      'Allow external applications to securely communicate with the CoreHR platform.',
    category: 'Developer',
    status: 'Connected',
    icon: 'API',
    color: 'bg-slate-100 text-slate-700',
    connectedCompanies: 87,
    lastSync: 'Real-time',
    syncFrequency: 'Real-time',
    version: 'v1.4',
    endpoint: 'https://api.corehr.com',
    apiStatus: 'Healthy',
    enabled: true,
    dataSync: [
      'Employees',
      'Companies',
      'Subscriptions',
      'Reports',
    ],
  },

  {
    id: 9,
    name: 'Salesforce',
    description:
      'Synchronize customer, company and CRM information with Salesforce.',
    category: 'CRM',
    status: 'Available',
    icon: 'SF',
    color: 'bg-sky-50 text-sky-600',
    connectedCompanies: 0,
    lastSync: 'Never',
    syncFrequency: 'Every hour',
    version: 'v6.0',
    endpoint: 'https://login.salesforce.com',
    apiStatus: 'Available',
    enabled: false,
    dataSync: [
      'Companies',
      'Contacts',
      'Accounts',
      'Customer activity',
    ],
  },

  {
    id: 10,
    name: 'HubSpot',
    description:
      'Connect HubSpot CRM to synchronize contacts, companies and customer activity.',
    category: 'CRM',
    status: 'Available',
    icon: 'H',
    color: 'bg-orange-50 text-orange-600',
    connectedCompanies: 0,
    lastSync: 'Never',
    syncFrequency: 'Every hour',
    version: 'v5.3',
    endpoint: 'https://api.hubapi.com',
    apiStatus: 'Available',
    enabled: false,
    dataSync: [
      'Contacts',
      'Companies',
      'Deals',
      'Activity',
    ],
  },

  {
    id: 11,
    name: 'PostgreSQL',
    description:
      'Connect external PostgreSQL databases for secure data synchronization.',
    category: 'Database',
    status: 'Connected',
    icon: 'PG',
    color: 'bg-blue-50 text-blue-700',
    connectedCompanies: 12,
    lastSync: '3 minutes ago',
    syncFrequency: 'Every 15 minutes',
    version: 'v15',
    endpoint: 'Private database',
    apiStatus: 'Healthy',
    enabled: true,
    dataSync: [
      'Employee records',
      'Company data',
      'Audit records',
      'Reports',
    ],
  },

  {
    id: 12,
    name: 'Jira',
    description:
      'Connect Jira to manage HR-related tasks, workflows and support issues.',
    category: 'Productivity',
    status: 'Available',
    icon: 'J',
    color: 'bg-blue-50 text-blue-600',
    connectedCompanies: 0,
    lastSync: 'Never',
    syncFrequency: 'Every 30 minutes',
    version: 'v4.0',
    endpoint: 'https://api.atlassian.com',
    apiStatus: 'Available',
    enabled: false,
    dataSync: [
      'Tasks',
      'Issues',
      'Projects',
      'Comments',
    ],
  },

  {
    id: 13,
    name: 'Zoom',
    description:
      'Connect Zoom for employee meetings, events and communication workflows.',
    category: 'Communication',
    status: 'Available',
    icon: 'Z',
    color: 'bg-blue-50 text-blue-600',
    connectedCompanies: 0,
    lastSync: 'Never',
    syncFrequency: 'Every 30 minutes',
    version: 'v2.5',
    endpoint: 'https://api.zoom.us',
    apiStatus: 'Available',
    enabled: false,
    dataSync: [
      'Meetings',
      'Users',
      'Webinars',
      'Attendance',
    ],
  },

  {
    id: 14,
    name: 'ServiceNow',
    description:
      'Connect ServiceNow for enterprise support, incidents and workflow automation.',
    category: 'Enterprise',
    status: 'Available',
    icon: 'SN',
    color: 'bg-green-50 text-green-600',
    connectedCompanies: 0,
    lastSync: 'Never',
    syncFrequency: 'Every hour',
    version: 'v2.0',
    endpoint: 'https://api.servicenow.com',
    apiStatus: 'Available',
    enabled: false,
    dataSync: [
      'Incidents',
      'Requests',
      'Users',
      'Workflows',
    ],
  },
];

/* ============================================================
   CATEGORY LIST
   ============================================================ */

const categories = [
  'All',
  'Communication',
  'Productivity',
  'Payments',
  'Email',
  'CRM',
  'Developer',
  'Database',
  'Enterprise',
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export const IntegrationsView = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);

  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const [search, setSearch] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);

  const [toast, setToast] = useState(null);

  /* ==========================================================
     TOAST
  ========================================================== */

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const matchesSearch =
        integration.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        integration.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        integration.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [integrations, search, selectedCategory]);

  /* ==========================================================
     COUNTS
  ========================================================== */

  const connectedCount = integrations.filter(
    (item) => item.status === 'Connected'
  ).length;

  const availableCount = integrations.filter(
    (item) => item.status === 'Available'
  ).length;

  const errorCount = integrations.filter(
    (item) => item.status === 'Error'
  ).length;

  /* ==========================================================
     UPDATE INTEGRATION
  ========================================================== */

  const updateIntegration = (id, changes) => {
    setIntegrations((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    );

    setSelectedIntegration((current) =>
      current && current.id === id
        ? {
            ...current,
            ...changes,
          }
        : current
    );
  };

  /* ==========================================================
     CONNECT
  ========================================================== */

  const handleConnect = (integration) => {
    updateIntegration(integration.id, {
      status: 'Connected',
      enabled: true,
      apiStatus: 'Healthy',
      connectedCompanies: 1,
      lastSync: 'Just now',
    });

    showToast(`${integration.name} connected successfully.`);

    setSelectedIntegration({
      ...integration,
      status: 'Connected',
      enabled: true,
      apiStatus: 'Healthy',
      connectedCompanies: 1,
      lastSync: 'Just now',
    });
  };

  /* ==========================================================
     DISCONNECT
  ========================================================== */

  const handleDisconnect = (integration) => {
    updateIntegration(integration.id, {
      status: 'Available',
      enabled: false,
      apiStatus: 'Available',
      connectedCompanies: 0,
      lastSync: 'Never',
    });

    showToast(`${integration.name} disconnected.`, 'warning');

    setSelectedIntegration({
      ...integration,
      status: 'Available',
      enabled: false,
      apiStatus: 'Available',
      connectedCompanies: 0,
      lastSync: 'Never',
    });
  };

  /* ==========================================================
     ENABLE / DISABLE
  ========================================================== */

  const handleToggle = (integration) => {
    const newEnabled = !integration.enabled;

    updateIntegration(integration.id, {
      enabled: newEnabled,
    });

    showToast(
      `${integration.name} ${
        newEnabled ? 'enabled' : 'disabled'
      }.`
    );
  };

  /* ==========================================================
     TEST CONNECTION
  ========================================================== */

  const handleTestConnection = (integration) => {
    showToast(`Testing ${integration.name} connection...`);

    setTimeout(() => {
      updateIntegration(integration.id, {
        apiStatus: 'Healthy',
        lastSync: 'Just now',
      });

      showToast(
        `${integration.name} connection is healthy.`
      );
    }, 1200);
  };

  /* ==========================================================
     SYNC NOW
  ========================================================== */

  const handleSync = (integration) => {
    showToast(`Sync started for ${integration.name}...`);

    setTimeout(() => {
      updateIntegration(integration.id, {
        lastSync: 'Just now',
      });

      showToast(
        `${integration.name} synchronization completed.`
      );
    }, 1200);
  };

  /* ==========================================================
     DETAIL PAGE
  ========================================================== */

  if (selectedIntegration) {
    return (
      <>
        <IntegrationDetails
          integration={selectedIntegration}
          onBack={() => setSelectedIntegration(null)}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onToggle={handleToggle}
          onTestConnection={handleTestConnection}
          onSync={handleSync}
          showToast={showToast}
        />

        <Toast toast={toast} />
      </>
    );
  }

  /* ==========================================================
     MAIN PAGE
  ========================================================== */

  return (
    <div className="space-y-6 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Plug className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Integration Center
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage applications, APIs and external services connected to CoreHR.
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Integration
        </button>

      </div>

      {/* ======================================================
          SYSTEM STATUS
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Integration Platform Healthy
              </p>

              <p className="text-xs text-slate-500">
                All connected services are operating normally.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Last platform check: Just now

          </div>

        </div>

      </div>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Integrations"
          value={integrations.length}
          subtitle="Configured services"
          icon={<Plug className="h-5 w-5" />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          title="Connected"
          value={connectedCount}
          subtitle="Currently active"
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Available"
          value={availableCount}
          subtitle="Ready to connect"
          icon={<Cloud className="h-5 w-5" />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          title="API Health"
          value={errorCount > 0 ? 'Attention' : 'Healthy'}
          subtitle={
            errorCount > 0
              ? `${errorCount} integration requires attention`
              : 'All systems operational'
          }
          icon={
            errorCount > 0 ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <Activity className="h-5 w-5" />
            )
          }
          iconClass={
            errorCount > 0
              ? 'bg-amber-50 text-amber-600'
              : 'bg-emerald-50 text-emerald-600'
          }
        />

      </div>

      {/* ======================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

          <div className="relative w-full lg:max-w-md">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {/* Category */}

          <div className="flex items-center gap-2 overflow-x-auto pb-1">

            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />

            {categories.map((category) => (

              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  whitespace-nowrap
                  rounded-lg
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  transition

                  ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

      </div>

      {/* ======================================================
          INTEGRATIONS LIST
      ====================================================== */}

      <div>

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Connected Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an integration to view configuration and activity.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {filteredIntegrations.length} integrations
          </span>

        </div>

        {filteredIntegrations.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">

            <Search className="mx-auto h-8 w-8 text-slate-300" />

            <h3 className="mt-3 font-semibold text-slate-900">
              No integrations found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or category.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredIntegrations.map((integration) => (

              <IntegrationCard
                key={integration.id}
                integration={integration}
                onClick={() =>
                  setSelectedIntegration(integration)
                }
              />

            ))}

          </div>

        )}

      </div>

      {/* ======================================================
          ADD INTEGRATION MODAL
      ====================================================== */}

      {showAddModal && (
        <AddIntegrationModal
          onClose={() => setShowAddModal(false)}
          onAdd={(integration) => {
            setIntegrations((current) => [
              ...current,
              {
                ...integration,
                id: Date.now(),
              },
            ]);

            setShowAddModal(false);

            showToast(
              `${integration.name} added to Integration Center.`
            );
          }}
        />
      )}

      {/* ======================================================
          TOAST
      ====================================================== */}

      <Toast toast={toast} />

    </div>
  );
};

/* ============================================================
   SUMMARY CARD
   ============================================================ */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

/* ============================================================
   INTEGRATION CARD
   ============================================================ */

const IntegrationCard = ({
  integration,
  onClick,
}) => {
  const isConnected = integration.status === 'Connected';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
    >

      {/* Top */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${integration.color}`}
          >
            {integration.icon}
          </div>

          <div>

            <h3 className="font-semibold text-slate-900">
              {integration.name}
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {integration.category}
            </p>

          </div>

        </div>

        <MoreVertical className="h-4 w-4 text-slate-300" />

      </div>

      {/* Description */}

      <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-600">
        {integration.description}
      </p>

      {/* Status */}

      <div className="mt-5 flex items-center justify-between">

        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold

            ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }
          `}
        >

          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected
                ? 'bg-emerald-500'
                : 'bg-slate-400'
            }`}
          />

          {integration.status}

        </span>

        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">

          View Details

          <ChevronRight className="h-3.5 w-3.5" />

        </span>

      </div>

      {/* Bottom */}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">

        <span>
          {integration.connectedCompanies} companies
        </span>

        <span>
          {integration.lastSync}
        </span>

      </div>

    </button>
  );
};

/* ============================================================
   DETAIL PAGE
   ============================================================ */

const IntegrationDetails = ({
  integration,
  onBack,
  onConnect,
  onDisconnect,
  onToggle,
  onTestConnection,
  onSync,
  showToast,
}) => {
  const [activeSection, setActiveSection] =
    useState('overview');

  const [showSecret, setShowSecret] =
    useState(false);

  const [apiKey, setApiKey] =
    useState('sk_live_corehr_****************');

  return (
    <div className="space-y-6 pb-10">

      {/* ======================================================
          DETAIL HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4">

        <button
          onClick={onBack}
          className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Integrations
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${integration.color}`}
              >
                {integration.icon}
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="text-2xl font-bold text-slate-900">
                    {integration.name}
                  </h1>

                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold

                      ${
                        integration.status === 'Connected'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }
                    `}
                  >
                    {integration.status}
                  </span>

                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {integration.description}
                </p>

              </div>

            </div>

            {/* Actions */}

            <div className="flex flex-wrap gap-2">

              {integration.status === 'Connected' ? (
                <>
                  <button
                    onClick={() => onSync(integration)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Sync Now
                  </button>

                  <button
                    onClick={() =>
                      onDisconnect(integration)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <Link2 className="h-4 w-4" />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onConnect(integration)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Plug className="h-4 w-4" />
                  Connect
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex min-w-max border-b border-slate-200">

          {[
            {
              id: 'overview',
              label: 'Overview',
              icon: Activity,
            },
            {
              id: 'configuration',
              label: 'Configuration',
              icon: Settings2,
            },
            {
              id: 'security',
              label: 'Security',
              icon: ShieldCheck,
            },
            {
              id: 'activity',
              label: 'Activity',
              icon: Clock3,
            },
          ].map((tab) => {

            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`
                  flex
                  items-center
                  gap-2
                  border-b-2
                  px-5
                  py-4
                  text-sm
                  font-semibold
                  transition

                  ${
                    activeSection === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }
                `}
              >

                <Icon className="h-4 w-4" />

                {tab.label}

              </button>
            );
          })}

        </div>

      </div>

      {/* ======================================================
          OVERVIEW
      ====================================================== */}

      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Status */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Connection Status
                </h2>

                <p className="text-xs text-slate-400">
                  Current service health
                </p>
              </div>

            </div>

            <div className="mt-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>

              <div>

                <p className="font-semibold text-emerald-700">
                  {integration.apiStatus}
                </p>

                <p className="text-xs text-slate-400">
                  API connection is working
                </p>

              </div>

            </div>

          </div>

          {/* Companies */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Connected Companies
                </h2>

                <p className="text-xs text-slate-400">
                  Tenants using this integration
                </p>
              </div>

            </div>

            <p className="mt-6 text-3xl font-bold text-slate-900">
              {integration.connectedCompanies}
            </p>

          </div>

          {/* Last Sync */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Last Synchronization
                </h2>

                <p className="text-xs text-slate-400">
                  Latest successful sync
                </p>
              </div>

            </div>

            <p className="mt-6 text-lg font-bold text-slate-900">
              {integration.lastSync}
            </p>

          </div>

          {/* Data */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Data Synchronization
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Information exchanged with this service.
                </p>
              </div>

              <Database className="h-5 w-5 text-slate-400" />

            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

              {integration.dataSync.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                >

                  <Check className="h-4 w-4 text-emerald-500" />

                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Quick Actions */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-4 space-y-2">

              <button
                onClick={() =>
                  onTestConnection(integration)
                }
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Zap className="h-4 w-4 text-amber-500" />
                Test Connection
              </button>

              <button
                onClick={() => onSync(integration)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4 text-blue-500" />
                Synchronize Now
              </button>

              <button
                onClick={() => onToggle(integration)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {integration.enabled ? (
                  <>
                    <Pause className="h-4 w-4 text-amber-500" />
                    Disable Integration
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-emerald-500" />
                    Enable Integration
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================
          CONFIGURATION
      ====================================================== */}

      {activeSection === 'configuration' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <Settings2 className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Integration Configuration
                </h2>

                <p className="text-xs text-slate-400">
                  Manage connection parameters.
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-5">

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  API Endpoint
                </label>

                <div className="relative">

                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    defaultValue={integration.endpoint}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  API Key
                </label>

                <div className="relative">

                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type={
                      showSecret
                        ? 'text'
                        : 'password'
                    }
                    value={apiKey}
                    onChange={(e) =>
                      setApiKey(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowSecret(!showSecret)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Synchronization Frequency
                </label>

                <select
                  defaultValue={integration.syncFrequency}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"
                >
                  <option>Real-time</option>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                  <option>Every 6 hours</option>
                  <option>Daily</option>
                </select>

              </div>

              <button
                onClick={() =>
                  showToast(
                    `${integration.name} configuration saved.`
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Check className="h-4 w-4" />
                Save Configuration
              </button>

            </div>

          </div>

          {/* Connection */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Connection
            </h2>

            <div className="mt-5 space-y-4">

              <InfoRow
                label="Version"
                value={integration.version}
              />

              <InfoRow
                label="Status"
                value={integration.status}
              />

              <InfoRow
                label="API Health"
                value={integration.apiStatus}
              />

              <InfoRow
                label="Sync Frequency"
                value={integration.syncFrequency}
              />

            </div>

            <button
              onClick={() =>
                onTestConnection(integration)
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              Test Connection
            </button>

          </div>

        </div>
      )}

      {/* ======================================================
          SECURITY
      ====================================================== */}

      {activeSection === 'security' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Security Status
                </h2>

                <p className="text-xs text-slate-400">
                  Integration security controls
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              <SecurityItem
                title="Encrypted Connection"
                description="TLS encryption enabled"
              />

              <SecurityItem
                title="Credential Protection"
                description="Secrets stored securely"
              />

              <SecurityItem
                title="Access Control"
                description="Role-based access enabled"
              />

              <SecurityItem
                title="Audit Logging"
                description="Integration events are logged"
              />

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Permissions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Data permissions granted to this integration.
            </p>

            <div className="mt-5 space-y-3">

              {[
                'Read employee data',
                'Read company data',
                'Read organization data',
                'Send notifications',
                'Access synchronization events',
              ].map((permission) => (

                <div
                  key={permission}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >

                  <span className="text-sm text-slate-700">
                    {permission}
                  </span>

                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                </div>

              ))}

            </div>

          </div>

        </div>
      )}

      {/* ======================================================
          ACTIVITY
      ====================================================== */}

      {activeSection === 'activity' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Clock3 className="h-5 w-5 text-blue-600" />
              </div>

              <div>

                <h2 className="font-semibold text-slate-900">
                  Integration Activity
                </h2>

                <p className="text-xs text-slate-400">
                  Recent events and synchronization activity.
                </p>

              </div>

            </div>

          </div>

          <div className="divide-y divide-slate-100">

            <ActivityRow
              icon={<CheckCircle2 />}
              title="Synchronization completed"
              description={`${integration.connectedCompanies} companies synchronized successfully.`}
              time="2 minutes ago"
            />

            <ActivityRow
              icon={<ShieldCheck />}
              title="Connection verified"
              description="API authentication check completed successfully."
              time="18 minutes ago"
            />

            <ActivityRow
              icon={<Users />}
              title="Company connection updated"
              description="A tenant integration configuration was updated."
              time="1 hour ago"
            />

            <ActivityRow
              icon={<Settings2 />}
              title="Configuration changed"
              description="Synchronization settings were updated."
              time="3 hours ago"
            />

            <ActivityRow
              icon={<FileCode2 />}
              title="Integration initialized"
              description="Integration service was initialized successfully."
              time="Yesterday"
            />

          </div>

        </div>
      )}

    </div>
  );
};

/* ============================================================
   INFO ROW
   ============================================================ */

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">

      <span className="text-xs font-medium text-slate-400">
        {label}
      </span>

      <span className="text-right text-xs font-semibold text-slate-700">
        {value}
      </span>

    </div>
  );
};

/* ============================================================
   SECURITY ITEM
   ============================================================ */

const SecurityItem = ({
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">

      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>

    </div>
  );
};

/* ============================================================
   ACTIVITY ROW
   ============================================================ */

const ActivityRow = ({
  icon,
  title,
  description,
  time,
}) => {
  return (
    <div className="flex gap-4 p-5">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        {React.cloneElement(icon, {
          className: 'h-4 w-4',
        })}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <span className="text-xs text-slate-400">
            {time}
          </span>

        </div>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
};

/* ============================================================
   ADD INTEGRATION MODAL
   ============================================================ */

const AddIntegrationModal = ({
  onClose,
  onAdd,
}) => {
  const availableIntegrations = [
    {
      name: 'Google Drive',
      category: 'Productivity',
      icon: 'G',
      color: 'bg-red-50 text-red-600',
    },
    {
      name: 'Dropbox',
      category: 'Productivity',
      icon: 'D',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'WhatsApp Business',
      category: 'Communication',
      icon: 'W',
      color: 'bg-green-50 text-green-600',
    },
    {
      name: 'Okta',
      category: 'Identity',
      icon: 'O',
      color: 'bg-slate-100 text-slate-700',
    },
    {
      name: 'Auth0',
      category: 'Identity',
      icon: 'A',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      name: 'SFTP',
      category: 'Developer',
      icon: 'S',
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Add Integration
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select a service to add to your CoreHR platform.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[60vh] overflow-y-auto p-5">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {availableIntegrations.map((integration) => (

              <button
                key={integration.name}
                onClick={() =>
                  onAdd({
                    ...integration,
                    description: `Connect ${integration.name} with CoreHR for centralized enterprise workflows.`,
                    status: 'Available',
                    connectedCompanies: 0,
                    lastSync: 'Never',
                    syncFrequency: 'Every 30 minutes',
                    version: 'v1.0',
                    endpoint: 'Configuration required',
                    apiStatus: 'Available',
                    enabled: false,
                    dataSync: [
                      'Employee data',
                      'Company data',
                      'Events',
                    ],
                  })
                }
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/30"
              >

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${integration.color}`}
                >
                  {integration.icon}
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-semibold text-slate-900">
                    {integration.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {integration.category}
                  </p>

                </div>

                <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />

              </button>

            ))}

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-slate-200 p-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

/* ============================================================
   TOAST
   ============================================================ */

const Toast = ({
  toast,
}) => {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[200]">

      <div
        className={`
          flex
          max-w-sm
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          shadow-2xl

          ${
            toast.type === 'warning'
              ? 'bg-amber-600'
              : 'bg-slate-900'
          }
        `}
      >

        {toast.type === 'warning' ? (
          <AlertCircle className="h-5 w-5" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        )}

        {toast.message}

      </div>

    </div>
  );
};

export default IntegrationsView;

