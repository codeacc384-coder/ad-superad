import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

import {
  Building2,
  Users,
  CreditCard,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ShieldCheck,
  Activity,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  HardDrive,
  Database,
  Mail,
  Server,
  Settings,
  FileText,
  RefreshCw,
  Globe,
  Lock,
  Megaphone,
  BarChart3,
  Download,
  ChevronRight,
  Clock,
  UserCheck
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';


/* =========================================================
   REVENUE DATA
========================================================= */

const revenueData6M = [
  { month: 'Apr', revenue: 138000, companies: 204 },
  { month: 'May', revenue: 149000, companies: 215 },
  { month: 'Jun', revenue: 162000, companies: 228 },
  { month: 'Jul', revenue: 171000, companies: 239 },
  { month: 'Aug', revenue: 184200, companies: 248 },
  { month: 'Sep', revenue: 198000, companies: 260 }
];

const revenueData1Y = [
  { month: 'Oct 25', revenue: 98000, companies: 150 },
  { month: 'Dec 25', revenue: 112000, companies: 172 },
  { month: 'Feb 26', revenue: 125000, companies: 188 },
  { month: 'Apr 26', revenue: 138000, companies: 204 },
  { month: 'Jun 26', revenue: 162000, companies: 228 },
  { month: 'Aug 26', revenue: 184200, companies: 248 }
];


/* =========================================================
   DASHBOARD
========================================================= */

export const DashboardView: React.FC = () => {
  const {
    companies,
    plans,
    invoices,
    auditLogs,
    setActiveTab,
    setCompanyFilterStatus,
    viewCompanyProfile,
    startImpersonation,
    setAddCompanyOpen
  } = useApp();

  const [timeRange, setTimeRange] = useState<'6M' | '1Y'>('6M');
  const [recentSearch, setRecentSearch] = useState('');
  const [activityLimit, setActivityLimit] = useState(5);


  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalCompaniesCount = companies.length;

  const activeCompaniesCount = companies.filter(
    c => c.status === 'Active'
  ).length;

  const totalEmployees = companies.reduce(
    (acc, c) => acc + c.employeesCount,
    0
  );

  const totalMRR = companies.reduce(
    (acc, c) =>
      acc + (c.status === 'Active' ? c.monthlyPrice : 0),
    0
  );

  const activeSubscriptions = companies.filter(
    c => c.plan !== 'Free'
  ).length;

  const activePercentage =
    totalCompaniesCount > 0
      ? Math.round(
          (activeCompaniesCount / totalCompaniesCount) * 100
        )
      : 0;


  /* =========================================================
     PLAN DISTRIBUTION
  ========================================================= */

  const planDistribution = plans.map(p => {
    const count = companies.filter(
      c => c.plan === p.tier
    ).length;

    const colors: Record<string, string> = {
      Enterprise: '#4F46E5',
      Professional: '#06B6D4',
      Starter: '#10B981',
      Free: '#94A3B8'
    };

    return {
      name: p.name,
      value: count || 1,
      color: colors[p.tier] || '#6366F1'
    };
  });


  /* =========================================================
     RECENT COMPANIES
  ========================================================= */

  const recentCompanies = companies
    .filter(
      c =>
        c.name
          .toLowerCase()
          .includes(recentSearch.toLowerCase()) ||
        c.tenantId
          .toLowerCase()
          .includes(recentSearch.toLowerCase())
    )
    .slice(0, 6);


  /* =========================================================
     DASHBOARD DATA
  ========================================================= */

  const systemServices = [
    {
      name: 'Application Server',
      status: 'Operational',
      value: '99.99%',
      icon: Server,
      color: 'emerald'
    },
    {
      name: 'Database',
      status: 'Operational',
      value: '99.98%',
      icon: Database,
      color: 'blue'
    },
    {
      name: 'API Services',
      status: 'Operational',
      value: '8 / 8',
      icon: Globe,
      color: 'purple'
    },
    {
      name: 'Storage',
      status: 'Healthy',
      value: '68%',
      icon: HardDrive,
      color: 'amber'
    }
  ];


  /* =========================================================
     QUICK ACTIONS
  ========================================================= */

  const quickActions = [
    {
      title: 'Add Company',
      description: 'Create new tenant',
      icon: Plus,
      action: () => setAddCompanyOpen(true),
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50'
    },
    {
      title: 'Manage Companies',
      description: 'View all tenants',
      icon: Building2,
      action: () => {
        setCompanyFilterStatus(null);
        setActiveTab('companies');
      },
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-50'
    },
    {
      title: 'Manage Users',
      description: 'Manage employees',
      icon: Users,
      action: () => setActiveTab('users'),
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      hover: 'hover:bg-sky-50'
    },
    {
      title: 'Billing',
      description: 'Invoices & payments',
      icon: CreditCard,
      action: () => setActiveTab('billing'),
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      hover: 'hover:bg-emerald-50'
    },
    {
      title: 'Analytics',
      description: 'View reports',
      icon: BarChart3,
      action: () => setActiveTab('analytics'),
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-50'
    },
    {
      title: 'Audit Logs',
      description: 'Review activities',
      icon: ShieldCheck,
      action: () => setActiveTab('audit'),
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      hover: 'hover:bg-amber-50'
    }
  ];


  /* =========================================================
     ADMIN MODULES
  ========================================================= */

  const adminModules = [
    {
      title: 'System Health',
      description: 'Monitor servers and services',
      icon: Activity,
      tab: 'system-health',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Backup & Recovery',
      description: 'Manage backups and restore points',
      icon: RefreshCw,
      tab: 'backup',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Data Management',
      description: 'Manage platform data',
      icon: Database,
      tab: 'data-management',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      title: 'Email & Communication',
      description: 'Manage system communications',
      icon: Mail,
      tab: 'communication',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    },
    {
      title: 'API & Integrations',
      description: 'Manage external integrations',
      icon: Globe,
      tab: 'integrations',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Compliance Center',
      description: 'Security and compliance',
      icon: Lock,
      tab: 'compliance',
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    {
      title: 'Announcements',
      description: 'Publish system announcements',
      icon: Megaphone,
      tab: 'announcements',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Compliance Reports',
      description: 'Generate administrative reports',
      icon: FileText,
      tab: 'compliance-reports',
      color: 'text-slate-600',
      bg: 'bg-slate-100'
    }
  ];


  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* =====================================================
          1. TOP COMMAND CONSOLE
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-[#131B2E] via-[#1E293B] to-[#131B2E] text-white p-6 rounded-2xl shadow-lg border border-slate-700/50">

        <div className="space-y-2">

          <div className="flex flex-wrap items-center gap-3">

            <span className="text-xs bg-indigo-500/30 text-indigo-300 font-semibold px-2.5 py-1 rounded-full border border-indigo-400/30">
              Live Production Cluster
            </span>

            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All 8 Core Services Nominal
            </span>

          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Super Administrator Command Console
          </h2>

          <p className="text-xs text-slate-300 max-w-3xl">
            Managing{' '}
            <span className="font-semibold text-white">
              {totalCompaniesCount} tenant organizations
            </span>{' '}
            and{' '}
            <span className="font-semibold text-white">
              {totalEmployees.toLocaleString()} employee seats
            </span>{' '}
            across global regions.
          </p>

        </div>

        <div className="flex items-center gap-3 shrink-0">

          <button
            onClick={() => setActiveTab('analytics')}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg border border-white/10 transition-all flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-300" />
            Analytics Drilldown
          </button>

          <button
            onClick={() => setAddCompanyOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Provision Tenant
          </button>

        </div>
      </div>


      {/* =====================================================
          2. QUICK ACTIONS
      ===================================================== */}

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Quick Actions
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Frequently used super administrator operations
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

          {quickActions.map((action) => {

            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={action.action}
                className={`group p-4 rounded-xl border border-slate-200 bg-slate-50 ${action.hover} hover:border-slate-300 transition-all text-left`}
              >

                <div
                  className={`w-9 h-9 rounded-lg ${action.bg} ${action.text} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <p className="text-xs font-bold text-slate-900">
                  {action.title}
                </p>

                <p className="text-[10px] text-slate-500 mt-1">
                  {action.description}
                </p>

              </button>
            );
          })}

        </div>
      </div>


      {/* =====================================================
          3. KPI CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Companies */}

        <div
          onClick={() => {
            setCompanyFilterStatus(null);
            setActiveTab('companies');
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Total Companies
            </span>

            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>

          </div>

          <div className="mt-3 flex items-baseline gap-2">

            <span className="text-2xl font-black text-slate-900">
              {totalCompaniesCount}
            </span>

            <span className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +12%
            </span>

          </div>

          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            <span className="text-slate-700 font-semibold">
              {activeCompaniesCount} Active
            </span>{' '}
            • {activePercentage}% operational
          </p>

        </div>


        {/* Employees */}

        <div
          onClick={() => setActiveTab('users')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Active Employees
            </span>

            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>

          </div>

          <div className="mt-3 flex items-baseline gap-2">

            <span className="text-2xl font-black text-slate-900">
              {totalEmployees.toLocaleString()}
            </span>

            <span className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8.4%
            </span>

          </div>

          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Employee seats across all tenants
          </p>

        </div>


        {/* Revenue */}

        <div
          onClick={() => setActiveTab('billing')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Monthly Revenue
            </span>

            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>

          </div>

          <div className="mt-3 flex items-baseline gap-2">

            <span className="text-2xl font-black text-slate-900">
              ${totalMRR.toLocaleString()}
            </span>

            <span className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.2%
            </span>

          </div>

          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            ARR Run-Rate:{' '}
            <span className="font-semibold text-slate-700">
              ${(totalMRR * 12).toLocaleString()}
            </span>
          </p>

        </div>


        {/* Subscriptions */}

        <div
          onClick={() => setActiveTab('subscriptions')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Active Subscriptions
            </span>

            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>

          </div>

          <div className="mt-3 flex items-baseline gap-2">

            <span className="text-2xl font-black text-slate-900">
              {activeSubscriptions}
            </span>

            <span className="flex items-center text-xs font-bold text-indigo-600">
              99.2%
            </span>

          </div>

          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Retention rate with 0.8% net churn
          </p>

        </div>

      </div>


      {/* =====================================================
          4. SYSTEM OVERVIEW
      ===================================================== */}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              System Overview
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Real-time infrastructure and platform health
            </p>
          </div>

          <button
            onClick={() => setActiveTab('system-health')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Full Monitoring
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {systemServices.map(service => {

            const Icon = service.icon;

            return (
              <div
                key={service.name}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70"
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {service.name}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-medium text-emerald-600">
                          {service.status}
                        </span>
                      </div>
                    </div>

                  </div>

                  <span className="text-sm font-black text-slate-900">
                    {service.value}
                  </span>

                </div>

              </div>
            );
          })}

        </div>
      </div>


      {/* =====================================================
          5. REVENUE + SUBSCRIPTION CHARTS
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue */}

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Revenue Growth & Expansion
              </h3>

              <p className="text-xs text-slate-500">
                Platform billing metrics over active fiscal period
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">

              <button
                onClick={() => setTimeRange('6M')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeRange === '6M'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6 Months
              </button>

              <button
                onClick={() => setTimeRange('1Y')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeRange === '1Y'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1 Year
              </button>

            </div>

          </div>


          <div className="h-64 pt-4 w-full">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={
                  timeRange === '6M'
                    ? revenueData6M
                    : revenueData1Y
                }
              >

                <defs>

                  <linearGradient
                    id="colorRev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />

                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                />

                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    `$${val / 1000}k`
                  }
                />

                <Tooltip
                  content={({ active, payload, label }) => {

                    if (
                      active &&
                      payload &&
                      payload.length
                    ) {

                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">

                          <p className="font-bold text-slate-300">
                            {label}
                          </p>

                          <p className="text-indigo-400 font-extrabold text-sm mt-1">
                            $
                            {Number(
                              payload[0].value
                            ).toLocaleString()}{' '}
                            Revenue
                          </p>

                          <p className="text-[11px] text-slate-400">
                            {payload[0].payload.companies}{' '}
                            active clients
                          </p>

                        </div>
                      );
                    }

                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>
        </div>


        {/* Subscription Distribution */}

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">

          <div className="pb-3 border-b border-slate-100">

            <h3 className="text-sm font-bold text-slate-900">
              Subscription Tiers
            </h3>

            <p className="text-xs text-slate-500">
              Tenant volume distribution
            </p>

          </div>


          <div className="flex-1 flex flex-col justify-center items-center relative min-h-[190px]">

            <ResponsiveContainer width="100%" height={180}>

              <PieChart>

                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >

                  {planDistribution.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} Tenants`,
                    name
                  ]}
                />

              </PieChart>

            </ResponsiveContainer>


            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

              <span className="text-lg font-black text-slate-900">
                {totalCompaniesCount}
              </span>

              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Tenants
              </span>

            </div>

          </div>


          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">

            {planDistribution.map(p => (

              <div
                key={p.name}
                className="flex items-center gap-2"
              >

                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: p.color
                  }}
                />

                <span className="text-xs font-semibold text-slate-700 truncate">
                  {p.name}
                </span>

                <span className="text-xs text-slate-400 ml-auto font-medium">
                  {p.value}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* =====================================================
          6. BACKUP / DATA / COMMUNICATION STATUS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Backup */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Backup & Recovery
                </h3>

                <p className="text-[11px] text-slate-500">
                  Infrastructure backups
                </p>
              </div>

            </div>

            <span className="px-2 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">
              Healthy
            </span>

          </div>

          <div className="mt-5">

            <div className="flex justify-between mb-2">

              <span className="text-[11px] text-slate-500">
                Latest backup
              </span>

              <span className="text-[11px] font-bold text-slate-700">
                Today, 03:00 AM
              </span>

            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
            </div>

            <p className="text-[10px] text-slate-400 mt-2">
              92% backup health score
            </p>

          </div>

          <button
            onClick={() => setActiveTab('backup')}
            className="w-full mt-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
          >
            Manage Backups
          </button>

        </div>


        {/* Data Management */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Management
              </h3>

              <p className="text-[11px] text-slate-500">
                Platform data overview
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">

            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-[10px] text-slate-500">
                Database
              </p>

              <p className="text-sm font-black text-slate-900 mt-1">
                1.8 TB
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-[10px] text-slate-500">
                Records
              </p>

              <p className="text-sm font-black text-slate-900 mt-1">
                4.2M
              </p>
            </div>

          </div>

          <button
            onClick={() => setActiveTab('data-management')}
            className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
          >
            Manage Data
          </button>

        </div>


        {/* Communication */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Email & Communication
              </h3>

              <p className="text-[11px] text-slate-500">
                System communication status
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            <div className="flex items-center justify-between">

              <span className="text-xs text-slate-600">
                Delivery Rate
              </span>

              <span className="text-xs font-bold text-emerald-600">
                99.7%
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-xs text-slate-600">
                Emails Today
              </span>

              <span className="text-xs font-bold text-slate-900">
                12,482
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-xs text-slate-600">
                Failed
              </span>

              <span className="text-xs font-bold text-rose-600">
                14
              </span>

            </div>

          </div>

          <button
            onClick={() => setActiveTab('communication')}
            className="w-full mt-4 py-2 text-xs font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-lg"
          >
            Communication Center
          </button>

        </div>

      </div>


      {/* =====================================================
          7. RECENT COMPANIES
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">

          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                Recent Companies
              </h3>

              <p className="text-xs text-slate-500">
                Newly registered and configured tenant workspaces
              </p>

            </div>

            <div className="flex items-center gap-2">

              <div className="relative">

                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  placeholder="Filter table..."
                  value={recentSearch}
                  onChange={e =>
                    setRecentSearch(e.target.value)
                  }
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 w-44"
                />

              </div>

              <button
                onClick={() => setActiveTab('companies')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 shrink-0"
              >
                View All ({companies.length}) →
              </button>

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider">

                  <th className="py-3 px-4">
                    Company
                  </th>

                  <th className="py-3 px-4">
                    Plan
                  </th>

                  <th className="py-3 px-4">
                    Employees
                  </th>

                  <th className="py-3 px-4">
                    Status
                  </th>

                  <th className="py-3 px-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100 text-xs">

                {recentCompanies.map(c => (

                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() =>
                      viewCompanyProfile(c.id)
                    }
                  >

                    <td className="py-3 px-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`w-8 h-8 rounded-lg ${c.logoBgColor} ${c.logoTextColor} flex items-center justify-center font-bold text-xs shrink-0`}
                        >
                          {c.logoText}
                        </div>

                        <div>

                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {c.name}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            {c.tenantId} • {c.country}
                          </p>

                        </div>

                      </div>

                    </td>


                    <td className="py-3 px-4">

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.plan === 'Enterprise'
                            ? 'bg-purple-100 text-purple-700'
                            : c.plan === 'Professional'
                            ? 'bg-cyan-100 text-cyan-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {c.plan}
                      </span>

                    </td>


                    <td className="py-3 px-4 text-slate-600 font-medium">

                      {c.employeesCount.toLocaleString()} /{' '}
                      {c.quotaEmployees}

                    </td>


                    <td className="py-3 px-4">

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          c.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : c.status === 'Suspended'
                            ? 'bg-rose-100 text-rose-700'
                            : c.status === 'Trial'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >

                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Active'
                              ? 'bg-emerald-500'
                              : c.status === 'Suspended'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />

                        {c.status}

                      </span>

                    </td>


                    <td
                      className="py-3 px-4 text-right space-x-1"
                      onClick={e =>
                        e.stopPropagation()
                      }
                    >

                      <button
                        onClick={() =>
                          viewCompanyProfile(c.id)
                        }
                        className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() =>
                          startImpersonation(c.id)
                        }
                        className="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md"
                      >
                        Impersonate
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* =====================================================
            PLATFORM ACTIVITY
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col p-5">

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                Platform Activity
              </h3>

              <p className="text-xs text-slate-500">
                Live operational and billing events
              </p>

            </div>

            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Full Stream
            </button>

          </div>


          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[340px]">

            {auditLogs
              .slice(0, activityLimit)
              .map(log => (

                <div
                  key={log.id}
                  className="py-3 flex items-start gap-3"
                >

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      log.status === 'Success'
                        ? 'bg-emerald-100 text-emerald-600'
                        : log.status === 'Warning'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >

                    {log.status === 'Success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : log.status === 'Warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}

                  </div>


                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between gap-2">

                      <p className="font-bold text-xs text-slate-900 truncate">
                        {log.action}
                      </p>

                      <span className="text-[10px] text-slate-400 shrink-0">
                        {log.timestamp}
                      </span>

                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                      {log.details}
                    </p>

                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      Actor:{' '}
                      <span className="text-slate-600">
                        {log.actor.name}
                      </span>{' '}
                      • {log.companyName}
                    </p>

                  </div>

                </div>

              ))}

          </div>


          {auditLogs.length > activityLimit && (

            <button
              onClick={() =>
                setActivityLimit(
                  prev => prev + 5
                )
              }
              className="w-full mt-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Load More Activity
            </button>

          )}

        </div>

      </div>


      {/* =====================================================
          8. ADMIN MODULES
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h3 className="text-sm font-bold text-slate-900">
              Administration Modules
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Access important super administrator management areas
            </p>

          </div>

          <Settings className="w-5 h-5 text-slate-400" />

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {adminModules.map(module => {

            const Icon = module.icon;

            return (
              <button
                key={module.title}
                onClick={() =>
                  setActiveTab(module.tab)
                }
                className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all text-left"
              >

                <div
                  className={`w-10 h-10 rounded-xl ${module.bg} ${module.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-xs font-bold text-slate-900">
                    {module.title}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1 truncate">
                    {module.description}
                  </p>

                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0" />

              </button>
            );

          })}

        </div>

      </div>


      {/* =====================================================
          9. SECURITY / COMPLIANCE SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs font-semibold text-indigo-200">
                Security Status
              </p>

              <p className="text-lg font-black">
                Protected
              </p>

            </div>

          </div>

          <p className="text-[11px] text-indigo-100 mt-4">
            No critical security issues detected across the platform.
          </p>

          <button
            onClick={() => setActiveTab('compliance')}
            className="mt-4 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold"
          >
            Open Compliance Center
          </button>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs font-semibold text-slate-500">
                User Access
              </p>

              <p className="text-lg font-black text-slate-900">
                Normal
              </p>

            </div>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <span className="text-xs text-slate-500">
              Active sessions
            </span>

            <span className="text-xs font-bold text-slate-900">
              184
            </span>

          </div>

          <div className="mt-2 flex items-center justify-between">

            <span className="text-xs text-slate-500">
              Failed attempts
            </span>

            <span className="text-xs font-bold text-emerald-600">
              3
            </span>

          </div>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs font-semibold text-slate-500">
                System Announcements
              </p>

              <p className="text-lg font-black text-slate-900">
                3 Active
              </p>

            </div>

          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            Important platform notifications and administrator announcements.
          </p>

          <button
            onClick={() =>
              setActiveTab('announcements')
            }
            className="mt-4 text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            Manage Announcements →
          </button>

        </div>

      </div>


      {/* =====================================================
          10. FOOTER STATUS
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 pb-4">

        <div className="flex items-center gap-2">

          <span className="w-2 h-2 rounded-full bg-emerald-500" />

          <span className="text-[11px] font-medium text-slate-500">
            Platform operating normally
          </span>

        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">

          <span>
            Last updated: Just now
          </span>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="flex items-center gap-1 font-semibold text-slate-500 hover:text-indigo-600"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>

        </div>

      </div>

    </div>
  );
};
