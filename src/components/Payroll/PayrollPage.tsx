import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  IndianRupee,
  Wallet,
  Download,
  Play,
  X,
  Eye,
  FileText,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type PayrollPageProps = {
  onShowToast?: (message: string) => void;
};

type PayrollItem = {
  id: string;
  payroll_run_id: string | null;
  employee_id: string | null;
  salary_structure_id: string | null;

  attendance_days: number | null;
  paid_days: number | null;
  absent_days: number | null;
  leave_days: number | null;
  worked_hours: number | null;
  overtime_hours: number | null;

  basic: number | null;
  hra: number | null;
  allowance: number | null;
  variable: number | null;
  bonus: number | null;

  pf: number | null;
  esi: number | null;
  pt: number | null;
  tds: number | null;
  lwp: number | null;
  gross_pay: number | null;
  deductions: number | null;
  net_pay: number | null;

  payment_status: string | null;
  payment_reference: string | null;
  payment_gateway: string | null;

  calculated_at: string | null;
  payroll_released_at: string | null;

  created_at: string | null;
  updated_at: string | null;

  component_breakdown: any;
  salary_structure_snapshot: any;
  earnings_snapshot: any;
  deductions_snapshot: any;
  attendance_snapshot: any;
};

type PayrollRun = {
  id: string;
  payroll_month: string | null;
  status: string | null;
  employee_count: number | null;
  gross_pay: number | null;
  total_deductions: number | null;
  net_pay: number | null;
  processed_by: string | null;
  processed_at: string | null;
  period_start: string | null;
  period_end: string | null;
  pay_group: string | null;
};

type Employee = {
  id: string;
  employee_code: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  designation: string | null;
  location: string | null;
  status: string | null;
};

