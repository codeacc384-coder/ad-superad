import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Calculator,
  CheckCircle2,
  Edit3,
  Eye,
  IndianRupee,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

interface SalaryStructureProps {
  onShowToast?: (
    type: "success" | "error" | "info",
    title: string,
    message?: string
  ) => void;
}

interface SalaryStructureTemplate {
  id: string;
  structure_code: string | null;
  name: string | null;
  grade: string | null;
  department: string | null;
  location: string | null;

  min_ctc: number | null;
  midpoint_ctc: number | null;
  max_ctc: number | null;

  min_experience_years: number | null;
  max_experience_years: number | null;

  pf: number | null;
  esi: number | null;
  benefits: number | null;
  claims: number | null;

  created_at: string | null;
  updated_at: string | null;

  band: string | null;
  status: string | null;

  components: Record<string, unknown> | null;
}

interface StructureForm {
  structure_code: string;
  name: string;
  grade: string;
  department: string;
  location: string;
  min_ctc: string;
  midpoint_ctc: string;
  max_ctc: string;
  min_experience_years: string;
  max_experience_years: string;
  pf: string;
  esi: string;
  benefits: string;
  claims: string;
  band: string;
  status: string;
}

const emptyForm: StructureForm = {
  structure_code: "",
  name: "",
  grade: "",
  department: "",
  location: "",
  min_ctc: "",
  midpoint_ctc: "",
  max_ctc: "",
  min_experience_years: "",
  max_experience_years: "",
  pf: "",
  esi: "",
  benefits: "",
  claims: "",
  band: "",
  status: "ACTIVE",
};

