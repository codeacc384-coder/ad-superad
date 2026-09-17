import React, { useMemo, useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Filter,
  Search,
  Eye,
  FileText,
  Users,
  CreditCard,
  Building2,
  Activity,
  Clock,
  CheckCircle2,
  Plus,
  X,
  RefreshCw,
  MoreHorizontal,
  Star,
  StarOff,
  Settings2,
  BarChart3,
  ShieldCheck,
  Database,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  Play,
} from 'lucide-react';

interface Report {
  id: number;
  name: string;
  category: string;
  description: string;
  format: string;
  lastGenerated: string;
  status: 'Ready' | 'Scheduled' | 'Generating';
  owner: string;
  schedule: string;
  favorite: boolean;
  records: string;
}

interface CustomReportForm {
  name: string;
  category: string;
  format: string;
  schedule: string;
  description: string;
}

export const ReportsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      name: 'Tenant Activity Report',
      category: 'Tenants',
      description:
        'Detailed report of tenant activity, status, usage and engagement.',
      format: 'PDF',
      lastGenerated: 'Today, 10:30 AM',
      status: 'Ready',
      owner: 'Super Admin',
      schedule: 'Daily',
      favorite: true,
      records: '245',
    },
    {
      id: 2,
      name: 'User Activity Report',
      category: 'Users',
      description:
        'Platform user login, activity and account status information.',
      format: 'Excel',
      lastGenerated: 'Today, 09:15 AM',
      status: 'Ready',
      owner: 'Platform Admin',
      schedule: 'Weekly',
      favorite: true,
      records: '1,842',
    },
    {
      id: 3,
      name: 'Revenue & Billing Report',
      category: 'Finance',
      description:
        'Revenue, invoices, payments and billing performance overview.',
      format: 'Excel',
      lastGenerated: 'Yesterday, 04:20 PM',
      status: 'Ready',
      owner: 'Finance Admin',
      schedule: 'Monthly',
      favorite: false,
      records: '3,420',
    },
    {
      id: 4,
      name: 'Subscription Report',
      category: 'Subscriptions',
      description:
        'Subscription plans, upgrades, renewals and cancellations.',
      format: 'PDF',
      lastGenerated: 'Yesterday, 02:45 PM',
      status: 'Ready',
      owner: 'Finance Admin',
      schedule: 'Weekly',
      favorite: false,
      records: '842',
    },
    {
      id: 5,
      name: 'System Health Report',
      category: 'Operations',
      description:
        'Platform uptime, service health, incidents and performance.',
      format: 'PDF',
      lastGenerated: 'Today, 08:00 AM',
      status: 'Ready',
      owner: 'Security Admin',
      schedule: 'Daily',
      favorite: true,
      records: '128',
    },
    {
      id: 6,
      name: 'Audit & Compliance Report',
      category: 'Security',
      description:
        'Administrative actions, security events and compliance activity.',
      format: 'CSV',
      lastGenerated: 'Aug 31, 2026',
      status: 'Scheduled',
      owner: 'Security Admin',
      schedule: 'Monthly',
      favorite: false,
      records: '8,642',
    },
    {
      id: 7,
      name: 'Company Growth Report',
      category: 'Tenants',
      description:
        'New companies, growth rate, active tenants and churn analysis.',
      format: 'Excel',
      lastGenerated: 'Aug 30, 2026',
      status: 'Ready',
      owner: 'Super Admin',
      schedule: 'Monthly',
      favorite: true,
      records: '245',
    },
    {
      id: 8,
      name: 'Login & Authentication Report',
      category: 'Security',
      description:
        'Login attempts, failed authentication, MFA and suspicious activity.',
      format: 'CSV',
      lastGenerated: 'Today, 07:45 AM',
      status: 'Ready',
      owner: 'Security Admin',
      schedule: 'Daily',
      favorite: false,
      records: '12,481',
    },
    {
      id: 9,
      name: 'Payment Transaction Report',
      category: 'Finance',
      description:
        'Successful, failed, refunded and pending payment transactions.',
      format: 'Excel',
      lastGenerated: 'Today, 06:30 AM',
      status: 'Ready',
      owner: 'Finance Admin',
      schedule: 'Daily',
      favorite: false,
      records: '5,284',
    },
    {
      id: 10,
      name: 'Platform Performance Report',
      category: 'Operations',
      description:
        'API response time, uptime, service availability and incidents.',
      format: 'PDF',
      lastGenerated: 'Today, 05:00 AM',
      status: 'Ready',
      owner: 'Platform Admin',
      schedule: 'Daily',
      favorite: true,
      records: '964',
    },
  ]);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [customReport, setCustomReport] = useState<CustomReportForm>({
    name: '',
    category: 'Tenants',
    format: 'PDF',
    schedule: 'One Time',
    description: '',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ============================================================
     FILTER REPORTS
  ============================================================ */

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'All' || report.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [reports, search, category]);

  /* ============================================================
     CATEGORY COUNTS
  ============================================================ */

  const categoryCount = (name: string) => {
    return reports.filter((report) => report.category === name).length;
  };

  /* ============================================================
     VIEW REPORT
  ============================================================ */

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  /* ============================================================
     GENERATE REPORT
  ============================================================ */

  const handleGenerate = (report: Report) => {
    setReports((prev) =>
      prev.map((item) =>
        item.id === report.id
          ? {
              ...item,
              status: 'Generating',
              lastGenerated: 'Generating now...',
            }
          : item
      )
    );

    setTimeout(() => {
      setReports((prev) =>
        prev.map((item) =>
          item.id === report.id
            ? {
                ...item,
                status: 'Ready',
                lastGenerated: 'Just now',
              }
            : item
        )
      );
    }, 1500);
  };

  /* ============================================================
     CUSTOM REPORT
  ============================================================ */

  const handleCreateCustomReport = () => {
    if (!customReport.name.trim()) {
      alert('Please enter a report name.');
      return;
    }

    const newReport: Report = {
      id: Date.now(),
      name: customReport.name,
      category: customReport.category,
      description:
        customReport.description ||
        'Custom report created by Super Admin.',
      format: customReport.format,
      lastGenerated:
        customReport.schedule === 'One Time'
          ? 'Just now'
          : 'Not generated yet',
      status:
        customReport.schedule === 'One Time'
          ? 'Generating'
          : 'Scheduled',
      owner: 'Super Admin',
      schedule: customReport.schedule,
      favorite: false,
      records: '0',
    };

    setReports((prev) => [newReport, ...prev]);

    setShowGenerateModal(false);

    setCustomReport({
      name: '',
      category: 'Tenants',
      format: 'PDF',
      schedule: 'One Time',
      description: '',
    });

    if (newReport.status === 'Generating') {
      setTimeout(() => {
        setReports((prev) =>
          prev.map((item) =>
            item.id === newReport.id
              ? {
                  ...item,
                  status: 'Ready',
                  lastGenerated: 'Just now',
                  records: '245',
                }
              : item
          )
        );
      }, 1500);
    }
  };

  /* ============================================================
     DOWNLOAD
  ============================================================ */

  const handleDownload = (report: Report) => {
    const content = [
      'REPORT EXPORT',
      '==============================',
      `Report Name: ${report.name}`,
      `Category: ${report.category}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Owner: ${report.owner}`,
      `Records: ${report.records}`,
      '',
      'Summary',
      report.description,
      '',
      'Status: Successful',
    ].join('\n');

    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `${report.name
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()}.${report.format.toLowerCase() === 'csv' ? 'csv' : 'txt'}`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* ============================================================
     FAVORITE
  ============================================================ */

  const toggleFavorite = (id: number) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              favorite: !report.favorite,
            }
          : report
      )
    );
  };

  /* ============================================================
     REFRESH
  ============================================================ */

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  /* ============================================================
     SCHEDULE
  ============================================================ */

  const openSchedule = (report: Report) => {
    setSelectedReport(report);
    setShowScheduleModal(true);
  };

  /* ============================================================
     CATEGORY CLICK
  ============================================================ */

  const handleCategoryClick = (value: string) => {
    setCategory(value);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
              <FileBarChart className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Reports & Reporting Center
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Generate, analyze, schedule and export platform reports.
              </p>
            </div>

          </div>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </button>

        </div>

      </div>

      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <SummaryCard
          title="Total Reports"
          value={reports.length.toString()}
          subtitle="+4 this month"
          icon={<FileText className="h-5 w-5" />}
        />

        <SummaryCard
          title="Generated Today"
          value="18"
          subtitle="Across all categories"
          icon={<Activity className="h-5 w-5" />}
        />

        <SummaryCard
          title="Scheduled"
          value="6"
          subtitle="Next run within 24h"
          icon={<Clock className="h-5 w-5" />}
        />

        <SummaryCard
          title="Successful Exports"
          value="98.7%"
          subtitle="Last 30 days"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <SummaryCard
          title="Data Records"
          value="42.8K"
          subtitle="Across all reports"
          icon={<Database className="h-5 w-5" />}
        />

      </div>

      {/* ========================================================
          REPORT CATEGORIES
      ======================================================== */}

      <div>

        <div className="mb-3 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Report Categories
            </h2>

            <p className="text-sm text-slate-500">
              Select a category to view related reports.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

          <CategoryCard
            icon={<Building2 className="h-5 w-5" />}
            title="Tenants"
            count={`${categoryCount('Tenants')} Reports`}
            active={category === 'Tenants'}
            onClick={() => handleCategoryClick('Tenants')}
          />

          <CategoryCard
            icon={<Users className="h-5 w-5" />}
            title="Users"
            count={`${categoryCount('Users')} Reports`}
            active={category === 'Users'}
            onClick={() => handleCategoryClick('Users')}
          />

          <CategoryCard
            icon={<CreditCard className="h-5 w-5" />}
            title="Finance"
            count={`${categoryCount('Finance')} Reports`}
            active={category === 'Finance'}
            onClick={() => handleCategoryClick('Finance')}
          />

          <CategoryCard
            icon={<FileBarChart className="h-5 w-5" />}
            title="Subscriptions"
            count={`${categoryCount('Subscriptions')} Reports`}
            active={category === 'Subscriptions'}
            onClick={() => handleCategoryClick('Subscriptions')}
          />

          <CategoryCard
            icon={<Activity className="h-5 w-5" />}
            title="Operations"
            count={`${categoryCount('Operations')} Reports`}
            active={category === 'Operations'}
            onClick={() => handleCategoryClick('Operations')}
          />

          <CategoryCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Security"
            count={`${categoryCount('Security')} Reports`}
            active={category === 'Security'}
            onClick={() => handleCategoryClick('Security')}
          />

        </div>

      </div>

      {/* ========================================================
          QUICK INSIGHTS
      ======================================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        <InsightCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Revenue Growth"
          value="+18.4%"
          description="Compared with previous month"
        />

        <InsightCard
          icon={<BarChart3 className="h-5 w-5" />}
          title="Report Usage"
          value="2,481"
          description="Reports generated this month"
        />

        <InsightCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Failed Exports"
          value="12"
          description="Requires administrator attention"
        />

      </div>

      {/* ========================================================
          FILTER BAR
      ======================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search reports, categories or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          <div className="flex items-center gap-2">

            <Filter className="h-4 w-4 text-slate-400" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Tenants">Tenants</option>
              <option value="Users">Users</option>
              <option value="Finance">Finance</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Operations">Operations</option>
              <option value="Security">Security</option>
            </select>

          </div>

          <div className="flex items-center gap-2">

            <Calendar className="h-4 w-4 text-slate-400" />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>

          </div>

          <button
            type="button"
            onClick={() => setCategory('All')}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear Filters
          </button>

        </div>

      </div>

      {/* ========================================================
          REPORT TABLE
      ======================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Available Reports
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View, generate, schedule and export platform reports.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {filteredReports.length} Reports
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {reports.filter((r) => r.status === 'Ready').length} Ready
              </span>

            </div>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Report
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Format
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Records
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Last Generated
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReports.map((report) => (

                <tr
                  key={report.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() => toggleFavorite(report.id)}
                        className="text-slate-400 hover:text-amber-500"
                        title="Favorite"
                      >
                        {report.favorite ? (
                          <Star className="h-4 w-4 fill-current text-amber-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          {report.name}
                        </p>

                        <p className="mt-1 max-w-md text-xs text-slate-500">
                          {report.description}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Owner: {report.owner}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-6 py-5">

                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {report.category}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <span className="text-sm font-semibold text-slate-700">
                      {report.format}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <span className="text-sm font-medium text-slate-700">
                      {report.records}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <p className="text-sm text-slate-600">
                      {report.lastGenerated}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {report.schedule}
                    </p>

                  </td>

                  <td className="px-6 py-5">

                    <StatusBadge status={report.status} />

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex items-center justify-end gap-2">

                      <button
                        type="button"
                        onClick={() => handleView(report)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        title="View Report"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGenerate(report)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                        title="Generate"
                      >
                        <Play className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(report)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openSchedule(report)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-purple-600"
                        title="Schedule"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                        title="More"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredReports.length === 0 && (

            <div className="px-6 py-16 text-center">

              <FileBarChart className="mx-auto h-12 w-12 text-slate-300" />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                No reports found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ========================================================
          FAVORITE REPORTS
      ======================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Favorite Reports
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Frequently used reports for quick access.
            </p>

          </div>

          <Star className="h-5 w-5 text-amber-400" />

        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

          {reports
            .filter((report) => report.favorite)
            .map((report) => (

              <button
                key={report.id}
                type="button"
                onClick={() => handleView(report)}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/30"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {report.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {report.category} · {report.format}
                    </p>

                  </div>

                </div>

              </button>

            ))}

        </div>

      </div>

      {/* ========================================================
          CUSTOM REPORT MODAL
      ======================================================== */}

      {showGenerateModal && (

        <Modal
          title="Generate Custom Report"
          subtitle="Create a new report using your preferred configuration."
          onClose={() => setShowGenerateModal(false)}
        >

          <div className="space-y-5">

            <FormInput
              label="Report Name"
              value={customReport.name}
              placeholder="Example: Monthly Tenant Performance"
              onChange={(value) =>
                setCustomReport((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <FormSelect
                label="Category"
                value={customReport.category}
                options={[
                  'Tenants',
                  'Users',
                  'Finance',
                  'Subscriptions',
                  'Operations',
                  'Security',
                ]}
                onChange={(value) =>
                  setCustomReport((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
              />

              <FormSelect
                label="Export Format"
                value={customReport.format}
                options={['PDF', 'Excel', 'CSV']}
                onChange={(value) =>
                  setCustomReport((prev) => ({
                    ...prev,
                    format: value,
                  }))
                }
              />

            </div>

            <FormSelect
              label="Schedule"
              value={customReport.schedule}
              options={[
                'One Time',
                'Daily',
                'Weekly',
                'Monthly',
              ]}
              onChange={(value) =>
                setCustomReport((prev) => ({
                  ...prev,
                  schedule: value,
                }))
              }
            />

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                value={customReport.description}
                onChange={(e) =>
                  setCustomReport((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Describe what this report should contain..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateCustomReport}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Generate Report
              </button>

            </div>

          </div>

        </Modal>

      )}

      {/* ========================================================
          REPORT PREVIEW MODAL
      ======================================================== */}

      {showPreviewModal && selectedReport && (

        <Modal
          title={selectedReport.name}
          subtitle="Report preview and information"
          onClose={() => setShowPreviewModal(false)}
        >

          <div className="space-y-5">

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              <PreviewStat
                title="Category"
                value={selectedReport.category}
              />

              <PreviewStat
                title="Format"
                value={selectedReport.format}
              />

              <PreviewStat
                title="Records"
                value={selectedReport.records}
              />

              <PreviewStat
                title="Schedule"
                value={selectedReport.schedule}
              />

            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="text-sm font-semibold text-slate-900">
                Report Summary
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selectedReport.description}
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <InfoRow
                label="Report Owner"
                value={selectedReport.owner}
              />

              <InfoRow
                label="Last Generated"
                value={selectedReport.lastGenerated}
              />

              <InfoRow
                label="Current Status"
                value={selectedReport.status}
              />

              <InfoRow
                label="Export Type"
                value={selectedReport.format}
              />

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

              <button
                type="button"
                onClick={() => handleDownload(selectedReport)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(selectedReport)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Generate Again
              </button>

            </div>

          </div>

        </Modal>

      )}

      {/* ========================================================
          SCHEDULE MODAL
      ======================================================== */}

      {showScheduleModal && selectedReport && (

        <Modal
          title="Schedule Report"
          subtitle={`Configure automatic delivery for ${selectedReport.name}`}
          onClose={() => setShowScheduleModal(false)}
        >

          <div className="space-y-5">

            <div className="rounded-xl bg-indigo-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>

                <div>

                  <p className="text-sm font-semibold text-indigo-900">
                    {selectedReport.name}
                  </p>

                  <p className="text-xs text-indigo-600">
                    Current schedule: {selectedReport.schedule}
                  </p>

                </div>

              </div>

            </div>

            <FormSelect
              label="Frequency"
              value={selectedReport.schedule}
              options={[
                'One Time',
                'Daily',
                'Weekly',
                'Monthly',
              ]}
              onChange={(value) => {
                setReports((prev) =>
                  prev.map((report) =>
                    report.id === selectedReport.id
                      ? {
                          ...report,
                          schedule: value,
                          status:
                            value === 'One Time'
                              ? 'Ready'
                              : 'Scheduled',
                        }
                      : report
                  )
                );

                setSelectedReport((prev) =>
                  prev
                    ? {
                        ...prev,
                        schedule: value,
                        status:
                          value === 'One Time'
                            ? 'Ready'
                            : 'Scheduled',
                      }
                    : prev
                );
              }}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <FormInput
                label="Run Time"
                value="09:00 AM"
                placeholder="09:00 AM"
                onChange={() => {}}
              />

              <FormInput
                label="Recipient Email"
                value="admin@corehr-platform.com"
                placeholder="email@example.com"
                onChange={() => {}}
              />

            </div>

            <div className="flex justify-end border-t border-slate-200 pt-5">

              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Save Schedule
              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
};

/* ================================================================
   SUMMARY CARD
================================================================ */

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
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

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

      </div>

    </div>
  );
};

/* ================================================================
   CATEGORY CARD
================================================================ */

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  active: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  count,
  active,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? 'border-indigo-300 bg-indigo-50'
          : 'border-slate-200 bg-white hover:border-indigo-200'
      }`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            active
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {icon}
        </div>

        <div>

          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {count}
          </p>

        </div>

      </div>

    </button>
  );
};

/* ================================================================
   INSIGHT CARD
================================================================ */

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <span className="text-xs font-semibold text-emerald-600">
          Live
        </span>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
};

/* ================================================================
   STATUS BADGE
================================================================ */

const StatusBadge: React.FC<{
  status: Report['status'];
}> = ({ status }) => {

  const styles = {
    Ready: 'bg-emerald-50 text-emerald-700',
    Scheduled: 'bg-amber-50 text-amber-700',
    Generating: 'bg-indigo-50 text-indigo-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >

      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Ready'
            ? 'bg-emerald-500'
            : status === 'Scheduled'
            ? 'bg-amber-500'
            : 'bg-indigo-500'
        }`}
      />

      {status}

    </span>
  );
};

/* ================================================================
   MODAL
================================================================ */

interface ModalProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  children,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between border-b border-slate-200 p-6">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

/* ================================================================
   FORM INPUT
================================================================ */

interface FormInputProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
      />

    </div>
  );
};

/* ================================================================
   FORM SELECT
================================================================ */

interface FormSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      </div>

    </div>
  );
};

/* ================================================================
   PREVIEW STAT
================================================================ */

const PreviewStat: React.FC<{
  title: string;
  value: string;
}> = ({ title, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="text-xs font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};

/* ================================================================
   INFO ROW
================================================================ */

const InfoRow: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
};
