import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Shield,
  Key,
  Lock,
  Unlock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  MoreHorizontal,
  Download,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { supabase } from "../../lib/supabase";

type PlatformUserRole =
  | "Super Admin"
  | "Company Admin"
  | "HR Manager"
  | "Employee";

type PlatformUserStatus =
  | "Active"
  | "Suspended"
  | "Inactive";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  company_id: string;
  company_name: string;
  role: PlatformUserRole;
  status: PlatformUserStatus;
  department: string | null;
  two_factor_enabled: boolean;
  last_login: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

interface CompanyOption {
  id: string;
  tenant_id: string | null;
  name: string;
  status: string | null;
}

export const UsersView: React.FC = () => {
  const { viewCompanyProfile, addToast } = useApp();

  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] =
    useState<PlatformUserRole>("Company Admin");
  const [department, setDepartment] =
    useState("Human Resources");

  // =========================================================
  // LOAD USERS
  // =========================================================

  const loadUsers = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("platform_users")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error loading platform users:",
          error
        );
        throw error;
      }

      setUsers((data || []) as PlatformUser[]);
    } catch (error) {
      console.error(error);

      addToast({
        type: "error",
        message:
          "Unable to load platform users from Supabase.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // LOAD REAL TENANTS FROM SUPABASE
  // =========================================================

  const loadCompanies = async () => {
    try {
      setIsLoadingCompanies(true);

      const { data, error } = await supabase
        .from("companies")
        .select("id, tenant_id, name, status")
        .order("name", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Error loading companies:",
          error
        );
        throw error;
      }

      setCompanyOptions(
        (data || []) as CompanyOption[]
      );
    } catch (error) {
      console.error(error);

      setCompanyOptions([]);

      addToast({
        type: "error",
        message:
          "Unable to load tenants from Supabase.",
      });
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // =========================================================
  // INITIAL LOAD + TENANT REFRESH LISTENER
  // =========================================================

  useEffect(() => {
    loadUsers();
    loadCompanies();

    const handleCompaniesChanged = () => {
      loadCompanies();
    };

    window.addEventListener(
      "superadmin:companies-changed",
      handleCompaniesChanged
    );

    return () => {
      window.removeEventListener(
        "superadmin:companies-changed",
        handleCompaniesChanged
      );
    };
  }, []);

  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue) ||
        user.company_name
          .toLowerCase()
          .includes(searchValue) ||
        user.role
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      const matchesCompany =
        companyFilter === "All" ||
        user.company_id === companyFilter;

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesCompany &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    companyFilter,
    statusFilter,
  ]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "Suspended"
  ).length;

  const superAdmins = users.filter(
    (user) => user.role === "Super Admin"
  ).length;

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("Company Admin");
    setDepartment("Human Resources");

    if (companyOptions.length > 0) {
      setCompanyId(companyOptions[0].id);
    } else {
      setCompanyId("");
    }
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  // =========================================================
  // ROLE CHANGE
  // =========================================================

  const handleRoleChange = (
    newRole: PlatformUserRole
  ) => {
    setRole(newRole);

    if (newRole === "Super Admin") {
      setCompanyId("");
      return;
    }

    if (
      !companyId &&
      companyOptions.length > 0
    ) {
      setCompanyId(
        companyOptions[0].id
      );
    }
  };

  // =========================================================
  // CREATE USER
  // =========================================================

  const handleCreateUser = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      addToast({
        type: "error",
        message:
          "Please enter the user's name.",
      });
      return;
    }

    if (!email.trim()) {
      addToast({
        type: "error",
        message:
          "Please enter the user's email.",
      });
      return;
    }

    if (role !== "Super Admin") {
      if (companyOptions.length === 0) {
        addToast({
          type: "error",
          message:
            "No tenants exist yet. Please create a tenant in Tenant Management first.",
        });
        return;
      }

      if (!companyId) {
        addToast({
          type: "error",
          message:
            "Please select a tenant.",
        });
        return;
      }
    }

    try {
      setIsSaving(true);

      const selectedCompany =
        companyOptions.find(
          (company) =>
            company.id === companyId
        );

      if (
        role !== "Super Admin" &&
        !selectedCompany
      ) {
        addToast({
          type: "error",
          message:
            "The selected tenant could not be found. Please refresh the tenant list and try again.",
        });
        return;
      }

      const newUser = {
        name: name.trim(),

        email: email
          .trim()
          .toLowerCase(),

        company_id:
          role === "Super Admin"
            ? "GLOBAL"
            : selectedCompany!.id,

        company_name:
          role === "Super Admin"
            ? "Global Platform"
            : selectedCompany!.name,

        role,

        status:
          "Active" as PlatformUserStatus,

        department:
          department.trim() || null,

        two_factor_enabled: true,

        last_login: null,

        avatar: null,
      };

      const { data, error } =
        await supabase
          .from("platform_users")
          .insert(newUser)
          .select()
          .single();

      if (error) {
        console.error(
          "Error creating platform user:",
          error
        );

        if (
          error.code === "23505" ||
          error.message
            ?.toLowerCase()
            .includes("duplicate")
        ) {
          throw new Error(
            "A user with this email already exists."
          );
        }

        throw error;
      }

      setUsers(
        (currentUsers) => [
          data as PlatformUser,
          ...currentUsers,
        ]
      );

      setAddModalOpen(false);

      resetForm();

      addToast({
        type: "success",
        message:
          "Platform user created successfully.",
      });
    } catch (error: any) {
      console.error(error);

      addToast({
        type: "error",
        message:
          error?.message ||
          "Unable to create platform user.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // UPDATE USER STATUS
  // =========================================================

  const updateUserStatus = async (
    userId: string,
    status: PlatformUserStatus
  ) => {
    try {
      const { data, error } =
        await supabase
          .from("platform_users")
          .update({ status })
          .eq("id", userId)
          .select()
          .single();

      if (error) {
        console.error(
          "Error updating user status:",
          error
        );
        throw error;
      }

      setUsers(
        (currentUsers) =>
          currentUsers.map((user) =>
            user.id === userId
              ? (data as PlatformUser)
              : user
          )
      );

      addToast({
        type: "success",
        message:
          status === "Suspended"
            ? "User suspended successfully."
            : "User activated successfully.",
      });
    } catch (error: any) {
      console.error(error);

      addToast({
        type: "error",
        message:
          error?.message ||
          "Unable to update user status.",
      });
    }
  };

  const handleSuspendUser = async (
    userId: string
  ) => {
    await updateUserStatus(
      userId,
      "Suspended"
    );
  };

  const handleActivateUser = async (
    userId: string
  ) => {
    await updateUserStatus(
      userId,
      "Active"
    );
  };

  // =========================================================
  // PASSWORD RESET
  // =========================================================

  const handleResetPassword = (
    user: PlatformUser
  ) => {
    addToast({
      type: "info",
      message: `Password reset for ${user.email} requires Supabase Auth integration.`,
    });
  };

  // =========================================================
  // IMPERSONATION
  // =========================================================

  const handleImpersonation = (
    user: PlatformUser
  ) => {
    if (user.role === "Super Admin") {
      addToast({
        type: "error",
        message:
          "Super Admin impersonation is not allowed.",
      });
      return;
    }

    addToast({
      type: "info",
      message:
        "User impersonation requires Supabase Auth and a secure server-side function.",
    });
  };

  // =========================================================
  // FORMAT LAST LOGIN
  // =========================================================

  const formatLastLogin = (
    lastLogin: string | null
  ) => {
    if (!lastLogin) {
      return "Never";
    }

    const date = new Date(lastLogin);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "Never";
    }

    return date.toLocaleString();
  };

  // =========================================================
  // EXPORT
  // =========================================================

  const exportUsers = () => {
    if (filteredUsers.length === 0) {
      addToast({
        type: "info",
        message:
          "There are no users to export.",
      });
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Company",
      "Role",
      "Department",
      "2FA",
      "Status",
      "Last Login",
    ];

    const rows =
      filteredUsers.map(
        (user) => [
          user.name,
          user.email,
          user.company_name,
          user.role,
          user.department || "",
          user.two_factor_enabled
            ? "Enabled"
            : "Disabled",
          user.status,
          formatLastLogin(
            user.last_login
          ),
        ]
      );

    const csvContent = [
      headers,
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
      [csvContent],
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
      "platform-users.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // ROLE BADGE
  // =========================================================

  const getRoleBadge = (
    userRole: PlatformUserRole
  ) => {
    if (userRole === "Super Admin") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
          <Shield size={13} />
          Super Admin
        </span>
      );
    }

    if (userRole === "Company Admin") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          <UserCheck size={13} />
          Company Admin
        </span>
      );
    }

    if (userRole === "HR Manager") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
          <Users size={13} />
          HR Manager
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
        <Users size={13} />
        Employee
      </span>
    );
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadge = (
    status: PlatformUserStatus
  ) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          <CheckCircle2 size={13} />
          Active
        </span>
      );
    }

    if (status === "Suspended") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
          <XCircle size={13} />
          Suspended
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
        <XCircle size={13} />
        Inactive
      </span>
    );
  };

  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (
    userName: string
  ) => {
    const parts =
      userName
        .trim()
        .split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Users size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Platform Users
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage users across all tenants and platform roles.
              </p>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => {
              loadUsers();
              loadCompanies();
            }}
            disabled={
              isLoading ||
              isLoadingCompanies
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isLoading ||
                isLoadingCompanies
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={exportUsers}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Download size={16} />
            Export
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
          >
            <Plus size={17} />
            Add User
          </button>

        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalUsers}
              </p>
            </div>

            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Users
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {activeUsers}
              </p>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <UserCheck size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Suspended
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {suspendedUsers}
              </p>
            </div>

            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              <Lock size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Super Admins
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {superAdmins}
              </p>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Shield size={20} />
            </div>
          </div>
        </div>

      </div>

      {/* SEARCH + FILTERS */}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 xl:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, email, company or role..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            <option value="All">
              All Roles
            </option>

            <option value="Super Admin">
              Super Admin
            </option>

            <option value="Company Admin">
              Company Admin
            </option>

            <option value="HR Manager">
              HR Manager
            </option>

            <option value="Employee">
              Employee
            </option>
          </select>

          <select
            value={companyFilter}
            onChange={(event) =>
              setCompanyFilter(
                event.target.value
              )
            }
            disabled={isLoadingCompanies}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="All">
              All Companies
            </option>

            {companyOptions.map(
              (company) => (
                <option
                  key={company.id}
                  value={company.id}
                >
                  {company.name}
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
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Suspended">
              Suspended
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

        </div>
      </div>

      {/* USERS TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Company / Tenant
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  2FA
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Last Login
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">

                      <Loader2
                        size={28}
                        className="animate-spin text-purple-600"
                      />

                      <p className="text-sm text-gray-500">
                        Loading platform users...
                      </p>

                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">

                      <div className="mb-3 rounded-full bg-gray-100 p-4">
                        <Users
                          size={24}
                          className="text-gray-400"
                        />
                      </div>

                      <p className="font-medium text-gray-900">
                        No users found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>

                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                              {getInitials(
                                user.name
                              )}
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="truncate font-medium text-gray-900">
                              {user.name}
                            </p>

                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                              <Mail size={12} />
                              {user.email}
                            </p>

                            {user.department && (
                              <p className="mt-0.5 text-xs text-gray-400">
                                {user.department}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* COMPANY */}

                      <td className="px-5 py-4">

                        {user.company_id ===
                        "GLOBAL" ? (
                          <div className="flex items-center gap-2">

                            <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                              <Shield size={15} />
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">
                                Global Platform
                              </p>

                              <p className="text-xs text-gray-400">
                                Platform Team
                              </p>
                            </div>

                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              viewCompanyProfile(
                                user.company_id
                              )
                            }
                            className="group flex items-center gap-2 text-left"
                          >

                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                              <Building2 size={15} />
                            </div>

                            <div>

                              <p className="font-medium text-gray-900 group-hover:text-purple-600">
                                {user.company_name}
                              </p>

                              <p className="text-xs text-gray-400">
                                Tenant
                              </p>

                            </div>

                          </button>
                        )}

                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">
                        {getRoleBadge(
                          user.role
                        )}
                      </td>

                      {/* 2FA */}

                      <td className="px-5 py-4">

                        {user.two_factor_enabled ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                            <CheckCircle2 size={15} />
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400">
                            <XCircle size={15} />
                            Disabled
                          </span>
                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        {getStatusBadge(
                          user.status
                        )}
                      </td>

                      {/* LAST LOGIN */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatLastLogin(
                          user.last_login
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-1">

                          <button
                            type="button"
                            onClick={() =>
                              handleResetPassword(
                                user
                              )
                            }
                            title="Reset password"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-purple-600"
                          >
                            <Key size={16} />
                          </button>

                          {user.role !==
                            "Super Admin" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleImpersonation(
                                  user
                                )
                              }
                              title="Impersonate user"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                            >
                              <MoreHorizontal
                                size={17}
                              />
                            </button>
                          )}

                          {user.status ===
                          "Active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleSuspendUser(
                                  user.id
                                )
                              }
                              title="Suspend user"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Lock size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleActivateUser(
                                  user.id
                                )
                              }
                              title="Activate user"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                            >
                              <Unlock size={16} />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

        {!isLoading &&
          filteredUsers.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">

              <p className="text-sm text-gray-500">

                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {users.length}
                </span>{" "}
                users

              </p>

            </div>
          )}

      </div>

      {/* =====================================================
          COMPACT ADD USER MODAL
      ====================================================== */}

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Platform User
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Create a user profile in the platform database.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAddModalOpen(false)
                }
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleCreateUser}
              className="space-y-3.5 p-5"
            >

              {/* FULL NAME */}

              <div>

                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="user@company.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                />

              </div>

              {/* ASSIGNED TENANT */}

              <div>

                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Assigned Tenant
                </label>

                <select
                  value={companyId}
                  onChange={(event) =>
                    setCompanyId(
                      event.target.value
                    )
                  }
                  disabled={
                    role === "Super Admin" ||
                    isLoadingCompanies
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100 disabled:text-gray-400"
                >

                  <option value="">
                    {isLoadingCompanies
                      ? "Loading tenants..."
                      : companyOptions.length === 0
                      ? "No tenants available"
                      : "Select tenant"}
                  </option>

                  {companyOptions.map(
                    (company) => (
                      <option
                        key={company.id}
                        value={company.id}
                      >
                        {company.name} —{" "}
                        {company.tenant_id ||
                          company.id}
                      </option>
                    )
                  )}

                </select>

                {role ===
                "Super Admin" ? (
                  <p className="mt-1 text-[11px] text-gray-400">
                    Super Admins belong to the Global Platform.
                  </p>
                ) : companyOptions.length ===
                    0 &&
                  !isLoadingCompanies ? (
                  <p className="mt-1 text-[11px] text-red-500">
                    No tenants exist. Create a tenant in Tenant Management first.
                  </p>
                ) : null}

              </div>

              {/* ROLE */}

              <div>

                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(event) =>
                    handleRoleChange(
                      event.target
                        .value as PlatformUserRole
                    )
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >

                  <option value="Company Admin">
                    Company Admin
                  </option>

                  <option value="HR Manager">
                    HR Manager
                  </option>

                  <option value="Employee">
                    Employee
                  </option>

                  <option value="Super Admin">
                    Super Admin
                  </option>

                </select>

              </div>

              {/* DEPARTMENT */}

              <div>

                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Department
                </label>

                <input
                  type="text"
                  value={department}
                  onChange={(event) =>
                    setDepartment(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Human Resources"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* 2FA */}

              <div className="rounded-lg border border-purple-100 bg-purple-50 px-3 py-2.5">

                <div className="flex items-center gap-2.5">

                  <Shield
                    size={16}
                    className="shrink-0 text-purple-600"
                  />

                  <div>

                    <p className="text-xs font-medium text-purple-900">
                      2FA enabled by default
                    </p>

                    <p className="mt-0.5 text-[11px] text-purple-700">
                      Two-factor authentication will be enabled for this user.
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setAddModalOpen(false)
                  }
                  disabled={isSaving}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    isLoadingCompanies ||
                    (role !== "Super Admin" &&
                      companyOptions.length === 0)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isSaving && (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  )}

                  {isSaving
                    ? "Creating..."
                    : "Create User"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default UsersView;