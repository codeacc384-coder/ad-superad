import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  UserCheck,
  X,
  XCircle,
  FileText,
  Users,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* =========================================================
   DATABASE TYPES
========================================================= */

interface Employee {
  id: string;
  employee_code: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  department: string | null;
  location: string | null;
  designation: string | null;
  status: string | null;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  attendance_date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  break_minutes: number | null;
  status: string | null;
  check_in_lat: number | null;
  check_in_long: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ApprovalRequest {
  id: string;
  employee_id: string;
  request_type: string | null;
  title: string | null;
  description: string | null;
  amount: number | null;
  status: string | null;
  requested_by: string | null;
  requested_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_comment: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  approval_stage: string | null;
  tl_approved_by: string | null;
  tl_approved_at: string | null;
  tl_review_comment: string | null;
  hr_approved_by: string | null;
  hr_approved_at: string | null;
  hr_review_comment: string | null;
}

interface AttendanceView extends AttendanceRecord {
  employee: Employee | null;
}

interface LeaveView extends ApprovalRequest {
  employee: Employee | null;
}

/* =========================================================
   HELPERS
========================================================= */

const todayString = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const employeeName = (employee: Employee | null) => {
  if (!employee) return "Unknown Employee";

  if (employee.full_name?.trim()) {
    return employee.full_name.trim();
  }

  return `${employee.first_name || ""} ${employee.last_name || ""}`
    .trim() || "Unknown Employee";
};

const initials = (employee: Employee | null) => {
  const name = employeeName(employee);

  const parts = name
    .split(" ")
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatDate = (dateValue: string | null | undefined) => {
  if (!dateValue) return "—";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateValue: string | null | undefined) => {
  if (!dateValue) return "Not recorded";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const calculateHours = (
  checkIn: string | null,
  checkOut: string | null,
  breakMinutes: number | null
) => {
  if (!checkIn || !checkOut) {
    return null;
  }

  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    end <= start
  ) {
    return null;
  }

  const breakMs = Number(breakMinutes || 0) * 60 * 1000;

  const totalMs = Math.max(
    0,
    end - start - breakMs
  );

  return totalMs / 1000 / 60 / 60;
};

const formatHours = (hours: number | null) => {
  if (hours === null) {
    return "Not recorded";
  }

  return `${hours.toFixed(1)}h`;
};

const formatPercent = (value: number) => {
  return `${Math.round(value)}%`;
};

const parseLeaveDescription = (
  description: string | null
) => {
  if (!description) {
    return {
      startDate: null,
      endDate: null,
      leaveType: null,
      days: null,
      reason: null,
    };
  }

  try {
    const parsed = JSON.parse(description);

    return {
      startDate:
        parsed.startDate ||
        parsed.start_date ||
        null,

      endDate:
        parsed.endDate ||
        parsed.end_date ||
        null,

      leaveType:
        parsed.leaveType ||
        parsed.leave_type ||
        null,

      days:
        parsed.days ??
        parsed.totalDays ??
        null,

      reason:
        parsed.reason ||
        null,
    };
  } catch {
    return {
      startDate: null,
      endDate: null,
      leaveType: null,
      days: null,
      reason: description,
    };
  }
};

const statusLabel = (status: string | null) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export const AttendanceLeavePage: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<"attendance" | "leave">("attendance");

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [leaveRequests, setLeaveRequests] =
    useState<ApprovalRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedDate, setSelectedDate] =
    useState(todayString());

  const [locationFilter, setLocationFilter] =
    useState("ALL");

  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceView | null>(null);

  const [selectedLeave, setSelectedLeave] =
    useState<LeaveView | null>(null);

  const [showApplyLeave, setShowApplyLeave] =
    useState(false);

  const [leaveEmployeeId, setLeaveEmployeeId] =
    useState("");

  const [leaveType, setLeaveType] =
    useState("Casual Leave");

  const [leaveStartDate, setLeaveStartDate] =
    useState("");

  const [leaveEndDate, setLeaveEndDate] =
    useState("");

  const [leaveReason, setLeaveReason] =
    useState("");

  const [savingLeave, setSavingLeave] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  /* =======================================================
     LOAD EMPLOYEES
  ======================================================= */

  const loadEmployees = async () => {
    const { data, error } = await supabase
      .from("employees")
      .select(
        `
        id,
        employee_code,
        first_name,
        last_name,
        full_name,
        department,
        location,
        designation,
        status
        `
      )
      .order("full_name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "EMPLOYEES LOAD ERROR:",
        error
      );

      setMessage(
        `Unable to load employees: ${error.message}`
      );

      return;
    }