const currency = (
  value: number | null | undefined
) => {
  const amount = Number(value || 0);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const currencyFull = (
  value: number | null | undefined
) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const percentage = (
  value: number | null | undefined
) => {
  const number = Number(value || 0);

  /*
   * Supports both:
   * 2     -> 2%
   * 0.02  -> 2%
   */
  const display =
    number > 0 && number < 1
      ? number * 100
      : number;

  return `${display.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}%`;
};

const formatDate = (
  value: string | null
) => {
  if (!value) return "—";

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

const normalizeStatus = (
  value: string | null
) =>
  String(value || "ACTIVE")
    .trim()
    .toUpperCase()
    .replaceAll("_", " ");

const getBandPercentage = (
  item: SalaryStructureTemplate
) => {
  const min = Number(item.min_ctc || 0);
  const mid = Number(item.midpoint_ctc || 0);
  const max = Number(item.max_ctc || 0);

  if (max <= min) return 50;

  const percentageValue =
    ((mid - min) / (max - min)) * 100;

  return Math.min(
    100,
    Math.max(0, percentageValue)
  );
};

const getInitials = (name: string) => {
  if (!name) return "S";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const StatusBadge: React.FC<{
  status: string | null;
}> = ({ status }) => {
  const normalized = normalizeStatus(status);

  if (normalized === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Active
      </span>
    );
  }

  if (normalized === "DRAFT") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-600">
      {normalized}
    </span>
  );
};

const KpiCard: React.FC<{
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  dark?: boolean;
  purple?: boolean;
  green?: boolean;
}> = ({
  label,
  value,
  description,
  icon,
  dark,
  purple,
  green,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        dark
          ? "border-[#131b2e] bg-[#131b2e] text-white"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-wide ${
              dark
                ? "text-gray-300"
                : "text-[#50627a]"
            }`}
          >
            {label}
          </p>

          <p
            className={`mt-3 text-[27px] font-bold tracking-tight ${
              dark
                ? "text-white"
                : purple
                ? "text-purple-700"
                : green
                ? "text-emerald-700"
                : "text-gray-900"
            }`}
          >
            {value}
          </p>

          <p
            className={`mt-1 text-[11px] ${
              dark
                ? "text-gray-300"
                : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${
            dark
              ? "bg-[#29334a] text-emerald-400"
              : purple
              ? "bg-purple-50 text-purple-600"
              : green
              ? "bg-emerald-50 text-emerald-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-gray-900">
      {value || "—"}
    </p>
  </div>
);

export const SalaryStructure: React.FC<
  SalaryStructureProps
> = ({
  onShowToast,
}) => {
  const [structures, setStructures] =
    useState<SalaryStructureTemplate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("ALL");

  const [locationFilter, setLocationFilter] =
    useState("ALL");

  const [selected, setSelected] =
    useState<SalaryStructureTemplate | null>(
      null
    );

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<StructureForm>(emptyForm);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const loadStructures = async () => {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("salary_structure_templates")
      .select("*")
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "SALARY STRUCTURE ERROR:",
        error
      );

      setStructures([]);

      onShowToast?.(
        "error",
        "Salary Structure Error",
        error.message
      );
    } else {
      setStructures(
        (data || []) as SalaryStructureTemplate[]
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStructures();
  }, []);

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        structures
          .map((item) => item.department)
          .filter(Boolean) as string[]
      )
    ).sort();
  }, [structures]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        structures
          .map((item) => item.location)
          .filter(Boolean) as string[]
      )
    ).sort();
  }, [structures]);

  const filteredStructures = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return structures.filter((item) => {
      const searchable = [
        item.structure_code,
        item.name,
        item.grade,
        item.department,
        item.location,
        item.band,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchable.includes(query);

      const matchesDepartment =
        departmentFilter === "ALL" ||
        item.department === departmentFilter;

      const matchesLocation =
        locationFilter === "ALL" ||
        item.location === locationFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesLocation
      );
    });
  }, [
    structures,
    search,
    departmentFilter,
    locationFilter,
  ]);

  const averageMidpoint =
    structures.length > 0
      ? structures.reduce(
          (sum, item) =>
            sum +
            Number(item.midpoint_ctc || 0),
          0
        ) / structures.length
      : 0;

  const averagePF =
    structures.length > 0
      ? structures.reduce(
          (sum, item) =>
            sum + Number(item.pf || 0),
          0
        ) / structures.length
      : 0;

  const averageESI =
    structures.length > 0
      ? structures.reduce(
          (sum, item) =>
            sum + Number(item.esi || 0),
          0
        ) / structures.length
      : 0;

  const openNewStructure = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (
    item: SalaryStructureTemplate
  ) => {
    setEditingId(item.id);

    setForm({
      structure_code:
        item.structure_code || "",
      name: item.name || "",
      grade: item.grade || "",
      department:
        item.department || "",
      location:
        item.location || "",
      min_ctc:
        item.min_ctc?.toString() || "",
      midpoint_ctc:
        item.midpoint_ctc?.toString() || "",
      max_ctc:
        item.max_ctc?.toString() || "",
      min_experience_years:
        item.min_experience_years?.toString() ||
        "",
      max_experience_years:
        item.max_experience_years?.toString() ||
        "",
      pf:
        item.pf?.toString() || "",
      esi:
        item.esi?.toString() || "",
      benefits:
        item.benefits?.toString() || "",
      claims:
        item.claims?.toString() || "",
      band:
        item.band || "",
      status:
        item.status || "ACTIVE",
    });

    setSelected(null);
    setFormOpen(true);
  };

  const updateForm = (
    field: keyof StructureForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveStructure = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !form.structure_code.trim() ||
      !form.name.trim()
    ) {
      onShowToast?.(
        "error",
        "Missing Information",
        "Structure code and structure name are required."
      );

      return;
    }

    setSaving(true);

    const payload = {
      structure_code:
        form.structure_code.trim(),
      name: form.name.trim(),
      grade:
        form.grade.trim() || null,
      department:
        form.department.trim() || null,
      location:
        form.location.trim() || null,

      min_ctc:
        Number(form.min_ctc) || 0,
      midpoint_ctc:
        Number(form.midpoint_ctc) || 0,
      max_ctc:
        Number(form.max_ctc) || 0,

      min_experience_years:
        Number(form.min_experience_years) || 0,
      max_experience_years:
        Number(form.max_experience_years) || 0,

      pf:
        Number(form.pf) || 0,
      esi:
        Number(form.esi) || 0,
      benefits:
        Number(form.benefits) || 0,
      claims:
        Number(form.claims) || 0,

      band:
        form.band.trim() || null,
      status:
        form.status || "ACTIVE",
    };

    let error = null;

    if (editingId) {
      const result = await supabase
        .from("salary_structure_templates")
        .update(payload)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("salary_structure_templates")
        .insert(payload);

      error = result.error;
    }

    if (error) {
      console.error(
        "SALARY STRUCTURE SAVE ERROR:",
        error
      );

      onShowToast?.(
        "error",
        "Unable to save",
        error.message
      );
    } else {
      onShowToast?.(
        "success",
        editingId
          ? "Structure Updated"
          : "Structure Created",
        editingId
          ? "Salary structure has been updated."
          : "New salary structure has been created."
      );

      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadStructures();
    }

    setSaving(false);
  };

  const deleteStructure = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this salary structure?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const {
      error,
    } = await supabase
      .from("salary_structure_templates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "SALARY STRUCTURE DELETE ERROR:",
        error
      );

      onShowToast?.(
        "error",
        "Delete Failed",
        error.message
      );
    } else {
      onShowToast?.(
        "success",
        "Structure Deleted",
        "Salary structure has been deleted."
      );

      if (selected?.id === id) {
        setSelected(null);
      }

      await loadStructures();
    }

    setDeletingId(null);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <h1 className="text-[27px] font-bold tracking-tight text-gray-900">
              Salary Structure
            </h1>

            <p className="mt-1 max-w-3xl text-sm text-[#50627a]">
              View and manage HR-defined salary
              structure templates, CTC bands,
              experience ranges, statutory
              contributions, benefits, and claims.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2">

              <MapPin className="mr-2 h-4 w-4 text-[#50627a]" />

              <span className="mr-3 text-xs font-medium text-[#50627a]">
                Location
              </span>

              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(
                    e.target.value
                  )
                }
                className="bg-transparent text-xs font-semibold text-gray-900 outline-none"
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

            </div>

            <button
              type="button"
              onClick={openNewStructure}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#131b2e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#202a42]"
            >
              <Plus className="h-4 w-4" />
              New Structure
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          label="Salary Structures"
          value={structures.length}
          description="Available templates"
          icon={
            <Calculator className="h-5 w-5" />
          }
        />

        <KpiCard
          label="Average Midpoint"
          value={currency(
            averageMidpoint
          )}
          description="Average midpoint CTC"
          icon={
            <IndianRupee className="h-5 w-5" />
          }
          purple
        />

        <KpiCard
          label="Average PF"
          value={percentage(
            averagePF
          )}
          description="Configured PF rate"
          icon={
            <ShieldCheck className="h-5 w-5" />
          }
          green
        />

        <KpiCard
          label="Average ESI"
          value={percentage(
            averageESI
          )}
          description="Configured ESI rate"
          icon={
            <ShieldCheck className="h-5 w-5" />
          }
          dark
        />

      </div>


      {/* =====================================================
          LIBRARY
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* LIBRARY HEADER */}

        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-50 p-3">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>

            <div>

              <h2 className="text-[17px] font-bold text-gray-900">
                Salary Structure Library
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                HR-defined salary structure templates
                available for administrative review.
              </p>

            </div>

          </div>


          <div className="flex flex-col gap-2 sm:flex-row">

            <div className="relative">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search structure..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white sm:w-[265px]"
              />

            </div>


            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none"
            >

              <option value="ALL">
                All Departments
              </option>

              {departments.map(
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


            <button
              type="button"
              onClick={loadStructures}
              disabled={loading}
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              title="Refresh"
            >

              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

            </button>

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px]">

            <thead className="border-b border-gray-100 bg-[#faf8fa] text-[10px] font-bold uppercase tracking-wide text-[#50627a]">

              <tr>

                <th className="px-5 py-4 text-left">
                  Structure
                </th>

                <th className="px-5 py-4 text-left">
                  Department
                </th>

                <th className="px-5 py-4 text-left">
                  Location
                </th>

                <th className="px-5 py-4 text-left">
                  Salary Band
                </th>

                <th className="px-5 py-4 text-left">
                  Experience
                </th>

                <th className="px-5 py-4 text-left">
                  PF / ESI
                </th>

                <th className="px-5 py-4 text-center">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-100">

              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center"
                  >

                    <RefreshCw className="mx-auto h-7 w-7 animate-spin text-indigo-600" />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading salary structures...
                    </p>

                  </td>
                </tr>
              ) : filteredStructures.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center"
                  >

                    <Calculator className="mx-auto h-8 w-8 text-gray-300" />

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      No salary structures found
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Try another search or create
                      a new salary structure.
                    </p>

                  </td>
                </tr>
              ) : (
                filteredStructures.map(
                  (item) => {

                    const bandPercentage =
                      getBandPercentage(
                        item
                      );

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-[#fcfbfc]"
                      >

                        {/* STRUCTURE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                              <Calculator className="h-4 w-4" />

                            </div>

                            <div>

                              <p className="text-sm font-bold text-gray-900">
                                {item.name ||
                                  "Salary Structure"}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#50627a]">

                                {item.structure_code ||
                                  "—"}

                                {" • "}

                                Grade{" "}
                                {item.grade ||
                                  "—"}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* DEPARTMENT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <Building2 className="h-4 w-4 text-gray-400" />

                            <span className="text-sm text-gray-800">
                              {item.department ||
                                "—"}
                            </span>

                          </div>

                        </td>


                        {/* LOCATION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <MapPin className="h-4 w-4 text-blue-600" />

                            <span className="text-sm text-gray-800">
                              {item.location ||
                                "—"}
                            </span>

                          </div>

                        </td>


                        {/* SALARY BAND */}

                        <td className="px-5 py-4">

                          <div className="w-[220px]">

                            <div className="flex items-center justify-between gap-2 text-[10px]">

                              <span className="font-semibold text-gray-800">
                                {currency(
                                  item.min_ctc
                                )}
                              </span>

                              <span className="font-medium text-gray-500">
                                Mid{" "}
                                {currency(
                                  item.midpoint_ctc
                                )}
                              </span>

                              <span className="font-semibold text-gray-800">
                                {currency(
                                  item.max_ctc
                                )}
                              </span>

                            </div>

                            <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">

                              <div
                                className="absolute left-0 top-0 h-full rounded-full bg-[#131b2e]"
                                style={{
                                  width: `${bandPercentage}%`,
                                }}
                              />

                            </div>

                          </div>

                        </td>


                        {/* EXPERIENCE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <Users className="h-4 w-4 text-purple-600" />

                            <span className="text-sm font-medium text-gray-800">

                              {item.min_experience_years ??
                                0}

                              {" – "}

                              {item.max_experience_years ??
                                0}

                              {" yrs"}

                            </span>

                          </div>

                        </td>


                        {/* PF / ESI */}

                        <td className="px-5 py-4">

                          <div className="space-y-1">

                            <p className="text-[11px] font-semibold text-gray-800">

                              PF:{" "}
                              {percentage(
                                item.pf
                              )}

                            </p>

                            <p className="text-[11px] font-semibold text-gray-800">

                              ESI:{" "}
                              {percentage(
                                item.esi
                              )}

                            </p>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4 text-center">

                          <StatusBadge
                            status={
                              item.status
                            }
                          />

                        </td>


                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-1">

                            <button
                              type="button"
                              onClick={() =>
                                setSelected(
                                  item
                                )
                              }
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                openEdit(item)
                              }
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                deleteStructure(
                                  item.id
                                )
                              }
                              disabled={
                                deletingId ===
                                item.id
                              }
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Delete"
                            >

                              {deletingId ===
                              item.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}

                            </button>

                          </div>

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


      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-5">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-bold text-gray-900">
                    {selected.name ||
                      "Salary Structure"}
                  </h2>

                  <StatusBadge
                    status={
                      selected.status
                    }
                  />

                </div>

                <p className="mt-1 text-xs text-gray-500">

                  {selected.structure_code ||
                    "—"}

                  {" • Grade "}

                  {selected.grade ||
                    "—"}

                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>


            <div className="space-y-6 p-5">

              {/* BASIC */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Structure Information
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                  <DetailItem
                    label="Structure Code"
                    value={
                      selected.structure_code ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="Grade"
                    value={
                      selected.grade ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="Band"
                    value={
                      selected.band ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="Department"
                    value={
                      selected.department ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="Location"
                    value={
                      selected.location ||
                      "All Locations"
                    }
                  />

                  <DetailItem
                    label="Status"
                    value={normalizeStatus(
                      selected.status
                    )}
                  />

                </div>

              </section>


              {/* CTC */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Salary Band
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                  <DetailItem
                    label="Minimum CTC"
                    value={currencyFull(
                      selected.min_ctc
                    )}
                  />

                  <DetailItem
                    label="Midpoint CTC"
                    value={currencyFull(
                      selected.midpoint_ctc
                    )}
                  />

                  <DetailItem
                    label="Maximum CTC"
                    value={currencyFull(
                      selected.max_ctc
                    )}
                  />

                </div>

              </section>


              {/* EXPERIENCE */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Experience Range
                </h3>

                <DetailItem
                  label="Required Experience"
                  value={`${
                    selected.min_experience_years ??
                    0
                  } – ${
                    selected.max_experience_years ??
                    0
                  } years`}
                />

              </section>


              {/* STATUTORY */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Statutory & Benefits
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

                  <DetailItem
                    label="PF"
                    value={percentage(
                      selected.pf
                    )}
                  />

                  <DetailItem
                    label="ESI"
                    value={percentage(
                      selected.esi
                    )}
                  />

                  <DetailItem
                    label="Benefits"
                    value={currencyFull(
                      selected.benefits
                    )}
                  />

                  <DetailItem
                    label="Claims"
                    value={currencyFull(
                      selected.claims
                    )}
                  />

                </div>

              </section>


              {/* COMPONENTS */}

              {selected.components &&
                Object.keys(
                  selected.components
                ).length > 0 && (
                  <section>

                    <h3 className="mb-3 font-bold text-gray-900">
                      Salary Components
                    </h3>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                      {Object.entries(
                        selected.components
                      ).map(
                        ([key, value]) => (
                          <DetailItem
                            key={key}
                            label={key
                              .replaceAll(
                                "_",
                                " "
                              )
                              .replace(
                                /\b\w/g,
                                (letter) =>
                                  letter.toUpperCase()
                              )}
                            value={
                              typeof value ===
                              "number"
                                ? currencyFull(
                                    value
                                  )
                                : String(
                                    value ??
                                      "—"
                                  )
                            }
                          />
                        )
                      )}

                    </div>

                  </section>
                )}


              {/* DATES */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Record Information
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                  <DetailItem
                    label="Created"
                    value={formatDate(
                      selected.created_at
                    )}
                  />

                  <DetailItem
                    label="Last Updated"
                    value={formatDate(
                      selected.updated_at
                    )}
                  />

                </div>

              </section>

            </div>


            <div className="flex justify-end gap-2 border-t border-gray-200 p-4">

              <button
                type="button"
                onClick={() =>
                  openEdit(selected)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >

                <Edit3 className="h-4 w-4" />

                Edit

              </button>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="rounded-xl bg-[#131b2e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202a42]"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          NEW / EDIT MODAL
      ===================================================== */}

      {formOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            !saving && setFormOpen(false)
          }
        >

          <div
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-5">

              <div>

                <h2 className="text-lg font-bold text-gray-900">

                  {editingId
                    ? "Edit Salary Structure"
                    : "New Salary Structure"}

                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Configure the HR-defined salary
                  structure template.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  !saving &&
                  setFormOpen(false)
                }
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>


            <form
              onSubmit={saveStructure}
              className="space-y-6 p-5"
            >

              {/* STRUCTURE */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Structure Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  <FormField
                    label="Structure Code"
                    value={
                      form.structure_code
                    }
                    onChange={(value) =>
                      updateForm(
                        "structure_code",
                        value
                      )
                    }
                    placeholder="SAL-ENG-001"
                    required
                  />

                  <FormField
                    label="Structure Name"
                    value={form.name}
                    onChange={(value) =>
                      updateForm(
                        "name",
                        value
                      )
                    }
                    placeholder="Engineering Salary Structure"
                    required
                  />

                  <FormField
                    label="Grade"
                    value={form.grade}
                    onChange={(value) =>
                      updateForm(
                        "grade",
                        value
                      )
                    }
                    placeholder="Grade A"
                  />

                  <FormField
                    label="Department"
                    value={
                      form.department
                    }
                    onChange={(value) =>
                      updateForm(
                        "department",
                        value
                      )
                    }
                    placeholder="Engineering"
                  />

                  <FormField
                    label="Location"
                    value={
                      form.location
                    }
                    onChange={(value) =>
                      updateForm(
                        "location",
                        value
                      )
                    }
                    placeholder="Hyderabad"
                  />

                  <FormField
                    label="Band"
                    value={form.band}
                    onChange={(value) =>
                      updateForm(
                        "band",
                        value
                      )
                    }
                    placeholder="A1"
                  />

                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                      Status
                    </label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        updateForm(
                          "status",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                    >

                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="DRAFT">
                        Draft
                      </option>

                      <option value="INACTIVE">
                        Inactive
                      </option>

                    </select>

                  </div>

                </div>

              </section>


              {/* CTC */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  CTC Range
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  <FormField
                    label="Minimum CTC"
                    type="number"
                    value={form.min_ctc}
                    onChange={(value) =>
                      updateForm(
                        "min_ctc",
                        value
                      )
                    }
                    placeholder="300000"
                  />

                  <FormField
                    label="Midpoint CTC"
                    type="number"
                    value={
                      form.midpoint_ctc
                    }
                    onChange={(value) =>
                      updateForm(
                        "midpoint_ctc",
                        value
                      )
                    }
                    placeholder="500000"
                  />

                  <FormField
                    label="Maximum CTC"
                    type="number"
                    value={form.max_ctc}
                    onChange={(value) =>
                      updateForm(
                        "max_ctc",
                        value
                      )
                    }
                    placeholder="800000"
                  />

                </div>

              </section>


              {/* EXPERIENCE */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Experience Range
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <FormField
                    label="Minimum Experience (Years)"
                    type="number"
                    value={
                      form.min_experience_years
                    }
                    onChange={(value) =>
                      updateForm(
                        "min_experience_years",
                        value
                      )
                    }
                    placeholder="0"
                  />

                  <FormField
                    label="Maximum Experience (Years)"
                    type="number"
                    value={
                      form.max_experience_years
                    }
                    onChange={(value) =>
                      updateForm(
                        "max_experience_years",
                        value
                      )
                    }
                    placeholder="6"
                  />

                </div>

              </section>


              {/* STATUTORY */}

              <section>

                <h3 className="mb-3 font-bold text-gray-900">
                  Statutory Contributions
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                  <FormField
                    label="PF"
                    type="number"
                    value={form.pf}
                    onChange={(value) =>
                      updateForm(
                        "pf",
                        value
                      )
                    }
                    placeholder="12"
                  />

                  <FormField
                    label="ESI"
                    type="number"
                    value={form.esi}
                    onChange={(value) =>
                      updateForm(
                        "esi",
                        value
                      )
                    }
                    placeholder="2"
                  />

                  <FormField
                    label="Benefits"
                    type="number"
                    value={
                      form.benefits
                    }
                    onChange={(value) =>
                      updateForm(
                        "benefits",
                        value
                      )
                    }
                    placeholder="0"
                  />

                  <FormField
                    label="Claims"
                    type="number"
                    value={form.claims}
                    onChange={(value) =>
                      updateForm(
                        "claims",
                        value
                      )
                    }
                    placeholder="0"
                  />

                </div>

              </section>


              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    setFormOpen(false)
                  }
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#131b2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#202a42] disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />

                      {editingId
                        ? "Update Structure"
                        : "Create Structure"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};


/* ============================================================
   FORM FIELD
============================================================ */

const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}) => (
  <div>

    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
      {label}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}

    </label>

    <input
      type={type}
      value={value}
      required={required}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    />

  </div>
);


export default SalaryStructure;