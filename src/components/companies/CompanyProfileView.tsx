import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

import {
  getCompanyStorageUsage,
  getCompanyApiUsage,
} from '../../services/companyUsage';

import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  Users,
  HardDrive,
  Activity,
  CreditCard,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Ban,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Database,
  FileSignature,
  FileText,
  Hash,
} from 'lucide-react';

/* ================================================================
   DATABASE ROW
   ================================================================ */

type CompanyRow = {
  id: string;
  tenant_id: string;

  name: string;

  legal_name: string | null;
  business_type: string | null;
  registration_number: string | null;
  gstin: string | null;
  pan: string | null;
  registered_address: string | null;
  verification_status: string | null;

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

  /*
   * Legacy API value retained in the database schema.
   *
   * The live Super Admin API metric now comes from:
   * api_request_logs -> get_company_api_usage RPC.
   */
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

/* ================================================================
   HELPERS
   ================================================================ */

const formatDate = (value: string | null) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatMoney = (value: unknown) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;

const tagsArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).map(String);
  }

  return [];
};

const getRegistrationLabel = (
  businessType: string | null
) => {
  if (
    businessType === 'Private Limited Company' ||
    businessType === 'Public Limited Company'
  ) {
    return 'CIN';
  }

  if (businessType === 'LLP') {
    return 'LLPIN';
  }

  return 'Registration Number';
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export const CompanyProfileView: React.FC = () => {
  const {
    activeCompanyId,
    setActiveTab,
    addToast,
  } = useApp();

  const [company, setCompany] =
    useState<CompanyRow | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  /* ==========================================================
     LIVE STORAGE
     ========================================================== */

  const [
    storageUsage,
    setStorageUsage,
  ] = useState<{
    storage_used_bytes: number;
    storage_used_gb: number;
    quota_storage_gb: number;
    usage_percent: number;
    tenant_id: string;
  } | null>(null);

  const [
    storageLoading,
    setStorageLoading,
  ] = useState(false);

  /* ==========================================================
     LIVE API MTD
     ========================================================== */

  const [
    apiUsage,
    setApiUsage,
  ] = useState<{
    api_requests_mtd: number;
    quota_api_requests: number;
    usage_percent: number;
    tenant_id: string;
    month_start: string;
  } | null>(null);

  const [
    apiLoading,
    setApiLoading,
  ] = useState(false);

  /* ==========================================================
     FORM
     ========================================================== */

  const [form, setForm] = useState({
    name: '',
    legal_name: '',
    business_type:
      'Private Limited Company',
    registration_number: '',
    gstin: '',
    pan: '',
    registered_address: '',

    verification_status: 'Pending',

    industry: '',
    country: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    company_size: '',
    quota_employees: 0,
    status: 'Active',
  });

  /* ==========================================================
     FETCH COMPANY
     ========================================================== */

  const fetchCompany = useCallback(
    async () => {
      if (!activeCompanyId) {
        setCompany(null);
        setStorageUsage(null);
        setApiUsage(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from('companies')
        .select('*')
        .eq('id', activeCompanyId)
        .maybeSingle();

      if (error) {
        console.error(
          'Company profile Supabase error:',
          error
        );

        addToast(
          'Unable to Load Tenant',
          error.message,
          'error'
        );

        setCompany(null);
      } else {
        const row =
          data as CompanyRow | null;

        setCompany(row);

        if (row) {
          setForm({
            name: row.name || '',

            legal_name:
              row.legal_name ||
              row.name ||
              '',

            business_type:
              row.business_type ||
              'Private Limited Company',

            registration_number:
              row.registration_number ||
              '',

            gstin:
              row.gstin || '',

            pan:
              row.pan || '',

            registered_address:
              row.registered_address ||
              '',

            verification_status:
              row.verification_status ||
              'Pending',

            industry:
              row.industry || '',

            country:
              row.country || '',

            location:
              row.location || '',

            contact_email:
              row.contact_email || '',

            contact_phone:
              row.contact_phone || '',

            website:
              row.website || '',

            company_size:
              row.company_size || '',

            quota_employees:
              Number(
                row.quota_employees || 0
              ),

            status:
              row.status || 'Active',
          });
        }
      }

      setLoading(false);
    },
    [activeCompanyId, addToast]
  );

  /* ==========================================================
     FETCH LIVE STORAGE
     ========================================================== */

  const fetchStorageUsage =
    useCallback(async () => {
      if (!activeCompanyId) {
        setStorageUsage(null);
        setStorageLoading(false);
        return;
      }

      setStorageLoading(true);

      try {
        const usage =
          await getCompanyStorageUsage(
            activeCompanyId
          );

        setStorageUsage({
          storage_used_bytes:
            Number(
              usage.storageUsedBytes || 0
            ),

          storage_used_gb:
            Number(
              usage.storageUsedGB || 0
            ),

          quota_storage_gb:
            Number(
              usage.quotaStorageGB || 0
            ),

          usage_percent:
            Number(
              usage.usagePercent || 0
            ),

          tenant_id:
            usage.tenantId || '',
        });
      } catch (error) {
        console.warn(
          'Live storage usage could not be loaded:',
          error
        );

        setStorageUsage(null);
      } finally {
        setStorageLoading(false);
      }
    }, [activeCompanyId]);

  /* ==========================================================
     FETCH LIVE API MTD
     ========================================================== */

  const fetchApiUsage =
    useCallback(async () => {
      if (!activeCompanyId) {
        setApiUsage(null);
        setApiLoading(false);
        return;
      }

      setApiLoading(true);

      try {
        const usage =
          await getCompanyApiUsage(
            activeCompanyId
          );

        setApiUsage({
          api_requests_mtd:
            Number(
              usage.apiRequestsMTD || 0
            ),

          quota_api_requests:
            Number(
              usage.quotaApiRequests || 0
            ),

          usage_percent:
            Number(
              usage.usagePercent || 0
            ),

          tenant_id:
            usage.tenantId || '',

          month_start:
            usage.monthStart || '',
        });
      } catch (error) {
        console.warn(
          'Live API usage could not be loaded:',
          error
        );

        setApiUsage(null);
      } finally {
        setApiLoading(false);
      }
    }, [activeCompanyId]);

  /* ==========================================================
     LOAD COMPANY WHEN TENANT CHANGES
     ========================================================== */

  useEffect(() => {
    fetchCompany();
    fetchStorageUsage();
    fetchApiUsage();
  }, [
    activeCompanyId,
    fetchCompany,
    fetchStorageUsage,
    fetchApiUsage,
  ]);

  /* ==========================================================
     COMPANY CHANGE EVENT
     ========================================================== */

  useEffect(() => {
    const handler = () => {
      fetchCompany();
      fetchStorageUsage();
      fetchApiUsage();
    };

    window.addEventListener(
      'superadmin:companies-changed',
      handler
    );

    return () => {
      window.removeEventListener(
        'superadmin:companies-changed',
        handler
      );
    };
  }, [
    fetchCompany,
    fetchStorageUsage,
    fetchApiUsage,
  ]);

  /* ==========================================================
     SAVE COMPANY
     ========================================================== */

  const saveCompany = async () => {
    if (!company) return;

    if (!form.name.trim()) {
      addToast(
        'Company Name Required',
        'Enter the tenant company name.',
        'error'
      );
      return;
    }

    if (!form.legal_name.trim()) {
      addToast(
        'Legal Company Name Required',
        'Enter the legal registered company name.',
        'error'
      );
      return;
    }

    if (!form.business_type.trim()) {
      addToast(
        'Business Type Required',
        'Select the company business type.',
        'error'
      );
      return;
    }

    if (!form.registration_number.trim()) {
      addToast(
        `${getRegistrationLabel(
          form.business_type
        )} Required`,
        `Enter the ${getRegistrationLabel(
          form.business_type
        )}.`,
        'error'
      );
      return;
    }

    if (!form.pan.trim()) {
      addToast(
        'PAN Required',
        'Enter the company PAN.',
        'error'
      );
      return;
    }

    if (!form.registered_address.trim()) {
      addToast(
        'Registered Address Required',
        'Enter the registered company address.',
        'error'
      );
      return;
    }

    setSaving(true);

    const {
      data,
      error,
    } = await supabase
      .from('companies')
      .update({
        name: form.name.trim(),

        legal_name:
          form.legal_name.trim(),

        business_type:
          form.business_type.trim(),

        registration_number:
          form.registration_number.trim(),

        gstin:
          form.gstin.trim()
            ? form.gstin
                .trim()
                .toUpperCase()
            : null,

        pan:
          form.pan.trim()
            ? form.pan
                .trim()
                .toUpperCase()
            : null,

        registered_address:
          form.registered_address.trim(),

        verification_status:
          form.verification_status ||
          'Pending',

        industry:
          form.industry.trim() ||
          null,

        country:
          form.country.trim() ||
          null,

        location:
          form.location.trim() ||
          null,

        contact_email:
          form.contact_email
            .trim()
            .toLowerCase() ||
          null,

        contact_phone:
          form.contact_phone.trim() ||
          null,

        website:
          form.website.trim() ||
          null,

        company_size:
          form.company_size.trim() ||
          null,

        quota_employees:
          Math.max(
            0,
            Number(
              form.quota_employees || 0
            )
          ),

        status: form.status,

        updated_at:
          new Date().toISOString(),
      })
      .eq('id', company.id)
      .select('*')
      .single();

    if (error) {
      console.error(
        'Save tenant error:',
        error
      );

      addToast(
        'Save Failed',
        error.message,
        'error'
      );
    } else {
      setCompany(
        data as CompanyRow
      );

      setEditing(false);

      fetchStorageUsage();
      fetchApiUsage();

      window.dispatchEvent(
        new Event(
          'superadmin:companies-changed'
        )
      );

      addToast(
        'Tenant Updated',
        `${form.name} has been updated.`,
        'success'
      );
    }

    setSaving(false);
  };

  /* ==========================================================
     STATUS
     ========================================================== */

  const updateStatus = async (
    nextStatus: string
  ) => {
    if (!company) return;

    const {
      data,
      error,
    } = await supabase
      .from('companies')
      .update({
        status: nextStatus,
        updated_at:
          new Date().toISOString(),
      })
      .eq('id', company.id)
      .select('*')
      .single();

    if (error) {
      addToast(
        'Status Update Failed',
        error.message,
        'error'
      );
      return;
    }

    setCompany(
      data as CompanyRow
    );

    setForm((prev) => ({
      ...prev,
      status: nextStatus,
    }));

    window.dispatchEvent(
      new Event(
        'superadmin:companies-changed'
      )
    );

    addToast(
      `Tenant ${nextStatus}`,
      `${company.name} is now ${nextStatus.toLowerCase()}.`,
      'success'
    );
  };

  /* ==========================================================
     VERIFICATION QUICK UPDATE
     ========================================================== */

  const updateVerificationStatus =
    async (
      nextStatus:
        | 'Pending'
        | 'Verified'
        | 'Rejected'
    ) => {
      if (!company) return;

      const {
        data,
        error,
      } = await supabase
        .from('companies')
        .update({
          verification_status:
            nextStatus,

          updated_at:
            new Date().toISOString(),
        })
        .eq('id', company.id)
        .select('*')
        .single();

      if (error) {
        addToast(
          'Verification Update Failed',
          error.message,
          'error'
        );
        return;
      }

      setCompany(
        data as CompanyRow
      );

      setForm((prev) => ({
        ...prev,
        verification_status:
          nextStatus,
      }));

      window.dispatchEvent(
        new Event(
          'superadmin:companies-changed'
        )
      );

      addToast(
        'Verification Status Updated',
        `${company.name} is now ${nextStatus}.`,
        nextStatus === 'Verified'
          ? 'success'
          : nextStatus === 'Rejected'
          ? 'error'
          : 'info'
      );
    };

  /* ==========================================================
     USAGE
     ========================================================== */

  const usage = useMemo(() => {
    if (!company) {
      return {
        employees: 0,
        storage: 0,
        api: 0,
      };
    }

    const liveStoragePercent =
      storageUsage?.usage_percent ??
      (
        Number(
          company.quota_storage_gb || 0
        ) > 0
          ? (
              Number(
                company.storage_used_gb ||
                  0
              ) /
                Number(
                  company.quota_storage_gb ||
                    1
                )
            ) *
            100
          : 0
      );

    const liveApiPercent =
      apiUsage?.usage_percent ?? 0;

    return {
      employees:
        Number(
          company.quota_employees ||
            0
        ) > 0
          ? Math.round(
              (
                Number(
                  company.employees_count ||
                    0
                ) /
                  Number(
                    company.quota_employees ||
                      1
                  )
              ) *
                100
            )
          : 0,

      storage:
        liveStoragePercent,

      api:
        liveApiPercent,
    };
  }, [
    company,
    storageUsage,
    apiUsage,
  ]);

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />

          <p className="text-xs text-slate-500 mt-3">
            Loading tenant profile from
            Supabase...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     NOT FOUND
     ========================================================== */

  if (!company) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />

          <p className="text-sm font-semibold text-slate-700 mt-3">
            Tenant not found
          </p>

          <button
            onClick={() =>
              setActiveTab('companies')
            }
            className="mt-4 px-4 py-2 rounded-xl bg-[#131b2e] text-white text-xs font-semibold"
          >
            Back to Tenant Management
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================================
     DERIVED DATA
     ========================================================== */

  const tags =
    tagsArray(company.tags);

  const adminName =
    String(
      company.admin?.name ||
        'Not assigned'
    );

  const adminEmail =
    String(
      company.admin?.email || '—'
    );

  const adminPhone =
    String(
      company.admin?.phone || '—'
    );

  const adminRole =
    String(
      company.admin?.role ||
        'Company Admin'
    );


  const registrationLabel =
    getRegistrationLabel(
      company.business_type
    );

  const verificationStatus =
    company.verification_status ||
    'Pending';

  /* ==========================================================
     LIVE STORAGE DISPLAY
     ========================================================== */

  const displayedStorageGB =
    storageUsage?.storage_used_gb ??
    Number(
      company.storage_used_gb || 0
    );

  const displayedStorageQuota =
    storageUsage?.quota_storage_gb ??
    Number(
      company.quota_storage_gb || 0
    );

  const displayedStoragePercent =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          storageUsage?.usage_percent ??
            usage.storage ??
            0
        )
      )
    );

  /* ==========================================================
     LIVE API DISPLAY
     ========================================================== */

  const displayedApiRequests =
    apiUsage?.api_requests_mtd ?? 0;

  const displayedApiQuota =
    apiUsage?.quota_api_requests ??
    Number(
      company.quota_api_requests || 0
    );

  const displayedApiPercent =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          apiUsage?.usage_percent ?? 0
        )
      )
    );

  return (
    <div className="space-y-5">

      {/* ======================================================
          TOP BAR
          ====================================================== */}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() =>
            setActiveTab('companies')
          }
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Tenant Management
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setEditing(
                (value) => !value
              )
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {editing ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}

            {editing
              ? 'Cancel Edit'
              : 'Edit Tenant'}
          </button>

          {editing && (
            <button
              onClick={saveCompany}
              disabled={saving}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131b2e] text-white text-xs font-semibold disabled:opacity-60"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}

              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* ======================================================
          TENANT HEADER
          ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black"
              style={{
                backgroundColor:
                  company.logo_bg_color ||
                  '#EEF2FF',

                color:
                  company.logo_text_color ||
                  '#4F46E5',
              }}
            >
              {company.logo_text ||
                company.name
                  .split(/\s+/)
                  .map(
                    (x) => x[0]
                  )
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-2">

                <h1 className="text-xl font-bold text-slate-900">
                  {company.name}
                </h1>

                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {company.tenant_id}
                </span>

                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {company.plan ||
                    'No Plan'}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    company.status ===
                    'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : company.status ===
                        'Suspended'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {company.status}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    verificationStatus ===
                    'Verified'
                      ? 'bg-emerald-50 text-emerald-700'
                      : verificationStatus ===
                        'Rejected'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {verificationStatus}
                  </span>
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {company.industry ||
                  'Industry not specified'}{' '}
                •{' '}
                {company.location ||
                  company.country ||
                  'Location not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {company.website && (
              <button
                onClick={() =>
                  window.open(
                    company.website!,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="w-4 h-4" />
                Website
              </button>
            )}

            {company.status ===
            'Active' ? (
              <button
                onClick={() =>
                  updateStatus(
                    'Suspended'
                  )
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
              >
                <Ban className="w-4 h-4" />
                Suspend
              </button>
            ) : (
              <button
                onClick={() =>
                  updateStatus(
                    'Active'
                  )
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"
              >
                <CheckCircle2 className="w-4 h-4" />
                Activate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
          EDIT MODE
          ====================================================== */}

      {editing ? (
        <div className="space-y-4">

          <div className="bg-white border border-slate-200 rounded-2xl p-5">

            <h2 className="text-sm font-bold text-slate-900">
              Company Information
            </h2>

            <p className="text-[11px] text-slate-500 mt-1">
              Changes are saved directly to{' '}
              <span className="font-semibold">
                public.companies
              </span>
              .
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

              <EditField
                label="Company Name"
                value={form.name}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
              />

              <EditField
                label="Legal Company Name"
                value={form.legal_name}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    legal_name:
                      value,
                  }))
                }
              />

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Business Type
                </span>

                <select
                  value={
                    form.business_type
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        business_type:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option>
                    Private Limited Company
                  </option>

                  <option>
                    Public Limited Company
                  </option>

                  <option>
                    LLP
                  </option>

                  <option>
                    Partnership
                  </option>

                  <option>
                    Proprietorship
                  </option>

                  <option>
                    Other
                  </option>
                </select>
              </label>

              <EditField
                label={getRegistrationLabel(
                  form.business_type
                )}
                value={
                  form.registration_number
                }
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    registration_number:
                      value,
                  }))
                }
              />

              <EditField
                label="GSTIN"
                value={form.gstin}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    gstin:
                      value.toUpperCase(),
                  }))
                }
              />

              <EditField
                label="PAN"
                value={form.pan}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    pan:
                      value.toUpperCase(),
                  }))
                }
              />

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Registered Address
                  </span>

                  <textarea
                    rows={3}
                    value={
                      form.registered_address
                    }
                    onChange={(e) =>
                      setForm(
                        (prev) => ({
                          ...prev,
                          registered_address:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <EditField
                label="Industry"
                value={form.industry}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    industry: value,
                  }))
                }
              />

              <EditField
                label="Country"
                value={form.country}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    country: value,
                  }))
                }
              />

              <EditField
                label="Location"
                value={form.location}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    location: value,
                  }))
                }
              />

              <EditField
                label="Contact Email"
                value={
                  form.contact_email
                }
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    contact_email:
                      value,
                  }))
                }
              />

              <EditField
                label="Contact Phone"
                value={
                  form.contact_phone
                }
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    contact_phone:
                      value,
                  }))
                }
              />

              <EditField
                label="Website"
                value={form.website}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    website: value,
                  }))
                }
              />

              <EditField
                label="Company Size"
                value={
                  form.company_size
                }
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    company_size:
                      value,
                  }))
                }
              />

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Employee Quota
                </span>

                <input
                  type="number"
                  min={0}
                  value={
                    form.quota_employees
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        quota_employees:
                          Number(
                            e.target
                              .value ||
                              0
                          ),
                      })
                    )
                  }
                  className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Status
                </span>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        status:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <option>
                    Active
                  </option>

                  <option>
                    Trial
                  </option>

                  <option>
                    Suspended
                  </option>

                  <option>
                    Pending
                  </option>
                </select>
              </label>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">

            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="text-indigo-600">
                <ShieldCheck className="w-4 h-4" />
              </span>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Business Verification
                </h2>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  Review and update the tenant's legal
                  registration information and verification
                  status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Verification Status
                </span>

                <select
                  value={
                    form.verification_status
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        verification_status:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option>
                    Pending
                  </option>

                  <option>
                    Verified
                  </option>

                  <option>
                    Rejected
                  </option>
                </select>
              </label>

              <div className="flex items-end">
                <div
                  className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold ${
                    form.verification_status ===
                    'Verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : form.verification_status ===
                        'Rejected'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />

                    Current status:{' '}
                    {
                      form.verification_status
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <InfoCard
              title="Company Details"
              icon={
                <Building2 className="w-4 h-4" />
              }
            >
              <InfoRow
                icon={<Building2 />}
                label="Legal Name"
                value={
                  company.legal_name ||
                  company.name
                }
              />

              <InfoRow
                icon={<Building2 />}
                label="Business Type"
                value={
                  company.business_type
                }
              />

              <InfoRow
                icon={<Users />}
                label="Company Size"
                value={
                  company.company_size
                }
              />

              <InfoRow
                icon={<MapPin />}
                label="Country / Location"
                value={[
                  company.country,
                  company.location,
                ]
                  .filter(Boolean)
                  .join(' • ')}
              />

              <InfoRow
                icon={<CalendarDays />}
                label="Registered"
                value={formatDate(
                  company.registration_date
                )}
              />
            </InfoCard>

            <InfoCard
              title="Contact"
              icon={
                <Mail className="w-4 h-4" />
              }
            >
              <InfoRow
                icon={<Mail />}
                label="Email"
                value={
                  company.contact_email
                }
              />

              <InfoRow
                icon={<Phone />}
                label="Phone"
                value={
                  company.contact_phone
                }
              />

              <InfoRow
                icon={<Globe />}
                label="Website"
                value={
                  company.website
                }
              />
            </InfoCard>

            {/* ==================================================
                TENANT ADMINISTRATOR
                ================================================== */}

            <InfoCard
              title="Tenant Administrator"
              icon={
                <ShieldCheck className="w-4 h-4" />
              }
            >
              <InfoRow
                icon={<Users />}
                label="Name"
                value={adminName}
              />

              <InfoRow
                icon={<Mail />}
                label="Email"
                value={adminEmail}
              />

              <InfoRow
                icon={<Phone />}
                label="Phone"
                value={adminPhone}
              />

              <InfoRow
                icon={<ShieldCheck />}
                label="Role"
                value={adminRole}
              />
            </InfoCard>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">

              <div className="flex items-center gap-2">
                <span className="text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                </span>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Business Verification
                  </h2>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Legal registration and verification
                    information for this tenant.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">

                <span
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${
                    verificationStatus ===
                    'Verified'
                      ? 'bg-emerald-50 text-emerald-700'
                      : verificationStatus ===
                        'Rejected'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {verificationStatus}
                </span>

                {verificationStatus !==
                  'Verified' && (
                  <button
                    onClick={() =>
                      updateVerificationStatus(
                        'Verified'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify
                  </button>
                )}

                {verificationStatus !==
                  'Rejected' && (
                  <button
                    onClick={() =>
                      updateVerificationStatus(
                        'Rejected'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px] font-bold text-rose-700 hover:bg-rose-100"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

              <VerificationItem
                icon={<Building2 />}
                label="Legal Company Name"
                value={
                  company.legal_name ||
                  company.name
                }
              />

              <VerificationItem
                icon={<Building2 />}
                label="Business Type"
                value={
                  company.business_type
                }
              />

              <VerificationItem
                icon={<Hash />}
                label={
                  registrationLabel
                }
                value={
                  company.registration_number
                }
              />

              <VerificationItem
                icon={<FileText />}
                label="GSTIN"
                value={
                  company.gstin
                }
              />

              <VerificationItem
                icon={<FileText />}
                label="PAN"
                value={
                  company.pan
                }
              />

              <VerificationItem
                icon={<MapPin />}
                label="Registered Address"
                value={
                  company.registered_address
                }
                wide
              />
            </div>
          </div>
        </>
      )}

      {/* ======================================================
          METRICS
          ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <MetricCard
          icon={<Users />}
          label="Employees"
          value={`${Number(
            company.employees_count ||
              0
          ).toLocaleString(
            'en-IN'
          )} / ${Number(
            company.quota_employees ||
              0
          ).toLocaleString(
            'en-IN'
          )}`}
          detail={`${Math.min(
            100,
            usage.employees
          )}% of employee quota`}
        />

        <MetricCard
          icon={
            storageLoading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <HardDrive />
            )
          }
          label="Storage"
          value={`${displayedStorageGB.toLocaleString(
            'en-IN',
            {
              maximumFractionDigits: 4,
            }
          )} GB`}
          detail={`${displayedStoragePercent.toLocaleString(
            'en-IN',
            {
              maximumFractionDigits: 2,
            }
          )}% of ${displayedStorageQuota.toLocaleString(
            'en-IN'
          )} GB quota`}
        />

        <MetricCard
          icon={
            apiLoading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <Activity />
            )
          }
          label="API Requests MTD"
          value={displayedApiRequests.toLocaleString(
            'en-IN'
          )}
          detail={`${displayedApiPercent.toLocaleString(
            'en-IN',
            {
              maximumFractionDigits: 2,
            }
          )}% of ${displayedApiQuota.toLocaleString(
            'en-IN'
          )} quota`}
        />

        <MetricCard
          icon={<FileSignature />}
          label="E-Signatures YTD"
          value={Number(
            company.e_signatures_completed_ytd ||
              0
          ).toLocaleString(
            'en-IN'
          )}
          detail={
            company.e_signatures_growth ||
            'No growth data'
          }
        />
      </div>

      {/* ======================================================
          SUBSCRIPTION / SERVICES
          ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <InfoCard
          title="Subscription & Billing"
          icon={
            <CreditCard className="w-4 h-4" />
          }
        >
          <InfoRow
            icon={<CreditCard />}
            label="Plan"
            value={
              company.plan_level ||
              company.plan
            }
          />

          <InfoRow
            icon={<CreditCard />}
            label="Monthly Price"
            value={formatMoney(
              company.monthly_price
            )}
          />

          <InfoRow
            icon={<CalendarDays />}
            label="Billing Cycle"
            value={
              company.billing_cycle
            }
          />

          <InfoRow
            icon={<CalendarDays />}
            label="Renewal"
            value={formatDate(
              company.renewal_date
            )}
          />

          <InfoRow
            icon={<CheckCircle2 />}
            label="Auto Renewal"
            value={
              company.auto_renewal
                ? 'Enabled'
                : 'Disabled'
            }
          />
        </InfoCard>

        <InfoCard
          title="Platform Services"
          icon={
            <Database className="w-4 h-4" />
          }
        >
          <InfoRow
            icon={<CheckCircle2 />}
            label="Payroll Processing"
            value={
              company.payroll_processing
                ? 'Enabled'
                : 'Disabled'
            }
          />

          <InfoRow
            icon={<FileSignature />}
            label="E-Signatures"
            value={`${Number(
              company.e_signatures_completed_ytd ||
                0
            ).toLocaleString(
              'en-IN'
            )} completed YTD`}
          />

          <InfoRow
            icon={<CalendarDays />}
            label="Current Period"
            value={formatDate(
              company.current_period_start
            )}
          />

          <InfoRow
            icon={<Activity />}
            label="Last Updated"
            value={formatDate(
              company.updated_at
            )}
          />
        </InfoCard>
      </div>

      {/* ======================================================
          TAGS
          ====================================================== */}

      {tags.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <h2 className="text-sm font-bold text-slate-900">
            Tenant Tags
          </h2>

          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(
              (
                tag,
                index
              ) => (
                <span
                  key={`${tag}-${index}`}
                  className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      )}

    </div>
  );
};

/* ================================================================
   EDIT FIELD
   ================================================================ */

const EditField: React.FC<{
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}> = ({
  label,
  value,
  onChange,
}) => (
  <label className="block">
    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
      {label}
    </span>

    <input
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
      className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
    />
  </label>
);

/* ================================================================
   INFO CARD
   ================================================================ */

const InfoCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({
  title,
  icon,
  children,
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5">

    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
      <span className="text-indigo-600">
        {icon}
      </span>

      <h2 className="text-sm font-bold text-slate-900">
        {title}
      </h2>
    </div>

    <div className="mt-2 divide-y divide-slate-100">
      {children}
    </div>
  </div>
);

/* ================================================================
   INFO ROW
   ================================================================ */

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: unknown;
}> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 py-2.5">

    <span className="w-5 text-slate-400 [&>svg]:w-3.5 [&>svg]:h-3.5">
      {icon}
    </span>

    <span className="text-[10px] text-slate-500 w-28 shrink-0">
      {label}
    </span>

    <span className="text-xs font-semibold text-slate-800 truncate">
      {String(
        value || '—'
      )}
    </span>
  </div>
);

/* ================================================================
   VERIFICATION ITEM
   ================================================================ */

const VerificationItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: unknown;
  wide?: boolean;
}> = ({
  icon,
  label,
  value,
  wide,
}) => (
  <div
    className={`p-3 rounded-xl border border-slate-200 bg-slate-50 ${
      wide
        ? 'md:col-span-2 lg:col-span-3'
        : ''
    }`}
  >
    <div className="flex items-center gap-2">

      <span className="text-indigo-500 [&>svg]:w-4 [&>svg]:h-4">
        {icon}
      </span>

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>

    <p className="text-xs font-semibold text-slate-800 mt-2 break-words">
      {String(
        value || 'Not provided'
      )}
    </p>
  </div>
);

/* ================================================================
   METRIC CARD
   ================================================================ */

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}> = ({
  icon,
  label,
  value,
  detail,
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4">

    <div className="flex items-center justify-between">

      <span className="text-[10px] uppercase tracking-wide font-bold text-slate-500">
        {label}
      </span>

      <span className="text-indigo-600 [&>svg]:w-4 [&>svg]:h-4">
        {icon}
      </span>
    </div>

    <p className="text-xl font-black text-slate-900 mt-2">
      {value}
    </p>

    <p className="text-[10px] text-slate-500 mt-1">
      {detail}
    </p>
  </div>
);

export default CompanyProfileView;