    setEmployees(
      (data || []) as Employee[]
    );
  };

  /* =======================================================
     LOAD ATTENDANCE
  ======================================================= */

  const loadAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance_records")
      .select("*")
      .order("attendance_date", {
        ascending: false,
      })
      .order("check_in_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "ATTENDANCE LOAD ERROR:",
        error
      );

      setMessage(
        `Unable to load attendance: ${error.message}`
      );

      return;
    }

    setAttendance(
      (data || []) as AttendanceRecord[]
    );
  };

  /* =======================================================
     LOAD LEAVE
  ======================================================= */

  const loadLeaveRequests = async () => {
    const { data, error } = await supabase
      .from("approval_requests")
      .select("*")
      .eq("request_type", "LEAVE")
      .order("requested_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "LEAVE LOAD ERROR:",
        error
      );

      setMessage(
        `Unable to load leave requests: ${error.message}`
      );

      return;
    }

    setLeaveRequests(
      (data || []) as ApprovalRequest[]
    );
  };

  /* =======================================================
     LOAD EVERYTHING
  ======================================================= */

  const loadData = async () => {
    setLoading(true);
    setMessage(null);

    await Promise.all([
      loadEmployees(),
      loadAttendance(),
      loadLeaveRequests(),
    ]);

    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    setMessage(null);

    await Promise.all([
      loadEmployees(),
      loadAttendance(),
      loadLeaveRequests(),
    ]);

    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     MAP EMPLOYEES
  ======================================================= */

  const employeeMap = useMemo(() => {
    const map = new Map<
      string,
      Employee
    >();

    employees.forEach((employee) => {
      map.set(employee.id, employee);
    });

    return map;
  }, [employees]);

  /* =======================================================
     ATTENDANCE WITH EMPLOYEE
  ======================================================= */

  const attendanceViews =
    useMemo<AttendanceView[]>(() => {
      return attendance.map((record) => ({
        ...record,
        employee:
          employeeMap.get(
            record.employee_id
          ) || null,
      }));
    }, [attendance, employeeMap]);

  /* =======================================================
     LEAVE WITH EMPLOYEE
  ======================================================= */

  const leaveViews =
    useMemo<LeaveView[]>(() => {
      return leaveRequests.map((request) => ({
        ...request,
        employee:
          employeeMap.get(
            request.employee_id
          ) || null,
      }));
    }, [leaveRequests, employeeMap]);

  /* =======================================================
     LOCATION LIST
  ======================================================= */

  const locations = useMemo(() => {
    const values = employees
      .map((employee) =>
        employee.location?.trim()
      )
      .filter(
        (location): location is string =>
          Boolean(location)
      );

    return Array.from(
      new Set(values)
    ).sort();
  }, [employees]);

  /* =======================================================
     SELECTED-DATE ATTENDANCE
  ======================================================= */

  const dateAttendance =
    useMemo(() => {
      return attendanceViews.filter(
        (record) =>
          record.attendance_date ===
          selectedDate
      );
    }, [
      attendanceViews,
      selectedDate,
    ]);

  /* =======================================================
     FILTERED ATTENDANCE
  ======================================================= */

  const filteredAttendance =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return dateAttendance.filter(
        (record) => {
          const employee =
            record.employee;

          const name =
            employeeName(employee)
              .toLowerCase();

          const code =
            employee?.employee_code
              ?.toLowerCase() || "";

          const department =
            employee?.department
              ?.toLowerCase() || "";

          const location =
            employee?.location
              ?.toLowerCase() || "";

          const status =
            record.status
              ?.toLowerCase() || "";

          const matchesSearch =
            !query ||
            name.includes(query) ||
            code.includes(query) ||
            department.includes(query) ||
            location.includes(query);

          const matchesStatus =
            statusFilter === "ALL" ||
            status ===
              statusFilter.toLowerCase();

          const matchesLocation =
            locationFilter === "ALL" ||
            employee?.location ===
              locationFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesLocation
          );
        }
      );
    }, [
      dateAttendance,
      search,
      statusFilter,
      locationFilter,
    ]);

  /* =======================================================
     FILTERED LEAVE
  ======================================================= */

  const filteredLeave =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return leaveViews.filter(
        (request) => {
          const employee =
            request.employee;

          const name =
            employeeName(employee)
              .toLowerCase();

          const code =
            employee?.employee_code
              ?.toLowerCase() || "";

          const department =
            employee?.department
              ?.toLowerCase() || "";

          const status =
            request.status
              ?.toLowerCase() || "";

          const matchesSearch =
            !query ||
            name.includes(query) ||
            code.includes(query) ||
            department.includes(query);

          const matchesStatus =
            statusFilter === "ALL" ||
            status ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      leaveViews,
      search,
      statusFilter,
    ]);

  /* =======================================================
     DAILY METRICS
  ======================================================= */

  const dailyMetrics = useMemo(() => {
    const records =
      dateAttendance;

    const totalEmployees =
      employees.length;

    const presentCount =
      records.filter((record) => {
        const status =
          record.status
            ?.toUpperCase() || "";

        return (
          Boolean(record.check_in_at) ||
          [
            "PRESENT",
            "ON_TIME",
            "LATE",
            "CHECKED_IN",
            "WORKING",
          ].includes(status)
        );
      }).length;

    const absentCount =
      records.filter((record) => {
        const status =
          record.status
            ?.toUpperCase() || "";

        return [
          "ABSENT",
          "A",
        ].includes(status);
      }).length;

    const lateCount =
      records.filter((record) => {
        const status =
          record.status
            ?.toUpperCase() || "";

        return status.includes("LATE");
      }).length;

    const leaveCount =
      records.filter((record) => {
        const status =
          record.status
            ?.toUpperCase() || "";

        return status.includes("LEAVE");
      }).length;

    const totalHours =
      records.reduce(
        (total, record) => {
          const hours =
            calculateHours(
              record.check_in_at,
              record.check_out_at,
              record.break_minutes
            );

          return total + (hours || 0);
        },
        0
      );

    const recordsWithHours =
      records.filter(
        (record) =>
          calculateHours(
            record.check_in_at,
            record.check_out_at,
            record.break_minutes
          ) !== null
      );

    const attendanceRate =
      totalEmployees > 0
        ? (presentCount /
            totalEmployees) *
          100
        : 0;

    return {
      employees: totalEmployees,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      leave: leaveCount,
      totalHours,
      attendanceRate,
      recordsWithHours:
        recordsWithHours.length,
    };
  }, [
    dateAttendance,
    employees.length,
  ]);

  /* =======================================================
     LEAVE METRICS
  ======================================================= */

  const leaveMetrics = useMemo(() => {
    const total =
      leaveViews.length;

    const pending =
      leaveViews.filter(
        (item) =>
          item.status?.toUpperCase() ===
          "PENDING"
      ).length;

    const approved =
      leaveViews.filter(
        (item) =>
          item.status?.toUpperCase() ===
          "APPROVED"
      ).length;

    const rejected =
      leaveViews.filter(
        (item) =>
          item.status?.toUpperCase() ===
          "REJECTED"
      ).length;

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }, [leaveViews]);

  /* =======================================================
     UPDATE LEAVE STATUS
  ======================================================= */

  const updateLeaveStatus = async (
    request: ApprovalRequest,
    nextStatus: "APPROVED" | "REJECTED"
  ) => {
    const now =
      new Date().toISOString();

    const { error } = await supabase
      .from("approval_requests")
      .update({
        status: nextStatus,
        reviewed_at: now,
        review_comment:
          nextStatus === "APPROVED"
            ? "Approved by HR"
            : "Rejected by HR",
        hr_approved_at:
          nextStatus === "APPROVED"
            ? now
            : null,
      })
      .eq("id", request.id);

    if (error) {
      console.error(
        "LEAVE STATUS UPDATE ERROR:",
        error
      );

      setMessage(
        `Unable to update leave: ${error.message}`
      );

      return;
    }

    setMessage(
      `Leave request ${nextStatus.toLowerCase()} successfully.`
    );

    await loadLeaveRequests();

    setSelectedLeave(null);
  };

  /* =======================================================
     APPLY LEAVE
  ======================================================= */

  const submitLeave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!leaveEmployeeId) {
      setMessage(
        "Please select an employee."
      );
      return;
    }

    if (
      !leaveStartDate ||
      !leaveEndDate
    ) {
      setMessage(
        "Please select leave dates."
      );
      return;
    }

    if (leaveEndDate < leaveStartDate) {
      setMessage(
        "End date cannot be before start date."
      );
      return;
    }

    setSavingLeave(true);
    setMessage(null);

    const start =
      new Date(
        `${leaveStartDate}T00:00:00`
      );

    const end =
      new Date(
        `${leaveEndDate}T00:00:00`
      );

    const days =
      Math.floor(
        (end.getTime() -
          start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const description = JSON.stringify({
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      leaveType,
      days,
      reason:
        leaveReason.trim() || null,
    });

    const { error } =
      await supabase
        .from("approval_requests")
        .insert({
          employee_id:
            leaveEmployeeId,

          request_type: "LEAVE",

          title: leaveType,

          description,

          amount: null,

          status: "PENDING",

          requested_by:
            leaveEmployeeId,

          requested_at:
            new Date().toISOString(),

          approval_stage:
            "TL_PENDING",
        });

    if (error) {
      console.error(
        "APPLY LEAVE ERROR:",
        error
      );

      setMessage(
        `Unable to apply leave: ${error.message}`
      );

      setSavingLeave(false);
      return;
    }

    setMessage(
      "Leave application created successfully."
    );

    setSavingLeave(false);

    setShowApplyLeave(false);

    setLeaveEmployeeId("");
    setLeaveType("Casual Leave");
    setLeaveStartDate("");
    setLeaveEndDate("");
    setLeaveReason("");

    await loadLeaveRequests();
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setLocationFilter("ALL");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6 pb-10">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-bold tracking-tight text-[#101828]">
                Attendance & Leave Management
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Shift Roster Active
              </span>
            </div>

            <p className="mt-1 text-sm text-[#667085]">
              Biometric turnstile punches, geofence
              mobile check-ins, leave quotas, and
              manager approval queues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <CalendarCheck className="h-4 w-4 text-gray-500" />

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                className="bg-transparent text-sm font-medium outline-none"
              />
            </div>

            <button
              onClick={() =>
                setShowApplyLeave(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#131b2e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#202a42]"
            >
              <span className="text-lg leading-none">
                +
              </span>
              Apply Leave
            </button>

            <button
              onClick={refreshData}
              disabled={refreshing}
              className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
            </button>

          </div>
        </div>
      </section>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {message}
          </div>

          <button
            onClick={() =>
              setMessage(null)
            }
            className="rounded-md p-1 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* =================================================
          TABS
      ================================================= */}

      <div className="flex gap-2 border-b border-gray-200 pb-2">

        <button
          onClick={() => {
            setActiveTab("attendance");
            setSearch("");
            setStatusFilter("ALL");
          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "attendance"
              ? "bg-[#131b2e] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Daily Shift Punch Stream (
          {dateAttendance.length}
          )
        </button>

        <button
          onClick={() => {
            setActiveTab("leave");
            setSearch("");
            setStatusFilter("ALL");
          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "leave"
              ? "bg-[#131b2e] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Leave Applications & Quota (
          {leaveMetrics.total}
          )
        </button>

      </div>

      {/* =================================================
          ATTENDANCE TAB
      ================================================= */}

      {activeTab === "attendance" && (
        <>
          {/* FILTER BAR */}

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search punch records, emp name..."
                  className="w-full rounded-xl border border-gray-200 bg-[#fcfbfc] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />

                <select
                  value={locationFilter}
                  onChange={(event) =>
                    setLocationFilter(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none"
                >
                  <option value="ALL">
                    All Locations
                  </option>

                  {locations.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none"
                >
                  <option value="ALL">
                    All Statuses
                  </option>

                  <option value="PRESENT">
                    Present
                  </option>

                  <option value="ON_TIME">
                    On Time
                  </option>

                  <option value="LATE">
                    Late
                  </option>

                  <option value="ABSENT">
                    Absent
                  </option>

                  <option value="ON_LEAVE">
                    On Leave
                  </option>
                </select>

                {(search ||
                  statusFilter !== "ALL" ||
                  locationFilter !== "ALL") && (
                  <button
                    onClick={clearFilters}
                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>
          </section>

          {/* DAILY OVERVIEW */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[18px] font-bold text-[#101828]">
                      Daily Attendance Overview
                    </h2>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                      Daily Report
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Employee-wise working hours,
                    attendance, breaks, and
                    punch status.
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {dailyMetrics.employees} employees
                  included
                </span>

              </div>

            </div>

            {/* KPI */}

            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">

              <MetricCard
                label="Employees"
                value={String(
                  dailyMetrics.employees
                )}
                description="Employee population"
                icon={<Users className="h-5 w-5" />}
              />

              <MetricCard
                label="Working Hours"
                value={`${dailyMetrics.totalHours.toFixed(
                  1
                )}h`}
                description={
                  dailyMetrics.recordsWithHours >
                  0
                    ? "Recorded logged hours"
                    : "No completed punches"
                }
                icon={
                  <Clock3 className="h-5 w-5" />
                }
              />

              <MetricCard
                label="Attendance"
                value={formatPercent(
                  dailyMetrics.attendanceRate
                )}
                description={`${dailyMetrics.present} present`}
                icon={
                  <CheckCircle2 className="h-5 w-5" />
                }
                valueClass="text-emerald-600"
              />

              <MetricCard
                label="Late"
                value={String(
                  dailyMetrics.late
                )}
                description="Late punch records"
                icon={
                  <Clock3 className="h-5 w-5" />
                }
                valueClass={
                  dailyMetrics.late > 0
                    ? "text-amber-600"
                    : "text-gray-900"
                }
              />

              <MetricCard
                label="Exceptions"
                value={String(
                  dailyMetrics.absent +
                    dailyMetrics.leave
                )}
                description="Absent + leave records"
                icon={
                  <AlertCircle className="h-5 w-5" />
                }
                valueClass={
                  dailyMetrics.absent +
                    dailyMetrics.leave >
                  0
                    ? "text-red-600"
                    : "text-gray-900"
                }
              />

            </div>

          </section>

          {/* EMPLOYEE DAILY DETAILS */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 p-6">

              <h2 className="text-[18px] font-bold text-[#101828]">
                Employee-wise Daily Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Working hours, attendance,
                punctuality, break, leave and
                punch information from the database.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="bg-[#faf9fa] text-[11px] font-bold uppercase tracking-wide text-[#667085]">

                  <tr>
                    <th className="px-5 py-4 text-left">
                      Employee
                    </th>

                    <th className="px-5 py-4 text-left">
                      Working Hours
                    </th>

                    <th className="px-5 py-4 text-left">
                      Attendance
                    </th>

                    <th className="px-5 py-4 text-left">
                      Break
                    </th>

                    <th className="px-5 py-4 text-left">
                      Leave
                    </th>

                    <th className="px-5 py-4 text-left">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left">
                      Check-in
                    </th>

                    <th className="px-5 py-4 text-right">
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {loading ? (
                    <LoadingRow colSpan={8} />
                  ) : filteredAttendance.length ===
                    0 ? (
                    <EmptyRow
                      colSpan={8}
                      text="No attendance records found for the selected date/filter."
                    />
                  ) : (
                    filteredAttendance.map(
                      (record) => {
                        const hours =
                          calculateHours(
                            record.check_in_at,
                            record.check_out_at,
                            record.break_minutes
                          );

                        return (
                          <tr
                            key={record.id}
                            className="transition hover:bg-gray-50"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#131b2e] text-xs font-bold text-white">
                                  {initials(
                                    record.employee
                                  )}
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {employeeName(
                                      record.employee
                                    )}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {record.employee
                                      ?.employee_code ||
                                      "—"}{" "}
                                    •{" "}
                                    {record.employee
                                      ?.department ||
                                      "—"}
                                  </p>
                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4">
                              <p className="font-semibold text-gray-900">
                                {formatHours(hours)}
                              </p>

                              <p className="text-xs text-gray-500">
                                Expected 8h
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <StatusPill
                                label={
                                  statusLabel(
                                    record.status
                                  )
                                }
                                type={
                                  record.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                              {record.break_minutes ??
                                0}
                              m
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                              {record.status
                                ?.toUpperCase()
                                .includes(
                                  "LEAVE"
                                )
                                ? "Yes"
                                : "0 days"}
                            </td>

                            <td className="px-5 py-4">
                              <StatusPill
                                label={
                                  statusLabel(
                                    record.status
                                  )
                                }
                                type={
                                  record.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <Clock3 className="h-4 w-4 text-gray-400" />

                                {formatTime(
                                  record.check_in_at
                                )}
                              </div>

                            </td>

                            <td className="px-5 py-4 text-right">

                              <button
                                onClick={() =>
                                  setSelectedAttendance(
                                    record
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* PUNCH STREAM */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 p-6">
              <h2 className="text-[18px] font-bold">
                Daily Punch Stream
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Actual check-in records and
                geolocation information stored in
                attendance_records.
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-[#faf9fa] text-[11px] font-bold uppercase text-gray-500">
                  <tr>

                    <th className="px-5 py-4 text-left">
                      Employee
                    </th>

                    <th className="px-5 py-4 text-left">
                      Shift Date
                    </th>

                    <th className="px-5 py-4 text-left">
                      Check-in Punch
                    </th>

                    <th className="px-5 py-4 text-left">
                      Method & Location
                    </th>

                    <th className="px-5 py-4 text-left">
                      Logged Hours
                    </th>

                    <th className="px-5 py-4 text-left">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {loading ? (
                    <LoadingRow colSpan={7} />
                  ) : filteredAttendance.length ===
                    0 ? (
                    <EmptyRow
                      colSpan={7}
                      text="No punch records available."
                    />
                  ) : (
                    filteredAttendance.map(
                      (record) => {
                        const hours =
                          calculateHours(
                            record.check_in_at,
                            record.check_out_at,
                            record.break_minutes
                          );

                        return (
                          <tr
                            key={`punch-${record.id}`}
                            className="hover:bg-gray-50"
                          >

                            <td className="px-5 py-4">

                              <p className="font-semibold">
                                {employeeName(
                                  record.employee
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                {record.employee
                                  ?.employee_code ||
                                  "—"}{" "}
                                •{" "}
                                {record.employee
                                  ?.department ||
                                  "—"}
                              </p>

                            </td>

                            <td className="px-5 py-4 text-sm">
                              {formatDate(
                                record.attendance_date
                              )}
                            </td>

                            <td className="px-5 py-4">

                              <p className="font-bold">
                                {formatTime(
                                  record.check_in_at
                                )}
                              </p>

                            </td>

                            <td className="px-5 py-4">

                              {record.check_in_lat !==
                                null &&
                              record.check_in_long !==
                                null ? (
                                <div>
                                  <p className="flex items-center gap-1 text-sm font-medium">
                                    <MapPin className="h-4 w-4 text-gray-500" />

                                    {
                                      record.check_in_lat
                                    }
                                    ,{" "}
                                    {
                                      record.check_in_long
                                    }
                                  </p>

                                  <p className="mt-0.5 text-xs text-gray-500">
                                    Via MOBILE
                                    GEOFENCE
                                  </p>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  Location not
                                  recorded
                                </span>
                              )}

                            </td>

                            <td className="px-5 py-4 text-sm font-medium">
                              {formatHours(hours)}
                            </td>

                            <td className="px-5 py-4">

                              <StatusPill
                                label={
                                  statusLabel(
                                    record.status
                                  )
                                }
                                type={
                                  record.status
                                }
                              />

                            </td>

                            <td className="px-5 py-4 text-right">

                              <button
                                onClick={() =>
                                  setSelectedAttendance(
                                    record
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>
        </>
      )}

      {/* =================================================
          LEAVE TAB
      ================================================= */}

      {activeTab === "leave" && (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <MetricCard
              label="Total Applications"
              value={String(
                leaveMetrics.total
              )}
              description="Leave requests"
              icon={
                <FileText className="h-5 w-5" />
              }
            />

            <MetricCard
              label="Pending"
              value={String(
                leaveMetrics.pending
              )}
              description="Awaiting approval"
              icon={
                <Clock3 className="h-5 w-5" />
              }
              valueClass="text-amber-600"
            />

            <MetricCard
              label="Approved"
              value={String(
                leaveMetrics.approved
              )}
              description="Approved requests"
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              valueClass="text-emerald-600"
            />

            <MetricCard
              label="Rejected"
              value={String(
                leaveMetrics.rejected
              )}
              description="Rejected requests"
              icon={
                <XCircle className="h-5 w-5" />
              }
              valueClass="text-red-600"
            />

          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search employee, code, department..."
                  className="w-full rounded-xl border border-gray-200 bg-[#fcfbfc] py-2.5 pl-10 pr-4 text-sm outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none"
              >
                <option value="ALL">
                  All Statuses
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

          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 p-6">

              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-bold">
                  Leave Applications & Quota
                </h2>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                  {leaveMetrics.total} Requests
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Leave applications loaded directly
                from approval_requests.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-[#faf9fa] text-[11px] font-bold uppercase text-gray-500">

                  <tr>

                    <th className="px-5 py-4 text-left">
                      Employee
                    </th>

                    <th className="px-5 py-4 text-left">
                      Leave Type
                    </th>

                    <th className="px-5 py-4 text-left">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left">
                      Days
                    </th>

                    <th className="px-5 py-4 text-left">
                      Approval Stage
                    </th>

                    <th className="px-5 py-4 text-left">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {loading ? (
                    <LoadingRow colSpan={7} />
                  ) : filteredLeave.length ===
                    0 ? (
                    <EmptyRow
                      colSpan={7}
                      text="No leave applications found."
                    />
                  ) : (
                    filteredLeave.map(
                      (request) => {
                        const leave =
                          parseLeaveDescription(
                            request.description
                          );

                        return (
                          <tr
                            key={request.id}
                            className="hover:bg-gray-50"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#131b2e] text-xs font-bold text-white">
                                  {initials(
                                    request.employee
                                  )}
                                </div>

                                <div>
                                  <p className="font-semibold">
                                    {employeeName(
                                      request.employee
                                    )}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {request.employee
                                      ?.employee_code ||
                                      "—"}{" "}
                                    •{" "}
                                    {request.employee
                                      ?.department ||
                                      "—"}
                                  </p>
                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4 text-sm font-medium">
                              {leave.leaveType ||
                                request.title ||
                                "Leave"}
                            </td>

                            <td className="px-5 py-4 text-sm">
                              {leave.startDate
                                ? formatDate(
                                    leave.startDate
                                  )
                                : "—"}

                              {leave.endDate &&
                                leave.endDate !==
                                  leave.startDate && (
                                  <>
                                    {" "}
                                    –{" "}
                                    {formatDate(
                                      leave.endDate
                                    )}
                                  </>
                                )}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold">
                              {leave.days ??
                                "—"}
                            </td>

                            <td className="px-5 py-4 text-sm">
                              {statusLabel(
                                request.approval_stage
                              )}
                            </td>

                            <td className="px-5 py-4">

                              <StatusPill
                                label={
                                  statusLabel(
                                    request.status
                                  )
                                }
                                type={
                                  request.status
                                }
                              />

                            </td>

                            <td className="px-5 py-4 text-right">

                              <button
                                onClick={() =>
                                  setSelectedLeave(
                                    request
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>
        </>
      )}

      {/* =================================================
          ATTENDANCE DETAIL MODAL
      ================================================= */}

      {selectedAttendance && (
        <Modal
          title="Attendance Details"
          onClose={() =>
            setSelectedAttendance(null)
          }
        >

          <div className="space-y-5">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#131b2e] font-bold text-white">
                {initials(
                  selectedAttendance.employee
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  {employeeName(
                    selectedAttendance.employee
                  )}
                </h3>

                <p className="text-sm text-gray-500">
                  {
                    selectedAttendance.employee
                      ?.employee_code
                  }{" "}
                  •{" "}
                  {
                    selectedAttendance.employee
                      ?.designation
                  }
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <DetailBox
                label="Department"
                value={
                  selectedAttendance
                    .employee?.department ||
                  "—"
                }
              />

              <DetailBox
                label="Location"
                value={
                  selectedAttendance
                    .employee?.location ||
                  "—"
                }
              />

              <DetailBox
                label="Attendance Date"
                value={formatDate(
                  selectedAttendance.attendance_date
                )}
              />

              <DetailBox
                label="Status"
                value={statusLabel(
                  selectedAttendance.status
                )}
              />

              <DetailBox
                label="Check In"
                value={formatTime(
                  selectedAttendance.check_in_at
                )}
              />

              <DetailBox
                label="Check Out"
                value={formatTime(
                  selectedAttendance.check_out_at
                )}
              />

              <DetailBox
                label="Break"
                value={`${selectedAttendance.break_minutes ?? 0} minutes`}
              />

              <DetailBox
                label="Logged Hours"
                value={formatHours(
                  calculateHours(
                    selectedAttendance.check_in_at,
                    selectedAttendance.check_out_at,
                    selectedAttendance.break_minutes
                  )
                )}
              />

            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />

                <p className="text-sm font-semibold">
                  Check-in Location
                </p>
              </div>

              {selectedAttendance
                .check_in_lat !== null &&
              selectedAttendance
                .check_in_long !== null ? (
                <p className="text-sm text-gray-600">
                  Latitude:{" "}
                  {
                    selectedAttendance.check_in_lat
                  }
                  <br />
                  Longitude:{" "}
                  {
                    selectedAttendance.check_in_long
                  }
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  No geolocation recorded for
                  this punch.
                </p>
              )}

            </div>

          </div>

        </Modal>
      )}

      {/* =================================================
          LEAVE DETAIL MODAL
      ================================================= */}

      {selectedLeave && (
        <Modal
          title="Leave Application"
          onClose={() =>
            setSelectedLeave(null)
          }
        >

          {(() => {
            const leave =
              parseLeaveDescription(
                selectedLeave.description
              );

            const isPending =
              selectedLeave.status?.toUpperCase() ===
              "PENDING";

            return (
              <div className="space-y-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#131b2e] font-bold text-white">
                    {initials(
                      selectedLeave.employee
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {employeeName(
                        selectedLeave.employee
                      )}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {
                        selectedLeave.employee
                          ?.employee_code
                      }{" "}
                      •{" "}
                      {
                        selectedLeave.employee
                          ?.department
                      }
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <DetailBox
                    label="Leave Type"
                    value={
                      leave.leaveType ||
                      selectedLeave.title ||
                      "Leave"
                    }
                  />

                  <DetailBox
                    label="Status"
                    value={statusLabel(
                      selectedLeave.status
                    )}
                  />

                  <DetailBox
                    label="Start Date"
                    value={
                      leave.startDate
                        ? formatDate(
                            leave.startDate
                          )
                        : "—"
                    }
                  />

                  <DetailBox
                    label="End Date"
                    value={
                      leave.endDate
                        ? formatDate(
                            leave.endDate
                          )
                        : "—"
                    }
                  />

                  <DetailBox
                    label="Days"
                    value={
                      leave.days !== null &&
                      leave.days !== undefined
                        ? String(
                            leave.days
                          )
                        : "—"
                    }
                  />

                  <DetailBox
                    label="Approval Stage"
                    value={statusLabel(
                      selectedLeave.approval_stage
                    )}
                  />

                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Reason
                  </p>

                  <p className="mt-2 text-sm text-gray-700">
                    {leave.reason ||
                      "No reason provided."}
                  </p>

                </div>

                {selectedLeave.review_comment && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <p className="text-xs font-semibold uppercase text-blue-600">
                      Review Comment
                    </p>

                    <p className="mt-2 text-sm text-blue-800">
                      {
                        selectedLeave.review_comment
                      }
                    </p>

                  </div>
                )}

                {isPending && (
                  <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">

                    <button
                      onClick={() =>
                        updateLeaveStatus(
                          selectedLeave,
                          "REJECTED"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        updateLeaveStatus(
                          selectedLeave,
                          "APPROVED"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>

                  </div>
                )}

              </div>
            );
          })()}

        </Modal>
      )}

      {/* =================================================
          APPLY LEAVE MODAL
      ================================================= */}

      {showApplyLeave && (
        <Modal
          title="Apply Leave"
          onClose={() =>
            setShowApplyLeave(false)
          }
        >

          <form
            onSubmit={submitLeave}
            className="space-y-5"
          >

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Employee
              </label>

              <select
                value={leaveEmployeeId}
                onChange={(event) =>
                  setLeaveEmployeeId(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                required
              >
                <option value="">
                  Select employee
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employeeName(
                        employee
                      )}{" "}
                      (
                      {
                        employee.employee_code
                      }
                      )
                    </option>
                  )
                )}

              </select>

            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Leave Type
              </label>

              <select
                value={leaveType}
                onChange={(event) =>
                  setLeaveType(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option>
                  Casual Leave
                </option>

                <option>
                  Sick Leave
                </option>

                <option>
                  Annual Leave
                </option>

                <option>
                  Emergency Leave
                </option>
              </select>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={leaveStartDate}
                  onChange={(event) =>
                    setLeaveStartDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={leaveEndDate}
                  onChange={(event) =>
                    setLeaveEndDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none"
                  required
                />
              </div>

            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Reason
              </label>

              <textarea
                value={leaveReason}
                onChange={(event) =>
                  setLeaveReason(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Enter reason..."
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">

              <button
                type="button"
                onClick={() =>
                  setShowApplyLeave(false)
                }
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingLeave}
                className="rounded-xl bg-[#131b2e] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {savingLeave
                  ? "Saving..."
                  : "Submit Leave"}
              </button>

            </div>

          </form>

        </Modal>
      )}

    </div>
  );
};

/* =========================================================
   METRIC CARD
========================================================= */

const MetricCard: React.FC<{
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueClass?: string;
}> = ({
  label,
  value,
  description,
  icon,
  valueClass = "text-gray-900",
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

    <div className="flex items-center justify-between">

      <p className="text-[11px] font-bold uppercase tracking-wide text-[#667085]">
        {label}
      </p>

      <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
        {icon}
      </div>

    </div>

    <p
      className={`mt-3 text-[25px] font-bold ${valueClass}`}
    >
      {value}
    </p>

    <p className="mt-1 text-xs text-gray-500">
      {description}
    </p>

  </div>
);

/* =========================================================
   STATUS PILL
========================================================= */

const StatusPill: React.FC<{
  label: string;
  type: string | null;
}> = ({ label, type }) => {
  const value =
    type?.toUpperCase() || "";

  let classes =
    "bg-gray-100 text-gray-600";

  if (
    value === "PRESENT" ||
    value === "ON_TIME" ||
    value === "APPROVED" ||
    value === "ACTIVE"
  ) {
    classes =
      "bg-emerald-100 text-emerald-700";
  }

  if (
    value === "PENDING" ||
    value === "LATE" ||
    value === "ON_LEAVE"
  ) {
    classes =
      "bg-amber-100 text-amber-700";
  }

  if (
    value === "REJECTED" ||
    value === "ABSENT"
  ) {
    classes =
      "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${classes}`}
    >
      {label}
    </span>
  );
};

/* =========================================================
   MODAL
========================================================= */

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({
  title,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">

        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
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

/* =========================================================
   DETAIL BOX
========================================================= */

const DetailBox: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-gray-900">
      {value}
    </p>

  </div>
);

/* =========================================================
   TABLE STATES
========================================================= */

const LoadingRow: React.FC<{
  colSpan: number;
}> = ({ colSpan }) => (
  <tr>
    <td
      colSpan={colSpan}
      className="py-16 text-center"
    >
      <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-600" />

      <p className="mt-3 text-sm text-gray-500">
        Loading data from Supabase...
      </p>
    </td>
  </tr>
);

const EmptyRow: React.FC<{
  colSpan: number;
  text: string;
}> = ({ colSpan, text }) => (
  <tr>
    <td
      colSpan={colSpan}
      className="py-16 text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <CalendarCheck className="h-5 w-5 text-gray-400" />
      </div>

      <p className="mt-3 text-sm font-medium text-gray-600">
        {text}
      </p>
    </td>
  </tr>
);

export default AttendanceLeavePage;