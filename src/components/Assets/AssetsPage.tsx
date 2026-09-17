import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  Laptop,
  CreditCard,
  Monitor,
  Smartphone,
  Eye,
  RefreshCw,
  X,
  MapPin,
  User,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Asset = {
  id: string;
  asset_code: string | null;
  asset_name: string | null;
  asset_type: string | null;
  serial_number: string | null;
  employee_id: string | null;
  location: string | null;
  status: string | null;
  condition: string | null;
  issue_date: string | null;
  return_date: string | null;
  purchase_date: string | null;
  purchase_cost: number | null;
  vendor: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Employee = {
  id: string;
  employee_code: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  department: string | null;
  location: string | null;
  designation: string | null;
};

type AssetWithEmployee = Asset & {
  employee?: Employee | null;
};

interface AssetsPageProps {
  onShowToast?: (message: string, type?: "success" | "error" | "info") => void;
}

const AssetsPage: React.FC<AssetsPageProps> = ({ onShowToast }) => {
  const [assets, setAssets] = useState<AssetWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [selectedAsset, setSelectedAsset] =
    useState<AssetWithEmployee | null>(null);

  const [error, setError] = useState("");

  const loadAssets = async () => {
    try {
      setError("");

      const { data: assetData, error: assetError } = await supabase
        .from("assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (assetError) {
        throw assetError;
      }

      const assetRows = (assetData || []) as Asset[];

      /*
       * Fetch employees separately.
       * This avoids relying on a Supabase foreign-key relationship.
       */
      const employeeIds = [
        ...new Set(
          assetRows
            .map((asset) => asset.employee_id)
            .filter((id): id is string => Boolean(id))
        ),
      ];

      let employeeRows: Employee[] = [];

      if (employeeIds.length > 0) {
        const { data: employeesData, error: employeesError } = await supabase
          .from("employees")
          .select(
            "id, employee_code, first_name, last_name, full_name, department, location, designation"
          )
          .in("id", employeeIds);

        if (employeesError) {
          console.warn("Employee lookup failed:", employeesError);
        } else {
          employeeRows = (employeesData || []) as Employee[];
        }
      }

      const employeeMap = new Map<string, Employee>();

      employeeRows.forEach((employee) => {
        employeeMap.set(employee.id, employee);
      });

      const combined: AssetWithEmployee[] = assetRows.map((asset) => ({
        ...asset,
        employee: asset.employee_id
          ? employeeMap.get(asset.employee_id) || null
          : null,
      }));

      setAssets(combined);

      console.log("ASSETS FROM SUPABASE:", assetRows);
      console.log("EMPLOYEES:", employeeRows);
      console.log("COMBINED ASSETS:", combined);
    } catch (err: any) {
      console.error("Assets loading error:", err);

      const message =
        err?.message || "Unable to load assets from Supabase.";

      setError(message);
      onShowToast?.(message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const refreshAssets = async () => {
    setRefreshing(true);
    await loadAssets();
  };

  const employeeName = (asset: AssetWithEmployee) => {
    if (!asset.employee) {
      return asset.employee_id ? "Employee not found" : "Unassigned";
    }

    if (asset.employee.full_name) {
      return asset.employee.full_name;
    }

    return `${asset.employee.first_name || ""} ${
      asset.employee.last_name || ""
    }`.trim() || "Unknown Employee";
  };

  const employeeCode = (asset: AssetWithEmployee) => {
    return asset.employee?.employee_code || "—";
  };

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesSearch =
        !query ||
        [
          asset.asset_code,
          asset.asset_name,
          asset.asset_type,
          asset.serial_number,
          asset.location,
          asset.status,
          asset.condition,
          asset.vendor,
          employeeName(asset),
          employeeCode(asset),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        statusFilter === "ALL" ||
        String(asset.status || "").toUpperCase() === statusFilter;

      const matchesType =
        typeFilter === "ALL" ||
        String(asset.asset_type || "").toUpperCase() === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, search, statusFilter, typeFilter]);

  const totalAssets = assets.length;

  const assignedAssets = assets.filter(
    (asset) => asset.employee_id
  ).length;

  const availableAssets = assets.filter((asset) => {
    const status = String(asset.status || "").toUpperCase();

    return (
      status === "AVAILABLE" ||
      status === "IN_STOCK" ||
      status === "UNASSIGNED"
    );
  }).length;

  const maintenanceAssets = assets.filter((asset) => {
    const status = String(asset.status || "").toUpperCase();

    return (
      status === "MAINTENANCE" ||
      status === "REPAIR" ||
      status === "UNDER_REPAIR"
    );
  }).length;

  const assetTypes = useMemo(() => {
    const types = new Set<string>();

    assets.forEach((asset) => {
      if (asset.asset_type) {
        types.add(asset.asset_type);
      }
    });

    return Array.from(types).sort();
  }, [assets]);

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

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "—";

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const statusClass = (status: string | null) => {
    const value = String(status || "").toUpperCase();

    if (
      value === "ACTIVE" ||
      value === "ASSIGNED" ||
      value === "ALLOCATED" ||
      value === "AVAILABLE"
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (
      value === "MAINTENANCE" ||
      value === "REPAIR" ||
      value === "UNDER_REPAIR"
    ) {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    if (
      value === "RETURNED" ||
      value === "INACTIVE" ||
      value === "RETIRED"
    ) {
      return "bg-slate-100 text-slate-600 border-slate-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-100";
  };

  const conditionClass = (condition: string | null) => {
    const value = String(condition || "").toUpperCase();

    if (
      value === "GOOD" ||
      value === "EXCELLENT" ||
      value === "NEW"
    ) {
      return "text-emerald-700";
    }

    if (value === "FAIR") {
      return "text-amber-700";
    }

    if (
      value === "POOR" ||
      value === "DAMAGED"
    ) {
      return "text-red-600";
    }

    return "text-slate-600";
  };

  const getAssetIcon = (type: string | null) => {
    const value = String(type || "").toLowerCase();

    if (value.includes("laptop")) {
      return <Laptop size={20} />;
    }

    if (
      value.includes("card") ||
      value.includes("access")
    ) {
      return <CreditCard size={20} />;
    }

    if (
      value.includes("phone") ||
      value.includes("mobile")
    ) {
      return <Smartphone size={20} />;
    }

    if (
      value.includes("monitor") ||
      value.includes("display")
    ) {
      return <Monitor size={20} />;
    }

    return <Package size={20} />;
  };

  return (
    <div className="min-h-full bg-[#F7F8FA] px-5 py-6 md:px-8">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                Asset Management
              </h1>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                ADMIN VIEW
              </span>
            </div>

            <p className="text-sm text-slate-500">
              Track company assets, employee assignments,
              condition, location and asset lifecycle.
            </p>
          </div>

          <button
            onClick={refreshAssets}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">
              Asset Loading Failed
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Assets
            </span>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Package size={21} />
            </div>
          </div>

          <div className="text-3xl font-bold text-slate-900">
            {totalAssets}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Assets in database
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Assigned
            </span>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <User size={21} />
            </div>
          </div>

          <div className="text-3xl font-bold text-slate-900">
            {assignedAssets}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Assigned to employees
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Available
            </span>

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <CheckCircle2 size={21} />
            </div>
          </div>

          <div className="text-3xl font-bold text-slate-900">
            {availableAssets}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Ready for allocation
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Maintenance
            </span>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <RotateCcw size={21} />
            </div>
          </div>

          <div className="text-3xl font-bold text-slate-900">
            {maintenanceAssets}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Under repair / maintenance
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search asset, employee, code, serial number..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="RETURNED">Returned</option>
            <option value="RETIRED">Retired</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="ALL">All Asset Types</option>

            {assetTypes.map((type) => (
              <option key={type} value={type.toUpperCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Company Assets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredAssets.length} asset
                {filteredAssets.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <Package
              size={23}
              className="text-indigo-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <RefreshCw
                size={19}
                className="animate-spin"
              />
              Loading assets from Supabase...
            </div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400">
              <Package size={32} />
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              No assets found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              No records match the current search or filters.
              Check the Supabase assets table if you expect
              records to appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Asset
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Employee
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Serial Number
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Condition
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    {/* Asset */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                          {getAssetIcon(asset.asset_type)}
                        </div>

                        <div>
                          <div className="font-semibold text-slate-900">
                            {asset.asset_name || "Unnamed Asset"}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {asset.asset_code || "No asset code"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee */}
                    <td className="px-5 py-5">
                      <div className="font-semibold text-slate-800">
                        {employeeName(asset)}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {employeeCode(asset)}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-5">
                      <span className="text-sm text-slate-700">
                        {asset.asset_type || "—"}
                      </span>
                    </td>

                    {/* Serial */}
                    <td className="px-5 py-5">
                      <span className="font-mono text-sm text-slate-600">
                        {asset.serial_number || "—"}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin size={15} />
                        {asset.location || "—"}
                      </div>
                    </td>

                    {/* Condition */}
                    <td className="px-5 py-5">
                      <span
                        className={`text-sm font-semibold ${conditionClass(
                          asset.condition
                        )}`}
                      >
                        {asset.condition || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(
                          asset.status
                        )}`}
                      >
                        {asset.status || "UNKNOWN"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-5">
                      <button
                        onClick={() =>
                          setSelectedAsset(asset)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

      {/* Details Modal */}
      {selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  {getAssetIcon(selectedAsset.asset_type)}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedAsset.asset_name ||
                      "Asset Details"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedAsset.asset_code || "No asset code"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAsset(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              <DetailItem
                label="Asset Name"
                value={selectedAsset.asset_name}
              />

              <DetailItem
                label="Asset Code"
                value={selectedAsset.asset_code}
              />

              <DetailItem
                label="Asset Type"
                value={selectedAsset.asset_type}
              />

              <DetailItem
                label="Serial Number"
                value={selectedAsset.serial_number}
              />

              <DetailItem
                label="Assigned Employee"
                value={employeeName(selectedAsset)}
              />

              <DetailItem
                label="Employee Code"
                value={employeeCode(selectedAsset)}
              />

              <DetailItem
                label="Department"
                value={
                  selectedAsset.employee?.department ||
                  null
                }
              />

              <DetailItem
                label="Designation"
                value={
                  selectedAsset.employee?.designation ||
                  null
                }
              />

              <DetailItem
                label="Location"
                value={selectedAsset.location}
              />

              <DetailItem
                label="Status"
                value={selectedAsset.status}
              />

              <DetailItem
                label="Condition"
                value={selectedAsset.condition}
              />

              <DetailItem
                label="Issue Date"
                value={formatDate(
                  selectedAsset.issue_date
                )}
              />

              <DetailItem
                label="Return Date"
                value={formatDate(
                  selectedAsset.return_date
                )}
              />

              <DetailItem
                label="Purchase Date"
                value={formatDate(
                  selectedAsset.purchase_date
                )}
              />

              <DetailItem
                label="Purchase Cost"
                value={formatCurrency(
                  selectedAsset.purchase_cost
                )}
              />

              <DetailItem
                label="Vendor"
                value={selectedAsset.vendor}
              />

              <div className="md:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Notes
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    {selectedAsset.notes || "No notes available."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setSelectedAsset(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="text-sm font-semibold text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
};

export { AssetsPage };
export default AssetsPage;