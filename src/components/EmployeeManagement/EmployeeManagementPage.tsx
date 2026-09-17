import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Eye,
  User,
  AlertCircle,
  RefreshCw,
  BriefcaseBusiness,
  ShieldCheck,
  Users,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import { Modal } from "../Modal";

/* =========================================================
   PROPS
========================================================= */

interface EmployeeManagementPageProps {
  onShowToast: (
    type: "success" | "error" | "info",
    title: string,
    msg?: string
  ) => void;
}

/* =========================================================
   TYPES
========================================================= */

type EmploymentType =
  | "FULL_TIME"
  | "CONTRACT"
  | "PROBATION"
  | "INTERN";

type EmployeeStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "PROBATION"
  | "NOTICE_PERIOD";

interface Employee {
  id: string;

  employee_code: string;

  first_name: string;

  last_name: string;

  full_name: string;

  gender: string | null;

  date_of_birth: string | null;

  phone: string | null;

  personal_email: string | null;

  address: string | null;

  work_email: string | null;

  temp_password: string | null;

  role: string | null;

  department: string | null;

  location: string | null;

  joining_date: string | null;

  employment_type: EmploymentType | string | null;

  reporting_manager: string | null;

  experience_years: number | null;

  status: EmployeeStatus | string | null;

  created_at: string | null;

  updated_at: string | null;

  designation: string | null;
}

interface FormData {
  employee_code: string;

  first_name: string;

  last_name: string;

  full_name: string;

  gender: string;

  date_of_birth: string;

  phone: string;

  personal_email: string;

  address: string;

  work_email: string;

  role: string;

  department: string;

  location: string;

  joining_date: string;

  employment_type: EmploymentType;

  reporting_manager: string;

  experience_years: string;

  status: EmployeeStatus;

  designation: string;
}

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM: FormData = {
  employee_code: "",

  first_name: "",

  last_name: "",

  full_name: "",

  gender: "",

  date_of_birth: "",

  phone: "",

  personal_email: "",

  address: "",

  work_email: "",

  role: "",

  department: "",

  location: "",

  joining_date: "",

  employment_type: "FULL_TIME",

  reporting_manager: "",

  experience_years: "0",

  status: "ACTIVE",

  designation: "",
};

/* =========================================================
   CONSTANTS
========================================================= */

const DEPARTMENTS = [
  "Human Resources",
  "Engineering",
  "Finance & Accounts",
  "Product",
  "Administration",
  "Sales",
  "Marketing",
  "Operations",
];

const LOCATIONS = [
  "Hyderabad",
  "Bangalore",
  "Delhi",
  "Mumbai",
];

const GENDERS = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
];

const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "CONTRACT",
  "PROBATION",
  "INTERN",
];

const EMPLOYMENT_TYPE_LABELS = [
  "Full Time",
  "Contract",
  "Probation",
  "Intern",
];

const STATUS_OPTIONS = [
  "ACTIVE",
  "ON_LEAVE",
  "PROBATION",
  "NOTICE_PERIOD",
];

const STATUS_LABELS = [
  "Active",
  "On Leave",
  "Probation",
  "Notice Period",
];

/* =========================================================
   HELPERS
========================================================= */

const initials = (name: string) => {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA"
  );
};

const pretty = (
  value: string | null | undefined
) => {
  if (!value) return "Not Available";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
};

const dateText = (
  value: string | null | undefined
) => {
  if (!value) return "Not Available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const safeText = (
  value: string | null | undefined
) => {
  return value && value.trim()
    ? value
    : "Not Available";
};

/* =========================================================
   COMPONENT
========================================================= */

export const EmployeeManagementPage: React.FC<
  EmployeeManagementPageProps
