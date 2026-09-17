import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  Users,
  AlertCircle,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Employee {
  id: string;
  employee_code: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  department: string | null;
  location: string | null;
  designation: string | null;
  joining_date: string | null;
}

interface OnboardingRecord {
  id: string;
  employee_id: string;
  status: string | null;

  personal_details_complete: boolean | null;
  documents_collected: boolean | null;
  documents_verified: boolean | null;
  bank_details_complete: boolean | null;
  statutory_details_complete: boolean | null;
  offer_document: boolean | null;
  policy_acknowledged: boolean | null;
  it_asset_allocated: boolean | null;

  work_email_created: boolean | null;
  id_card_issued: boolean | null;
  team_assigned: boolean | null;
  manager_assigned: boolean | null;
  training_completed: boolean | null;

  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface OnboardingRow {
  onboarding: OnboardingRecord;
  employee: Employee | null;
}

interface OnboardingPageProps {
  onShowToast?: (message: string, type?: string) => void;
}

const CHECKLIST_FIELDS: Array<{
  key: keyof OnboardingRecord;
  label: string;
}> = [
  {
    key: "personal_details_complete",
    label: "Personal Details",
  },
  {
    key: "documents_collected",
    label: "Documents Collected",
  },
  {
    key: "documents_verified",
    label: "Documents Verified",
  },
  {
    key: "bank_details_complete",
    label: "Bank Details",
  },
  {
    key: "statutory_details_complete",
    label: "Statutory Details",
  },
  {
    key: "offer_document",
    label: "Offer Document",
  },
  {
    key: "policy_acknowledged",
    label: "Policy Acknowledged",
  },
  {
    key: "it_asset_allocated",
    label: "IT Asset",
  },
];

const getEmployeeName = (employee: Employee | null) => {
  if (!employee) return "Unknown Employee";

  if (employee.full_name?.trim()) {
    return employee.full_name.trim();
  }

  return `${employee.first_name || ""} ${
    employee.last_name || ""
  }`.trim() || "Unknown Employee";
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${
    parts[parts.length - 1][0] || ""
  }`.toUpperCase();
};

const formatDate = (date: string | null) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getProgress = (record: OnboardingRecord) => {
  const completed = CHECKLIST_FIELDS.filter(
    (item) => record[item.key] === true
  ).length;

  return {
    completed,
    total: CHECKLIST_FIELDS.length,
    percentage: Math.round(
      (completed / CHECKLIST_FIELDS.length) * 100
    ),
  };
};

const getStatus = (record: OnboardingRecord) => {
  const status = (record.status || "In Progress")
    .toLowerCase()
    .replace(/_/g, " ");

  if (status === "completed" || status === "complete") {
    return "Completed";
  }

  if (
    status === "action required" ||
    status === "action_required"
  ) {
    return "Action Required";
  }

  return "In Progress";
};

export const OnboardingPage: React.FC<
  OnboardingPageProps
> = ({ onShowToast }) => {
  const [rows, setRows] = useState<OnboardingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] =
    useState("All Locations");

  const [selectedRow, setSelectedRow] =
    useState<OnboardingRow | null>(null);

  const loadOnboarding = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      /*
       * IMPORTANT:
       * We intentionally fetch both tables separately.
       *
       * employee_onboarding.employee_id
       *            ↓
       * employees.id
       *
       * This avoids depending on Supabase's generated
       * relationship name.
       */

      const [
        onboardingResult,
        employeesResult,
      ] = await Promise.all([
        supabase
          .from("employee_onboarding")
          .select(`
            id,
            employee_id,
            status,
            personal_details_complete,
            documents_collected,
            documents_verified,
            bank_details_complete,
            statutory_details_complete,
            offer_document,
            policy_acknowledged,
            it_asset_allocated,
            work_email_created,
            id_card_issued,
            team_assigned,
            manager_assigned,
            training_completed,
            notes,
            started_at,
            completed_at,
            created_at,
            updated_at
          `)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("employees")
          .select(`
            id,
            employee_code,
            first_name,
            last_name,
            full_name,
            department,
            location,
            designation,
            joining_date
          `)
          .order("full_name", {
            ascending: true,
          }),
      ]);

      if (onboardingResult.error) {
        throw new Error(
          `Onboarding query failed: ${onboardingResult.error.message}`
        );
      }

      if (employeesResult.error) {
        throw new Error(
          `Employee query failed: ${employeesResult.error.message}`
        );
      }

      const onboardingData =
        (onboardingResult.data || []) as OnboardingRecord[];

      const employeeData =
        (employeesResult.data || []) as Employee[];

      const employeeMap = new Map<string, Employee>();

      employeeData.forEach((employee) => {
        employeeMap.set(employee.id, employee);
      });

      const mergedRows: OnboardingRow[] =
        onboardingData.map((onboarding) => ({
          onboarding,
          employee:
            employeeMap.get(onboarding.employee_id) ||
            null,
        }));

      setRows(mergedRows);

      console.log(
        "ONBOARDING RECORDS:",
        onboardingData
      );

      console.log(
        "EMPLOYEES:",
        employeeData
      );

      console.log(
        "MERGED ONBOARDING:",
        mergedRows
      );
    } catch (error) {
      console.error(
        "ONBOARDING LOAD ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load onboarding data.";

      setErrorMessage(message);

      onShowToast?.(
        "Unable to load onboarding data.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOnboarding();
  }, []);

  const locations = useMemo(() => {
    const values = rows
      .map((row) => row.employee?.location)
      .filter(
        (location): location is string =>
          Boolean(location?.trim())
      );

    return [
      "All Locations",
      ...Array.from(new Set(values)),
    ];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const employee = row.employee;

      const name = getEmployeeName(employee);
      const employeeCode =
        employee?.employee_code || "";
      const department =
        employee?.department || "";
      const location =
        employee?.location || "";

      const matchesSearch =
        !query ||
        `${name} ${employeeCode} ${department} ${location}`
          .toLowerCase()
          .includes(query);

      const matchesLocation =
        locationFilter === "All Locations" ||
        location === locationFilter;

      return (
        matchesSearch &&
        matchesLocation
      );
    });
  }, [rows, search, locationFilter]);

  const statistics = useMemo(() => {
    const total = filteredRows.length;

    const completed = filteredRows.filter(
      (row) =>
        getStatus(row.onboarding) === "Completed"
    ).length;

    const actionRequired =
      filteredRows.filter(
        (row) =>
          getStatus(row.onboarding) ===
          "Action Required"
      ).length;

    const inProgress =
      filteredRows.filter(
        (row) =>
          getStatus(row.onboarding) ===
          "In Progress"
      ).length;

    return {
      total,
      completed,
      inProgress,
      actionRequired,
    };
  }, [filteredRows]);

  return (
    <div className="min-h-full space-y-6 bg-[#f7f8fa] p-1">
      {/* PAGE HEADER */}
      <section className="rounded-2xl border border-[#dedee3] bg-white p-7 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[24px] font-bold tracking-tight text-[#101828]">
                Employee Onboarding Management
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Admin View
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm text-[#667085]">
              Monitor employee onboarding, document
              verification, joining readiness, and HR
              ownership across all company locations.
            </p>
          </div>

          <button
            onClick={loadOnboarding}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9d9df] bg-white px-4 py-2.5 text-sm font-semibold text-[#344054] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="TOTAL ONBOARDING"
          value={statistics.total}
          subtitle="Active onboarding records"
          icon={<Users className="h-5 w-5" />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="COMPLETED"
          value={statistics.completed}
          subtitle="Ready for joining"
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          iconClass="bg-emerald-50 text-emerald-600"
          valueClass="text-emerald-700"
        />

        <StatCard
          title="IN PROGRESS"
          value={statistics.inProgress}
          subtitle="HR onboarding underway"
          icon={<Clock3 className="h-5 w-5" />}
          iconClass="bg-blue-50 text-blue-600"
          valueClass="text-blue-700"
        />

        <StatCard
          title="ACTION REQUIRED"
          value={statistics.actionRequired}
          subtitle="Requires administrative attention"
          icon={
            <AlertCircle className="h-5 w-5" />
          }
          iconClass="bg-red-50 text-red-600"
          valueClass="text-red-700"
        />
      </section>

      {/* MAIN RECORDS */}
      <section className="overflow-hidden rounded-2xl border border-[#dedee3] bg-white shadow-sm">
        {/* SECTION HEADER */}
        <div className="border-b border-[#e6e7eb] px-6 py-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#667085]" />

                <h2 className="text-[18px] font-bold text-[#101828]">
                  Onboarding Records by Location
                </h2>
              </div>

              <p className="mt-1 text-sm text-[#667085]">
                View employee onboarding information
                based on company branch or location.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-[#667085]">
                Location
              </span>

              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(e.target.value)
                }
                className="min-w-[190px] rounded-xl border border-[#d0d5dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#344054] outline-none focus:border-[#667085]"
              >
                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MINI STATS */}
        <div className="grid grid-cols-1 gap-3 border-b border-[#e6e7eb] bg-[#fcfcfd] p-5 md:grid-cols-4">
          <MiniStat
            label="TOTAL"
            value={statistics.total}
          />

          <MiniStat
            label="COMPLETED"
            value={statistics.completed}
          />

          <MiniStat
            label="IN PROGRESS"
            value={statistics.inProgress}
          />

          <MiniStat
            label="ACTION REQUIRED"
            value={statistics.actionRequired}
          />
        </div>

        {/* SEARCH */}
        <div className="border-b border-[#e6e7eb] p-5">
          <div className="relative max-w-[430px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search employee, code, department..."
              className="w-full rounded-xl border border-[#d0d5dd] bg-white py-2.5 pl-10 pr-4 text-sm text-[#101828] outline-none placeholder:text-[#98a2b3] focus:border-[#667085]"
            />
          </div>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p className="font-semibold">
                  Unable to load onboarding data
                </p>

                <p className="mt-1">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-[#e6e7eb] bg-[#f8f8fa]">
                <TableHeader>
                  EMPLOYEE
                </TableHeader>

                <TableHeader>
                  DEPARTMENT
                </TableHeader>

                <TableHeader>
                  LOCATION
                </TableHeader>

                <TableHeader>
                  JOINING DATE
                </TableHeader>

                <TableHeader>
                  PROGRESS
                </TableHeader>

                <TableHeader>
                  STATUS
                </TableHeader>

                <TableHeader align="right">
                  ACTION
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center"
                  >
                    <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[#344054]" />

                    <p className="mt-3 text-sm text-[#667085]">
                      Loading onboarding records...
                    </p>
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center"
                  >
                    <Users className="mx-auto h-8 w-8 text-[#98a2b3]" />

                    <p className="mt-3 font-semibold text-[#344054]">
                      No onboarding records found
                    </p>

                    <p className="mt-1 text-sm text-[#667085]">
                      Try changing the location or
                      search filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const employee =
                    row.employee;

                  const name =
                    getEmployeeName(employee);

                  const progress =
                    getProgress(
                      row.onboarding
                    );

                  const status =
                    getStatus(
                      row.onboarding
                    );

                  return (
                    <tr
                      key={row.onboarding.id}
                      className="border-b border-[#eef0f2] transition hover:bg-[#fcfcfd]"
                    >
                      {/* EMPLOYEE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[11px] font-bold text-white">
                            {getInitials(name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#101828]">
                              {name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#667085]">
                              {employee?.employee_code ||
                                "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DEPARTMENT */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#101828]">
                          {employee?.department ||
                            "—"}
                        </p>

                        <p className="mt-0.5 text-xs text-[#667085]">
                          {employee?.designation ||
                            "—"}
                        </p>
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#344054]">
                          <MapPin className="h-4 w-4 text-[#667085]" />

                          {employee?.location ||
                            "—"}
                        </div>
                      </td>

                      {/* JOINING DATE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#667085]">
                          <CalendarDays className="h-4 w-4" />

                          {formatDate(
                            employee?.joining_date ||
                              null
                          )}
                        </div>
                      </td>

                      {/* PROGRESS */}
                      <td className="px-6 py-4">
                        <div className="min-w-[145px]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#344054]">
                              {progress.completed} /{" "}
                              {progress.total}
                            </span>

                            <span className="font-bold text-[#344054]">
                              {progress.percentage}%
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9eaee]">
                            <div
                              className="h-full rounded-full bg-[#111827] transition-all"
                              style={{
                                width: `${progress.percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={status}
                        />
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setSelectedRow(row)
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-[#d0d5dd] bg-white px-3.5 py-2 text-xs font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* DETAILS MODAL */}
      {selectedRow && (
        <OnboardingDetailsModal
          row={selectedRow}
          onClose={() =>
            setSelectedRow(null)
          }
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

const StatCard: React.FC<{
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  valueClass?: string;
}> = ({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  valueClass = "text-[#101828]",
}) => (
  <div className="rounded-2xl border border-[#dedee3] bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#667085]">
          {title}
        </p>

        <p
          className={`mt-3 text-[29px] font-bold tracking-tight ${valueClass}`}
        >
          {value}
        </p>

        <p className="mt-2 text-xs text-[#667085]">
          {subtitle}
        </p>
      </div>

      <div
        className={`rounded-xl p-3 ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const MiniStat: React.FC<{
  label: string;
  value: number;
}> = ({ label, value }) => (
  <div className="rounded-xl border border-[#e4e7ec] bg-white px-4 py-3">
    <p className="text-[10px] font-bold uppercase tracking-wide text-[#667085]">
      {label}
    </p>

    <p className="mt-1 text-lg font-bold text-[#101828]">
      {value}
    </p>
  </div>
);

const TableHeader: React.FC<{
  children: React.ReactNode;
  align?: "left" | "right";
}> = ({ children, align = "left" }) => (
  <th
    className={`px-6 py-3.5 text-[10px] font-bold tracking-wide text-[#667085] ${
      align === "right"
        ? "text-right"
        : "text-left"
    }`}
  >
    {children}
  </th>
);

const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
        Completed
      </span>
    );
  }

  if (status === "Action Required") {
    return (
      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700">
        Action Required
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
      In Progress
    </span>
  );
};

const OnboardingDetailsModal: React.FC<{
  row: OnboardingRow;
  onClose: () => void;
}> = ({ row, onClose }) => {
  const employee = row.employee;
  const record = row.onboarding;

  const name = getEmployeeName(employee);
  const progress = getProgress(record);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e4e7ec] bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111827] text-xs font-bold text-white">
              {getInitials(name)}
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#101828]">
                {name}
              </h3>

              <p className="text-xs text-[#667085]">
                {employee?.employee_code || "—"}{" "}
                •{" "}
                {employee?.department || "—"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#667085] hover:bg-[#f2f4f7]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="space-y-6 p-6">
          {/* SUMMARY */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <DetailBox
              label="Location"
              value={
                employee?.location || "—"
              }
            />

            <DetailBox
              label="Joining Date"
              value={formatDate(
                employee?.joining_date ||
                  null
              )}
            />

            <DetailBox
              label="Status"
              value={getStatus(record)}
            />
          </div>

          {/* PROGRESS */}
          <div className="rounded-xl border border-[#e4e7ec] bg-[#fcfcfd] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#101828]">
                  Onboarding Progress
                </p>

                <p className="mt-1 text-xs text-[#667085]">
                  {progress.completed} of{" "}
                  {progress.total} key steps
                  completed
                </p>
              </div>

              <p className="text-lg font-bold text-[#101828]">
                {progress.percentage}%
              </p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e9eaee]">
              <div
                className="h-full rounded-full bg-[#111827]"
                style={{
                  width: `${progress.percentage}%`,
                }}
              />
            </div>
          </div>

          {/* CHECKLIST */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-[#101828]">
              Onboarding Checklist
            </h4>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {CHECKLIST_FIELDS.map(
                (item) => {
                  const completed =
                    record[item.key] === true;

                  return (
                    <div
                      key={String(item.key)}
                      className="flex items-center justify-between rounded-xl border border-[#e4e7ec] px-4 py-3"
                    >
                      <span className="text-sm text-[#344054]">
                        {item.label}
                      </span>

                      {completed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085]">
                          <Clock3 className="h-4 w-4" />
                          Pending
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* ADDITIONAL TRACKING */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-[#101828]">
              Additional Onboarding Tracking
            </h4>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <BooleanDetail
                label="Work Email Created"
                value={
                  record.work_email_created
                }
              />

              <BooleanDetail
                label="ID Card Issued"
                value={
                  record.id_card_issued
                }
              />

              <BooleanDetail
                label="Team Assigned"
                value={
                  record.team_assigned
                }
              />

              <BooleanDetail
                label="Manager Assigned"
                value={
                  record.manager_assigned
                }
              />

              <BooleanDetail
                label="Training Completed"
                value={
                  record.training_completed
                }
              />
            </div>
          </div>

          {/* NOTES */}
          {record.notes && (
            <div className="rounded-xl border border-[#e4e7ec] bg-[#f9fafb] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                Notes
              </p>

              <p className="mt-2 text-sm text-[#344054]">
                {record.notes}
              </p>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end border-t border-[#e4e7ec] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f2937]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailBox: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div className="rounded-xl border border-[#e4e7ec] bg-white p-4">
    <p className="text-[10px] font-bold uppercase tracking-wide text-[#667085]">
      {label}
    </p>

    <p className="mt-2 text-sm font-semibold text-[#101828]">
      {value}
    </p>
  </div>
);

const BooleanDetail: React.FC<{
  label: string;
  value: boolean | null;
}> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-xl border border-[#e4e7ec] px-4 py-3">
    <span className="text-sm text-[#344054]">
      {label}
    </span>

    {value ? (
      <span className="font-semibold text-emerald-700">
        Complete
      </span>
    ) : (
      <span className="font-semibold text-[#667085]">
        Pending
      </span>
    )}
  </div>
);

export default OnboardingPage;