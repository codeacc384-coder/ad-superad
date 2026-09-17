import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type OTRecord = {
  id: string;
  employee_id: string | null;
  employee_code: string | null;
  employee_name: string | null;
  department: string | null;
  month: string | null;
  ot_hours: number | null;
  ot_type: string | null;
  base_rate: number | null;
  multiplier: number | null;
  ot_rate: number | null;
  ot_amount: number | null;
  bonus: number | null;
  performance_rating: string | null;
  bonus_reason: string | null;
  approval: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type Employee = {
  id: string;
  employee_code: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  status: string | null;
};

type OTStructure = {
  id: string;
  structure_name: string | null;
  effective_from: string | null;
  effective_to: string | null;
  status: string | null;
  base_rate_mode: string | null;
  default_base_rate: number | null;
  minimum_attendance: number | null;
  attendance_adjustment: number | null;
  weekday_multiplier: number | null;
  weekend_multiplier: number | null;
  holiday_multiplier: number | null;
  performance_incentive_enabled: boolean | null;
  performance_incentive_type: string | null;
  outstanding_incentive: number | null;
  exceeds_incentive: number | null;
  meets_incentive: number | null;
  needs_improvement_incentive: number | null;
  approval_workflow: string | null;
  payroll_cycle: string | null;
};

type Props = {
  onShowToast?: (message: string, type?: string) => void;
};

const getCurrentMonth = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Date(year, monthNumber - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getMonthStart = (month: string) => `${month}-01`;

const getNextMonthStart = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  const nextDate = new Date(year, monthNumber, 1);

  return `${nextDate.getFullYear()}-${String(
    nextDate.getMonth() + 1
  ).padStart(2, "0")}-01`;
};

const getMonthOptions = () => {
  const options: string[] = [];
  const current = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      current.getFullYear(),
      current.getMonth() - i,
      1
    );

    options.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );
  }

  return options;
};

const money = (value: number | null | undefined) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const shortMoney = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }

  return money(value);
};

