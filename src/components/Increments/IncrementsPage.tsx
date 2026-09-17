import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Employee = {
  id: string;
  employee_code: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  designation: string | null;
  status: string | null;
};

type Increment = {
  id: string;
  employee_id: string | null;
  approval_cycle: string | null;
  effective_date: string | null;

  current_ctc: number | null;
  increment_percentage: number | null;
  increment_amount: number | null;
  revised_ctc: number | null;

  current_designation: string | null;
  revised_designation: string | null;

  current_band: string | null;
  revised_band: string | null;

  performance_rating: string | null;
  status: string | null;

  requested_by: string | null;
  approved_by: string | null;
  approved_at: string | null;

  remarks: string | null;

  created_at: string | null;
  updated_at: string | null;

  overtime_hours: number | null;

  tl_feedback: string | null;
  recommendation_reason: string | null;

  feedback_document_name: string | null;
  feedback_document_path: string | null;
  feedback_document_mime: string | null;
  feedback_document_size: number | null;

  approval_stage: string | null;
  requested_by_employee_id: string | null;
  admin_comment: string | null;
};

type Props = {
  onShowToast?: (message: string, type?: string) => void;
};

const money = (value: number | null | undefined) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const employeeName = (employee?: Employee) => {
  if (!employee) return "Unknown Employee";

  if (employee.full_name) return employee.full_name;

  return `${employee.first_name || ""} ${
    employee.last_name || ""
  }`.trim() || "Unknown Employee";
};