> = ({ onShowToast }) => {
  /* =======================================================
     STATE
  ======================================================= */

  const [employees, setEmployees] = useState<
    Employee[]
  >([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [viewMode, setViewMode] = useState<
    "TABLE" | "GRID"
  >("TABLE");

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [newEmp, setNewEmp] =
    useState<FormData>(EMPTY_FORM);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  /* =======================================================
     LOAD EMPLOYEES FROM SUPABASE
  ======================================================= */

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    console.log(
      "Loading employees from Supabase..."
    );

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("full_name", {
        ascending: true,
      });

    console.log(
      "EMPLOYEES FROM SUPABASE:",
      data
    );

    console.log(
      "EMPLOYEE LOAD ERROR:",
      error
    );

    if (error) {
      setLoadError(error.message);

      setEmployees([]);

      onShowToast(
        "error",
        "Supabase Connection Error",
        error.message
      );
    } else {
      setEmployees(
        (data || []) as Employee[]
      );
    }

    setIsLoading(false);
  }, [onShowToast]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  /* =======================================================
     FILTER EMPLOYEES
  ======================================================= */

  const filteredEmployees = useMemo(() => {
    const query =
      searchTerm.toLowerCase().trim();

    return employees.filter((employee) => {
      const searchMatch =
        !query ||
        (
          employee.full_name || ""
        )
          .toLowerCase()
          .includes(query) ||
        (
          employee.employee_code || ""
        )
          .toLowerCase()
          .includes(query) ||
        (
          employee.work_email || ""
        )
          .toLowerCase()
          .includes(query) ||
        (
          employee.personal_email || ""
        )
          .toLowerCase()
          .includes(query) ||
        (
          employee.designation || ""
        )
          .toLowerCase()
          .includes(query) ||
        (
          employee.department || ""
        )
          .toLowerCase()
          .includes(query);

      const departmentMatch =
        departmentFilter === "ALL" ||
        employee.department ===
          departmentFilter;

      const statusMatch =
        statusFilter === "ALL" ||
        employee.status === statusFilter;

      return (
        searchMatch &&
        departmentMatch &&
        statusMatch
      );
    });
  }, [
    employees,
    searchTerm,
    departmentFilter,
    statusFilter,
  ]);

  /* =======================================================
     UPDATE FORM FIELD
  ======================================================= */

  const updateField = <
    K extends keyof FormData
  >(
    key: K,
    value: FormData[K]
  ) => {
    setNewEmp((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* =======================================================
     AUTO BUILD FULL NAME
  ======================================================= */

  const handleFirstNameChange = (
    value: string
  ) => {
    const fullName =
      `${value} ${newEmp.last_name}`.trim();

    setNewEmp((previous) => ({
      ...previous,
      first_name: value,
      full_name: fullName,
    }));
  };

  const handleLastNameChange = (
    value: string
  ) => {
    const fullName =
      `${newEmp.first_name} ${value}`.trim();

    setNewEmp((previous) => ({
      ...previous,
      last_name: value,
      full_name: fullName,
    }));
  };

  /* =======================================================
     ADD EMPLOYEE
  ======================================================= */

  const handleAddEmployee = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    const requiredFields = [
      newEmp.employee_code,
      newEmp.first_name,
      newEmp.full_name,
      newEmp.phone,
      newEmp.work_email,
      newEmp.department,
      newEmp.location,
      newEmp.joining_date,
      newEmp.designation,
    ];

    if (
      requiredFields.some(
        (value) =>
          !String(value).trim()
      )
    ) {
      onShowToast(
        "error",
        "Validation Failed",
        "Please complete all required employee fields."
      );

      return;
    }

    /* -----------------------------------------------------
       EMAIL VALIDATION
    ----------------------------------------------------- */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        newEmp.work_email.trim()
      )
    ) {
      onShowToast(
        "error",
        "Invalid Email",
        "Please enter a valid work email address."
      );

      return;
    }

    /* -----------------------------------------------------
       EXPERIENCE VALIDATION
    ----------------------------------------------------- */

    const experienceYears = Number(
      newEmp.experience_years || 0
    );

    if (
      !Number.isFinite(experienceYears) ||
      experienceYears < 0
    ) {
      onShowToast(
        "error",
        "Invalid Experience",
        "Experience years must be a valid number."
      );

      return;
    }

    setIsSaving(true);

    /* -----------------------------------------------------
       PAYLOAD MATCHING ACTUAL DATABASE
    ----------------------------------------------------- */

    const employeePayload = {
      employee_code:
        newEmp.employee_code.trim(),

      first_name:
        newEmp.first_name.trim(),

      last_name:
        newEmp.last_name.trim(),

      full_name:
        newEmp.full_name.trim(),

      gender:
        newEmp.gender.trim() || null,

      date_of_birth:
        newEmp.date_of_birth || null,

      phone:
        newEmp.phone.trim(),

      personal_email:
        newEmp.personal_email.trim() || null,

      address:
        newEmp.address.trim() || null,

      work_email:
        newEmp.work_email.trim(),

      role:
        newEmp.role.trim() ||
        newEmp.designation.trim(),

      department:
        newEmp.department,

      location:
        newEmp.location,

      joining_date:
        newEmp.joining_date,

      employment_type:
        newEmp.employment_type,

      reporting_manager:
        newEmp.reporting_manager.trim() ||
        null,

      experience_years:
        experienceYears,

      status:
        newEmp.status,

      designation:
        newEmp.designation.trim(),
    };

    console.log(
      "EMPLOYEE INSERT PAYLOAD:",
      employeePayload
    );

    /* -----------------------------------------------------
       INSERT
    ----------------------------------------------------- */

    const {
      data,
      error,
    } = await supabase
      .from("employees")
      .insert(employeePayload)
      .select("*")
      .single();

    console.log(
      "EMPLOYEE INSERT RESULT:",
      data
    );

    console.log(
      "EMPLOYEE INSERT ERROR:",
      error
    );

    /* -----------------------------------------------------
       HANDLE ERROR
    ----------------------------------------------------- */

    if (error) {
      console.error(
        "Employee insert failed:",
        error
      );

      onShowToast(
        "error",
        "Employee Not Saved",
        error.message
      );

      setIsSaving(false);

      return;
    }

    /* -----------------------------------------------------
       UPDATE LOCAL DATA
    ----------------------------------------------------- */

    if (data) {
      setEmployees((previous) =>
        [...previous, data as Employee].sort(
          (first, second) =>
            (
              first.full_name || ""
            ).localeCompare(
              second.full_name || ""
            )
        )
      );
    }

    /* -----------------------------------------------------
       RESET
    ----------------------------------------------------- */

    setNewEmp(EMPTY_FORM);

    setIsAddModalOpen(false);

    setIsSaving(false);

    onShowToast(
      "success",
      "Employee Added",
      `${data?.full_name || "Employee"} was successfully saved to Supabase.`
    );
  };

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const statusBadge = (
    status: string | null
  ) => {
    switch (status) {
      case "ACTIVE":
        return {
          label: "Active",
          bg: "bg-emerald-100",
          text: "text-emerald-900",
        };

      case "ON_LEAVE":
        return {
          label: "On Leave",
          bg: "bg-purple-100",
          text: "text-purple-900",
        };

      case "PROBATION":
        return {
          label: "Probation",
          bg: "bg-amber-100",
          text: "text-amber-900",
        };

      case "NOTICE_PERIOD":
        return {
          label: "Notice Period",
          bg: "bg-rose-100",
          text: "text-rose-900",
        };

      default:
        return {
          label: "Unknown",
          bg: "bg-slate-100",
          text: "text-slate-800",
        };
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">

            <h1 className="text-[20px] font-bold text-[#1b1b1d] tracking-tight">
              Employee Directory & Master Profiles
            </h1>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
              {isLoading
                ? "Loading..."
                : `${employees.length} Enrolled`}
            </span>

          </div>

          <p className="text-[13px] text-[#505f76] mt-0.5">
            Complete employee lifecycle records,
            organization details, employment status,
            and contact information.
          </p>
        </div>

        <div className="flex items-center gap-2.5">

          <button
            onClick={loadEmployees}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13px] font-semibold hover:bg-[#f6f3f5] disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isLoading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>

          <button
            onClick={() =>
              setIsAddModalOpen(true)
            }
            className="flex items-center gap-2 px-4 py-2 bg-[#131b2e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#131b2e]/90"
          >
            <Plus className="w-4 h-4" />

            Add Employee
          </button>

        </div>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

        <div className="relative flex-1 max-w-md w-full">

          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" />

          <input
            type="text"
            placeholder="Search by name, employee code, designation, email..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
          />

        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* DEPARTMENT */}

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(
                event.target.value
              )
            }
            className="px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[13px] bg-white"
          >
            <option value="ALL">
              All Departments
            </option>

            {DEPARTMENTS.map(
              (department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              )
            )}
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[13px] bg-white"
          >
            <option value="ALL">
              All Statuses
            </option>

            {STATUS_OPTIONS.map(
              (status, index) => (
                <option
                  key={status}
                  value={status}
                >
                  {STATUS_LABELS[index]}
                </option>
              )
            )}
          </select>

          {/* VIEW MODE */}

          <div className="flex items-center border border-[#c6c6cd] rounded-lg overflow-hidden">

            <button
              onClick={() =>
                setViewMode("TABLE")
              }
              className={`px-3 py-1 text-[12px] font-semibold ${
                viewMode === "TABLE"
                  ? "bg-[#131b2e] text-white"
                  : "bg-white text-[#505f76]"
              }`}
            >
              Table
            </button>

            <button
              onClick={() =>
                setViewMode("GRID")
              }
              className={`px-3 py-1 text-[12px] font-semibold ${
                viewMode === "GRID"
                  ? "bg-[#131b2e] text-white"
                  : "bg-white text-[#505f76]"
              }`}
            >
              Grid
            </button>

          </div>

        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-[13px] text-rose-800 flex gap-2">

          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

          <span>
            <b>Supabase error:</b>{" "}
            {loadError}
          </span>

        </div>
      )}

      {/* =================================================
          TABLE VIEW
      ================================================= */}

      {viewMode === "TABLE" ? (

        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left text-[13px]">

              <thead className="bg-[#f6f3f5] text-[#505f76] uppercase text-[11px] font-bold tracking-wider border-b border-[#c6c6cd]/40">

                <tr>

                  <th className="px-6 py-3.5">
                    Employee
                  </th>

                  <th className="px-6 py-3.5">
                    Role & Department
                  </th>

                  <th className="px-6 py-3.5">
                    Location
                  </th>

                  <th className="px-6 py-3.5">
                    Joining Date
                  </th>

                  <th className="px-6 py-3.5">
                    Status
                  </th>

                  <th className="px-6 py-3.5 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#c6c6cd]/30">

                {isLoading ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-12 text-center text-[#76777d]"
                    >
                      Loading employees from
                      Supabase...
                    </td>

                  </tr>

                ) : filteredEmployees.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-12 text-center text-[#76777d]"
                    >
                      No employee data found
                      in Supabase.
                    </td>

                  </tr>

                ) : (

                  filteredEmployees.map(
                    (employee) => {

                      const badge =
                        statusBadge(
                          employee.status
                        );

                      return (
                        <tr
                          key={employee.id}
                          className="hover:bg-[#fcf8fa] transition-colors"
                        >

                          {/* EMPLOYEE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs">
                                {initials(
                                  employee.full_name
                                )}
                              </div>

                              <div>

                                <p className="font-bold text-[#1b1b1d]">
                                  {safeText(
                                    employee.full_name
                                  )}
                                </p>

                                <p className="text-[12px] text-[#505f76] font-mono">
                                  {
                                    employee.employee_code
                                  }
                                </p>

                                <p className="text-[11px] text-[#76777d]">
                                  {
                                    employee.work_email ||
                                    employee.personal_email ||
                                    "No email"
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ROLE */}

                          <td className="px-6 py-4">

                            <p className="font-semibold">
                              {safeText(
                                employee.designation
                              )}
                            </p>

                            <p className="text-[12px] text-[#505f76]">
                              {safeText(
                                employee.department
                              )}
                            </p>

                            <p className="text-[11px] text-[#76777d] mt-0.5">
                              {safeText(
                                employee.role
                              )}
                            </p>

                          </td>

                          {/* LOCATION */}

                          <td className="px-6 py-4 text-[#505f76]">

                            <span className="inline-flex items-center gap-1.5">

                              <MapPin className="w-3.5 h-3.5" />

                              {safeText(
                                employee.location
                              )}

                            </span>

                          </td>

                          {/* JOINING DATE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <Calendar className="w-3.5 h-3.5 text-[#76777d]" />

                              <span className="font-medium">
                                {dateText(
                                  employee.joining_date
                                )}
                              </span>

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">

                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.bg} ${badge.text}`}
                            >
                              {badge.label}
                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="px-6 py-4 text-right">

                            <button
                              onClick={() =>
                                setSelectedEmployee(
                                  employee
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f6f3f5] hover:bg-[#131b2e] hover:text-white text-[#131b2e] font-semibold text-[12px]"
                            >

                              <Eye className="w-3.5 h-3.5" />

                              View Profile

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

        </div>

      ) : (

        /* =================================================
           GRID VIEW
        ================================================= */

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {isLoading ? (

            <div className="col-span-full bg-white border border-[#c6c6cd]/60 rounded-2xl p-12 text-center text-[#76777d]">
              Loading employees from
              Supabase...
            </div>

          ) : filteredEmployees.length ===
            0 ? (

            <div className="col-span-full bg-white border border-[#c6c6cd]/60 rounded-2xl p-12 text-center text-[#76777d]">
              No employee data found.
            </div>

          ) : (

            filteredEmployees.map(
              (employee) => {

                const badge =
                  statusBadge(
                    employee.status
                  );

                return (
                  <div
                    key={employee.id}
                    className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm hover:border-[#131b2e] transition-all space-y-4"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#131b2e] text-white flex items-center justify-center font-bold">

                          {initials(
                            employee.full_name
                          )}

                        </div>

                        <div>

                          <h3 className="font-bold text-[#1b1b1d] text-[15px]">
                            {safeText(
                              employee.full_name
                            )}
                          </h3>

                          <p className="text-[12px] text-[#505f76] font-mono">
                            {
                              employee.employee_code
                            }
                          </p>

                        </div>

                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="space-y-2 text-[12.5px] border-t border-b border-[#c6c6cd]/30 py-3">

                      <p className="font-semibold">
                        {safeText(
                          employee.designation
                        )}
                      </p>

                      <p className="text-[#505f76]">
                        {safeText(
                          employee.department
                        )}
                      </p>

                      <p className="text-[#76777d] flex items-center gap-1.5">

                        <MapPin className="w-3.5 h-3.5" />

                        {safeText(
                          employee.location
                        )}

                      </p>

                      <p className="text-[#76777d] flex items-center gap-1.5">

                        <Calendar className="w-3.5 h-3.5" />

                        {dateText(
                          employee.joining_date
                        )}

                      </p>

                    </div>

                    {/* FOOTER */}

                    <div className="flex items-center justify-between">

                      <div>

                        <span className="text-[11px] text-[#76777d] uppercase font-semibold">
                          Employment Type
                        </span>

                        <p className="font-semibold">
                          {pretty(
                            employee.employment_type
                          )}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          setSelectedEmployee(
                            employee
                          )
                        }
                        className="px-3.5 py-1.5 bg-[#131b2e] text-white rounded-lg text-[12px] font-semibold"
                      >
                        Details
                      </button>

                    </div>

                  </div>
                );
              }
            )

          )}

        </div>
      )}

      {/* =================================================
          ADD EMPLOYEE MODAL
      ================================================= */}

      {isAddModalOpen && (

        <Modal
          isOpen={isAddModalOpen}
          onClose={() =>
            !isSaving &&
            setIsAddModalOpen(false)
          }
          title="Add New Employee"
          size="lg"
        >

          <form
            onSubmit={handleAddEmployee}
            className="space-y-5"
          >

            {/* =========================================
                PERSONAL INFORMATION
            ========================================= */}

            <Section
              title="Personal Information"
              icon={
                <User className="w-4 h-4" />
              }
            >

              <div className="grid md:grid-cols-2 gap-4">

                <Field
                  label="Employee Code *"
                  value={
                    newEmp.employee_code
                  }
                  onChange={(value) =>
                    updateField(
                      "employee_code",
                      value
                    )
                  }
                  placeholder="TMI0115"
                  required
                />

                <Field
                  label="First Name *"
                  value={
                    newEmp.first_name
                  }
                  onChange={
                    handleFirstNameChange
                  }
                  placeholder="First name"
                  required
                />

                <Field
                  label="Last Name"
                  value={
                    newEmp.last_name
                  }
                  onChange={
                    handleLastNameChange
                  }
                  placeholder="Last name"
                />

                <Field
                  label="Full Name *"
                  value={
                    newEmp.full_name
                  }
                  onChange={(value) =>
                    updateField(
                      "full_name",
                      value
                    )
                  }
                  placeholder="Full legal name"
                  required
                />

                <Select
                  label="Gender"
                  value={newEmp.gender}
                  onChange={(value) =>
                    updateField(
                      "gender",
                      value
                    )
                  }
                  options={GENDERS}
                  placeholder="Select Gender"
                />

                <Field
                  label="Date of Birth"
                  type="date"
                  value={
                    newEmp.date_of_birth
                  }
                  onChange={(value) =>
                    updateField(
                      "date_of_birth",
                      value
                    )
                  }
                />

                <Field
                  label="Phone *"
                  value={newEmp.phone}
                  onChange={(value) =>
                    updateField(
                      "phone",
                      value
                    )
                  }
                  placeholder="+91 98765 43210"
                  required
                />

                <Field
                  label="Personal Email"
                  type="email"
                  value={
                    newEmp.personal_email
                  }
                  onChange={(value) =>
                    updateField(
                      "personal_email",
                      value
                    )
                  }
                  placeholder="personal@email.com"
                />

                <div className="md:col-span-2">

                  <Field
                    label="Address"
                    value={
                      newEmp.address
                    }
                    onChange={(value) =>
                      updateField(
                        "address",
                        value
                      )
                    }
                    placeholder="Residential address"
                  />

                </div>

              </div>

            </Section>

            {/* =========================================
                CONTACT
            ========================================= */}

            <Section
              title="Work Contact"
              icon={
                <Mail className="w-4 h-4" />
              }
            >

              <div className="grid md:grid-cols-2 gap-4">

                <Field
                  label="Work Email *"
                  type="email"
                  value={
                    newEmp.work_email
                  }
                  onChange={(value) =>
                    updateField(
                      "work_email",
                      value
                    )
                  }
                  placeholder="employee@company.com"
                  required
                />

                <Field
                  label="Role"
                  value={newEmp.role}
                  onChange={(value) =>
                    updateField(
                      "role",
                      value
                    )
                  }
                  placeholder="Employee / Manager / HR"
                />

              </div>

            </Section>

            {/* =========================================
                JOB & ORGANIZATION
            ========================================= */}

            <Section
              title="Job & Organization"
              icon={
                <Building className="w-4 h-4" />
              }
            >

              <div className="grid md:grid-cols-2 gap-4">

                <Field
                  label="Designation *"
                  value={
                    newEmp.designation
                  }
                  onChange={(value) =>
                    updateField(
                      "designation",
                      value
                    )
                  }
                  placeholder="Software Engineer"
                  required
                />

                <Select
                  label="Department *"
                  value={
                    newEmp.department
                  }
                  onChange={(value) =>
                    updateField(
                      "department",
                      value
                    )
                  }
                  options={DEPARTMENTS}
                  placeholder="Select Department"
                />

                <Select
                  label="Location *"
                  value={
                    newEmp.location
                  }
                  onChange={(value) =>
                    updateField(
                      "location",
                      value
                    )
                  }
                  options={LOCATIONS}
                  placeholder="Select Location"
                />

                <Field
                  label="Joining Date *"
                  type="date"
                  value={
                    newEmp.joining_date
                  }
                  onChange={(value) =>
                    updateField(
                      "joining_date",
                      value
                    )
                  }
                  required
                />

                <Select
                  label="Employment Type *"
                  value={
                    newEmp.employment_type
                  }
                  onChange={(value) =>
                    updateField(
                      "employment_type",
                      value as EmploymentType
                    )
                  }
                  options={
                    EMPLOYMENT_TYPES
                  }
                  labels={
                    EMPLOYMENT_TYPE_LABELS
                  }
                />

                <Field
                  label="Reporting Manager"
                  value={
                    newEmp.reporting_manager
                  }
                  onChange={(value) =>
                    updateField(
                      "reporting_manager",
                      value
                    )
                  }
                  placeholder="Manager name"
                />

                <Select
                  label="Employment Status *"
                  value={newEmp.status}
                  onChange={(value) =>
                    updateField(
                      "status",
                      value as EmployeeStatus
                    )
                  }
                  options={
                    STATUS_OPTIONS
                  }
                  labels={
                    STATUS_LABELS
                  }
                />

                <Field
                  label="Experience Years"
                  type="number"
                  value={
                    newEmp.experience_years
                  }
                  onChange={(value) =>
                    updateField(
                      "experience_years",
                      value
                    )
                  }
                  placeholder="0"
                />

              </div>

            </Section>

            {/* =========================================
                NOTE
            ========================================= */}

            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">

              <div className="flex gap-3">

                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />

                <div>

                  <p className="text-[13px] font-semibold text-indigo-900">
                    Supabase Employee Master
                  </p>

                  <p className="mt-1 text-[12px] text-indigo-800">
                    This form saves the employee
                    information directly to the
                    <b> employees </b>
                    table. Salary, bank, statutory,
                    onboarding and document information
                    will be connected through their
                    respective Supabase tables.
                  </p>

                </div>

              </div>

            </div>

            {/* =========================================
                BUTTONS
            ========================================= */}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#c6c6cd]/40">

              <button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  setIsAddModalOpen(false)
                }
                className="px-4 py-2 rounded-xl border border-[#c6c6cd] text-[13px] font-semibold hover:bg-[#f6f3f5] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-[#131b2e] text-white text-[13px] font-semibold flex items-center gap-2 disabled:opacity-60"
              >

                {isSaving && (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                )}

                {isSaving
                  ? "Saving..."
                  : "Add Employee"}

              </button>

            </div>

          </form>

        </Modal>
      )}

      {/* =================================================
          EMPLOYEE PROFILE MODAL
      ================================================= */}

      {selectedEmployee && (

        <Modal
          isOpen={!!selectedEmployee}
          onClose={() =>
            setSelectedEmployee(null)
          }
          title={`Employee Master: ${selectedEmployee.full_name} (${selectedEmployee.employee_code})`}
          size="lg"
        >

          <div className="space-y-5">

            {/* HEADER */}

            <div className="p-4 rounded-xl bg-[#131b2e] text-white flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold">

                  {initials(
                    selectedEmployee.full_name
                  )}

                </div>

                <div>

                  <h3 className="text-[17px] font-bold">
                    {
                      selectedEmployee.full_name
                    }
                  </h3>

                  <p className="text-[13px] text-white/80">
                    {
                      selectedEmployee.designation ||
                      "Not Specified"
                    }

                    {" • "}

                    {
                      selectedEmployee.department ||
                      "Not Specified"
                    }
                  </p>

                  <p className="text-[11px] text-white/60 mt-1 font-mono">
                    {
                      selectedEmployee.employee_code
                    }
                  </p>

                </div>

              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-[11px] uppercase">

                {pretty(
                  selectedEmployee.status
                )}

              </span>

            </div>

            {/* INFORMATION GRID */}

            <div className="grid md:grid-cols-2 gap-4">

              {/* PERSONAL */}

              <Info
                title="Personal Information"
                icon={
                  <User className="w-4 h-4" />
                }
                rows={[
                  [
                    "Employee Code",
                    selectedEmployee.employee_code,
                  ],
                  [
                    "Full Name",
                    selectedEmployee.full_name,
                  ],
                  [
                    "First Name",
                    selectedEmployee.first_name,
                  ],
                  [
                    "Last Name",
                    selectedEmployee.last_name,
                  ],
                  [
                    "Gender",
                    safeText(
                      selectedEmployee.gender
                    ),
                  ],
                  [
                    "Date of Birth",
                    dateText(
                      selectedEmployee.date_of_birth
                    ),
                  ],
                ]}
              />

              {/* CONTACT */}

              <Info
                title="Contact Information"
                icon={
                  <Phone className="w-4 h-4" />
                }
                rows={[
                  [
                    "Phone",
                    safeText(
                      selectedEmployee.phone
                    ),
                  ],
                  [
                    "Work Email",
                    safeText(
                      selectedEmployee.work_email
                    ),
                  ],
                  [
                    "Personal Email",
                    safeText(
                      selectedEmployee.personal_email
                    ),
                  ],
                  [
                    "Address",
                    safeText(
                      selectedEmployee.address
                    ),
                  ],
                ]}
              />

              {/* JOB */}

              <Info
                title="Job & Organization"
                icon={
                  <Building className="w-4 h-4" />
                }
                rows={[
                  [
                    "Designation",
                    safeText(
                      selectedEmployee.designation
                    ),
                  ],
                  [
                    "Department",
                    safeText(
                      selectedEmployee.department
                    ),
                  ],
                  [
                    "Role",
                    safeText(
                      selectedEmployee.role
                    ),
                  ],
                  [
                    "Location",
                    safeText(
                      selectedEmployee.location
                    ),
                  ],
                  [
                    "Reporting Manager",
                    safeText(
                      selectedEmployee.reporting_manager
                    ),
                  ],
                ]}
              />

              {/* EMPLOYMENT */}

              <Info
                title="Employment"
                icon={
                  <BriefcaseBusiness className="w-4 h-4" />
                }
                rows={[
                  [
                    "Joining Date",
                    dateText(
                      selectedEmployee.joining_date
                    ),
                  ],
                  [
                    "Employment Type",
                    pretty(
                      selectedEmployee.employment_type
                    ),
                  ],
                  [
                    "Status",
                    pretty(
                      selectedEmployee.status
                    ),
                  ],
                  [
                    "Experience",
                    `${
                      selectedEmployee.experience_years ??
                      0
                    } years`,
                  ],
                ]}
              />

              {/* SYSTEM */}

              <Info
                title="System Information"
                icon={
                  <Calendar className="w-4 h-4" />
                }
                rows={[
                  [
                    "Created",
                    dateText(
                      selectedEmployee.created_at
                    ),
                  ],
                  [
                    "Last Updated",
                    dateText(
                      selectedEmployee.updated_at
                    ),
                  ],
                ]}
              />

              {/* USER ACCESS */}

              <Info
                title="User Access"
                icon={
                  <Users className="w-4 h-4" />
                }
                rows={[
                  [
                    "Role",
                    safeText(
                      selectedEmployee.role
                    ),
                  ],
                  [
                    "Work Email",
                    safeText(
                      selectedEmployee.work_email
                    ),
                  ],
                ]}
              />

            </div>

            {/* CLOSE */}

            <div className="flex justify-end pt-3 border-t border-[#c6c6cd]/40">

              <button
                onClick={() =>
                  setSelectedEmployee(null)
                }
                className="px-4 py-2 rounded-xl border border-[#c6c6cd] text-[13px] font-semibold hover:bg-[#f6f3f5]"
              >
                Close
              </button>

            </div>

          </div>

        </Modal>
      )}

    </div>
  );
};

/* =========================================================
   SECTION COMPONENT
========================================================= */

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <section className="border-t border-[#c6c6cd]/40 pt-4">

      <h3 className="font-bold text-[13px] mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>

      {children}

    </section>
  );
};

/* =========================================================
   FIELD COMPONENT
========================================================= */

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) => {
  return (
    <div>

      <label className="block text-[12.5px] font-semibold text-[#1b1b1d] mb-1">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] focus:outline-none focus:border-[#131b2e]"
      />

    </div>
  );
};

