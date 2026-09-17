import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserMinus,
  Clock3,
  AlertCircle,
  MapPin,
  Building2,
  BriefcaseBusiness,
  RefreshCw,
  TrendingUp,
  IndianRupee,
  CalendarCheck,
  FileCheck2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender?: string | null;
  phone?: string | null;
  personal_email?: string | null;
  work_email?: string | null;
  role?: string | null;
  department?: string | null;
  location?: string | null;
  joining_date?: string | null;
  employment_type?: string | null;
  reporting_manager?: string | null;
  experience_years?: number | null;
  status?: string | null;
  designation?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  attendance_date: string;
  check_in_at?: string | null;
  check_out_at?: string | null;
  break_minutes?: number | null;
  status?: string | null;
  check_in_lat?: number | null;
  check_in_long?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ApprovalRequest {
  id: string;
  employee_id: string;
  request_type?: string | null;
  title?: string | null;
  description?: string | null;
  amount?: number | null;
  status?: string | null;
  requested_by?: string | null;
  requested_at?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_comment?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  approval_stage?: string | null;
}

interface PayrollRun {
  id: string;
  payroll_month: string;
  status?: string | null;
  employee_count?: number | null;
  gross_pay?: number | null;
  total_deductions?: number | null;
  net_pay?: number | null;
  processed_by?: string | null;
  processed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  pay_group?: string | null;
}

interface Payslip {
  id: string;
  payroll_run_id?: string | null;
  employee_id?: string | null;
  pay_period_start?: string | null;
  pay_period_end?: string | null;
  status?: string | null;
  generated_at?: string | null;
  published_at?: string | null;
  payroll_month?: string | null;
  basic_pay?: number | null;
  total_earnings?: number | null;
  total_deductions?: number | null;
  net_pay?: number | null;
  created_at?: string | null;
}

