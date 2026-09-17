import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  ShieldCheck,
  CalendarDays,
  X,
} from "lucide-react";

interface Props {
  onShowToast?: (
    type: "success" | "error" | "info",
    title: string,
    message?: string
  ) => void;
}

interface Rule {
  id: string;
  title: string;
  category: string;
  description: string;
  effectiveDate: string;
  version: string;
  status: "ACTIVE" | "DRAFT";
}

export const RulesRegulationsPage: React.FC<
  Props
> = ({ onShowToast }) => {
  const [rules, setRules] =
    useState<Rule[]>([
      {
        id: "RULE-001",
        title: "Attendance Policy",
        category: "Attendance",
        description:
          "Employees are required to record attendance according to company attendance procedures.",
        effectiveDate: "2026-01-01",
        version: "1.0",
        status: "ACTIVE",
      },
      {
        id: "RULE-002",
        title: "Leave Policy",
        category: "Leave",
        description:
          "Leave requests must be submitted through the HRMS approval workflow.",
        effectiveDate: "2026-01-01",
        version: "1.0",
        status: "ACTIVE",
      },
      {
        id: "RULE-003",
        title: "Overtime Policy",
        category: "Payroll",
        description:
          "Overtime must be approved before it is included in payroll processing.",
        effectiveDate: "2026-01-01",
        version: "1.0",
        status: "ACTIVE",
      },
      {
        id: "RULE-004",
        title: "Code of Conduct",
        category: "Company Policy",
        description:
          "Employees must follow company standards of professional conduct.",
        effectiveDate: "2026-01-01",
        version: "1.0",
        status: "ACTIVE",
      },
    ]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("ALL");

  const [selected, setSelected] =
    useState<Rule | null>(null);

  const [showAdd, setShowAdd] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [newCategory, setNewCategory] =
    useState("Company Policy");

  const filtered = rules.filter(
    (rule) => {
      const text =
        `${rule.title} ${rule.category} ${rule.description}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (category === "ALL" ||
          rule.category === category)
      );
    }
  );

  const categories = Array.from(
    new Set(rules.map((rule) => rule.category))
  );

  const addRule = () => {
    if (
      !title.trim() ||
      !description.trim()
    ) {
      onShowToast?.(
        "error",
        "Missing Details",
        "Enter rule title and description."
      );

      return;
    }

    const newRule: Rule = {
      id: `RULE-${String(
        rules.length + 1
      ).padStart(3, "0")}`,
      title,
      category: newCategory,
      description,
      effectiveDate: new Date()
        .toISOString()
        .split("T")[0],
      version: "1.0",
      status: "DRAFT",
    };

    setRules((previous) => [
      ...previous,
      newRule,
    ]);

    setTitle("");
    setDescription("");
    setShowAdd(false);

    onShowToast?.(
      "success",
      "Rule Created",
      "New rule has been added."
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
              <h1 className="text-[21px] font-bold">
                Rules & Regulations
              </h1>

              <p className="text-sm text-gray-500">
                Manage company policies, HR rules
                and regulatory guidelines.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setShowAdd(true)
            }
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Summary
          label="Total Rules"
          value={rules.length}
        />

        <Summary
          label="Active Rules"
          value={
            rules.filter(
              (rule) =>
                rule.status === "ACTIVE"
            ).length
          }
        />

        <Summary
          label="Draft Rules"
          value={
            rules.filter(
              (rule) =>
                rule.status === "DRAFT"
            ).length
          }
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search rules..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Categories
          </option>

          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((rule) => (
          <div
            key={rule.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <div className="flex gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    {rule.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {rule.id} • Version{" "}
                    {rule.version}
                  </p>
                </div>
              </div>

              <span
                className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${
                  rule.status ===
                  "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {rule.status}
              </span>
            </div>

            <div className="mt-4">
              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                {rule.category}
              </span>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
              {rule.description}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CalendarDays className="h-4 w-4" />
                Effective:{" "}
                {rule.effectiveDate}
              </div>

              <button
                onClick={() =>
                  setSelected(rule)
                }
                className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white"
              >
                View Rule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW */}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-bold">
                  {selected.title}
                </h2>

                <p className="text-xs text-gray-500">
                  {selected.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <SummaryItem
                  label="Category"
                  value={selected.category}
                />

                <SummaryItem
                  label="Version"
                  value={selected.version}
                />

                <SummaryItem
                  label="Effective Date"
                  value={
                    selected.effectiveDate
                  }
                />

                <SummaryItem
                  label="Status"
                  value={selected.status}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                  Rule Description
                </p>

                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                  {selected.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD */}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">
                Add Rule
              </h2>

              <button
                onClick={() =>
                  setShowAdd(false)
                }
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Rule title"
                className="w-full rounded-xl border p-3 text-sm"
              />

              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-3 text-sm"
              >
                <option>
                  Company Policy
                </option>
                <option>
                  Attendance
                </option>
                <option>
                  Leave
                </option>
                <option>
                  Payroll
                </option>
                <option>
                  Compliance
                </option>
                <option>
                  Employee Conduct
                </option>
              </select>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Rule description"
                rows={5}
                className="w-full rounded-xl border p-3 text-sm"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() =>
                  setShowAdd(false)
                }
                className="rounded-xl border px-4 py-2.5 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={addRule}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Summary: React.FC<{
  label: string;
  value: number;
}> = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-bold uppercase text-gray-500">
      {label}
    </p>

    <p className="mt-2 text-2xl font-bold">
      {value}
    </p>
  </div>
);

const SummaryItem: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold">
      {value}
    </p>
  </div>
);

export default RulesRegulationsPage;