import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import {
  Building2,
  Search,
  Plus,
  RefreshCw,
  Download,
  Eye,
  UserRound,
  MapPin,
  CreditCard,
  Users,
  CheckCircle2,
  Clock3,
  Ban,
  AlertCircle,
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';

type CompanyRow = {
  id: string;
  tenant_id: string;
  name: string;
  logo_text: string | null;
  logo_bg_color: string | null;
  logo_text_color: string | null;
  logo_url: string | null;
  industry: string | null;
  country: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  company_size: string | null;
  registration_date: string | null;
  status: string;
  plan: string | null;
  plan_level: string | null;
  billing_cycle: string | null;
  monthly_price: number | string | null;
  renewal_date: string | null;
  current_period_start: string | null;
  auto_renewal: boolean | null;
  employees_count: number | null;
  quota_employees: number | null;
  storage_used_gb: number | string | null;
  quota_storage_gb: number | null;
  api_requests_mtd: number | null;
  quota_api_requests: number | null;
  payroll_processing: boolean | null;
  e_signatures_completed_ytd: number | null;
  e_signatures_growth: string | null;
  admin: Record<string, any> | null;
  tags: any;
  created_at: string | null;
  updated_at: string | null;
};

const statusOptions = ['ALL', 'Active', 'Trial', 'Suspended', 'Pending'];

const money = (value: unknown) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;

const dateOnly = (value: string | null) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

const statusClasses = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Trial':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Suspended':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Pending':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export const CompaniesView: React.FC = () => {
  const {
    setActiveTab,
    viewCompanyProfile,
    setAddCompanyOpen,
    addToast,
  } = useApp();

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [plan, setPlan] = useState('ALL');
  const [sortAsc, setSortAsc] = useState(true);
  const [menuId, setMenuId] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('Tenant Management Supabase error:', queryError);
      setError(queryError.message);
      setCompanies([]);
    } else {
      setCompanies((data || []) as CompanyRow[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();

    const handler = () => fetchCompanies();
    window.addEventListener('superadmin:companies-changed', handler);
    return () => window.removeEventListener('superadmin:companies-changed', handler);
  }, [fetchCompanies]);

  const plans = useMemo(
    () =>
      Array.from(
        new Set(
          companies
            .map((c) => c.plan)
            .filter((p): p is string => Boolean(p))
        )
      ).sort(),
    [companies]
  );

  const counts = useMemo(
    () => ({
      total: companies.length,
      active: companies.filter((c) => c.status === 'Active').length,
      trial: companies.filter((c) => c.status === 'Trial').length,
      suspended: companies.filter((c) => c.status === 'Suspended').length,
      pending: companies.filter((c) => c.status === 'Pending').length,
    }),
    [companies]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const result = companies.filter((company) => {
      const adminName = String(company.admin?.name || '');
      const adminEmail = String(company.admin?.email || '');

      const matchesSearch =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.tenant_id.toLowerCase().includes(q) ||
        String(company.contact_email || '').toLowerCase().includes(q) ||
        adminName.toLowerCase().includes(q) ||
        adminEmail.toLowerCase().includes(q);

      const matchesStatus =
        status === 'ALL' || company.status === status;

      const matchesPlan =
        plan === 'ALL' || company.plan === plan;

      return matchesSearch && matchesStatus && matchesPlan;
    });

    return result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortAsc ? comparison : -comparison;
    });
  }, [companies, search, status, plan, sortAsc]);

  const updateStatus = async (company: CompanyRow, nextStatus: string) => {
    setMenuId(null);

    const { error: updateError } = await supabase
      .from('companies')
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', company.id);

    if (updateError) {
      addToast('error', 'Update Failed', updateError.message);
      return;
    }

    addToast(
      'success',
      `Tenant ${nextStatus}`,
      `${company.name} is now ${nextStatus.toLowerCase()}.`
    );

    await fetchCompanies();
  };

  const exportCSV = () => {
    const headers = [
      'Tenant ID',
      'Company Name',
      'Industry',
      'Country',
      'Location',
      'Plan',
      'Billing Cycle',
      'Monthly Price',
      'Employees',
      'Employee Quota',
      'Status',
      'Admin Name',
      'Admin Email',
      'Registration Date',
      'Renewal Date',
    ];

    const rows = filtered.map((c) => [
      c.tenant_id,
      c.name,
      c.industry || '',
      c.country || '',
      c.location || '',
      c.plan || '',
      c.billing_cycle || '',
      Number(c.monthly_price || 0),
      Number(c.employees_count || 0),
      Number(c.quota_employees || 0),
      c.status,
      c.admin?.name || '',
      c.admin?.email || '',
      dateOnly(c.registration_date),
      dateOnly(c.renewal_date),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenant-management-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    addToast('success', 'Export Complete', 'Tenant data exported as CSV.');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Tenant Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage companies, tenant access, subscriptions and administrator details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={() => setAddCompanyOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131b2e] text-white text-xs font-semibold hover:bg-slate-800"
          >
            <Plus className="w-4 h-4" />
            Add Tenant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ['Total', counts.total, Building2],
          ['Active', counts.active, CheckCircle2],
          ['Trial', counts.trial, Clock3],
          ['Suspended', counts.suspended, Ban],
          ['Pending', counts.pending, AlertCircle],
        ].map(([label, value, Icon]) => (
          <button
            key={String(label)}
            onClick={() => setStatus(label === 'Total' ? 'ALL' : String(label))}
            className={`text-left bg-white border rounded-2xl p-4 hover:border-indigo-300 hover:shadow-sm transition ${
              status === (label === 'Total' ? 'ALL' : label)
                ? 'border-indigo-300 ring-1 ring-indigo-100'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wide text-slate-500">
                {label}
              </span>
              <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {value}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenant, ID, email or administrator..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
        >
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {item === 'ALL' ? 'All Statuses' : item}
            </option>
          ))}
        </select>

        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
        >
          <option value="ALL">All Plans</option>
          {plans.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSortAsc((v) => !v)}
          className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
          title="Sort by company name"
        >
          <ArrowUpDown className="w-4 h-4" />
          Name
        </button>

        <button
          onClick={fetchCompanies}
          className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-800">
              Could not load tenant records
            </p>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Tenant Directory
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {filtered.length} tenant{filtered.length === 1 ? '' : 's'} shown
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-14 text-center text-xs text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            Loading tenant records from Supabase...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 mt-3">
              No tenants found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try changing the search or filters, or add a new tenant.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-bold">Tenant</th>
                  <th className="px-4 py-3 font-bold">Plan</th>
                  <th className="px-4 py-3 font-bold">Employees</th>
                  <th className="px-4 py-3 font-bold">Billing</th>
                  <th className="px-4 py-3 font-bold">Administrator</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((company) => {
                  const used = Number(company.employees_count || 0);
                  const quota = Number(company.quota_employees || 0);
                  const usage = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
                  const adminName = String(company.admin?.name || 'Not assigned');
                  const adminEmail = String(company.admin?.email || '—');

                  return (
                    <tr key={company.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <button
                          onClick={() => viewCompanyProfile(company.id)}
                          className="flex items-center gap-3 text-left"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                            style={{
                              backgroundColor: company.logo_bg_color || '#EEF2FF',
                              color: company.logo_text_color || '#4F46E5',
                            }}
                          >
                            {company.logo_text ||
                              company.name
                                .split(/\s+/)
                                .map((x) => x[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-900 hover:text-indigo-600">
                              {company.name}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {company.tenant_id} • {company.location || company.country || 'Location not set'}
                            </p>
                          </div>
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-slate-800">
                          {company.plan || 'Not assigned'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {company.plan_level || '—'}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-800">
                            {used.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            / {quota.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="w-28 h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${usage}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-slate-800">
                          {money(company.monthly_price)}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {company.billing_cycle || '—'}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs font-semibold text-slate-800">
                          {adminName}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {adminEmail}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${statusClasses(company.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {company.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setMenuId(menuId === company.id ? null : company.id)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {menuId === company.id && (
                            <div className="absolute right-0 top-10 z-30 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-left">
                              <button
                                onClick={() => viewCompanyProfile(company.id)}
                                className="w-full px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Inspect
                              </button>

                              {company.website && (
                                <button
                                  onClick={() => window.open(company.website!, '_blank', 'noopener,noreferrer')}
                                  className="w-full px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Open Website
                                </button>
                              )}

                              {company.status === 'Active' ? (
                                <button
                                  onClick={() => updateStatus(company, 'Suspended')}
                                  className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Suspend Tenant
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateStatus(company, 'Active')}
                                  className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Activate Tenant
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setMenuId(null);
                                  viewCompanyProfile(company.id);
                                  setActiveTab('company-detail');
                                }}
                                className="w-full px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2"
                              >
                                <UserRound className="w-3.5 h-3.5" />
                                Company Profile
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 px-1">
        Tenant records shown here are read directly from <span className="font-semibold">public.companies</span> in Supabase.
      </p>
    </div>
  );
};

export default CompaniesView;