const employeeDisplayName = (employee: Employee) => {
  if (employee.full_name) return employee.full_name;

  return `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
};

const approvalLabel = (approval: string | null) => {
  if (!approval) return "Pending";

  return approval
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const approvalClass = (approval: string | null) => {
  const value = (approval || "").toLowerCase();

  if (
    value.includes("approved") ||
    value === "approve" ||
    value === "paid"
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (value.includes("reject")) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
};

const otTypeClass = (type: string | null) => {
  const value = (type || "").toLowerCase();

  if (value.includes("weekend")) {
    return "bg-purple-50 text-purple-700";
  }

  if (value.includes("holiday")) {
    return "bg-orange-50 text-orange-700";
  }

  return "bg-blue-50 text-blue-700";
};

export const OTPage: React.FC<Props> = ({ onShowToast }) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [records, setRecords] = useState<OTRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [structure, setStructure] = useState<OTStructure | null>(null);

  const [loading, setLoading] = useState(true);
  const [structureLoading, setStructureLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [selectedRecord, setSelectedRecord] = useState<OTRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    month: getCurrentMonth(),
    ot_hours: "",
    ot_type: "Weekday",
    base_rate: "",
    multiplier: "1.5",
    bonus: "",
    performance_rating: "",
    bonus_reason: "",
    approval: "PENDING",
  });

  const monthOptions = useMemo(() => getMonthOptions(), []);

  const loadOTRecords = async () => {
    setLoading(true);
    setError("");

    const startDate = getMonthStart(selectedMonth);
    const nextMonth = getNextMonthStart(selectedMonth);

    try {
      const { data, error: dbError } = await supabase
        .from("overtime_bonus_records")
        .select("*")
        .gte("month", startDate)
        .lt("month", nextMonth)
        .order("month", { ascending: false })
        .order("created_at", { ascending: false });

      if (dbError) {
        throw dbError;
      }

      setRecords((data || []) as OTRecord[]);
    } catch (err: any) {
      console.error("OT Loading Failed:", err);

      setError(err?.message || "Failed to load OT records");
      setRecords([]);

      onShowToast?.(
        `OT Loading Failed: ${err?.message || "Unable to load records"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from("employees")
        .select(
          "id, employee_code, full_name, first_name, last_name, department, status"
        )
        .order("full_name", { ascending: true });

      if (dbError) {
        console.error("Employee loading failed:", dbError);
        return;
      }

      setEmployees((data || []) as Employee[]);
    } catch (err) {
      console.error("Employee loading failed:", err);
    }
  };

  const loadOTStructure = async () => {
    setStructureLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from("ot_structures")
        .select("*")
        .eq("status", "ACTIVE")
        .order("effective_from", { ascending: false });

      if (dbError) {
        throw dbError;
      }

      const startDate = getMonthStart(selectedMonth);

      const matchingStructure = ((data || []) as OTStructure[]).find(
        (item) => {
          if (!item.effective_from) return false;

          const startsBefore =
            item.effective_from <= startDate;

          const endsAfter =
            !item.effective_to || item.effective_to >= startDate;

          return startsBefore && endsAfter;
        }
      );

      setStructure(matchingStructure || null);
    } catch (err) {
      console.error("OT structure loading failed:", err);
      setStructure(null);
    } finally {
      setStructureLoading(false);
    }
  };

  useEffect(() => {
    loadOTRecords();
    loadOTStructure();
  }, [selectedMonth]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredRecords = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !searchValue ||
        (record.employee_name || "").toLowerCase().includes(searchValue) ||
        (record.employee_code || "").toLowerCase().includes(searchValue) ||
        (record.department || "").toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "ALL" ||
        (record.ot_type || "").toLowerCase() ===
          typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [records, search, typeFilter]);

  const totalOTHours = useMemo(() => {
    return records.reduce(
      (sum, record) => sum + Number(record.ot_hours || 0),
      0
    );
  }, [records]);

  const totalOTAmount = useMemo(() => {
    return records.reduce(
      (sum, record) => sum + Number(record.ot_amount || 0),
      0
    );
  }, [records]);

  const totalBonus = useMemo(() => {
    return records.reduce(
      (sum, record) => sum + Number(record.bonus || 0),
      0
    );
  }, [records]);

  const totalPayout = totalOTAmount + totalBonus;

  const averageOTHours =
    records.length > 0 ? totalOTHours / records.length : 0;

  const averageCostPerHour =
    totalOTHours > 0 ? totalPayout / totalOTHours : 0;

  const monthlyPerformance = useMemo(() => {
    return monthOptions
      .slice()
      .reverse()
      .map((month) => {
        return {
          month,
          label: new Date(
            Number(month.split("-")[0]),
            Number(month.split("-")[1]) - 1,
            1
          ).toLocaleDateString("en-US", {
            month: "short",
          }),
        };
      });
  }, [monthOptions]);

  const [monthlyRecords, setMonthlyRecords] = useState<
    Record<string, OTRecord[]>
  >({});

  const loadSixMonthData = async () => {
    try {
      const sixMonths = monthOptions.slice(0, 6);

      const firstMonth = sixMonths[sixMonths.length - 1];
      const lastMonth = sixMonths[0];

      const { data, error: dbError } = await supabase
        .from("overtime_bonus_records")
        .select("*")
        .gte("month", getMonthStart(firstMonth))
        .lt("month", getNextMonthStart(lastMonth));

      if (dbError) {
        throw dbError;
      }

      const grouped: Record<string, OTRecord[]> = {};

      sixMonths.forEach((month) => {
        grouped[month] = [];
      });

      ((data || []) as OTRecord[]).forEach((record) => {
        if (!record.month) return;

        const monthKey = record.month.substring(0, 7);

        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }

        grouped[monthKey].push(record);
      });

      setMonthlyRecords(grouped);
    } catch (err) {
      console.error("Six month OT data failed:", err);
      setMonthlyRecords({});
    }
  };

  useEffect(() => {
    loadSixMonthData();
  }, [selectedMonth]);

  const chartData = useMemo(() => {
    return monthlyPerformance
      .slice(-6)
      .map((item) => {
        const monthRecords = monthlyRecords[item.month] || [];

        const hours = monthRecords.reduce(
          (sum, record) => sum + Number(record.ot_hours || 0),
          0
        );

        const payout = monthRecords.reduce(
          (sum, record) =>
            sum +
            Number(record.ot_amount || 0) +
            Number(record.bonus || 0),
          0
        );

        return {
          ...item,
          hours,
          payout,
        };
      });
  }, [monthlyPerformance, monthlyRecords]);

  const maxChartHours = Math.max(
    ...chartData.map((item) => item.hours),
    1
  );

  const updateForm = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const calculatedOTRate =
    Number(form.base_rate || 0) * Number(form.multiplier || 0);

  const calculatedOTAmount =
    calculatedOTRate * Number(form.ot_hours || 0);

  const resetForm = () => {
    setForm({
      employee_id: "",
      month: selectedMonth,
      ot_hours: "",
      ot_type: "Weekday",
      base_rate: structure?.default_base_rate
        ? String(structure.default_base_rate)
        : "",
      multiplier:
        structure?.weekday_multiplier
          ? String(structure.weekday_multiplier)
          : "1.5",
      bonus: "",
      performance_rating: "",
      bonus_reason: "",
      approval: "PENDING",
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(
      (item) => item.id === employeeId
    );

    setForm((previous) => ({
      ...previous,
      employee_id: employeeId,
      base_rate: previous.base_rate
        ? previous.base_rate
        : structure?.default_base_rate
        ? String(structure.default_base_rate)
        : "",
    }));
  };

  const handleOTTypeChange = (type: string) => {
    let multiplier = "1.5";

    if (type.toLowerCase() === "weekend") {
      multiplier = String(
        structure?.weekend_multiplier || 2
      );
    }

    if (type.toLowerCase() === "holiday") {
      multiplier = String(
        structure?.holiday_multiplier || 2.5
      );
    }

    if (type.toLowerCase() === "weekday") {
      multiplier = String(
        structure?.weekday_multiplier || 1.5
      );
    }

    setForm((previous) => ({
      ...previous,
      ot_type: type,
      multiplier,
    }));
  };

  const handleAddOT = async () => {
    if (!form.employee_id) {
      onShowToast?.("Please select an employee", "error");
      return;
    }

    if (!form.ot_hours || Number(form.ot_hours) <= 0) {
      onShowToast?.("Please enter valid OT hours", "error");
      return;
    }

    const employee = employees.find(
      (item) => item.id === form.employee_id
    );

    if (!employee) {
      onShowToast?.("Employee not found", "error");
      return;
    }

    const payload = {
      employee_id: employee.id,
      employee_code: employee.employee_code,
      employee_name: employeeDisplayName(employee),
      department: employee.department,
      month: getMonthStart(form.month),
      ot_hours: Number(form.ot_hours),
      ot_type: form.ot_type,
      base_rate: Number(form.base_rate || 0),
      multiplier: Number(form.multiplier || 0),
      ot_rate: calculatedOTRate,
      ot_amount: calculatedOTAmount,
      bonus: Number(form.bonus || 0),
      performance_rating:
        form.performance_rating || null,
      bonus_reason: form.bonus_reason || null,
      approval: form.approval || "PENDING",
    };

    try {
      const { error: dbError } = await supabase
        .from("overtime_bonus_records")
        .insert(payload);

      if (dbError) {
        throw dbError;
      }

      setShowAddModal(false);

      onShowToast?.("OT record added successfully", "success");

      await loadOTRecords();
      await loadSixMonthData();
    } catch (err: any) {
      console.error("Add OT failed:", err);

      onShowToast?.(
        `Failed to add OT: ${
          err?.message || "Unknown error"
        }`,
        "error"
      );
    }
  };

  const selectedEmployee = selectedRecord
    ? employees.find(
        (employee) =>
          employee.id === selectedRecord.employee_id
      )
    : null;

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm px-7 py-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Overtime & Bonus Management
                </h1>

                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ADMIN VIEW
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Configure OT rules and monitor employee overtime,
                approval status, OT payout, performance incentives,
                and payroll impact.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Current Period
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatMonth(selectedMonth)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                <Plus size={18} />
                Add OT
              </button>

              <button
                type="button"
                onClick={loadOTRecords}
                className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                <TrendingUp size={17} />
                OT Report
              </button>
            </div>
          </div>
        </section>

        {/* Month / Search */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search employee, code or department..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">
                  OT Month
                </span>

                <div className="relative">
                  <Calendar
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <select
                    value={selectedMonth}
                    onChange={(event) =>
                      setSelectedMonth(event.target.value)
                    }
                    className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-semibold outline-none focus:border-indigo-400"
                  >
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>
                        {formatMonth(month)}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  loadOTRecords();
                  loadOTStructure();
                  loadSixMonthData();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={17} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <div className="font-semibold">
              OT Loading Failed
            </div>
            <div className="mt-1">{error}</div>
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Total OT Hours
                </p>

                <p className="mt-4 text-3xl font-bold">
                  {loading ? "—" : totalOTHours.toFixed(1)}
                </p>

                <p className="mt-2 text-xs text-emerald-600">
                  Calculated from current OT records
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Clock3 size={22} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Total OT Payout
                </p>

                <p className="mt-4 text-3xl font-bold text-emerald-700">
                  {loading ? "—" : shortMoney(totalPayout)}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  OT compensation + performance incentives
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 text-xl">
                ₹
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Avg OT / Month
                </p>

                <p className="mt-4 text-3xl font-bold text-purple-700">
                  {loading ? "—" : averageOTHours.toFixed(1)}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Average overtime hours per record
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Calendar size={22} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Avg Cost / OT Hr
                </p>

                <p className="mt-4 text-3xl font-bold text-orange-700">
                  {loading ? "—" : money(averageCostPerHour)}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Recalculated from current OT records
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* Performance + Policy */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#111827] p-3 text-white">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    OT Performance & Cost
                  </h2>

                  <p className="text-sm text-slate-500">
                    Monthly overtime workload and payroll impact
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                LAST 6 MONTHS
              </span>
            </div>

            <div className="p-6">
              {chartData.every((item) => item.hours === 0) ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
                  <div className="rounded-2xl bg-slate-100 p-5 text-slate-400">
                    <TrendingUp size={30} />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-800">
                    No OT records available
                  </h3>

                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Monthly performance will appear after OT
                    records are added to the database.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {chartData.map((item) => {
                    const width =
                      item.hours === 0
                        ? 0
                        : Math.max(
                            (item.hours / maxChartHours) * 100,
                            3
                          );

                    return (
                      <div
                        key={item.month}
                        className="grid grid-cols-[60px_1fr_80px_100px] gap-4 items-center"
                      >
                        <div className="font-semibold text-sm">
                          {item.label}
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-slate-400">
                              Overtime utilization
                            </span>
                          </div>

                          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#111827] transition-all"
                              style={{
                                width: `${width}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-sm">
                            {item.hours.toFixed(1)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            hours
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-sm text-emerald-700">
                            {shortMoney(item.payout)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            payout
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Policy */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Settings2 size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    OT Policy Snapshot
                  </h2>

                  <p className="text-sm text-slate-500">
                    Configuration from Supabase
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {structureLoading ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  Loading OT policy...
                </div>
              ) : !structure ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="font-semibold text-amber-800">
                    No OT structure configured
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-amber-700">
                    The <strong>ot_structures</strong> table does
                    not contain an active policy applicable to{" "}
                    {formatMonth(selectedMonth)}.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                      Current Base Rate Structure
                    </p>

                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {money(structure.default_base_rate)}
                    </p>

                    <p className="mt-2 text-xs text-blue-700">
                      {structure.base_rate_mode ||
                        "Organization configured"}
                    </p>

                    {structure.minimum_attendance !==
                      null && (
                      <p className="mt-1 text-xs text-blue-700">
                        Minimum attendance:{" "}
                        {structure.minimum_attendance}%
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Weekday OT
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Multiplier
                      </p>
                    </div>

                    <strong>
                      {structure.weekday_multiplier || 0}x
                    </strong>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Weekend OT
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Multiplier
                      </p>
                    </div>

                    <strong>
                      {structure.weekend_multiplier || 0}x
                    </strong>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Holiday OT
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Multiplier
                      </p>
                    </div>

                    <strong>
                      {structure.holiday_multiplier || 0}x
                    </strong>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Performance Incentive
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {structure.performance_incentive_type ||
                          "Not specified"}
                      </p>
                    </div>

                    <strong>
                      {structure.performance_incentive_enabled
                        ? "Enabled"
                        : "Disabled"}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Approval
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Required before payroll
                      </p>
                    </div>

                    <strong>
                      {structure.approval_workflow ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Payroll
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Payroll cycle
                      </p>
                    </div>

                    <strong>
                      {structure.payroll_cycle ||
                        "Not specified"}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Employee OT Records */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-7 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Users size={20} />
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  Employee OT Records
                </h2>

                <p className="text-sm text-slate-500">
                  Actual records loaded from{" "}
                  <strong>overtime_bonus_records</strong>.
                </p>
              </div>
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none"
              >
                <option value="ALL">All OT Types</option>
                <option value="Weekday">Weekday</option>
                <option value="Weekend">Weekend</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading OT records from Supabase...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto w-fit rounded-2xl bg-slate-100 p-5 text-slate-400">
                <Clock3 size={30} />
              </div>

              <h3 className="mt-5 font-semibold text-slate-800">
                No OT records available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                There are no records in{" "}
                <strong>{formatMonth(selectedMonth)}</strong>{" "}
                according to the database.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      OT Type
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Hours
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      OT Rate
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      OT Payout
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Bonus
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Approval
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-900">
                          {record.employee_name ||
                            "Unknown Employee"}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          {record.employee_code || "—"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {record.department || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${otTypeClass(
                            record.ot_type
                          )}`}
                        >
                          {record.ot_type || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-semibold">
                        {Number(record.ot_hours || 0).toFixed(1)} hrs
                      </td>

                      <td className="px-6 py-5 text-right text-sm">
                        {money(record.ot_rate)}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-emerald-700">
                        {money(record.ot_amount)}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-purple-700">
                        {money(record.bonus)}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${approvalClass(
                            record.approval
                          )}`}
                        >
                          {(record.approval || "")
                            .toLowerCase()
                            .includes("approved") && (
                            <CheckCircle2 size={13} />
                          )}

                          {approvalLabel(record.approval)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedRecord(record)
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

          {!loading && filteredRecords.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-4 flex flex-wrap justify-between gap-3 text-sm text-slate-500">
              <span>
                Showing {filteredRecords.length} of{" "}
                {records.length} records
              </span>

              <span>
                {formatMonth(selectedMonth)} •{" "}
                {totalOTHours.toFixed(1)} total OT hours •{" "}
                {money(totalPayout)} total payout
              </span>
            </div>
          )}
        </section>
      </div>

      {/* View OT Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  OT Record Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedRecord.employee_name ||
                    "Unknown Employee"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              <Detail
                label="Employee Code"
                value={selectedRecord.employee_code}
              />

              <Detail
                label="Department"
                value={selectedRecord.department}
              />

              <Detail
                label="Month"
                value={
                  selectedRecord.month
                    ? formatMonth(
                        selectedRecord.month.substring(0, 7)
                      )
                    : "—"
                }
              />

              <Detail
                label="OT Type"
                value={selectedRecord.ot_type}
              />

              <Detail
                label="OT Hours"
                value={`${Number(
                  selectedRecord.ot_hours || 0
                ).toFixed(2)} hrs`}
              />

              <Detail
                label="Base Rate"
                value={money(selectedRecord.base_rate)}
              />

              <Detail
                label="Multiplier"
                value={`${Number(
                  selectedRecord.multiplier || 0
                ).toFixed(2)}x`}
              />

              <Detail
                label="OT Rate"
                value={money(selectedRecord.ot_rate)}
              />

              <Detail
                label="OT Amount"
                value={money(selectedRecord.ot_amount)}
              />

              <Detail
                label="Bonus"
                value={money(selectedRecord.bonus)}
              />

              <Detail
                label="Performance Rating"
                value={
                  selectedRecord.performance_rating
                }
              />

              <Detail
                label="Approval"
                value={approvalLabel(
                  selectedRecord.approval
                )}
              />

              <div className="sm:col-span-2">
                <Detail
                  label="Bonus Reason"
                  value={selectedRecord.bonus_reason}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add OT Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  Add OT Record
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This record will be inserted into Supabase.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
              <FormField label="Employee">
                <select
                  value={form.employee_id}
                  onChange={(event) =>
                    handleEmployeeChange(event.target.value)
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
                        {employeeDisplayName(employee)}
                        {employee.employee_code
                          ? ` (${employee.employee_code})`
                          : ""}
                      </option>
                    ))}
                </select>
              </FormField>

              <FormField label="Month">
                <input
                  type="month"
                  value={form.month}
                  onChange={(event) =>
                    updateForm("month", event.target.value)
                  }
                  className="form-input"
                />
              </FormField>

              <FormField label="OT Type">
                <select
                  value={form.ot_type}
                  onChange={(event) =>
                    handleOTTypeChange(event.target.value)
                  }
                  className="form-input"
                >
                  <option value="Weekday">Weekday</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </FormField>

              <FormField label="OT Hours">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.ot_hours}
                  onChange={(event) =>
                    updateForm("ot_hours", event.target.value)
                  }
                  placeholder="Example: 9"
                  className="form-input"
                />
              </FormField>

              <FormField label="Base Rate">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.base_rate}
                  onChange={(event) =>
                    updateForm("base_rate", event.target.value)
                  }
                  placeholder="₹ / hour"
                  className="form-input"
                />
              </FormField>

              <FormField label="Multiplier">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.multiplier}
                  onChange={(event) =>
                    updateForm("multiplier", event.target.value)
                  }
                  className="form-input"
                />
              </FormField>

              <FormField label="Bonus">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.bonus}
                  onChange={(event) =>
                    updateForm("bonus", event.target.value)
                  }
                  placeholder="₹"
                  className="form-input"
                />
              </FormField>

              <FormField label="Performance Rating">
                <input
                  type="text"
                  value={form.performance_rating}
                  onChange={(event) =>
                    updateForm(
                      "performance_rating",
                      event.target.value
                    )
                  }
                  placeholder="Example: Excellent"
                  className="form-input"
                />
              </FormField>

              <FormField label="Approval">
                <select
                  value={form.approval}
                  onChange={(event) =>
                    updateForm(
                      "approval",
                      event.target.value
                    )
                  }
                  className="form-input"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </FormField>

              <FormField label="Bonus Reason" full>
                <textarea
                  value={form.bonus_reason}
                  onChange={(event) =>
                    updateForm(
                      "bonus_reason",
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Optional reason"
                  className="form-input resize-none"
                />
              </FormField>

              <div className="md:col-span-2 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600">
                      Calculated OT Rate
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {money(calculatedOTRate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-indigo-600">
                      Calculated OT Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {money(calculatedOTAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-indigo-600">
                      Total With Bonus
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-700">
                      {money(
                        calculatedOTAmount +
                          Number(form.bonus || 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddOT}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Save OT Record
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

const FormField = ({
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

export default OTPage;