const money = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const getEmployeeName = (employee: Employee) => {
  if (employee.full_name) return employee.full_name;

  const name = [
    employee.first_name,
    employee.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || employee.employee_code || "Employee";
};

const formatMonth = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(
    value.length === 7 ? `${value}-01` : value
  );

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const statusClass = (status: string | null) => {
  const value = String(status || "").toUpperCase();

  if (
    value.includes("PAID") ||
    value.includes("COMPLETED") ||
    value.includes("PROCESSED")
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    value.includes("PENDING") ||
    value.includes("PROCESS")
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (
    value.includes("FAILED") ||
    value.includes("REJECT")
  ) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-600 border-slate-200";
};

export const PayrollPage: React.FC<PayrollPageProps> = ({
  onShowToast,
}) => {
  const [items, setItems] = useState<PayrollItem[]>([]);
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] =
    useState("2026-09");

  const [selectedItem, setSelectedItem] =
    useState<PayrollItem | null>(null);

  const [error, setError] = useState("");

  const notify = (message: string) => {
    onShowToast?.(message);
  };

  /*
   * ============================================================
   * LOAD PAYROLL
   * ============================================================
   */

  const loadPayroll = async () => {
    setLoading(true);
    setError("");

    try {
      /*
       * IMPORTANT:
       *
       * payroll_items uses:
       *
       * gross_pay
       * deductions
       * net_pay
       *
       * NOT:
       *
       * gross
       * total_deductions
       * net
       */

      const [
        itemsResult,
        runsResult,
        employeesResult,
      ] = await Promise.all([
        supabase
          .from("payroll_items")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("payroll_runs")
          .select("*")
          .order("payroll_month", {
            ascending: false,
          }),

        supabase
          .from("employees")
          .select("*")
          .order("full_name", {
            ascending: true,
          }),
      ]);

      if (itemsResult.error) {
        throw new Error(
          `Payroll items: ${itemsResult.error.message}`
        );
      }

      if (runsResult.error) {
        throw new Error(
          `Payroll runs: ${runsResult.error.message}`
        );
      }

      if (employeesResult.error) {
        throw new Error(
          `Employees: ${employeesResult.error.message}`
        );
      }

      console.log(
        "PAYROLL ITEMS:",
        itemsResult.data
      );

      console.log(
        "PAYROLL RUNS:",
        runsResult.data
      );

      console.log(
        "PAYROLL EMPLOYEES:",
        employeesResult.data
      );

      setItems(
        (itemsResult.data || []) as PayrollItem[]
      );

      setRuns(
        (runsResult.data || []) as PayrollRun[]
      );

      setEmployees(
        (employeesResult.data || []) as Employee[]
      );
    } catch (err) {
      console.error(
        "PAYROLL LOAD ERROR:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Unable to load payroll data.";

      setError(message);

      notify(
        `Payroll Loading Failed: ${message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  /*
   * ============================================================
   * EMPLOYEE MAP
   * ============================================================
   */

  const employeeMap = useMemo(() => {
    const map = new Map<string, Employee>();

    employees.forEach((employee) => {
      map.set(employee.id, employee);
    });

    return map;
  }, [employees]);

  /*
   * ============================================================
   * MONTH FILTER
   * ============================================================
   */

  const monthItems = useMemo(() => {
    return items.filter((item) => {
      const run = runs.find(
        (r) => r.id === item.payroll_run_id
      );

      if (!run?.payroll_month) {
        return true;
      }

      return run.payroll_month.startsWith(
        selectedMonth
      );
    });
  }, [items, runs, selectedMonth]);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return monthItems;

    return monthItems.filter((item) => {
      const employee = item.employee_id
        ? employeeMap.get(item.employee_id)
        : undefined;

      const employeeName = employee
        ? getEmployeeName(employee)
        : "";

      const employeeCode =
        employee?.employee_code || "";

      const department =
        employee?.department || "";

      return (
        employeeName
          .toLowerCase()
          .includes(query) ||
        employeeCode
          .toLowerCase()
          .includes(query) ||
        department
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    monthItems,
    search,
    employeeMap,
  ]);

  /*
   * ============================================================
   * PAYROLL TOTALS
   * ============================================================
   *
   * CORRECT SUPABASE FIELDS:
   *
   * gross_pay
   * deductions
   * net_pay
   */

  const totalGross = useMemo(() => {
    return filteredItems.reduce(
      (sum, item) =>
        sum + Number(item.gross_pay || 0),
      0
    );
  }, [filteredItems]);

  const totalDeductions = useMemo(() => {
    return filteredItems.reduce(
      (sum, item) =>
        sum + Number(item.deductions || 0),
      0
    );
  }, [filteredItems]);

  const totalNet = useMemo(() => {
    return filteredItems.reduce(
      (sum, item) =>
        sum + Number(item.net_pay || 0),
      0
    );
  }, [filteredItems]);

  /*
   * ============================================================
   * PROCESS PAYROLL
   * ============================================================
   */

  const processPayroll = async () => {
    if (filteredItems.length === 0) {
      notify(
        "No payroll employees available for this month."
      );
      return;
    }

    setProcessing(true);

    try {
      const run = runs.find((item) =>
        String(item.payroll_month || "").startsWith(
          selectedMonth
        )
      );

      if (!run) {
        notify(
          "No payroll run exists for this month."
        );
        return;
      }

      const { error } = await supabase
        .from("payroll_runs")
        .update({
          status: "PROCESSED",
          processed_at:
            new Date().toISOString(),
        })
        .eq("id", run.id);

      if (error) {
        throw error;
      }

      notify(
        "Payroll processed successfully."
      );

      await loadPayroll();
    } catch (err) {
      console.error(
        "PROCESS PAYROLL ERROR:",
        err
      );

      notify(
        `Payroll processing failed: ${
          err instanceof Error
            ? err.message
            : "Unknown error"
        }`
      );
    } finally {
      setProcessing(false);
    }
  };

  /*
   * ============================================================
   * EXPORT
   * ============================================================
   */

  const exportPayroll = () => {
    if (filteredItems.length === 0) {
      notify(
        "No payroll data available to export."
      );
      return;
    }

    const header = [
      "Employee Code",
      "Employee Name",
      "Department",
      "Attendance Days",
      "Paid Days",
      "Basic",
      "HRA",
      "Allowance",
      "Variable",
      "Bonus",
      "Gross Pay",
      "PF",
      "ESI",
      "PT",
      "TDS",
      "Deductions",
      "Net Pay",
      "Payment Status",
    ];

    const rows = filteredItems.map(
      (item) => {
        const employee = item.employee_id
          ? employeeMap.get(item.employee_id)
          : undefined;

        return [
          employee?.employee_code || "",
          employee
            ? getEmployeeName(employee)
            : "",
          employee?.department || "",
          item.attendance_days || 0,
          item.paid_days || 0,
          item.basic || 0,
          item.hra || 0,
          item.allowance || 0,
          item.variable || 0,
          item.bonus || 0,
          item.gross_pay || 0,
          item.pf || 0,
          item.esi || 0,
          item.pt || 0,
          item.tds || 0,
          item.deductions || 0,
          item.net_pay || 0,
          item.payment_status || "",
        ];
      }
    );

    const csv = [
      header,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `payroll-${selectedMonth}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    notify(
      "Payroll report exported successfully."
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-full bg-[#f7f8fa] px-6 py-6">
      {/* HEADER */}

      <div className="rounded-3xl border border-slate-200 bg-white px-7 py-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-950">
                Payroll Processing & Salary Disbursal
              </h1>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                DRAFT
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Gross-to-net payroll processing, statutory
              deductions and employee salary disbursement.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportPayroll}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Download size={17} />
              Export Bank Batch
            </button>

            <button
              onClick={processPayroll}
              disabled={processing}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {processing ? (
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Play size={17} />
              )}

              Process Payroll
            </button>
          </div>
        </div>
      </div>

      {/* FILTER */}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search employee, code or department..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">
              Payroll Month
            </span>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
            />

            <button
              onClick={loadPayroll}
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5"
          />

          <div>
            <p className="font-bold">
              Payroll Loading Failed
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>

          <button
            onClick={() => setError("")}
            className="ml-auto"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* KPI */}

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="EMPLOYEES"
          value={String(
            filteredItems.length
          )}
          subtitle="Active payroll employees"
          icon={<Users size={22} />}
        />

        <KpiCard
          title="GROSS PAYROLL"
          value={money(totalGross)}
          subtitle="Total gross earnings"
          icon={
            <IndianRupee size={22} />
          }
        />

        <KpiCard
          title="TOTAL DEDUCTIONS"
          value={money(totalDeductions)}
          subtitle="PF + PT + TDS + other deductions"
          icon={<Wallet size={22} />}
          valueClass="text-orange-600"
        />

        <div className="rounded-3xl bg-slate-950 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wide text-slate-400">
                NET PAYROLL
              </p>

              <p className="mt-4 text-3xl font-bold text-emerald-400">
                {money(totalNet)}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Employee take-home
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-3 text-emerald-400">
              <Wallet size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* SALARY REGISTER */}

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <IndianRupee size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Salary Register
              </h2>

              <p className="text-sm text-slate-500">
                {formatMonth(
                  selectedMonth
                )}{" "}
                payroll details
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw
              size={28}
              className="animate-spin text-indigo-600"
            />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <Users
              size={40}
              className="text-slate-300"
            />

            <p className="mt-4 font-bold text-slate-700">
              No payroll records found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              There are no payroll items for{" "}
              {formatMonth(selectedMonth)}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1250px] w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Employee
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Days
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Gross
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    PF
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    TDS
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Net Salary
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map(
                  (item) => {
                    const employee =
                      item.employee_id
                        ? employeeMap.get(
                            item.employee_id
                          )
                        : undefined;

                    const name = employee
                      ? getEmployeeName(
                          employee
                        )
                      : "Unknown Employee";

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                              {name
                                .split(" ")
                                .slice(0, 2)
                                .map(
                                  (x) =>
                                    x[0]
                                )
                                .join("")
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                {name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {employee?.employee_code ||
                                  "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-700">
                          {employee?.department ||
                            "—"}
                        </td>

                        <td className="px-5 py-5 text-right">
                          <p className="font-bold text-slate-800">
                            {item.paid_days ??
                              0}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            paid
                          </p>
                        </td>

                        <td className="px-5 py-5 text-right font-bold text-slate-900">
                          {money(
                            item.gross_pay
                          )}
                        </td>

                        <td className="px-5 py-5 text-right text-sm text-slate-700">
                          {money(item.pf)}
                        </td>

                        <td className="px-5 py-5 text-right text-sm text-slate-700">
                          {money(item.tds)}
                        </td>

                        <td className="px-5 py-5 text-right font-bold text-emerald-700">
                          {money(
                            item.net_pay
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${statusClass(
                              item.payment_status
                            )}`}
                          >
                            {item.payment_status ||
                              "Pending"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() =>
                              setSelectedItem(
                                item
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <Eye
                              size={16}
                            />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Payroll Details
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedItem.employee_id
                    ? getEmployeeName(
                        employeeMap.get(
                          selectedItem.employee_id
                        ) || {
                          id: "",
                          employee_code: "",
                          full_name:
                            "Employee",
                          first_name: "",
                          last_name: "",
                          department: "",
                          designation: "",
                          location: "",
                          status: "",
                        }
                      )
                    : "Employee"}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <DetailCard
                  label="Gross Pay"
                  value={money(
                    selectedItem.gross_pay
                  )}
                />

                <DetailCard
                  label="Deductions"
                  value={money(
                    selectedItem.deductions
                  )}
                />

                <DetailCard
                  label="Net Pay"
                  value={money(
                    selectedItem.net_pay
                  )}
                  green
                />
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-slate-900">
                  Earnings
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-5">
                  <SmallDetail
                    label="Basic"
                    value={money(
                      selectedItem.basic
                    )}
                  />

                  <SmallDetail
                    label="HRA"
                    value={money(
                      selectedItem.hra
                    )}
                  />

                  <SmallDetail
                    label="Allowance"
                    value={money(
                      selectedItem.allowance
                    )}
                  />

                  <SmallDetail
                    label="Variable"
                    value={money(
                      selectedItem.variable
                    )}
                  />

                  <SmallDetail
                    label="Bonus"
                    value={money(
                      selectedItem.bonus
                    )}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-slate-900">
                  Deductions
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-5">
                  <SmallDetail
                    label="PF"
                    value={money(
                      selectedItem.pf
                    )}
                  />

                  <SmallDetail
                    label="ESI"
                    value={money(
                      selectedItem.esi
                    )}
                  />

                  <SmallDetail
                    label="PT"
                    value={money(
                      selectedItem.pt
                    )}
                  />

                  <SmallDetail
                    label="TDS"
                    value={money(
                      selectedItem.tds
                    )}
                  />

                  <SmallDetail
                    label="LWP"
                    value={money(
                      selectedItem.lwp
                    )}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-slate-900">
                  Attendance
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-5">
                  <SmallDetail
                    label="Attendance"
                    value={String(
                      selectedItem.attendance_days ??
                        0
                    )}
                  />

                  <SmallDetail
                    label="Paid Days"
                    value={String(
                      selectedItem.paid_days ??
                        0
                    )}
                  />

                  <SmallDetail
                    label="Absent"
                    value={String(
                      selectedItem.absent_days ??
                        0
                    )}
                  />

                  <SmallDetail
                    label="Leave"
                    value={String(
                      selectedItem.leave_days ??
                        0
                    )}
                  />

                  <SmallDetail
                    label="OT Hours"
                    value={String(
                      selectedItem.overtime_hours ??
                        0
                    )}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Payment Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${statusClass(
                      selectedItem.payment_status
                    )}`}
                  >
                    {selectedItem.payment_status ||
                      "Pending"}
                  </span>
                </div>

                <FileText
                  size={28}
                  className="text-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==============================================================
   COMPONENTS
============================================================== */

const KpiCard = ({
  title,
  value,
  subtitle,
  icon,
  valueClass = "text-slate-950",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  valueClass?: string;
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-wide text-slate-500">
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

        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          green
            ? "text-emerald-700"
            : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

const SmallDetail = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
};

export default PayrollPage;