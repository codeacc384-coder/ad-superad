import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import { useApp } from "../../context/useApp";

type LeadStatus =
  | "new"
  | "reviewing"
  | "verified"
  | "rejected"
  | "converted";

type Lead = {
  id: number;
  full_name: string;
  work_email: string;
  company_name: string;
  phone_number: string;
  company_size: string;
  subject: string;
  message: string;
  selected_plan: string | null;
  created_at: string;
  status: LeadStatus;
  reviewed_at: string | null;
  reviewed_by: string | null;
  converted_company_id: string | null;
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  verified: "Verified",
  rejected: "Rejected",
  converted: "Converted",
};

const STATUS_CLASSES: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700",
  verified: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  converted: "bg-purple-100 text-purple-700",
};

function LeadsView() {
  const { showSuccess, showError } = useApp();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const loadLeads = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage("");

        const { data, error } = await supabase
          .from("enquiries")
          .select(`
            id,
            full_name,
            work_email,
            company_name,
            phone_number,
            company_size,
            subject,
            message,
            selected_plan,
            created_at,
            status,
            reviewed_at,
            reviewed_by,
            converted_company_id
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase Leads query error:", error);
          throw new Error(
            error.message || "Unable to load enquiries."
          );
        }

        const formattedLeads: Lead[] = (data ?? []).map((row) => {
          const rawStatus = row.status;

          const status: LeadStatus =
            rawStatus === "new" ||
            rawStatus === "reviewing" ||
            rawStatus === "verified" ||
            rawStatus === "rejected" ||
            rawStatus === "converted"
              ? rawStatus
              : "new";

          return {
            id: row.id,
            full_name: row.full_name ?? "",
            work_email: row.work_email ?? "",
            company_name: row.company_name ?? "",
            phone_number: row.phone_number ?? "",
            company_size: row.company_size ?? "",
            subject: row.subject ?? "",
            message: row.message ?? "",
            selected_plan: row.selected_plan ?? null,
            created_at: row.created_at,
            status,
            reviewed_at: row.reviewed_at ?? null,
            reviewed_by: row.reviewed_by ?? null,
            converted_company_id:
              row.converted_company_id ?? null,
          };
        });

        setLeads(formattedLeads);
      } catch (error) {
        console.error("Failed to load leads:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load leads from Supabase.";

        setErrorMessage(message);

        if (showError) {
          showError(message);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return leads;
    }

    return leads.filter((lead) => {
      return (
        lead.full_name.toLowerCase().includes(search) ||
        lead.work_email.toLowerCase().includes(search) ||
        lead.company_name.toLowerCase().includes(search) ||
        lead.subject.toLowerCase().includes(search) ||
        (lead.selected_plan ?? "").toLowerCase().includes(search)
      );
    });
  }, [leads, searchTerm]);

  const summary = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      reviewing: leads.filter(
        (lead) => lead.status === "reviewing"
      ).length,
      verified: leads.filter(
        (lead) => lead.status === "verified"
      ).length,
      rejected: leads.filter(
        (lead) => lead.status === "rejected"
      ).length,
      converted: leads.filter(
        (lead) => lead.status === "converted"
      ).length,
    };
  }, [leads]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateLeadStatus = async (
    lead: Lead,
    newStatus: LeadStatus
  ) => {
    if (isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.warn(
          "Unable to get current Supabase user:",
          authError.message
        );
      }

      const updatePayload = {
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id ?? null,
      };

      const { data, error } = await supabase
        .from("enquiries")
        .update(updatePayload)
        .eq("id", lead.id)
        .select(`
          id,
          full_name,
          work_email,
          company_name,
          phone_number,
          company_size,
          subject,
          message,
          selected_plan,
          created_at,
          status,
          reviewed_at,
          reviewed_by,
          converted_company_id
        `)
        .single();

      if (error) {
        console.error(
          "Supabase lead status update error:",
          error
        );

        throw new Error(
          error.message || "Unable to update lead status."
        );
      }

      const updatedLead: Lead = {
        id: data.id,
        full_name: data.full_name ?? "",
        work_email: data.work_email ?? "",
        company_name: data.company_name ?? "",
        phone_number: data.phone_number ?? "",
        company_size: data.company_size ?? "",
        subject: data.subject ?? "",
        message: data.message ?? "",
        selected_plan: data.selected_plan ?? null,
        created_at: data.created_at,
        status:
          data.status === "new" ||
          data.status === "reviewing" ||
          data.status === "verified" ||
          data.status === "rejected" ||
          data.status === "converted"
            ? data.status
            : "new",
        reviewed_at: data.reviewed_at ?? null,
        reviewed_by: data.reviewed_by ?? null,
        converted_company_id:
          data.converted_company_id ?? null,
      };

      setLeads((currentLeads) =>
        currentLeads.map((item) =>
          item.id === updatedLead.id ? updatedLead : item
        )
      );

      setSelectedLead(updatedLead);

      if (showSuccess) {
        showSuccess(
          `Lead status updated to ${STATUS_LABELS[newStatus]}.`
        );
      }
    } catch (error) {
      console.error("Failed to update lead:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update lead status.";

      if (showError) {
        showError(message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusActions = (lead: Lead) => {
    switch (lead.status) {
      case "new":
        return (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              updateLeadStatus(lead, "reviewing")
            }
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Review
          </button>
        );

      case "reviewing":
        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateLeadStatus(lead, "verified")
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Verify
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateLeadStatus(lead, "rejected")
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        );

      case "rejected":
        return (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              updateLeadStatus(lead, "new")
            }
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reopen
          </button>
        );

      case "verified":
        return (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            This lead has been verified.
          </div>
        );

      case "converted":
        return (
          <div className="rounded-lg bg-purple-50 px-4 py-3 text-sm text-purple-700">
            This lead has been converted.
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leads
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage enquiries submitted from The Cloud Base website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLeads(true)}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={isRefreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Supabase Status */}
      <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <CheckCircle2
          size={20}
          className="mt-0.5 shrink-0 text-green-600"
        />

        <div>
          <p className="font-semibold text-green-800">
            Supabase connected
          </p>
          <p className="mt-0.5 text-sm text-green-700">
            Leads are loaded directly from the enquiries table.
          </p>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="font-semibold text-red-800">
              Unable to load leads
            </p>

            <p className="mt-1 text-sm text-red-700">
              {errorMessage}
            </p>

            <p className="mt-2 text-xs text-red-600">
              Check your Supabase URL/key and the SELECT policy
              for the enquiries table.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <SummaryCard
          title="Total"
          value={summary.total}
          icon={<Building2 size={19} />}
        />

        <SummaryCard
          title="New"
          value={summary.new}
          icon={<Clock size={19} />}
        />

        <SummaryCard
          title="Reviewing"
          value={summary.reviewing}
          icon={<Search size={19} />}
        />

        <SummaryCard
          title="Verified"
          value={summary.verified}
          icon={<CheckCircle2 size={19} />}
        />

        <SummaryCard
          title="Rejected"
          value={summary.rejected}
          icon={<X size={19} />}
        />

        <SummaryCard
          title="Converted"
          value={summary.converted}
          icon={<CheckCircle2 size={19} />}
        />
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by name, email, company, subject or plan..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <RefreshCw
                size={19}
                className="animate-spin"
              />
              Loading enquiries...
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <MessageSquare size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              {searchTerm
                ? "No leads found"
                : "No enquiries yet"}
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              {searchTerm
                ? "Try changing your search term."
                : "Enquiries submitted through the landing page will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Lead
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Plan
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Received
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Lead */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                          <User size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {lead.full_name || "Unnamed"}
                          </p>

                          <p className="truncate text-sm text-gray-500">
                            {lead.work_email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {lead.company_name || "—"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {lead.company_size || "Size not provided"}
                      </p>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      {lead.selected_plan ? (
                        <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                          {lead.selected_plan}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not selected
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={15} />
                        {formatDate(lead.created_at)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[lead.status]}`}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>

                    {/* View */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && filteredLeads.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
      )}

      {/* Lead Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close lead details"
            onClick={() => setSelectedLead(null)}
            className="absolute inset-0 cursor-default bg-black/40"
          />

          {/* Drawer */}
          <aside className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Lead #{selectedLead.id}
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedLead.full_name || "Unnamed Lead"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedLead.company_name || "Company not provided"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Status */}
              <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[selectedLead.status]}`}
                  >
                    {STATUS_LABELS[selectedLead.status]}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Received
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(selectedLead.created_at)}
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <DetailRow
                    icon={<User size={17} />}
                    label="Full Name"
                    value={selectedLead.full_name}
                  />

                  <DetailRow
                    icon={<Mail size={17} />}
                    label="Work Email"
                    value={selectedLead.work_email}
                  />

                  <DetailRow
                    icon={<Building2 size={17} />}
                    label="Company"
                    value={selectedLead.company_name}
                  />

                  <DetailRow
                    icon={<Phone size={17} />}
                    label="Phone"
                    value={selectedLead.phone_number}
                  />

                  <DetailRow
                    icon={<Building2 size={17} />}
                    label="Company Size"
                    value={selectedLead.company_size}
                  />
                </div>
              </section>

              {/* Enquiry */}
              <section className="mt-8">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                  Enquiry
                </h3>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">
                    {selectedLead.subject || "No subject"}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {selectedLead.message || "No message provided."}
                  </p>
                </div>
              </section>

              {/* Plan */}
              <section className="mt-8">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                  Selected Plan
                </h3>

                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <p className="font-semibold text-violet-800">
                    {selectedLead.selected_plan ||
                      "No plan selected"}
                  </p>
                </div>
              </section>

              {/* Activity */}
              <section className="mt-8">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                  Activity
                </h3>

                <div className="space-y-3">
                  <ActivityRow
                    title="Enquiry received"
                    date={selectedLead.created_at}
                  />

                  {selectedLead.reviewed_at && (
                    <ActivityRow
                      title={`Lead marked as ${STATUS_LABELS[selectedLead.status].toLowerCase()}`}
                      date={selectedLead.reviewed_at}
                    />
                  )}
                </div>
              </section>

              {/* Workflow */}
              <section className="mt-8">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                  Workflow
                </h3>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[selectedLead.status]}`}
                    >
                      {STATUS_LABELS[selectedLead.status]}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Reviewed At
                    </span>

                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(selectedLead.reviewed_at)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Reviewed By
                    </span>

                    <span className="max-w-[230px] truncate text-right text-sm font-medium text-gray-900">
                      {selectedLead.reviewed_by || "Not reviewed"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Converted Company
                    </span>

                    <span className="max-w-[230px] truncate text-right text-sm font-medium text-gray-900">
                      {selectedLead.converted_company_id ||
                        "Not converted"}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-200 bg-white px-6 py-5">
              {getStatusActions(selectedLead)}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-gray-900">
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-gray-500">
        {title}
      </p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="mt-0.5 text-violet-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function ActivityRow({
  title,
  date,
}: {
  title: string;
  date: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-500" />

      <div>
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export { LeadsView };
export default LeadsView;