interface Increment {
  appraisal_cycle?: string | null;
  effective_date?: string | null;
  current_ctc?: number | null;
  increment_percentage?: number | null;
  increment_amount?: number | null;
  revised_ctc?: number | null;
  current_designation?: string | null;
  revised_designation?: string | null;
  current_band?: string | null;
  revised_band?: string | null;
  performance_rating?: string | null;
  status?: string | null;
  requested_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  remarks?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface DashboardPageProps {
  onNavigateModule?: (module: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateModule,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [increments, setIncrements] = useState<Increment[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedLocation, setSelectedLocation] =
    useState("All Locations");

  const loadDashboardData = async () => {
    try {
      setError(null);

      const [
        employeesResult,
        attendanceResult,
        approvalsResult,
        payrollRunsResult,
        payslipsResult,
        incrementsResult,
      ] = await Promise.all([
        supabase
          .from("employees")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("attendance_records")
          .select("*")
          .order("attendance_date", { ascending: false }),

        supabase
          .from("approval_requests")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("payroll_runs")
          .select("*")
          .order("payroll_month", { ascending: false }),

        supabase
          .from("payslips")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("employee_increments")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (employeesResult.error) {
        throw employeesResult.error;
      }

      if (attendanceResult.error) {
        throw attendanceResult.error;
      }

      if (approvalsResult.error) {
        throw approvalsResult.error;
      }

      if (payrollRunsResult.error) {
        throw payrollRunsResult.error;
      }

      if (payslipsResult.error) {
        throw payslipsResult.error;
      }

      if (incrementsResult.error) {
        throw incrementsResult.error;
      }

      console.log("DASHBOARD EMPLOYEES:", employeesResult.data);
      console.log("DASHBOARD ATTENDANCE:", attendanceResult.data);
      console.log("DASHBOARD APPROVALS:", approvalsResult.data);
      console.log("DASHBOARD PAYROLL:", payrollRunsResult.data);
      console.log("DASHBOARD PAYSLIPS:", payslipsResult.data);
      console.log("DASHBOARD INCREMENTS:", incrementsResult.data);

      setEmployees((employeesResult.data || []) as Employee[]);
      setAttendance(
        (attendanceResult.data || []) as AttendanceRecord[]
      );
      setApprovals(
        (approvalsResult.data || []) as ApprovalRequest[]
      );
      setPayrollRuns(
        (payrollRunsResult.data || []) as PayrollRun[]
      );
      setPayslips((payslipsResult.data || []) as Payslip[]);
      setIncrements(
        (incrementsResult.data || []) as Increment[]
      );
    } catch (err: any) {
      console.error("DASHBOARD LOAD ERROR:", err);

      setError(
        err?.message ||
          "Unable to load Dashboard data from Supabase."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filteredEmployees = useMemo(() => {
    if (selectedLocation === "All Locations") {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.location === selectedLocation
    );
  }, [employees, selectedLocation]);

  const statistics = useMemo(() => {
    const total = filteredEmployees.length;

    const active = filteredEmployees.filter(
      (employee) =>
        String(employee.status || "").toUpperCase() ===
        "ACTIVE"
    ).length;

    const probation = filteredEmployees.filter(
      (employee) =>
        String(employee.status || "").toUpperCase() ===
        "PROBATION"
    ).length;

    const noticePeriod = filteredEmployees.filter(
      (employee) =>
        String(employee.status || "")
          .toUpperCase()
          .replace(/\s+/g, "_") === "NOTICE_PERIOD"
    ).length;

    const onLeaveFromEmployeeStatus =
      filteredEmployees.filter(
        (employee) =>
          String(employee.status || "")
            .toUpperCase()
            .replace(/\s+/g, "_") === "ON_LEAVE"
      ).length;

    const approvedLeaveRequests = approvals.filter(
      (request) =>
        String(request.request_type || "")
          .toUpperCase()
          .includes("LEAVE") &&
        String(request.status || "")
          .toUpperCase()
          .includes("APPROVED")
    ).length;

    const onLeave =
      onLeaveFromEmployeeStatus + approvedLeaveRequests;

    return {
      total,
      active,
      probation,
      noticePeriod,
      onLeave,
    };
  }, [filteredEmployees, approvals]);

  const attendanceStatistics = useMemo(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    const todayRecords = attendance.filter(
      (record) => record.attendance_date === today
    );

    const present = todayRecords.filter(
      (record) =>
        String(record.status || "").toLowerCase() ===
          "present" ||
        Boolean(record.check_in_at)
    ).length;

    const absent = todayRecords.filter(
      (record) =>
        String(record.status || "").toLowerCase() ===
        "absent"
    ).length;

    return {
      todayRecords,
      present,
      absent,
    };
  }, [attendance]);

  const payrollStatistics = useMemo(() => {
    if (payrollRuns.length === 0) {
      return {
        gross: 0,
        deductions: 0,
        net: 0,
        latestStatus: "No Payroll",
        employeeCount: 0,
      };
    }

    const latest = payrollRuns[0];

    return {
      gross: Number(latest.gross_pay || 0),
      deductions: Number(
        latest.total_deductions || 0
      ),
      net: Number(latest.net_pay || 0),
      latestStatus: latest.status || "Unknown",
      employeeCount: Number(
        latest.employee_count || 0
      ),
    };
  }, [payrollRuns]);

  const pendingApprovals = useMemo(() => {
    return approvals.filter((request) => {
      const status = String(
        request.status || ""
      ).toLowerCase();

      return (
        status === "pending" ||
        status === "submitted" ||
        status === "in_review"
      );
    }).length;
  }, [approvals]);

  const incrementStatistics = useMemo(() => {
    const pending = increments.filter((item) =>
      String(item.status || "")
        .toLowerCase()
        .includes("pending")
    ).length;

    const approved = increments.filter((item) =>
      String(item.status || "")
        .toLowerCase()
        .includes("approved")
    ).length;

    return {
      pending,
      approved,
      total: increments.length,
    };
  }, [increments]);

  const locationData = useMemo(() => {
    const locationMap: Record<string, number> = {};

    employees.forEach((employee) => {
      const location =
        employee.location || "Unknown";

      locationMap[location] =
        (locationMap[location] || 0) + 1;
    });

    return Object.entries(locationMap)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [employees]);

  const departmentData = useMemo(() => {
    const departmentMap: Record<string, number> = {};

    filteredEmployees.forEach((employee) => {
      const department =
        employee.department || "Unassigned";

      departmentMap[department] =
        (departmentMap[department] || 0) + 1;
    });

    return Object.entries(departmentMap)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEmployees]);

  const employmentTypeData = useMemo(() => {
    const typeMap: Record<string, number> = {};

    filteredEmployees.forEach((employee) => {
      const type =
        employee.employment_type || "Unknown";

      typeMap[type] =
        (typeMap[type] || 0) + 1;
    });

    return Object.entries(typeMap).map(
      ([name, count]) => ({
        name: formatEmploymentType(name),
        count,
      })
    );
  }, [filteredEmployees]);

  const recentEmployees = useMemo(() => {
    return [...filteredEmployees]
      .sort((a, b) => {
        const first = new Date(
          a.created_at ||
            a.joining_date ||
            ""
        ).getTime();

        const second = new Date(
          b.created_at ||
            b.joining_date ||
            ""
        ).getTime();

        return second - first;
      })
      .slice(0, 5);
  }, [filteredEmployees]);

  const latestPayroll = payrollRuns[0];

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleNavigate = (module: string) => {
    onNavigateModule?.(module);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  function formatEmploymentType(type: string) {
    const normalized = type
      .toUpperCase()
      .replace(/[\s-]+/g, "_");

    const labels: Record<string, string> = {
      FULL_TIME: "Full Time",
      CONTRACT: "Contract",
      PROBATION: "Probation",
      INTERN: "Intern",
    };

    return labels[normalized] || type;
  }

  const formatStatus = (status?: string | null) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-full bg-[#F7F8FA] p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            HRMS Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Live workforce overview from Supabase
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <MapPin
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={selectedLocation}
              onChange={(event) =>
                setSelectedLocation(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
            >
              <option>All Locations</option>

              {locationData.map((location) => (
                <option
                  key={location.name}
                  value={location.name}
                >
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="font-medium text-red-800">
              Unable to load Dashboard data
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* MAIN KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          onClick={() =>
            handleNavigate("Employee Management")
          }
          className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Employees
              </p>

              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : statistics.total}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                From employees table
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3">
              <Users
                size={21}
                className="text-indigo-600"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() =>
            handleNavigate("Employee Management")
          }
          className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Employees
              </p>

              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : statistics.active}
              </p>

              <p className="mt-2 text-xs text-emerald-600">
                Current employee status
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3">
              <UserCheck
                size={21}
                className="text-emerald-600"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() =>
            handleNavigate("Attendance & Leave")
          }
          className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                On Leave
              </p>

              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : statistics.onLeave}
              </p>

              <p className="mt-2 text-xs text-amber-600">
                Employee + approved leave data
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <UserMinus
                size={21}
                className="text-amber-600"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() =>
            handleNavigate("Employee Management")
          }
          className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Probation
              </p>

              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : statistics.probation}
              </p>

              <p className="mt-2 text-xs text-indigo-600">
                Employees on probation
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3">
              <Clock3
                size={21}
                className="text-indigo-600"
              />
            </div>
          </div>
        </button>
      </div>

      {/* LIVE MODULE STATS */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <CalendarCheck size={19} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Today's Present
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : attendanceStatistics.present}
              </p>

              <p className="text-xs text-slate-400">
                attendance_records
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <FileCheck2 size={19} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending Approvals
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : pendingApprovals}
              </p>

              <p className="text-xs text-slate-400">
                approval_requests
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <IndianRupee size={19} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Latest Net Payroll
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : formatCurrency(
                      payrollStatistics.net
                    )}
              </p>

              <p className="text-xs text-slate-400">
                payroll_runs
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <TrendingUp size={19} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending Increments
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {loading
                  ? "—"
                  : incrementStatistics.pending}
              </p>

              <p className="text-xs text-slate-400">
                employee_increments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PAYROLL SUMMARY */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Latest Payroll
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Live data from payroll_runs
            </p>
          </div>

          <button
            onClick={() =>
              handleNavigate("Payroll")
            }
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Open Payroll
          </button>
        </div>

        {latestPayroll ? (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Payroll Month
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {latestPayroll.payroll_month}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Gross Pay
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatCurrency(
                  payrollStatistics.gross
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Deductions
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatCurrency(
                  payrollStatistics.deductions
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Net Pay
              </p>

              <p className="mt-1 font-semibold text-emerald-700">
                {formatCurrency(
                  payrollStatistics.net
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">
            No payroll run available.
          </p>
        )}
      </div>

      {/* LOCATION + DEPARTMENT */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* LOCATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Employees by Location
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Live employees table
              </p>
            </div>

            <MapPin
              size={19}
              className="text-slate-400"
            />
          </div>

          <div className="mt-6 space-y-5">
            {locationData.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No location data available.
              </p>
            ) : (
              locationData.map((item) => {
                const percentage =
                  employees.length > 0
                    ? (item.count /
                        employees.length) *
                      100
                    : 0;

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* DEPARTMENT */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Employees by Department
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Live employees table
              </p>
            </div>

            <Building2
              size={19}
              className="text-slate-400"
            />
          </div>

          <div className="mt-5 max-h-[270px] space-y-3 overflow-y-auto pr-1">
            {departmentData.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">
                No department data available.
              </p>
            ) : (
              departmentData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2">
                      <BriefcaseBusiness
                        size={16}
                        className="text-indigo-600"
                      />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* EMPLOYMENT TYPE */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Employment Type
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Workforce composition
            </p>
          </div>

          <Users
            size={19}
            className="text-slate-400"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {employmentTypeData.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-sm text-slate-500">
                {item.name}
              </p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT EMPLOYEES */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Employees
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Live employees table
            </p>
          </div>

          <button
            onClick={() =>
              handleNavigate("Employee Management")
            }
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading employee data...
          </div>
        ) : recentEmployees.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Employee
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Designation
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                          {getInitials(
                            employee.full_name ||
                              `${employee.first_name} ${employee.last_name}`
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {employee.full_name ||
                              `${employee.first_name} ${employee.last_name}`}
                          </p>

                          <p className="text-xs text-slate-500">
                            {employee.employee_code}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {employee.designation ||
                        "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {employee.department ||
                        "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {employee.location ||
                        "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatEmploymentType(
                        employee.employment_type ||
                          "Unknown"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          String(
                            employee.status || ""
                          ).toUpperCase() ===
                          "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : String(
                                employee.status || ""
                              )
                                .toUpperCase()
                                .includes(
                                  "LEAVE"
                                )
                            ? "bg-amber-50 text-amber-700"
                            : String(
                                employee.status || ""
                              )
                                .toUpperCase()
                                .includes(
                                  "PROBATION"
                                )
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {formatStatus(
                          employee.status
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export { DashboardPage };
export default DashboardPage;