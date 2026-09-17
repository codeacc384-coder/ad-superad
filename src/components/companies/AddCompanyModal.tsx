import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  UserRound,
  CreditCard,
  CheckCircle2,
  X,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

const PLAN_DEFAULTS: Record<
  string,
  {
    price: number;
    quota: number;
    storage: number;
    api: number;
  }
> = {
  Free: {
    price: 0,
    quota: 25,
    storage: 25,
    api: 100,
  },
  Starter: {
    price: 350,
    quota: 100,
    storage: 100,
    api: 500,
  },
  Professional: {
    price: 1800,
    quota: 250,
    storage: 500,
    api: 1000,
  },
  Enterprise: {
    price: 4500,
    quota: 500,
    storage: 1000,
    api: 5000,
  },
};

const BUSINESS_TYPES = [
  'Private Limited Company',
  'Public Limited Company',
  'LLP',
  'Partnership',
  'Proprietorship',
  'Other',
];

const makeTenantId = () =>
  `TNT-${Date.now().toString().slice(-8)}${Math.floor(
    Math.random() * 10
  )}`;

const makeInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CO';

const getRegistrationLabel = (businessType: string) => {
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

export const AddCompanyModal: React.FC = () => {
  const {
    addCompanyOpen,
    setAddCompanyOpen,
    addToast,
  } = useApp();

  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);

  /* ============================================================
     COMPANY DETAILS
     ============================================================ */

  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');

  const [businessType, setBusinessType] = useState(
    'Private Limited Company'
  );

  const [registrationNumber, setRegistrationNumber] =
    useState('');

  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');

  const [registeredAddress, setRegisteredAddress] =
    useState('');

  const [industry, setIndustry] = useState('Technology');
  const [country, setCountry] = useState('India');

  /*
   * IMPORTANT:
   *
   * location is NOT NULL in the companies table.
   * Therefore this field is required and must never be
   * inserted as null.
   */
  const [location, setLocation] = useState('');

  const [companySize, setCompanySize] = useState('51-200');

  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');

  /* ============================================================
     ADMIN
     ============================================================ */

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  const [adminRole, setAdminRole] = useState(
    'Company Administrator'
  );

  /*
   * This password is NEVER written to the companies table.
   * It exists only temporarily in the browser so the admin
   * can manually create the Supabase Auth user.
   */
  const [adminPassword, setAdminPassword] = useState('');

  /* ============================================================
     PLAN
     ============================================================ */

  const [plan, setPlan] = useState('Professional');

  const [billingCycle, setBillingCycle] =
    useState('Monthly');

  const [quotaEmployees, setQuotaEmployees] =
    useState(250);

  const [status, setStatus] = useState('Active');

  const [autoRenewal, setAutoRenewal] =
    useState(true);

  /* ============================================================
     VERIFICATION
     ============================================================ */

  const [verificationStatus, setVerificationStatus] =
    useState('Pending');

  /* ============================================================
     MODAL
     ============================================================ */

  if (!addCompanyOpen) {
    return null;
  }

  const selectedPlan =
    PLAN_DEFAULTS[plan] ||
    PLAN_DEFAULTS.Professional;

  const registrationLabel =
    getRegistrationLabel(businessType);

  /* ============================================================
     RESET
     ============================================================ */

  const reset = () => {
    setStep(1);
    setSaving(false);

    /* Company */

    setName('');
    setLegalName('');

    setBusinessType(
      'Private Limited Company'
    );

    setRegistrationNumber('');
    setGstin('');
    setPan('');
    setRegisteredAddress('');

    setIndustry('Technology');
    setCountry('India');

    /*
     * Location must be entered for every new tenant.
     */
    setLocation('');

    setCompanySize('51-200');

    setContactEmail('');
    setContactPhone('');
    setWebsite('');

    /* Admin */

    setAdminName('');
    setAdminEmail('');
    setAdminPhone('');

    setAdminRole(
      'Company Administrator'
    );

    setAdminPassword('');

    /* Plan */

    setPlan('Professional');
    setBillingCycle('Monthly');
    setQuotaEmployees(250);
    setStatus('Active');
    setAutoRenewal(true);

    /* Verification */

    setVerificationStatus('Pending');
  };

  const close = () => {
    if (saving) {
      return;
    }

    setAddCompanyOpen(false);
    reset();
  };

  /* ============================================================
     EMAIL VALIDATION
     ============================================================ */

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    );
  };

  /* ============================================================
     STEP VALIDATION
     ============================================================ */

  const next = () => {
    /* ==========================================================
       STEP 1
       ========================================================== */

    if (step === 1) {
      if (!name.trim()) {
        addToast(
          'Company Name Required',
          'Enter the company name.',
          'error'
        );
        return;
      }

      if (!legalName.trim()) {
        addToast(
          'Legal Company Name Required',
          'Enter the legal registered company name.',
          'error'
        );
        return;
      }

      if (!businessType.trim()) {
        addToast(
          'Business Type Required',
          'Select the company business type.',
          'error'
        );
        return;
      }

      if (!registrationNumber.trim()) {
        addToast(
          `${registrationLabel} Required`,
          `Enter the ${registrationLabel}.`,
          'error'
        );
        return;
      }

      if (!pan.trim()) {
        addToast(
          'PAN Required',
          'Enter the company PAN.',
          'error'
        );
        return;
      }

      if (!registeredAddress.trim()) {
        addToast(
          'Registered Address Required',
          'Enter the registered company address.',
          'error'
        );
        return;
      }

      /*
       * IMPORTANT FIX
       *
       * The database column companies.location is NOT NULL.
       */
      if (!location.trim()) {
        addToast(
          'Location Required',
          'Enter the company location, such as Hyderabad.',
          'error'
        );
        return;
      }

      if (!country.trim()) {
        addToast(
          'Country Required',
          'Enter the company country.',
          'error'
        );
        return;
      }

      if (!contactEmail.trim()) {
        addToast(
          'Contact Email Required',
          'Enter a company contact email.',
          'error'
        );
        return;
      }

      if (!isValidEmail(contactEmail)) {
        addToast(
          'Invalid Contact Email',
          'Enter a valid company contact email address.',
          'error'
        );
        return;
      }
    }

    /* ==========================================================
       STEP 2
       ========================================================== */

    if (step === 2) {
      if (!adminName.trim()) {
        addToast(
          'Administrator Name Required',
          'Enter the administrator name.',
          'error'
        );
        return;
      }

      if (!adminEmail.trim()) {
        addToast(
          'Administrator Email Required',
          'Enter the administrator email.',
          'error'
        );
        return;
      }

      if (!isValidEmail(adminEmail)) {
        addToast(
          'Invalid Admin Email',
          'Enter a valid administrator email address.',
          'error'
        );
        return;
      }

      if (!adminPassword) {
        addToast(
          'Administrator Password Required',
          'Enter the password that will be used for the Supabase Auth account.',
          'error'
        );
        return;
      }

      if (adminPassword.length < 6) {
        addToast(
          'Password Too Short',
          'The administrator password must be at least 6 characters.',
          'error'
        );
        return;
      }
    }

    /* ==========================================================
       MOVE TO NEXT STEP
       ========================================================== */

    if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  /* ============================================================
     PREVIOUS
     ============================================================ */

  const previous = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  /* ============================================================
     CREATE TENANT
     ============================================================ */

  const createTenant = async () => {
    if (saving) {
      return;
    }

    /*
     * Final safety validation before touching Supabase.
     */

    if (!name.trim()) {
      addToast(
        'Company Name Required',
        'Enter the company name.',
        'error'
      );
      setStep(1);
      return;
    }

    if (!location.trim()) {
      addToast(
        'Location Required',
        'Location cannot be empty because companies.location is required.',
        'error'
      );
      setStep(1);
      return;
    }

    if (!contactEmail.trim()) {
      addToast(
        'Contact Email Required',
        'Enter the company contact email.',
        'error'
      );
      setStep(1);
      return;
    }

    if (!adminName.trim()) {
      addToast(
        'Administrator Required',
        'Enter the administrator name.',
        'error'
      );
      setStep(2);
      return;
    }

    if (!adminEmail.trim()) {
      addToast(
        'Administrator Email Required',
        'Enter the administrator email.',
        'error'
      );
      setStep(2);
      return;
    }

    if (!adminPassword || adminPassword.length < 6) {
      addToast(
        'Administrator Password Required',
        'Enter an administrator password with at least 6 characters.',
        'error'
      );
      setStep(2);
      return;
    }

    setSaving(true);

    try {
      /* ========================================================
         NORMALIZED VALUES
         ======================================================== */

      const tenantId = makeTenantId();

      const initials = makeInitials(name);

      const normalizedName = name.trim();

      const normalizedLegalName =
        legalName.trim() ||
        normalizedName;

      const normalizedAdminEmail =
        adminEmail.trim().toLowerCase();

      const normalizedContactEmail =
        contactEmail.trim().toLowerCase();

      const normalizedLocation =
        location.trim();

      const normalizedCountry =
        country.trim();

      const normalizedPan =
        pan.trim()
          ? pan.trim().toUpperCase()
          : null;

      const normalizedGstin =
        gstin.trim()
          ? gstin.trim().toUpperCase()
          : null;

      /* ========================================================
         DATES
         ======================================================== */

      const now = new Date();

      const createdAt =
        now.toISOString();

      const currentPeriodStart =
        now.toISOString();

      const renewalDate =
        new Date(now);

      renewalDate.setMonth(
        renewalDate.getMonth() +
          (billingCycle === 'Annual'
            ? 12
            : 1)
      );

      /* ========================================================
         EMPLOYEE QUOTA
         ======================================================== */

      const finalEmployeeQuota =
        Math.max(
          0,
          Number(
            quotaEmployees ||
              selectedPlan.quota
          )
        );

      /* ========================================================
         COMPANY PAYLOAD
         ======================================================== */

      const payload = {
        /*
         * Primary identifier
         */
        id: tenantId,

        /*
         * Tenant identifier
         */
        tenant_id: tenantId,

        /* ======================================================
           BASIC COMPANY INFORMATION
           ====================================================== */

        name: normalizedName,

        legal_name:
          normalizedLegalName,

        business_type:
          businessType.trim(),

        registration_number:
          registrationNumber.trim(),

        gstin:
          normalizedGstin,

        pan:
          normalizedPan,

        registered_address:
          registeredAddress.trim(),

        /* ======================================================
           VERIFICATION
           ====================================================== */

        verification_status:
          verificationStatus ||
          'Pending',

        /* ======================================================
           LOGO
           ====================================================== */

        logo_text:
          initials,

        logo_bg_color:
          '#EEF2FF',

        logo_text_color:
          '#4F46E5',

        logo_url:
          null,

        /* ======================================================
           COMPANY INFORMATION
           ====================================================== */

        industry:
          industry.trim() ||
          'Technology',

        country:
          normalizedCountry,

        /*
         * IMPORTANT:
         *
         * companies.location is NOT NULL.
         *
         * We have already validated it above, and we send
         * the actual string instead of null.
         */
        location:
          normalizedLocation,

        company_size:
          companySize.trim() ||
          null,

        contact_email:
          normalizedContactEmail,

        contact_phone:
          contactPhone.trim() ||
          null,

        website:
          website.trim() ||
          null,

        /* ======================================================
           REGISTRATION
           ====================================================== */

        registration_date:
          createdAt,

        /* ======================================================
           TENANT STATUS
           ====================================================== */

        status:
          status || 'Active',

        /* ======================================================
           SUBSCRIPTION
           ====================================================== */

        plan:
          plan,

        plan_level:
          plan,

        billing_cycle:
          billingCycle,

        monthly_price:
          selectedPlan.price,

        renewal_date:
          renewalDate.toISOString(),

        current_period_start:
          currentPeriodStart,

        auto_renewal:
          autoRenewal,

        /* ======================================================
           EMPLOYEES
           ====================================================== */

        employees_count:
          0,

        quota_employees:
          finalEmployeeQuota,

        /* ======================================================
           STORAGE
           ====================================================== */

        storage_used_gb:
          0,

        quota_storage_gb:
          selectedPlan.storage,

        /* ======================================================
           API
           ====================================================== */

        api_requests_mtd:
          0,

        quota_api_requests:
          selectedPlan.api,

        /* ======================================================
           PAYROLL
           ====================================================== */

        payroll_processing:
          false,

        /* ======================================================
           E-SIGNATURES
           ====================================================== */

        e_signatures_completed_ytd:
          0,

        e_signatures_growth:
          '+0%',

        /* ======================================================
           COMPANY ADMIN
           
           IMPORTANT:
           Password is intentionally NOT stored.
           ====================================================== */

        admin: {
          name:
            adminName.trim(),

          email:
            normalizedAdminEmail,

          phone:
            adminPhone.trim() ||
            contactPhone.trim() ||
            '',

          role:
            adminRole.trim() ||
            'Company Administrator',

          status:
            'Active',
        },

        /* ======================================================
           TAGS
           ====================================================== */

        tags: [
          plan,
          normalizedCountry,
          businessType,
          verificationStatus,
        ].filter(Boolean),

        /* ======================================================
           TIMESTAMPS
           ====================================================== */

        created_at:
          createdAt,

        updated_at:
          createdAt,
      };

      console.log(
        'Creating company:',
        payload
      );

      /* ========================================================
         DIRECT SUPABASE INSERT
         
         NO EDGE FUNCTION
         NO SERVER FUNCTION
         NO FUNCTIONS.INVOKE
         ======================================================== */

      const {
        data,
        error,
      } = await supabase
        .from('companies')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error(
          'Supabase company insert error:',
          error
        );

        throw error;
      }

      console.log(
        'Company created successfully:',
        data
      );

      /* ========================================================
         REFRESH COMPANY LIST
         ======================================================== */

      window.dispatchEvent(
        new Event(
          'superadmin:companies-changed'
        )
      );

      /* ========================================================
         SUCCESS
         ======================================================== */

      addToast(
        'Tenant Created',
        `${normalizedName} has been created successfully. Tenant ID: ${tenantId}`,
        'success'
      );

      /* ========================================================
         CLOSE
         ======================================================== */

      setAddCompanyOpen(false);

      reset();
    } catch (error: any) {
      console.error(
        'Tenant creation failed:',
        error
      );

      let message =
        'Unable to create the tenant.';

      /* ========================================================
         POSTGRES NOT NULL
         ======================================================== */

      if (
        error?.code === '23502'
      ) {
        const column =
          error?.message
            ?.match(
              /column "([^"]+)"/
            )?.[1];

        if (column) {
          message =
            `The database requires "${column}" but no value was provided. Please enter that field.`;
        } else {
          message =
            'A required company field is missing. Please check all required fields.';
        }
      }

      /* ========================================================
         DUPLICATE
         ======================================================== */

      else if (
        error?.code === '23505'
      ) {
        message =
          'A tenant with this ID or another unique company value already exists. Please try again.';
      }

      /* ========================================================
         RLS / PERMISSION
         ======================================================== */

      else if (
        error?.code === '42501'
      ) {
        message =
          'You do not have permission to create a tenant. Check the Supabase RLS policy for the companies table.';
      }

      /* ========================================================
         FOREIGN KEY
         ======================================================== */

      else if (
        error?.code === '23503'
      ) {
        message =
          'The tenant references another record that does not exist. Check the company relationships in Supabase.';
      }

      /* ========================================================
         GENERIC SUPABASE ERROR
         ======================================================== */

      else if (
        error?.message
      ) {
        message =
          error.message;
      }

      addToast(
        'Tenant Creation Failed',
        message,
        'error'
      );

      setSaving(false);
    }
  };

  /* ============================================================
     SHARED INPUT STYLE
     ============================================================ */

  const inputClass =
    'mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-indigo-100';

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200">

        {/* ======================================================
            HEADER
            ====================================================== */}

        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Add New Tenant
            </h2>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Create a company directly in Supabase.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={saving}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ======================================================
            STEPPER
            ====================================================== */}

        <div className="px-5 py-4 border-b border-slate-100">
          <div className="grid grid-cols-4 gap-2">
            {[
              ['1', 'Company', Building2],
              ['2', 'Admin', UserRound],
              ['3', 'Plan', CreditCard],
              ['4', 'Review', CheckCircle2],
            ].map(
              ([number, label, Icon], index) => {
                const StepIcon =
                  Icon as React.ComponentType<{
                    className?: string;
                  }>;

                return (
                  <div
                    key={String(number)}
                    className={`flex items-center gap-2 ${
                      step === index + 1
                        ? 'text-indigo-600'
                        : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        step === index + 1
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'bg-slate-100'
                      }`}
                    >
                      <StepIcon className="w-3.5 h-3.5" />
                    </div>

                    <span className="text-[10px] font-bold hidden sm:block">
                      {label}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* ======================================================
            BODY
            ====================================================== */}

        <div className="p-5 overflow-y-auto max-h-[58vh]">

          {/* ====================================================
              STEP 1 — COMPANY
              ==================================================== */}

          {step === 1 && (
            <div className="space-y-5">

              <SectionTitle
                title="Company Information"
                description="Basic tenant identity, legal registration and contact information."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Field label="Company Name *">
                  <input
                    className={inputClass}
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="e.g. Technomold"
                  />
                </Field>

                <Field label="Legal Company Name *">
                  <input
                    className={inputClass}
                    value={legalName}
                    onChange={(e) =>
                      setLegalName(
                        e.target.value
                      )
                    }
                    placeholder="Registered legal company name"
                  />
                </Field>

                <Field label="Business Type *">
                  <select
                    className={inputClass}
                    value={businessType}
                    onChange={(e) => {
                      setBusinessType(
                        e.target.value
                      );

                      setRegistrationNumber('');
                    }}
                  >
                    {BUSINESS_TYPES.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field
                  label={`${registrationLabel} *`}
                >
                  <input
                    className={inputClass}
                    value={registrationNumber}
                    onChange={(e) =>
                      setRegistrationNumber(
                        e.target.value
                      )
                    }
                    placeholder={`Enter ${registrationLabel}`}
                  />
                </Field>

                <Field label="GSTIN">
                  <input
                    className={inputClass}
                    value={gstin}
                    onChange={(e) =>
                      setGstin(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g. 29ABCDE1234F1Z5"
                  />
                </Field>

                <Field label="PAN *">
                  <input
                    className={inputClass}
                    value={pan}
                    onChange={(e) =>
                      setPan(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g. ABCDE1234F"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Registered Address *">
                    <textarea
                      rows={3}
                      className={inputClass}
                      value={registeredAddress}
                      onChange={(e) =>
                        setRegisteredAddress(
                          e.target.value
                        )
                      }
                      placeholder="Complete registered company address"
                    />
                  </Field>
                </div>

                <Field label="Industry">
                  <input
                    className={inputClass}
                    value={industry}
                    onChange={(e) =>
                      setIndustry(
                        e.target.value
                      )
                    }
                    placeholder="Technology"
                  />
                </Field>

                <Field label="Country *">
                  <input
                    className={inputClass}
                    value={country}
                    onChange={(e) =>
                      setCountry(
                        e.target.value
                      )
                    }
                    placeholder="India"
                  />
                </Field>

                {/* =================================================
                    IMPORTANT FIX:
                    LOCATION IS REQUIRED
                    ================================================= */}

                <Field label="Location *">
                  <input
                    className={`${inputClass} ${
                      !location.trim()
                        ? 'border-slate-200'
                        : 'border-emerald-200'
                    }`}
                    value={location}
                    onChange={(e) =>
                      setLocation(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Hyderabad"
                  />

                  <p className="text-[10px] text-slate-400 mt-1">
                    Required because the companies.location
                    database column does not allow NULL values.
                  </p>
                </Field>

                <Field label="Company Size">
                  <select
                    className={inputClass}
                    value={companySize}
                    onChange={(e) =>
                      setCompanySize(
                        e.target.value
                      )
                    }
                  >
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>501-1000</option>
                    <option>1000+</option>
                  </select>
                </Field>

                <Field label="Company Contact Email *">
                  <input
                    type="email"
                    className={inputClass}
                    value={contactEmail}
                    onChange={(e) =>
                      setContactEmail(
                        e.target.value
                      )
                    }
                    placeholder="admin@company.com"
                  />
                </Field>

                <Field label="Contact Phone">
                  <input
                    className={inputClass}
                    value={contactPhone}
                    onChange={(e) =>
                      setContactPhone(
                        e.target.value
                      )
                    }
                    placeholder="+91 ..."
                  />
                </Field>

                <Field label="Website">
                  <input
                    className={inputClass}
                    value={website}
                    onChange={(e) =>
                      setWebsite(
                        e.target.value
                      )
                    }
                    placeholder="https://company.com"
                  />
                </Field>
              </div>

              {/* ==================================================
                  VERIFICATION
                  ================================================== */}

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>

                  <div className="flex-1">

                    <h4 className="text-xs font-bold text-slate-900">
                      Business Verification
                    </h4>

                    <p className="text-[10px] text-slate-500 mt-1">
                      New tenants are created as Pending until
                      their legal company information has been
                      reviewed.
                    </p>

                    <div className="mt-3 max-w-xs">

                      <label className="block">

                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Verification Status
                        </span>

                        <select
                          className={inputClass}
                          value={
                            verificationStatus
                          }
                          onChange={(e) =>
                            setVerificationStatus(
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Verified">
                            Verified
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>
                        </select>

                      </label>

                    </div>

                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              STEP 2 — ADMIN
              ==================================================== */}

          {step === 2 && (
            <div className="space-y-4">

              <SectionTitle
                title="Primary Administrator"
                description="Enter the Company Admin details and the password they will use to sign in."
              />

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-[10px] text-amber-800">
                  The administrator password is NOT stored in
                  the companies table. After creating the tenant,
                  create the same email/password in Supabase
                  Authentication → Users.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Field label="Admin Name *">
                  <input
                    className={inputClass}
                    value={adminName}
                    onChange={(e) =>
                      setAdminName(
                        e.target.value
                      )
                    }
                    placeholder="Administrator name"
                  />
                </Field>

                <Field label="Admin Email *">
                  <input
                    type="email"
                    className={inputClass}
                    value={adminEmail}
                    onChange={(e) =>
                      setAdminEmail(
                        e.target.value
                      )
                    }
                    placeholder="admin@company.com"
                  />
                </Field>

                <Field label="Admin Password *">
                  <input
                    type="password"
                    minLength={6}
                    autoComplete="new-password"
                    className={inputClass}
                    value={adminPassword}
                    onChange={(e) =>
                      setAdminPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter Company Admin password"
                  />

                  <p className="text-[10px] text-slate-400 mt-1">
                    This is never inserted into the companies
                    table. Use it when creating the Supabase Auth
                    user.
                  </p>
                </Field>

                <Field label="Admin Phone">
                  <input
                    className={inputClass}
                    value={adminPhone}
                    onChange={(e) =>
                      setAdminPhone(
                        e.target.value
                      )
                    }
                    placeholder="+91 ..."
                  />
                </Field>

                <Field label="Admin Role">
                  <input
                    className={inputClass}
                    value={adminRole}
                    onChange={(e) =>
                      setAdminRole(
                        e.target.value
                      )
                    }
                    placeholder="Company Administrator"
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ====================================================
              STEP 3 — PLAN
              ==================================================== */}

          {step === 3 && (
            <div className="space-y-4">

              <SectionTitle
                title="Plan & Access"
                description="Set the initial subscription, tenant status and employee capacity."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {Object.entries(
                  PLAN_DEFAULTS
                ).map(
                  ([
                    nameValue,
                    defaults,
                  ]) => (
                    <button
                      key={nameValue}
                      type="button"
                      onClick={() => {
                        setPlan(
                          nameValue
                        );

                        if (
                          quotaEmployees ===
                            250 ||
                          quotaEmployees ===
                            500
                        ) {
                          setQuotaEmployees(
                            defaults.quota
                          );
                        }
                      }}
                      className={`text-left p-4 rounded-xl border transition ${
                        plan === nameValue
                          ? 'border-indigo-400 bg-indigo-50/50 ring-1 ring-indigo-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">

                        <span className="text-sm font-bold text-slate-900">
                          {nameValue}
                        </span>

                        {plan ===
                          nameValue && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        )}

                      </div>

                      <p className="text-xs font-bold text-slate-700 mt-2">
                        ₹
                        {defaults.price.toLocaleString(
                          'en-IN'
                        )}{' '}
                        / month
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        Default quota:{' '}
                        {defaults.quota}{' '}
                        employees •{' '}
                        {defaults.storage}{' '}
                        GB
                      </p>

                    </button>
                  )
                )}

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Field label="Billing Cycle">
                  <select
                    className={inputClass}
                    value={billingCycle}
                    onChange={(e) =>
                      setBillingCycle(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Monthly
                    </option>

                    <option>
                      Annual
                    </option>
                  </select>
                </Field>

                <Field label="Employee Quota">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={quotaEmployees}
                    onChange={(e) =>
                      setQuotaEmployees(
                        Number(
                          e.target.value ||
                            0
                        )
                      )
                    }
                  />
                </Field>

                <Field label="Initial Status">
                  <select
                    className={inputClass}
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Active
                    </option>

                    <option>
                      Trial
                    </option>

                    <option>
                      Pending
                    </option>

                    <option>
                      Suspended
                    </option>
                  </select>
                </Field>

              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">

                <input
                  type="checkbox"
                  checked={autoRenewal}
                  onChange={(e) =>
                    setAutoRenewal(
                      e.target.checked
                    )
                  }
                />

                <div>

                  <p className="text-xs font-bold text-slate-800">
                    Enable auto renewal
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Stores the setting in the tenant record.
                  </p>

                </div>

              </label>

              {/* STORAGE */}

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Building2 className="w-4 h-4" />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-slate-900">
                      Storage Quota
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      The selected plan provides{' '}
                      <span className="font-bold text-indigo-700">
                        {selectedPlan.storage} GB
                      </span>{' '}
                      of tenant storage.
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      Actual storage usage will be calculated
                      automatically from Supabase Storage.
                    </p>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ====================================================
              STEP 4 — REVIEW
              ==================================================== */}

          {step === 4 && (
            <div className="space-y-4">

              <SectionTitle
                title="Review Tenant"
                description="Confirm the values before inserting the record."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <ReviewItem
                  label="Company"
                  value={name}
                />

                <ReviewItem
                  label="Legal Company Name"
                  value={legalName}
                />

                <ReviewItem
                  label="Business Type"
                  value={businessType}
                />

                <ReviewItem
                  label={registrationLabel}
                  value={registrationNumber}
                />

                <ReviewItem
                  label="GSTIN"
                  value={gstin}
                />

                <ReviewItem
                  label="PAN"
                  value={pan}
                />

                <ReviewItem
                  label="Registered Address"
                  value={registeredAddress}
                />

                <ReviewItem
                  label="Verification Status"
                  value={
                    verificationStatus
                  }
                />

                <ReviewItem
                  label="Industry"
                  value={industry}
                />

                <ReviewItem
                  label="Country"
                  value={country}
                />

                <ReviewItem
                  label="Location"
                  value={location}
                />

                <ReviewItem
                  label="Company Size"
                  value={companySize}
                />

                <ReviewItem
                  label="Contact"
                  value={contactEmail}
                />

                <ReviewItem
                  label="Administrator"
                  value={adminName}
                />

                <ReviewItem
                  label="Admin Email"
                  value={adminEmail}
                />

                <ReviewItem
                  label="Admin Password"
                  value={
                    adminPassword
                      ? '••••••••'
                      : ''
                  }
                />

                <ReviewItem
                  label="Plan"
                  value={plan}
                />

                <ReviewItem
                  label="Billing Cycle"
                  value={billingCycle}
                />

                <ReviewItem
                  label="Monthly Price"
                  value={`₹${selectedPlan.price.toLocaleString(
                    'en-IN'
                  )}`}
                />

                <ReviewItem
                  label="Employee Quota"
                  value={String(
                    quotaEmployees
                  )}
                />

                <ReviewItem
                  label="Storage Quota"
                  value={`${selectedPlan.storage} GB`}
                />

                <ReviewItem
                  label="Initial Storage Used"
                  value="0 GB"
                />

                <ReviewItem
                  label="Status"
                  value={status}
                />

                <ReviewItem
                  label="Auto Renewal"
                  value={
                    autoRenewal
                      ? 'Enabled'
                      : 'Disabled'
                  }
                />

              </div>

              {/* ==================================================
                  AUTH NOTICE
                  ================================================== */}

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                <div className="flex items-start gap-3">

                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-slate-900">
                      Company Admin Login
                    </p>

                    <p className="text-[10px] text-slate-600 mt-1">
                      The tenant record will be created directly
                      in the companies table. The administrator
                      Auth account is separate and must be created
                      in Supabase Authentication → Users using:
                    </p>

                    <div className="mt-2 space-y-1">

                      <p className="text-[10px] text-slate-700">
                        <span className="font-bold">
                          Email:
                        </span>{' '}
                        {adminEmail ||
                          '—'}
                      </p>

                      <p className="text-[10px] text-slate-700">
                        <span className="font-bold">
                          Password:
                        </span>{' '}
                        Same password entered above
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* ======================================================
            FOOTER
            ====================================================== */}

        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">

          <button
            type="button"
            onClick={
              step === 1
                ? close
                : previous
            }
            disabled={saving}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-50"
          >
            {step === 1 ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                Back
              </>
            )}
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131b2e] text-white text-xs font-semibold disabled:opacity-60"
            >
              Continue

              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={createTenant}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}

              {saving
                ? 'Creating...'
                : 'Create Tenant'}
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

/* ================================================================
   SECTION TITLE
   ================================================================ */

const SectionTitle: React.FC<{
  title: string;
  description: string;
}> = ({
  title,
  description,
}) => (
  <div>

    <h3 className="text-sm font-bold text-slate-900">
      {title}
    </h3>

    <p className="text-[11px] text-slate-500 mt-1">
      {description}
    </p>

  </div>
);

/* ================================================================
   FIELD
   ================================================================ */

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({
  label,
  children,
}) => (
  <label className="block">

    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
      {label}
    </span>

    {children}

  </label>
);

/* ================================================================
   REVIEW ITEM
   ================================================================ */

const ReviewItem: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value,
}) => (
  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">

    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
      {label}
    </p>

    <p className="text-xs font-semibold text-slate-800 mt-1 break-words">
      {value || '—'}
    </p>

  </div>
);

export default AddCompanyModal;