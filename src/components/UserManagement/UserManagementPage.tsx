import React, { useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  Users,
  Shield,
  KeyRound,
  Smartphone,
  Search,
  RefreshCw,
  UserCog,
  Building2,
  Mail,
  X,
  Eye,
  Ban,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface PlatformUser {
  id: string;
  name: string | null;
  email: string | null;
  company_id: string | null;
  company_name: string | null;
  role: string | null;
  status: string | null;
  department: string | null;
  two_factor_enabled: boolean | null;
  last_login: string | null;
  avatar: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface UserManagementPageProps {
  onShowToast?: (message: string, type?: string) => void;
}

/*
|--------------------------------------------------------------------------
| ROLE OPTIONS
|--------------------------------------------------------------------------
| These are application-level roles.
| They are stored in platform_users.role.
*/
const ROLE_OPTIONS = [
  "All Roles",
  "Admin",
  "HR",
  "TL",
  "Employee",
];

const ADD_ROLE_OPTIONS = [
  "Admin",
  "HR",
  "TL",
  "Employee",
];

/*
|--------------------------------------------------------------------------
| STATUS OPTIONS
|--------------------------------------------------------------------------
*/
const STATUS_OPTIONS = [
  "All Status",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const normalize = (value: string | null | undefined) =>
  (value || "").trim().toLowerCase();

const formatRole = (role: string | null) => {
  if (!role) return "Employee";

  const value = role.replace(/_/g, " ").trim();

  return value.replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );
};

const formatStatus = (status: string | null) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const getInitials = (name: string | null) => {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
};

const formatDateTime = (value: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const roleBadgeClass = (role: string | null) => {
  const value = normalize(role);

  if (
    value === "admin" ||
    value.includes("administrator")
  ) {
    return "border-red-100 bg-red-50 text-red-700";
  }

  if (value === "hr" || value.includes("human")) {
    return "border-purple-100 bg-purple-50 text-purple-700";
  }

  if (value === "tl" || value.includes("team")) {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
};

const statusBadgeClass = (status: string | null) => {
  const value = normalize(status);

  if (
    value === "active" ||
    value === "enabled" ||
    value === "approved"
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    value === "suspended" ||
    value === "inactive" ||
    value === "disabled"
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
};

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export const UserManagementPage: React.FC<
  UserManagementPageProps
> = ({ onShowToast }) => {
  const [users, setUsers] = useState<PlatformUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("All Roles");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [selectedUser, setSelectedUser] =
    useState<PlatformUser | null>(null);

  const [showAddUser, setShowAddUser] =
    useState(false);

  const [savingUser, setSavingUser] =
    useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    company_id: "",
    company_name: "",
    role: "Employee",
    status: "ACTIVE",
    department: "",
    two_factor_enabled: false,
  });

  /*
  |--------------------------------------------------------------------------
  | TOAST
  |--------------------------------------------------------------------------
  */

  const notify = (
    message: string,
    type = "success"
  ) => {
    if (onShowToast) {
      onShowToast(message, type);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD USERS
  |--------------------------------------------------------------------------
  */

  const loadUsers = async () => {
    try {
      setLoading(true);

      console.log(
        "Loading platform_users from Supabase..."
      );

      const { data, error } = await supabase
        .from("platform_users")
        .select(`
          id,
          name,
          email,
          company_id,
          company_name,
          role,
          status,
          department,
          two_factor_enabled,
          last_login,
          avatar,
          created_at,
          updated_at
        `)
        .order("name", {
          ascending: true,
        });

      if (error) {
        console.error(
          "PLATFORM USERS LOAD ERROR:",
          error
        );

        notify(
          `Unable to load workforce users: ${error.message}`,
          "error"
        );

        setUsers([]);
        return;
      }

      console.log(
        "PLATFORM USERS FROM SUPABASE:",
        data
      );

      setUsers(
        (data || []) as PlatformUser[]
      );
    } catch (error) {
      console.error(
        "UNEXPECTED WORKFORCE ERROR:",
        error
      );

      notify(
        "Unexpected error while loading workforce data.",
        "error"
      );

      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadUsers();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
  };

  /*
  |--------------------------------------------------------------------------
  | FILTERED USERS
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [
        user.name,
        user.email,
        user.department,
        user.company_name,
        user.role,
        user.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesRole =
        roleFilter === "All Roles" ||
        normalize(user.role) ===
          normalize(roleFilter);

      const matchesStatus =
        statusFilter === "All Status" ||
        normalize(user.status) ===
          normalize(statusFilter);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | KPI COUNTS
  |--------------------------------------------------------------------------
  */

  const adminCount = users.filter(
    (user) => normalize(user.role) === "admin"
  ).length;

  const hrCount = users.filter(
    (user) => normalize(user.role) === "hr"
  ).length;

  const tlCount = users.filter(
    (user) => normalize(user.role) === "tl"
  ).length;

  const employeeCount = users.filter(
    (user) =>
      normalize(user.role) === "employee"
  ).length;

  const twoFactorCount = users.filter(
    (user) =>
      user.two_factor_enabled === true
  ).length;

  const activeCount = users.filter(
    (user) => normalize(user.status) === "active"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | ADD USER
  |--------------------------------------------------------------------------
  */

  const handleAddUser = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!newUser.name.trim()) {
      notify("User name is required.", "error");
      return;
    }

    if (!newUser.email.trim()) {
      notify("Email is required.", "error");
      return;
    }

    if (!newUser.department.trim()) {
      notify("Department is required.", "error");
      return;
    }

    try {
      setSavingUser(true);

      const payload = {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        company_id:
          newUser.company_id.trim() || null,
        company_name:
          newUser.company_name.trim() || null,
        role: newUser.role,
        status: newUser.status,
        department:
          newUser.department.trim(),
        two_factor_enabled:
          newUser.two_factor_enabled,
        last_login: null,
        avatar: null,
      };

      console.log(
        "ADDING PLATFORM USER:",
        payload
      );

      const { data, error } = await supabase
        .from("platform_users")
        .insert(payload)
        .select(`
          id,
          name,
          email,
          company_id,
          company_name,
          role,
          status,
          department,
          two_factor_enabled,
          last_login,
          avatar,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        console.error(
          "ADD PLATFORM USER ERROR:",
          error
        );

        notify(
          `Unable to add user: ${error.message}`,
          "error"
        );

        return;
      }

      console.log(
        "NEW PLATFORM USER:",
        data
      );

      setUsers((current) =>
        [...current, data as PlatformUser].sort(
          (a, b) =>
            (a.name || "").localeCompare(
              b.name || ""
            )
        )
      );

      notify(
        "Workforce user added successfully."
      );

      resetForm();
      setShowAddUser(false);
    } catch (error) {
      console.error(
        "UNEXPECTED ADD USER ERROR:",
        error
      );

      notify(
        "Unexpected error while adding user.",
        "error"
      );
    } finally {
      setSavingUser(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESET ADD USER FORM
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      company_id: "",
      company_name: "",
      role: "Employee",
      status: "ACTIVE",
      department: "",
      two_factor_enabled: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SUSPEND / ACTIVATE
  |--------------------------------------------------------------------------
  */

  const handleSuspend = async (
    user: PlatformUser
  ) => {
    const currentStatus =
      normalize(user.status);

    const suspended =
      currentStatus === "suspended" ||
      currentStatus === "inactive";

    const nextStatus = suspended
      ? "ACTIVE"
      : "SUSPENDED";

    try {
      const { error } = await supabase
        .from("platform_users")
        .update({
          status: nextStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error(
          "UPDATE PLATFORM USER ERROR:",
          error
        );

        notify(
          `Unable to update user: ${error.message}`,
          "error"
        );

        return;
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                status: nextStatus,
                updated_at:
                  new Date().toISOString(),
              }
            : item
        )
      );

      notify(
        nextStatus === "SUSPENDED"
          ? `${user.name || "User"} suspended.`
          : `${user.name || "User"} activated.`
      );

      setSelectedUser(null);
    } catch (error) {
      console.error(
        "UNEXPECTED STATUS ERROR:",
        error
      );

      notify(
        "Unexpected error while updating status.",
        "error"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* ================================================================
          PAGE HEADER
      ================================================================ */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-[22px] font-bold tracking-tight text-[#111827]">
                Workforce Management
              </h1>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700">
                RBAC & Access Control
              </span>

            </div>

            <p className="mt-1 max-w-3xl text-sm text-[#5f6b7a]">
              Manage administrators, HR users, team leads,
              employees, access roles, security controls,
              and workforce access.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => {
                resetForm();
                setShowAddUser(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#131b2e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c263d]"
            >
              <UserPlus className="h-4 w-4" />
              Add Workforce User
            </button>

          </div>

        </div>
      </section>

      {/* ================================================================
          KPI CARDS
      ================================================================ */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="TOTAL USERS"
          value={users.length}
          icon={
            <Users className="h-5 w-5 text-blue-600" />
          }
          iconBackground="bg-blue-50"
        />

        <StatCard
          title="ADMINS"
          value={adminCount}
          icon={
            <Shield className="h-5 w-5 text-red-600" />
          }
          iconBackground="bg-red-50"
        />

        <StatCard
          title="HR USERS"
          value={hrCount}
          icon={
            <UserCog className="h-5 w-5 text-purple-600" />
          }
          iconBackground="bg-purple-50"
        />

        <StatCard
          title="TEAM LEADS"
          value={tlCount}
          icon={
            <UserRound className="h-5 w-5 text-indigo-600" />
          }
          iconBackground="bg-indigo-50"
        />

        <StatCard
          title="2FA PROTECTED"
          value={`${twoFactorCount} / ${users.length}`}
          icon={
            <Smartphone className="h-5 w-5 text-emerald-600" />
          }
          iconBackground="bg-emerald-50"
        />

      </section>

      {/* ================================================================
          SECONDARY SUMMARY
      ================================================================ */}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <MiniStat
          label="ACTIVE USERS"
          value={activeCount}
          description="Currently active workforce accounts"
        />

        <MiniStat
          label="EMPLOYEES"
          value={employeeCount}
          description="Employee-level platform accounts"
        />

        <MiniStat
          label="ACCESS MODEL"
          value="RBAC"
          description="Role-based workforce access"
        />

      </section>

      {/* ================================================================
          USER TABLE
      ================================================================ */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* SEARCH + FILTER */}

        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-4 xl:flex-row xl:items-center">

          <div className="relative w-full xl:max-w-[500px]">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, email, department or role..."
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-400"
            >
              {ROLE_OPTIONS.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-400"
            >
              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              title="Refresh workforce users"
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

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px]">

            <thead className="bg-[#faf9fb]">

              <tr className="border-b border-gray-200">

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#526078]">
                  User Identity
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#526078]">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#526078]">
                  Company
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#526078]">
                  Department
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#526078]">
                  Security
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#526078]">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-[#526078]">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {/* LOADING */}

              {loading ? (
                <tr>

                  <td
                    colSpan={7}
                    className="py-20 text-center"
                  >

                    <RefreshCw className="mx-auto h-7 w-7 animate-spin text-indigo-600" />

                    <p className="mt-3 text-sm font-medium text-gray-600">
                      Loading workforce users...
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Reading platform_users from Supabase
                    </p>

                  </td>

                </tr>
              ) : filteredUsers.length === 0 ? (

                /* EMPTY */

                <tr>

                  <td
                    colSpan={7}
                    className="py-20 text-center"
                  >

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                      <Users className="h-7 w-7 text-gray-400" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-gray-800">
                      {users.length === 0
                        ? "No workforce users available"
                        : "No users found"}
                    </p>

                    <p className="mx-auto mt-1 max-w-md text-xs text-gray-500">
                      {users.length === 0
                        ? "The platform_users table currently has no records. Add a workforce user to populate this section."
                        : "Try changing the search or filters."}
                    </p>

                    {users.length === 0 && (
                      <button
                        onClick={() => {
                          resetForm();
                          setShowAddUser(true);
                        }}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#131b2e] px-4 py-2.5 text-xs font-semibold text-white"
                      >
                        <UserPlus className="h-4 w-4" />
                        Add First User
                      </button>
                    )}

                  </td>

                </tr>

              ) : (

                /* DATA */

                filteredUsers.map((user) => {

                  const suspended =
                    normalize(user.status) ===
                      "suspended" ||
                    normalize(user.status) ===
                      "inactive";

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-[#fcfbfc]"
                    >

                      {/* USER */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={
                                user.name ||
                                "User"
                              }
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
                              {getInitials(
                                user.name
                              )}
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-[#111827]">
                              {user.name ||
                                "Unnamed User"}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">

                              <Mail className="h-3 w-3" />

                              <span className="truncate">
                                {user.email ||
                                  "No email"}
                              </span>

                            </div>

                          </div>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${roleBadgeClass(
                            user.role
                          )}`}
                        >
                          {formatRole(
                            user.role
                          )}
                        </span>

                      </td>

                      {/* COMPANY */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <Building2 className="h-4 w-4 text-gray-400" />

                          <span className="text-sm font-medium text-gray-800">
                            {user.company_name ||
                              "—"}
                          </span>

                        </div>

                      </td>

                      {/* DEPARTMENT */}

                      <td className="px-6 py-5">

                        <span className="text-sm font-medium text-gray-700">
                          {user.department ||
                            "—"}
                        </span>

                      </td>

                      {/* SECURITY */}

                      <td className="px-6 py-5">

                        {user.two_factor_enabled ? (

                          <div>

                            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">

                              <ShieldCheck className="h-4 w-4" />

                              2FA Enabled

                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                              Last login:{" "}
                              {formatDateTime(
                                user.last_login
                              )}
                            </p>

                          </div>

                        ) : (

                          <div>

                            <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-600">

                              <Smartphone className="h-4 w-4" />

                              2FA Disabled

                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                              Last login:{" "}
                              {formatDateTime(
                                user.last_login
                              )}
                            </p>

                          </div>

                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase ${statusBadgeClass(
                            user.status
                          )}`}
                        >
                          {formatStatus(
                            user.status
                          )}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() =>
                              setSelectedUser(
                                user
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            title="View user"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleSuspend(
                                user
                              )
                            }
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                              suspended
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "border-red-200 bg-white text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {suspended
                              ? "Activate"
                              : "Suspend"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        {!loading && (
          <div className="border-t border-gray-200 bg-[#fcfbfc] px-6 py-3">

            <p className="text-xs text-gray-500">

              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {users.length}
              </span>{" "}
              workforce users

            </p>

          </div>
        )}

      </section>

      {/* ================================================================
          VIEW USER MODAL
      ================================================================ */}

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-200 p-6">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  User Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Workforce information from platform_users
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-6 p-6">

              {/* PROFILE */}

              <div className="flex items-center gap-4">

                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={
                      selectedUser.name ||
                      "User"
                    }
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563eb] text-lg font-bold text-white">
                    {getInitials(
                      selectedUser.name
                    )}
                  </div>
                )}

                <div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedUser.name ||
                      "Unnamed User"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {selectedUser.email ||
                      "No email"}
                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <DetailItem
                  label="Role"
                  value={formatRole(
                    selectedUser.role
                  )}
                />

                <DetailItem
                  label="Status"
                  value={formatStatus(
                    selectedUser.status
                  )}
                />

                <DetailItem
                  label="Company"
                  value={
                    selectedUser.company_name ||
                    "—"
                  }
                />

                <DetailItem
                  label="Company ID"
                  value={
                    selectedUser.company_id ||
                    "—"
                  }
                />

                <DetailItem
                  label="Department"
                  value={
                    selectedUser.department ||
                    "—"
                  }
                />

                <DetailItem
                  label="2FA"
                  value={
                    selectedUser.two_factor_enabled
                      ? "Enabled"
                      : "Disabled"
                  }
                />

                <DetailItem
                  label="Last Login"
                  value={formatDateTime(
                    selectedUser.last_login
                  )}
                />

                <DetailItem
                  label="Created"
                  value={formatDateTime(
                    selectedUser.created_at
                  )}
                />

              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

                <button
                  onClick={() =>
                    setSelectedUser(null)
                  }
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    handleSuspend(
                      selectedUser
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#131b2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1c263d]"
                >
                  <Ban className="h-4 w-4" />

                  {normalize(
                    selectedUser.status
                  ) === "suspended"
                    ? "Activate User"
                    : "Suspend User"}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================================
          ADD USER MODAL
      ================================================================ */}

      {showAddUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-200 p-6">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Add Workforce User
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Create a workforce access record in
                  platform_users.
                </p>

              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowAddUser(false);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <form
              onSubmit={handleAddUser}
              className="space-y-5 p-6"
            >

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <FormField
                  label="Full Name"
                  value={newUser.name}
                  onChange={(value) =>
                    setNewUser(
                      (current) => ({
                        ...current,
                        name: value,
                      })
                    )
                  }
                  placeholder="Enter full name"
                  required
                />

                <FormField
                  label="Email"
                  type="email"
                  value={newUser.email}
                  onChange={(value) =>
                    setNewUser(
                      (current) => ({
                        ...current,
                        email: value,
                      })
                    )
                  }
                  placeholder="Enter email address"
                  required
                />

                <FormField
                  label="Department"
                  value={newUser.department}
                  onChange={(value) =>
                    setNewUser(
                      (current) => ({
                        ...current,
                        department: value,
                      })
                    )
                  }
                  placeholder="Engineering / HR / Finance"
                  required
                />

                <FormField
                  label="Company Name"
                  value={newUser.company_name}
                  onChange={(value) =>
                    setNewUser(
                      (current) => ({
                        ...current,
                        company_name: value,
                      })
                    )
                  }
                  placeholder="TechNova Solutions"
                />

                <FormField
                  label="Company ID"
                  value={newUser.company_id}
                  onChange={(value) =>
                    setNewUser(
                      (current) => ({
                        ...current,
                        company_id: value,
                      })
                    )
                  }
                  placeholder="Company ID"
                />

                {/* ROLE */}

                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Access Role
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    value={newUser.role}
                    onChange={(event) =>
                      setNewUser(
                        (current) => ({
                          ...current,
                          role:
                            event.target.value,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    {ADD_ROLE_OPTIONS.map(
                      (role) => (
                        <option
                          key={role}
                          value={role}
                        >
                          {role}
                        </option>
                      )
                    )}
                  </select>

                </div>

                {/* STATUS */}

                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Status
                  </label>

                  <select
                    value={newUser.status}
                    onChange={(event) =>
                      setNewUser(
                        (current) => ({
                          ...current,
                          status:
                            event.target.value,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>

                    <option value="SUSPENDED">
                      SUSPENDED
                    </option>

                  </select>

                </div>

              </div>

              {/* 2FA */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                <input
                  type="checkbox"
                  checked={
                    newUser.two_factor_enabled
                  }
                  onChange={(event) =>
                    setNewUser(
                      (current) => ({
                        ...current,
                        two_factor_enabled:
                          event.target.checked,
                      })
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />

                <div>

                  <p className="text-sm font-semibold text-gray-800">
                    Enable 2FA
                  </p>

                  <p className="text-xs text-gray-500">
                    Stores two_factor_enabled = true
                    in platform_users.
                  </p>

                </div>

              </label>

              {/* NOTE */}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <p className="text-xs font-semibold text-blue-800">
                  Access record
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  This creates the workforce user record
                  in Supabase. Authentication/password
                  management should be handled separately
                  through Supabase Auth.
                </p>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddUser(false);
                  }}
                  disabled={savingUser}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingUser}
                  className="flex items-center gap-2 rounded-xl bg-[#131b2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1c263d] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {savingUser && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}

                  {savingUser
                    ? "Adding..."
                    : "Add User"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBackground: string;
}> = ({
  title,
  value,
  icon,
  iconBackground,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-wide text-[#657187]">
            {title}
          </p>

          <p className="mt-1 text-[24px] font-bold text-[#111827]">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| MINI STAT
|--------------------------------------------------------------------------
*/

const MiniStat: React.FC<{
  label: string;
  value: string | number;
  description: string;
}> = ({
  label,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-[10px] font-bold uppercase tracking-wide text-[#657187]">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-[#111827]">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| DETAIL ITEM
|--------------------------------------------------------------------------
*/

const DetailItem: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| FORM FIELD
|--------------------------------------------------------------------------
*/

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
  required = false,
}) => {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-semibold text-gray-700">

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
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />

    </div>
  );
};

export default UserManagementPage;