/* =========================================================
   SELECT COMPONENT
========================================================= */

const Select = ({
  label,
  value,
  onChange,
  options,
  labels,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: string[];
  placeholder?: string;
}) => {
  return (
    <div>

      <label className="block text-[12.5px] font-semibold text-[#1b1b1d] mb-1">
        {label}
      </label>

      <select
        required
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-white focus:outline-none focus:border-[#131b2e]"
      >

        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map(
          (option, index) => (
            <option
              key={option}
              value={option}
            >
              {labels?.[index] ||
                option}
            </option>
          )
        )}

      </select>

    </div>
  );
};

/* =========================================================
   INFO COMPONENT
========================================================= */

const Info = ({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  rows: [string, string][];
}) => {
  return (
    <div className="p-4 rounded-xl border border-[#c6c6cd]/60 bg-[#fcf8fa] space-y-2 text-[12.5px]">

      <h4 className="font-bold text-[#1b1b1d] text-[13px] flex items-center gap-1.5 border-b border-[#c6c6cd]/40 pb-1.5">
        {icon}
        {title}
      </h4>

      <div className="space-y-1 pt-1">

        {rows.map(
          ([key, value]) => (
            <p key={key}>

              <span className="text-[#505f76]">
                {key}:
              </span>{" "}

              <strong className="break-words">
                {value}
              </strong>

            </p>
          )
        )}

      </div>

    </div>
  );
};

export default EmployeeManagementPage;