const statusLabel = (status: string | null) => {
  if (!status) return "Pending";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const statusClass = (status: string | null) => {
  const value = (status || "").toLowerCase();

  if (value.includes("approved")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    value.includes("reject") ||
    value.includes("declined")
  ) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (
    value.includes("pending") ||
    value.includes("review")
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
};

const getCurrentYear = () =>
  new Date().getFullYear().toString();

export const IncrementsPage: React.FC<Props> = ({
  onShowToast,
}) => {
  const [records, setRecords] = useState<Increment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [yearFilter, setYearFilter] =
    useState(getCurrentYear());

  const [selectedRecord, setSelectedRecord] =
    useState<Increment | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    approval_cycle: "",
    effective_date: "",
    current_ctc: "",
    increment_percentage: "",
    current_designation: "",
    revised_designation: "",
    current_band: "",
    revised_band: "",
    performance_rating: "",
    status: "PENDING",
    requested_by: "HR Administrator",
    remarks: "",
    overtime_hours: "",
    tl_feedback: "",
    recommendation_reason: "",
    approval_stage: "ADMIN_REVIEW",
    admin_comment: "",
  });

  const employeeMap = useMemo(() => {
    const map: Record<string, Employee> = {};

    employees.forEach((employee) => {
      map[employee.id] = employee;
    });

    return map;
  }, [employees]);

  const loadEmployees = async () => {
    const { data, error: dbError } = await supabase
      .from("employees")
      .select(
        "id, employee_code, full_name, first_name, last_name, department, designation, status"
      )
      .order("full_name", { ascending: true });

    if (dbError) {
      console.error("Employee loading error:", dbError);
      return;
    }

    setEmployees((data || []) as Employee[]);
  };

  const loadIncrements = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: dbError } = await supabase
        .from("employee_increments")
        .select("*")
        .order("effective_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (dbError) {
        throw dbError;
      }

      setRecords((data || []) as Increment[]);
    } catch (err: any) {
      console.error("Increment loading error:", err);

      const message =
        err?.message || "Unable to load increment records.";

      setError(message);
      setRecords([]);

      onShowToast?.(
        `Increment Loading Failed: ${message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadIncrements();
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set<string>();

    records.forEach((record) => {
      if (record.effective_date) {
        years.add(
          record.effective_date.substring(0, 4)
        );
      }
    });

    years.add(getCurrentYear());

    return Array.from(years).sort(
      (a, b) => Number(b) - Number(a)
    );
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const employee = employeeMap[record.employee_id || ""];

      const matchesSearch =
        !query ||
        employeeName(employee)
          .toLowerCase()
          .includes(query) ||
        (employee?.employee_code || "")
          .toLowerCase()
          .includes(query) ||
        (employee?.department || "")
          .toLowerCase()
          .includes(query) ||
        (record.current_designation || "")
          .toLowerCase()
          .includes(query) ||
        (record.revised_designation || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (record.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesYear =
        yearFilter === "ALL" ||
        !record.effective_date ||
        record.effective_date.startsWith(yearFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesYear
      );
    });
  }, [
    records,
    employeeMap,
    search,
    statusFilter,
    yearFilter,
  ]);

  const totalRecords = filteredRecords.length;

  const approvedCount = filteredRecords.filter(
    (record) =>
      (record.status || "").toLowerCase() === "approved"
  ).length;

  const pendingCount = filteredRecords.filter((record) =>
    (record.status || "")
      .toLowerCase()
      .includes("pending")
  ).length;

  const totalIncrementAmount = filteredRecords.reduce(
    (sum, record) =>
      sum + Number(record.increment_amount || 0),
    0
  );

  const averageIncrementPercentage =
    filteredRecords.length > 0
      ? filteredRecords.reduce(
          (sum, record) =>
            sum +
            Number(record.increment_percentage || 0),
          0
        ) / filteredRecords.length
      : 0;

  const updateForm = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const calculatedIncrementAmount =
    Number(form.current_ctc || 0) *
    (Number(form.increment_percentage || 0) / 100);

  const calculatedRevisedCTC =
    Number(form.current_ctc || 0) +
    calculatedIncrementAmount;

  const resetForm = () => {
    setForm({
      employee_id: "",
      approval_cycle: "",
      effective_date: "",
      current_ctc: "",
      increment_percentage: "",
      current_designation: "",
      revised_designation: "",
      current_band: "",
      revised_band: "",
      performance_rating: "",
      status: "PENDING",
      requested_by: "HR Administrator",
      remarks: "",
      overtime_hours: "",
      tl_feedback: "",
      recommendation_reason: "",
      approval_stage: "ADMIN_REVIEW",
      admin_comment: "",
    });
  };

  const handleEmployeeSelect = (
    employeeId: string
  ) => {
    const employee = employeeMap[employeeId];

    setForm((previous) => ({
      ...previous,
      employee_id: employeeId,
      current_designation:
        previous.current_designation ||
        employee?.designation ||
        "",
    }));
  };

  const handleAddIncrement = async () => {
    if (!form.employee_id) {
      onShowToast?.(
        "Please select an employee.",
        "error"
      );
      return;
    }

    if (!form.current_ctc) {
      onShowToast?.(
        "Please enter current CTC.",
        "error"
      );
      return;
    }

    if (!form.increment_percentage) {
      onShowToast?.(
        "Please enter increment percentage.",
        "error"
      );
      return;
    }

    const payload = {
      employee_id: form.employee_id,
      approval_cycle:
        form.approval_cycle || null,
      effective_date:
        form.effective_date || null,

      current_ctc: Number(form.current_ctc),
      increment_percentage: Number(
        form.increment_percentage
      ),
      increment_amount: calculatedIncrementAmount,
      revised_ctc: calculatedRevisedCTC,

      current_designation:
        form.current_designation || null,
      revised_designation:
        form.revised_designation || null,

      current_band: form.current_band || null,
      revised_band: form.revised_band || null,

      performance_rating:
        form.performance_rating || null,

      status: form.status || "PENDING",

      requested_by:
        form.requested_by || "HR Administrator",

      remarks: form.remarks || null,

      overtime_hours:
        form.overtime_hours === ""
          ? null
          : Number(form.overtime_hours),

      tl_feedback:
        form.tl_feedback || null,

      recommendation_reason:
        form.recommendation_reason || null,

      approval_stage:
        form.approval_stage || "ADMIN_REVIEW",

      admin_comment:
        form.admin_comment || null,
    };

    try {
      const { error: dbError } = await supabase
        .from("employee_increments")
        .insert(payload);

      if (dbError) {
        throw dbError;
      }

      setShowAddModal(false);

      onShowToast?.(
        "Increment record added successfully.",
        "success"
      );

      await loadIncrements();
    } catch (err: any) {
      console.error("Increment insert error:", err);

      onShowToast?.(
        `Failed to add increment: ${
          err?.message || "Unknown error"
        }`,
        "error"
      );
    }
  };

  const updateStatus = async (
    record: Increment,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    try {
      const { error: dbError } = await supabase
        .from("employee_increments")
        .update({
          status: newStatus,
          approved_by:
            newStatus === "APPROVED"
              ? "HR Administrator"
              : null,
          approved_at:
            newStatus === "APPROVED"
              ? new Date().toISOString()
              : null,
          approval_stage:
            newStatus === "APPROVED"
              ? "COMPLETED"
              : "REJECTED",
        })
        .eq("id", record.id);

      if (dbError) {
        throw dbError;
      }

      onShowToast?.(
        `Increment ${newStatus.toLowerCase()} successfully.`,
        "success"
      );

      setSelectedRecord(null);

      await loadIncrements();
    } catch (err: any) {
      console.error("Increment status update error:", err);

      onShowToast?.(
        `Update failed: ${
          err?.message || "Unknown error"
        }`,
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900">
      <div className="p-6 md:p-8 space-y-6">

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Increment Management
                </h1>

                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  ADMIN VIEW
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Manage employee salary increments,
                performance reviews, revised CTC and
                approval workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={18} />
                Add Increment
              </button>

              <button
                type="button"
                onClick={loadIncrements}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={17} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

            <div className="relative flex-1 max-w-2xl">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search employee, code, department or designation..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  value={yearFilter}
                  onChange={(e) =>
                    setYearFilter(e.target.value)
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-9 text-sm font-semibold outline-none"
                >
                  <option value="ALL">
                    All Years
                  </option>

                  {availableYears.map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none"
              >
                <option value="ALL">
                  All Status
                </option>
                <option value="PENDING">
                  Pending
                </option>
                <option value="APPROVED">
                  Approved
                </option>
                <option value="REJECTED">
                  Rejected
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="font-semibold text-red-700">
              Increment Loading Failed
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* KPI */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <KpiCard
            title="TOTAL REQUESTS"
            value={loading ? "—" : totalRecords}
            subtitle="Increment records"
            icon={<Users size={22} />}
          />

          <KpiCard
            title="PENDING APPROVAL"
            value={loading ? "—" : pendingCount}
            subtitle="Awaiting review"
            icon={<Calendar size={22} />}
            valueClass="text-amber-600"
          />

          <KpiCard
            title="APPROVED"
            value={loading ? "—" : approvedCount}
            subtitle="Approved increments"
            icon={<CheckCircle2 size={22} />}
            valueClass="text-emerald-600"
          />

          <KpiCard
            title="TOTAL INCREMENT"
            value={
              loading
                ? "—"
                : money(totalIncrementAmount)
            }
            subtitle={`${averageIncrementPercentage.toFixed(
              1
            )}% average increment`}
            icon={<TrendingUp size={22} />}
            valueClass="text-indigo-600"
          />
        </section>

        {/* TABLE */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <div className="border-b border-slate-100 px-7 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <TrendingUp size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Employee Increment Register
                </h2>

                <p className="text-sm text-slate-500">
                  Data from employee_increments
                </p>
              </div>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {filteredRecords.length} RECORDS
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading increment records from Supabase...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto w-fit rounded-2xl bg-slate-100 p-5 text-slate-400">
                <TrendingUp size={30} />
              </div>

              <h3 className="mt-5 font-semibold text-slate-800">
                No increment records found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No records match the selected filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">

                    <Th>EMPLOYEE</Th>
                    <Th>DEPARTMENT</Th>
                    <Th>CURRENT CTC</Th>
                    <Th>INCREMENT</Th>
                    <Th>REVISED CTC</Th>
                    <Th>DESIGNATION</Th>
                    <Th>EFFECTIVE DATE</Th>
                    <Th>STATUS</Th>
                    <Th>ACTION</Th>

                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => {
                    const employee =
                      employeeMap[
                        record.employee_id || ""
                      ];

                    return (
                      <tr
                        key={record.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {employeeName(employee)}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {employee?.employee_code ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-slate-600">
                            {employee?.department ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold">
                          {money(record.current_ctc)}
                        </td>

                        <td className="px-6 py-5">
                          <span className="font-bold text-emerald-700">
                            {Number(
                              record.increment_percentage ||
                                0
                            ).toFixed(2)}
                            %
                          </span>

                          <p className="mt-1 text-xs text-slate-400">
                            +
                            {money(
                              record.increment_amount
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-indigo-700">
                          {money(record.revised_ctc)}
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-slate-700">
                            {record.revised_designation ||
                              record.current_designation ||
                              "—"}
                          </p>

                          {record.revised_band && (
                            <p className="mt-1 text-xs text-slate-400">
                              Band:{" "}
                              {record.revised_band}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatDate(
                            record.effective_date
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                              record.status
                            )}`}
                          >
                            {(record.status || "")
                              .toLowerCase()
                              .includes(
                                "approved"
                              ) && (
                              <CheckCircle2
                                size={13}
                              />
                            )}

                            {statusLabel(
                              record.status
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRecord(
                                record
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading &&
            filteredRecords.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
                Showing{" "}
                <strong>
                  {filteredRecords.length}
                </strong>{" "}
                increment records.
              </div>
            )}
        </section>
      </div>

      {/* VIEW MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold">
                  Increment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    employeeName(
                      employeeMap[
                        selectedRecord.employee_id ||
                          ""
                      ]
                    )
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecord(null)
                }
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Salary */}
              <div>
                <SectionTitle>
                  Salary Details
                </SectionTitle>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">

                  <Detail
                    label="Current CTC"
                    value={money(
                      selectedRecord.current_ctc
                    )}
                  />

                  <Detail
                    label="Increment"
                    value={`${Number(
                      selectedRecord.increment_percentage ||
                        0
                    ).toFixed(2)}%`}
                  />

                  <Detail
                    label="Increment Amount"
                    value={money(
                      selectedRecord.increment_amount
                    )}
                  />

                  <Detail
                    label="Revised CTC"
                    value={money(
                      selectedRecord.revised_ctc
                    )}
                  />

                  <Detail
                    label="Effective Date"
                    value={formatDate(
                      selectedRecord.effective_date
                    )}
                  />

                  <Detail
                    label="Approval Cycle"
                    value={
                      selectedRecord.approval_cycle
                    }
                  />

                </div>
              </div>

              {/* Designation */}
              <div>
                <SectionTitle>
                  Designation & Band
                </SectionTitle>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">

                  <Detail
                    label="Current Designation"
                    value={
                      selectedRecord.current_designation
                    }
                  />

                  <Detail
                    label="Revised Designation"
                    value={
                      selectedRecord.revised_designation
                    }
                  />

                  <Detail
                    label="Current Band"
                    value={
                      selectedRecord.current_band
                    }
                  />

                  <Detail
                    label="Revised Band"
                    value={
                      selectedRecord.revised_band
                    }
                  />

                </div>
              </div>

              {/* Performance */}
              <div>
                <SectionTitle>
                  Performance & Feedback
                </SectionTitle>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">

                  <Detail
                    label="Performance Rating"
                    value={
                      selectedRecord.performance_rating
                    }
                  />

                  <Detail
                    label="Overtime Hours"
                    value={
                      selectedRecord.overtime_hours !==
                      null
                        ? `${selectedRecord.overtime_hours} hrs`
                        : "—"
                    }
                  />

                  <Detail
                    label="TL Feedback"
                    value={
                      selectedRecord.tl_feedback
                    }
                  />

                  <Detail
                    label="Recommendation Reason"
                    value={
                      selectedRecord.recommendation_reason
                    }
                  />

                </div>
              </div>

              {/* Approval */}
              <div>
                <SectionTitle>
                  Approval Workflow
                </SectionTitle>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">

                  <Detail
                    label="Status"
                    value={statusLabel(
                      selectedRecord.status
                    )}
                  />

                  <Detail
                    label="Approval Stage"
                    value={
                      selectedRecord.approval_stage
                    }
                  />

                  <Detail
                    label="Requested By"
                    value={
                      selectedRecord.requested_by
                    }
                  />

                  <Detail
                    label="Approved By"
                    value={
                      selectedRecord.approved_by
                    }
                  />

                  <Detail
                    label="Approved At"
                    value={formatDate(
                      selectedRecord.approved_at
                    )}
                  />

                  <Detail
                    label="Requested Employee ID"
                    value={
                      selectedRecord.requested_by_employee_id
                    }
                  />

                </div>
              </div>

              {/* Documents */}
              <div>
                <SectionTitle>
                  Feedback Document
                </SectionTitle>

                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  {selectedRecord.feedback_document_name ? (
                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                        <FileText size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {
                            selectedRecord.feedback_document_name
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            selectedRecord.feedback_document_mime ||
                            "Document"
                          }

                          {selectedRecord.feedback_document_size
                            ? ` • ${(
                                selectedRecord.feedback_document_size /
                                1024
                              ).toFixed(1)} KB`
                            : ""}
                        </p>
                      </div>

                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No feedback document attached.
                    </p>
                  )}

                </div>
              </div>

              {/* Remarks */}
              <div>
                <SectionTitle>
                  Remarks & Admin Comment
                </SectionTitle>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">

                  <Detail
                    label="Remarks"
                    value={
                      selectedRecord.remarks
                    }
                  />

                  <Detail
                    label="Admin Comment"
                    value={
                      selectedRecord.admin_comment
                    }
                  />

                </div>
              </div>

            </div>

            {/* APPROVAL BUTTONS */}
            <div className="border-t border-slate-100 px-6 py-4 flex flex-wrap justify-end gap-3">

              {(selectedRecord.status || "")
                .toLowerCase()
                .includes("pending") && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedRecord,
                        "REJECTED"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    <XCircle size={17} />
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedRecord,
                        "APPROVED"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={17} />
                    Approve
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() =>
                  setSelectedRecord(null)
                }
                className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold">
                  Add Employee Increment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new increment record in
                  Supabase.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddModal(false)
                }
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field label="Employee">
                <select
                  value={form.employee_id}
                  onChange={(e) =>
                    handleEmployeeSelect(
                      e.target.value
                    )
                  }
                  className="form-input"
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees
                    .filter(
                      (employee) =>
                        !employee.status ||
                        employee.status === "ACTIVE"
                    )
                    .map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employeeName(employee)}
                        {employee.employee_code
                          ? ` (${employee.employee_code})`
                          : ""}
                      </option>
                    ))}
                </select>
              </Field>

              <Field label="Approval Cycle">
                <input
                  value={form.approval_cycle}
                  onChange={(e) =>
                    updateForm(
                      "approval_cycle",
                      e.target.value
                    )
                  }
                  placeholder="Example: Annual Review 2026"
                  className="form-input"
                />
              </Field>

              <Field label="Effective Date">
                <input
                  type="date"
                  value={form.effective_date}
                  onChange={(e) =>
                    updateForm(
                      "effective_date",
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </Field>

              <Field label="Current CTC">
                <input
                  type="number"
                  min="0"
                  value={form.current_ctc}
                  onChange={(e) =>
                    updateForm(
                      "current_ctc",
                      e.target.value
                    )
                  }
                  placeholder="₹"
                  className="form-input"
                />
              </Field>

              <Field label="Increment Percentage">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.increment_percentage
                  }
                  onChange={(e) =>
                    updateForm(
                      "increment_percentage",
                      e.target.value
                    )
                  }
                  placeholder="Example: 10"
                  className="form-input"
                />
              </Field>

              <Field label="Current Designation">
                <input
                  value={form.current_designation}
                  onChange={(e) =>
                    updateForm(
                      "current_designation",
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </Field>

              <Field label="Revised Designation">
                <input
                  value={form.revised_designation}
                  onChange={(e) =>
                    updateForm(
                      "revised_designation",
                      e.target.value
                    )
                  }
                  placeholder="Optional"
                  className="form-input"
                />
              </Field>

              <Field label="Current Band">
                <input
                  value={form.current_band}
                  onChange={(e) =>
                    updateForm(
                      "current_band",
                      e.target.value
                    )
                  }
                  placeholder="Example: B2"
                  className="form-input"
                />
              </Field>

              <Field label="Revised Band">
                <input
                  value={form.revised_band}
                  onChange={(e) =>
                    updateForm(
                      "revised_band",
                      e.target.value
                    )
                  }
                  placeholder="Example: B3"
                  className="form-input"
                />
              </Field>

              <Field label="Performance Rating">
                <input
                  value={form.performance_rating}
                  onChange={(e) =>
                    updateForm(
                      "performance_rating",
                      e.target.value
                    )
                  }
                  placeholder="Example: Excellent"
                  className="form-input"
                />
              </Field>

              <Field label="Overtime Hours">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.overtime_hours}
                  onChange={(e) =>
                    updateForm(
                      "overtime_hours",
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value
                    )
                  }
                  className="form-input"
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="APPROVED">
                    Approved
                  </option>

                  <option value="REJECTED">
                    Rejected
                  </option>
                </select>
              </Field>

              <Field label="Approval Stage">
                <input
                  value={form.approval_stage}
                  onChange={(e) =>
                    updateForm(
                      "approval_stage",
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </Field>

              <Field label="Requested By">
                <input
                  value={form.requested_by}
                  onChange={(e) =>
                    updateForm(
                      "requested_by",
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </Field>

              <Field label="Recommendation Reason">
                <textarea
                  rows={3}
                  value={
                    form.recommendation_reason
                  }
                  onChange={(e) =>
                    updateForm(
                      "recommendation_reason",
                      e.target.value
                    )
                  }
                  className="form-input resize-none"
                />
              </Field>

              <Field label="TL Feedback">
                <textarea
                  rows={3}
                  value={form.tl_feedback}
                  onChange={(e) =>
                    updateForm(
                      "tl_feedback",
                      e.target.value
                    )
                  }
                  className="form-input resize-none"
                />
              </Field>

              <Field label="Remarks" full>
                <textarea
                  rows={3}
                  value={form.remarks}
                  onChange={(e) =>
                    updateForm(
                      "remarks",
                      e.target.value
                    )
                  }
                  className="form-input resize-none"
                />
              </Field>

              <Field label="Admin Comment" full>
                <textarea
                  rows={3}
                  value={form.admin_comment}
                  onChange={(e) =>
                    updateForm(
                      "admin_comment",
                      e.target.value
                    )
                  }
                  className="form-input resize-none"
                />
              </Field>

              {/* CALCULATION */}
              <div className="md:col-span-2 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                  Increment Calculation
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">

                  <div>
                    <p className="text-xs text-slate-500">
                      Current CTC
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {money(
                        Number(
                          form.current_ctc || 0
                        )
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Increment Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-700">
                      {money(
                        calculatedIncrementAmount
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Revised CTC
                    </p>

                    <p className="mt-1 text-xl font-bold text-indigo-700">
                      {money(
                        calculatedRevisedCTC
                      )}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowAddModal(false)
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddIncrement}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Save Increment
              </button>

            </div>
          </div>
        </div>
      )}

      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid rgb(226 232 240);
          border-radius: 0.75rem;
          background: white;
          padding: 0.75rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
        }

        .form-input:focus {
          border-color: rgb(129 140 248);
          box-shadow: 0 0 0 3px rgb(224 231 255);
        }
      `}</style>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const KpiCard = ({
  title,
  value,
  subtitle,
  icon,
  valueClass = "text-slate-900",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  valueClass?: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between">

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <p
          className={`mt-4 text-3xl font-bold ${valueClass}`}
        >
          {value}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="rounded-xl bg-slate-100 p-3 text-indigo-600">
        {icon}
      </div>

    </div>
  </div>
);

const Th = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
    {children}
  </th>
);

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-2 text-sm font-semibold text-slate-800 break-words">
      {value === null ||
      value === undefined ||
      value === ""
        ? "—"
        : value}
    </p>
  </div>
);

const SectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">
    {children}
  </h3>
);

const Field = ({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    {children}
  </div>
);

export default IncrementsPage;