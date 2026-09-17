import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Printer,
  RefreshCw,
  Search,
  X,
  CreditCard,
  CalendarDays,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type InvoiceStatus = "Paid" | "Pending" | "Failed" | "Refunded";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string | null;
  companyName: string;
  plan: string;
  status: InvoiceStatus;
  subtotal: number;
  taxes: number;
  total: number;
  billingDate: string;
  dueDate: string | null;
  billingAddress: string | null;
  transactionId: string | null;
  paymentMethod: string | null;
  items: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string | null;
  refundedAt?: string | null;
  refundReason?: string | null;
}

interface DatabaseInvoice {
  id: string;
  invoice_number: string;
  company_id: string | null;
  company_name: string;
  plan: string;
  status: InvoiceStatus;
  subtotal: number | string;
  taxes: number | string;
  total: number | string;
  billing_date: string;
  due_date: string | null;
  billing_address: string | null;
  transaction_id: string | null;
  payment_method: string | null;
  items: unknown;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  refunded_at: string | null;
  refund_reason: string | null;
}

interface TenantSubscription {
  id: string;
  tenantId: string;
  companyName: string;
  plan: string;
  planLevel: string;
  billingCycle: string;
  monthlyPrice: number;
  renewalDate: string | null;
  currentPeriodStart: string | null;
  autoRenewal: boolean;
  status: string;
  employeesCount: number;
  employeeQuota: number;
  storageUsedGb: number;
  storageQuotaGb: number;
  apiRequestsMtd: number;
  apiQuota: number;
}

interface DatabaseTenantSubscription {
  id: string;
  tenant_id: string | null;
  name: string;
  plan: string | null;
  plan_level: string | null;
  billing_cycle: string | null;
  monthly_price: number | string | null;
  renewal_date: string | null;
  current_period_start: string | null;
  auto_renewal: boolean | null;
  status: string | null;
  employees_count: number | string | null;
  quota_employees: number | string | null;
  storage_used_gb: number | string | null;
  quota_storage_gb: number | string | null;
  api_requests_mtd: number | string | null;
  quota_api_requests: number | string | null;
}

const formatCurrency = (value: number) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatINR = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeItems = (items: unknown): InvoiceItem[] => {
  if (!Array.isArray(items)) return [];

  return items.map((item: any) => ({
    description: String(item?.description ?? "Invoice Item"),
    quantity: Number(item?.quantity ?? 1),
    unitPrice: Number(item?.unitPrice ?? 0),
    total: Number(
      item?.total ??
        Number(item?.quantity ?? 1) * Number(item?.unitPrice ?? 0)
    ),
  }));
};

const mapInvoice = (row: DatabaseInvoice): Invoice => ({
  id: row.id,
  invoiceNumber: row.invoice_number,
  companyId: row.company_id,
  companyName: row.company_name,
  plan: row.plan,
  status: row.status,
  subtotal: Number(row.subtotal || 0),
  taxes: Number(row.taxes || 0),
  total: Number(row.total || 0),
  billingDate: row.billing_date,
  dueDate: row.due_date,
  billingAddress: row.billing_address,
  transactionId: row.transaction_id,
  paymentMethod: row.payment_method,
  items: normalizeItems(row.items),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  paidAt: row.paid_at,
  refundedAt: row.refunded_at,
  refundReason: row.refund_reason,
});

const mapSubscription = (
  row: DatabaseTenantSubscription
): TenantSubscription => ({
  id: row.id,
  tenantId: row.tenant_id || "—",
  companyName: row.name,
  plan: row.plan || row.plan_level || "—",
  planLevel: row.plan_level || row.plan || "—",
  billingCycle: row.billing_cycle || "Monthly",
  monthlyPrice: Number(row.monthly_price || 0),
  renewalDate: row.renewal_date,
  currentPeriodStart: row.current_period_start,
  autoRenewal: Boolean(row.auto_renewal),
  status: row.status || "Active",
  employeesCount: Number(row.employees_count || 0),
  employeeQuota: Number(row.quota_employees || 0),
  storageUsedGb: Number(row.storage_used_gb || 0),
  storageQuotaGb: Number(row.quota_storage_gb || 0),
  apiRequestsMtd: Number(row.api_requests_mtd || 0),
  apiQuota: Number(row.quota_api_requests || 0),
});

export const BillingView: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<TenantSubscription[]>(
    []
  );

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] =
    useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const loadInvoices = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const { data, error: fetchError } = await supabase
        .from("platform_invoices")
        .select("*")
        .order("billing_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Failed to load invoices:", fetchError);
        throw fetchError;
      }

      const mappedInvoices = (data || []).map((row) =>
        mapInvoice(row as DatabaseInvoice)
      );

      setInvoices(mappedInvoices);

      if (selectedInvoice) {
        const refreshedSelected = mappedInvoices.find(
          (invoice) => invoice.id === selectedInvoice.id
        );

        if (refreshedSelected) {
          setSelectedInvoice(refreshedSelected);
        }
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to load billing records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    try {
      setSubscriptionLoading(true);

      const { data, error: fetchError } = await supabase
        .from("companies")
        .select(`
          id,
          tenant_id,
          name,
          plan,
          plan_level,
          billing_cycle,
          monthly_price,
          renewal_date,
          current_period_start,
          auto_renewal,
          status,
          employees_count,
          quota_employees,
          storage_used_gb,
          quota_storage_gb,
          api_requests_mtd,
          quota_api_requests
        `)
        .order("name", { ascending: true });

      if (fetchError) {
        console.error(
          "Failed to load tenant subscriptions:",
          fetchError
        );

        throw fetchError;
      }

      const mappedSubscriptions = (data || []).map((row) =>
        mapSubscription(row as DatabaseTenantSubscription)
      );

      setSubscriptions(mappedSubscriptions);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to load tenant subscription details."
      );
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const loadBillingData = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    }

    await Promise.all([
      loadInvoices(showRefresh),
      loadSubscriptions(),
    ]);

    setRefreshing(false);
  };

  useEffect(() => {
    loadBillingData();

    const handleCompaniesChanged = () => {
      loadSubscriptions();
    };

    window.addEventListener(
      "superadmin:companies-changed",
      handleCompaniesChanged
    );

    return () => {
      window.removeEventListener(
        "superadmin:companies-changed",
        handleCompaniesChanged
      );
    };
  }, []);

  const totalInvoiced = useMemo(
    () =>
      invoices.reduce(
        (total, invoice) => total + invoice.total,
        0
      ),
    [invoices]
  );

  const totalPaid = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "Paid")
        .reduce(
          (total, invoice) => total + invoice.total,
          0
        ),
    [invoices]
  );

  const totalPending = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "Pending")
        .reduce(
          (total, invoice) => total + invoice.total,
          0
        ),
    [invoices]
  );

  const totalFailed = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "Failed")
        .reduce(
          (total, invoice) => total + invoice.total,
          0
        ),
    [invoices]
  );

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          subscription.status === "Active" ||
          subscription.status === "Trial"
      ),
    [subscriptions]
  );

  const monthlyRecurringRevenue = useMemo(
    () =>
      activeSubscriptions.reduce(
        (total, subscription) =>
          total + subscription.monthlyPrice,
        0
      ),
    [activeSubscriptions]
  );

  const annualRecurringRevenue = useMemo(
    () => monthlyRecurringRevenue * 12,
    [monthlyRecurringRevenue]
  );

  const paidPercentage =
    totalInvoiced > 0
      ? Math.round((totalPaid / totalInvoiced) * 100)
      : 0;

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !query ||
        invoice.invoiceNumber
          .toLowerCase()
          .includes(query) ||
        invoice.companyName
          .toLowerCase()
          .includes(query) ||
        invoice.plan.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const updateInvoiceStatus = async (
    invoice: Invoice,
    newStatus: InvoiceStatus
  ) => {
    try {
      setActionLoading(invoice.id);
      setError("");

      const updatePayload: Record<string, any> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === "Paid") {
        updatePayload.paid_at =
          new Date().toISOString();
      }

      if (newStatus === "Refunded") {
        updatePayload.refunded_at =
          new Date().toISOString();

        updatePayload.refund_reason =
          "Administrative refund";
      }

      const { data, error: updateError } =
        await supabase
          .from("platform_invoices")
          .update(updatePayload)
          .eq("id", invoice.id)
          .select("*")
          .single();

      if (updateError) {
        console.error(
          "Invoice update error:",
          updateError
        );

        throw updateError;
      }

      const updatedInvoice = mapInvoice(
        data as DatabaseInvoice
      );

      setInvoices((previous) =>
        previous.map((item) =>
          item.id === invoice.id
            ? updatedInvoice
            : item
        )
      );

      setSelectedInvoice((previous) =>
        previous?.id === invoice.id
          ? updatedInvoice
          : previous
      );
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          `Unable to update invoice ${invoice.invoiceNumber}.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPaid = async (invoice: Invoice) => {
    if (invoice.status === "Paid") return;

    await updateInvoiceStatus(invoice, "Paid");
  };

  const handleRefund = async (invoice: Invoice) => {
    if (invoice.status !== "Paid") return;

    const confirmed = window.confirm(
      `Issue a refund for ${invoice.invoiceNumber} (${formatCurrency(
        invoice.total
      )})?`
    );

    if (!confirmed) return;

    await updateInvoiceStatus(invoice, "Refunded");
  };

  const handleResendInvoice = (invoice: Invoice) => {
    const subject = encodeURIComponent(
      `Invoice ${invoice.invoiceNumber} - ${invoice.companyName}`
    );

    const body = encodeURIComponent(
      `Hello,

Please find the invoice details below.

Invoice: ${invoice.invoiceNumber}
Company: ${invoice.companyName}
Plan: ${invoice.plan}
Amount: ${formatCurrency(invoice.total)}
Status: ${invoice.status}
Billing Date: ${formatDate(invoice.billingDate)}
Due Date: ${formatDate(invoice.dueDate)}

Regards,
CoreHR Billing Team`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleExportBillingReport = () => {
    if (filteredInvoices.length === 0) {
      setError("There are no invoices to export.");
      return;
    }

    const headers = [
      "Invoice Number",
      "Company",
      "Plan",
      "Status",
      "Subtotal",
      "Taxes",
      "Total",
      "Billing Date",
      "Due Date",
      "Transaction ID",
      "Payment Method",
    ];

    const rows = filteredInvoices.map((invoice) => [
      invoice.invoiceNumber,
      invoice.companyName,
      invoice.plan,
      invoice.status,
      invoice.subtotal,
      invoice.taxes,
      invoice.total,
      invoice.billingDate,
      invoice.dueDate || "",
      invoice.transactionId || "",
      invoice.paymentMethod || "",
    ]);

    const escapeCsvValue = (value: unknown) => {
      const stringValue = String(value ?? "");

      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const csv = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) =>
        row.map(escapeCsvValue).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    link.download = `billing-ledger-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const statusClass = (status: InvoiceStatus) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700";

      case "Failed":
        return "bg-rose-100 text-rose-700";

      case "Pending":
        return "bg-amber-100 text-amber-700";

      case "Refunded":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const statusDotClass = (status: InvoiceStatus) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500";

      case "Failed":
        return "bg-rose-500";

      case "Pending":
        return "bg-amber-500";

      case "Refunded":
        return "bg-slate-500";

      default:
        return "bg-slate-500";
    }
  };

  const subscriptionStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700";

      case "Trial":
        return "bg-indigo-100 text-indigo-700";

      case "Suspended":
        return "bg-rose-100 text-rose-700";

      case "Pending":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Finance, Billing & Invoices
          </h2>

          <p className="text-xs text-slate-500">
            Manage tenant subscriptions, billing cycles,
            renewals, invoices, and payment records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadBillingData(true)}
            disabled={refreshing}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-2 transition-all disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

          <button
            onClick={handleExportBillingReport}
            disabled={
              loading ||
              filteredInvoices.length === 0
            }
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />

            Export Ledger
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          <div>
            <p className="font-bold">
              Billing operation failed
            </p>

            <p className="mt-1">{error}</p>
          </div>

          <button
            onClick={() => setError("")}
            className="text-rose-400 hover:text-rose-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Billing Overview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-indigo-600" />

          <h3 className="text-sm font-bold text-slate-900">
            Billing Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Active Subscriptions
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {subscriptionLoading
                  ? "—"
                  : activeSubscriptions.length}
              </span>

              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Live
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              Active and trial tenants
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Monthly Recurring Revenue
            </span>

            <div className="mt-2">
              <span className="text-2xl font-black text-indigo-600">
                {formatINR(monthlyRecurringRevenue)}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              Based on active tenant plans
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Annual Recurring Value
            </span>

            <div className="mt-2">
              <span className="text-2xl font-black text-violet-600">
                {formatINR(annualRecurringRevenue)}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              Monthly subscription value × 12
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Total Tenants
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {subscriptionLoading
                  ? "—"
                  : subscriptions.length}
              </span>

              <span className="text-xs font-bold text-slate-500">
                Companies
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              Directly from tenant subscriptions
            </p>
          </div>
        </div>
      </div>

      {/* Direct Tenant Billing */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />

              <h3 className="text-sm font-bold text-slate-900">
                Tenant Subscriptions & Direct Billing
              </h3>
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              Live subscription and billing information from the
              companies table
            </p>
          </div>

          <div className="text-[11px] font-semibold text-slate-500">
            {subscriptions.length} tenant
            {subscriptions.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  Tenant
                </th>

                <th className="py-3.5 px-4">
                  Plan
                </th>

                <th className="py-3.5 px-4">
                  Billing Cycle
                </th>

                <th className="py-3.5 px-4">
                  Price
                </th>

                <th className="py-3.5 px-4">
                  Renewal
                </th>

                <th className="py-3.5 px-4">
                  Auto Renewal
                </th>

                <th className="py-3.5 px-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {subscriptionLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />

                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Loading tenant billing details...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Building2 className="w-6 h-6 text-slate-300" />

                      <p className="mt-3 text-sm font-bold text-slate-700">
                        No tenant subscriptions found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Create a tenant from Tenant Management to
                        see its billing details here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr
                    key={subscription.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-slate-800">
                          {subscription.companyName}
                        </p>

                        <p className="font-mono text-[10px] text-indigo-600 mt-0.5">
                          {subscription.tenantId}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {subscription.plan}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />

                        {subscription.billingCycle}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <p className="font-extrabold text-slate-900">
                          {formatINR(
                            subscription.monthlyPrice
                          )}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          / month
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      {formatDate(
                        subscription.renewalDate
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${
                          subscription.autoRenewal
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            subscription.autoRenewal
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {subscription.autoRenewal
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${subscriptionStatusClass(
                          subscription.status
                        )}`}
                      >
                        {subscription.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Billing Details Cards */}
      {subscriptions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />

            <h3 className="text-sm font-bold text-slate-900">
              Subscription Resource Allocation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <div
                key={`resources-${subscription.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {subscription.companyName}
                    </p>

                    <p className="text-[10px] font-mono text-indigo-600 mt-0.5">
                      {subscription.tenantId}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {subscription.plan}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Employees
                    </p>

                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      {subscription.employeesCount}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {" "}
                        / {subscription.employeeQuota}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Storage
                    </p>

                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      {subscription.storageUsedGb}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {" "}
                        / {subscription.storageQuotaGb} GB
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      API MTD
                    </p>

                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      {subscription.apiRequestsMtd.toLocaleString()}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {" "}
                        /{" "}
                        {subscription.apiQuota.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Renewal
                    </p>

                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {formatDate(
                        subscription.renewalDate
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Subscription
                    </p>

                    <p className="text-xs font-bold text-indigo-600 mt-1">
                      {formatINR(
                        subscription.monthlyPrice
                      )}
                      /mo
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice Billing KPIs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-indigo-600" />

          <h3 className="text-sm font-bold text-slate-900">
            Invoice Ledger
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Total Billed YTD
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {formatCurrency(totalInvoiced)}
              </span>

              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Live
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              {invoices.length} invoices generated
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Cleared & Paid
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">
                {formatCurrency(totalPaid)}
              </span>

              <span className="text-xs font-bold text-slate-500">
                {paidPercentage}%
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              Successfully settled invoices
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Pending Receivables
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600">
                {formatCurrency(totalPending)}
              </span>

              <span className="text-xs font-bold text-amber-600">
                Pending
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              {
                invoices.filter(
                  (invoice) =>
                    invoice.status === "Pending"
                ).length
              }{" "}
              pending invoices
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Failed / Overdue
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600">
                {formatCurrency(totalFailed)}
              </span>

              <span className="text-xs font-bold text-rose-600">
                Action Req
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              {
                invoices.filter(
                  (invoice) =>
                    invoice.status === "Failed"
                ).length
              }{" "}
              failed invoices
            </p>
          </div>
        </div>
      </div>

      {/* Search / Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search by invoice # or company..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase">
            Filter:
          </span>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">
              All Invoices ({invoices.length})
            </option>

            <option value="Paid">
              Paid (
              {
                invoices.filter(
                  (invoice) =>
                    invoice.status === "Paid"
                ).length
              }
              )
            </option>

            <option value="Pending">
              Pending (
              {
                invoices.filter(
                  (invoice) =>
                    invoice.status === "Pending"
                ).length
              }
              )
            </option>

            <option value="Failed">
              Failed / Declined (
              {
                invoices.filter(
                  (invoice) =>
                    invoice.status === "Failed"
                ).length
              }
              )
            </option>

            <option value="Refunded">
              Refunded (
              {
                invoices.filter(
                  (invoice) =>
                    invoice.status === "Refunded"
                ).length
              }
              )
            </option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  Invoice #
                </th>

                <th className="py-3.5 px-4">
                  Company
                </th>

                <th className="py-3.5 px-4">
                  Plan Tier
                </th>

                <th className="py-3.5 px-4">
                  Amount
                </th>

                <th className="py-3.5 px-4">
                  Issue Date
                </th>

                <th className="py-3.5 px-4">
                  Due Date
                </th>

                <th className="py-3.5 px-4">
                  Status
                </th>

                <th className="py-3.5 px-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />

                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Loading invoices from Supabase...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Search className="w-5 h-5 text-slate-400" />
                      </div>

                      <p className="mt-3 text-sm font-bold text-slate-700">
                        No invoices found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try another search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() =>
                      setSelectedInvoice(invoice)
                    }
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 group-hover:underline">
                      {invoice.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {invoice.companyName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {invoice.plan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatCurrency(invoice.total)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(invoice.billingDate)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(invoice.dueDate)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${statusClass(
                          invoice.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDotClass(
                            invoice.status
                          )}`}
                        />

                        {invoice.status}
                      </span>
                    </td>

                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          onClick={() =>
                            setSelectedInvoice(invoice)
                          }
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          View
                        </button>

                        {invoice.status !== "Paid" &&
                          invoice.status !== "Refunded" && (
                            <button
                              disabled={
                                actionLoading ===
                                invoice.id
                              }
                              onClick={() =>
                                handleMarkPaid(invoice)
                              }
                              className="px-2.5 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50"
                            >
                              {actionLoading ===
                              invoice.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Mark Paid"
                              )}
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                  INV
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Invoice Details —{" "}
                    {selectedInvoice.invoiceNumber}
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    Issued to{" "}
                    {selectedInvoice.companyName}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedInvoice(null)
                }
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Sheet */}
            <div
              id="printable-invoice"
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    CoreHR Platform, Inc.
                  </h4>

                  <p className="text-xs text-slate-500 mt-1">
                    100 Enterprise Way, Suite 400
                  </p>

                  <p className="text-xs text-slate-500">
                    San Francisco, CA 94107, USA
                  </p>

                  <p className="text-xs text-slate-500">
                    billing@corehr-platform.com
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold inline-block mb-2 ${statusClass(
                      selectedInvoice.status
                    )}`}
                  >
                    STATUS:{" "}
                    {selectedInvoice.status.toUpperCase()}
                  </span>

                  <p className="font-mono text-xs text-slate-500">
                    Date:{" "}
                    {formatDate(
                      selectedInvoice.billingDate
                    )}
                  </p>

                  <p className="font-mono text-xs text-slate-500">
                    Due:{" "}
                    {formatDate(
                      selectedInvoice.dueDate
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Billed To:
                  </span>

                  <p className="font-bold text-slate-900 text-sm">
                    {selectedInvoice.companyName}
                  </p>

                  <p className="text-slate-600 mt-0.5">
                    {selectedInvoice.billingAddress ||
                      "Corporate Headquarters"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Payment Gateway Ref:
                  </span>

                  <p className="font-mono text-slate-700 font-semibold">
                    {selectedInvoice.transactionId ||
                      "—"}
                  </p>

                  <p className="text-slate-500 mt-0.5">
                    Method:{" "}
                    {selectedInvoice.paymentMethod ||
                      "—"}
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">
                        Description
                      </th>

                      <th className="py-2.5 px-3 text-center">
                        Qty
                      </th>

                      <th className="py-2.5 px-3 text-right">
                        Unit Price
                      </th>

                      <th className="py-2.5 px-3 text-right">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-slate-400"
                        >
                          No invoice items recorded.
                        </td>
                      </tr>
                    ) : (
                      selectedInvoice.items.map(
                        (item, index) => (
                          <tr key={index}>
                            <td className="py-2.5 px-3 font-medium text-slate-800">
                              {item.description}
                            </td>

                            <td className="py-2.5 px-3 text-center text-slate-600">
                              {item.quantity}
                            </td>

                            <td className="py-2.5 px-3 text-right text-slate-600">
                              {formatCurrency(
                                item.unitPrice
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>

                    <span>
                      {formatCurrency(
                        selectedInvoice.subtotal
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Duties:</span>

                    <span>
                      {formatCurrency(
                        selectedInvoice.taxes
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total:</span>

                    <span className="text-indigo-600">
                      {formatCurrency(
                        selectedInvoice.total
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {selectedInvoice.status ===
                "Refunded" &&
                selectedInvoice.refundReason && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      Refund Reason
                    </p>

                    <p className="text-xs text-amber-800 mt-1">
                      {
                        selectedInvoice.refundReason
                      }
                    </p>
                  </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />

                  Print / Save PDF
                </button>

                <button
                  onClick={() =>
                    handleResendInvoice(
                      selectedInvoice
                    )
                  }
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />

                  Email to Admin
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedInvoice.status !==
                  "Paid" &&
                  selectedInvoice.status !==
                    "Refunded" && (
                    <button
                      disabled={
                        actionLoading ===
                        selectedInvoice.id
                      }
                      onClick={() =>
                        handleMarkPaid(
                          selectedInvoice
                        )
                      }
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-60 flex items-center gap-2"
                    >
                      {actionLoading ===
                      selectedInvoice.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark as Paid
                        </>
                      )}
                    </button>
                  )}

                {selectedInvoice.status ===
                  "Paid" && (
                  <button
                    disabled={
                      actionLoading ===
                      selectedInvoice.id
                    }
                    onClick={() =>
                      handleRefund(selectedInvoice)
                    }
                    className="px-4 py-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg cursor-pointer disabled:opacity-60"
                  >
                    {actionLoading ===
                    selectedInvoice.id
                      ? "Processing..."
                      : "Issue Refund"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};