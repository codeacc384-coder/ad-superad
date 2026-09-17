import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  MoreVertical,
  Users,
  Eye,
  Edit3,
  Trash2,
  Download,
  Check,
  X,
  Lock,
  Copy,
  UserPlus,
  Activity,
  Clock,
  ChevronRight,
  Save,
  UserCheck,
  Settings,
  FileText,
  Building2,
  CreditCard,
  Layers,
  LifeBuoy,
  Sliders,
  Puzzle,
} from "lucide-react";

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

interface AssignedUser {
  id: string;
  name: string;
  email: string;
  company: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  avatar: string;
}

interface RoleActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: "permission" | "user" | "role";
}

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  systemRole: boolean;
  createdDate: string;
  updatedDate: string;
  permissions: Permission[];
  assignedUsers: AssignedUser[];
  activities: RoleActivity[];
}

const modules = [
  "Dashboard",
  "Tenant Management",
  "Finance & Billing",
  "Subscriptions & Plans",
  "Platform Users",
  "Platform Analytics",
  "Support Center",
  "Operations & Health",
  "Security Center",
  "Feature Access",
  "Audit Logs",
  "Configuration",
];

const createPermissions = (
  view: boolean,
  create: boolean,
  edit: boolean,
  deletePermission: boolean,
  exportPermission: boolean
): Permission[] =>
  modules.map((module) => ({
    module,
    view,
    create,
    edit,
    delete: deletePermission,
    export: exportPermission,
  }));

const superAdminUsers: AssignedUser[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex.morgan@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Today, 10:42 AM",
    status: "Active",
    avatar: "AM",
  },
  {
    id: "u2",
    name: "Sarah Williams",
    email: "sarah.williams@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Yesterday, 4:18 PM",
    status: "Active",
    avatar: "SW",
  },
  {
    id: "u3",
    name: "David Brown",
    email: "david.brown@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "2 days ago",
    status: "Active",
    avatar: "DB",
  },
];

const platformAdminUsers: AssignedUser[] = [
  {
    id: "u4",
    name: "Michael Scott",
    email: "michael.scott@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Today, 9:15 AM",
    status: "Active",
    avatar: "MS",
  },
  {
    id: "u5",
    name: "Emily Johnson",
    email: "emily.johnson@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Today, 8:31 AM",
    status: "Active",
    avatar: "EJ",
  },
];

const supportAdminUsers: AssignedUser[] = [
  {
    id: "u6",
    name: "James Wilson",
    email: "james.wilson@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Today, 11:04 AM",
    status: "Active",
    avatar: "JW",
  },
  {
    id: "u7",
    name: "Olivia Davis",
    email: "olivia.davis@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Yesterday, 3:40 PM",
    status: "Active",
    avatar: "OD",
  },
];

const financeAdminUsers: AssignedUser[] = [
  {
    id: "u8",
    name: "Daniel Miller",
    email: "daniel.miller@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Today, 7:55 AM",
    status: "Active",
    avatar: "DM",
  },
];

const securityAdminUsers: AssignedUser[] = [
  {
    id: "u9",
    name: "Sophia Anderson",
    email: "sophia.anderson@corehr.com",
    company: "CoreHR Platform",
    lastLogin: "Today, 10:02 AM",
    status: "Active",
    avatar: "SA",
  },
];

const hrAdminUsers: AssignedUser[] = [
  {
    id: "u10",
    name: "Robert Taylor",
    email: "robert.taylor@corehr.com",
    company: "Acme Corporation",
    lastLogin: "Today, 9:42 AM",
    status: "Active",
    avatar: "RT",
  },
  {
    id: "u11",
    name: "Emma Thomas",
    email: "emma.thomas@corehr.com",
    company: "Global Solutions",
    lastLogin: "Yesterday, 5:12 PM",
    status: "Active",
    avatar: "ET",
  },
];

const createActivity = (
  roleName: string,
  index: number
): RoleActivity[] => [
  {
    id: `${roleName}-activity-1-${index}`,
    action: "Permission updated",
    description: `${roleName} permissions were reviewed by an administrator.`,
    timestamp: "10 minutes ago",
    type: "permission",
  },
  {
    id: `${roleName}-activity-2-${index}`,
    action: "User assigned",
    description: `A user was assigned to the ${roleName} role.`,
    timestamp: "2 hours ago",
    type: "user",
  },
  {
    id: `${roleName}-activity-3-${index}`,
    action: "Role reviewed",
    description: `${roleName} access configuration was reviewed.`,
    timestamp: "Yesterday",
    type: "role",
  },
];

const initialRoles: Role[] = [
  {
    id: "role-1",
    name: "Super Admin",
    description: "Full access to the entire CoreHR platform.",
    users: 3,
    systemRole: true,
    createdDate: "01 Jan 2026",
    updatedDate: "28 Aug 2026",
    permissions: createPermissions(true, true, true, true, true),
    assignedUsers: superAdminUsers,
    activities: createActivity("Super Admin", 1),
  },
  {
    id: "role-2",
    name: "Platform Admin",
    description:
      "Manage tenants, users, subscriptions and platform operations.",
    users: 6,
    systemRole: true,
    createdDate: "03 Jan 2026",
    updatedDate: "26 Aug 2026",
    permissions: createPermissions(true, true, true, false, true),
    assignedUsers: platformAdminUsers,
    activities: createActivity("Platform Admin", 2),
  },
  {
    id: "role-3",
    name: "Support Admin",
    description: "Manage support tickets and assist platform users.",
    users: 8,
    systemRole: true,
    createdDate: "05 Jan 2026",
    updatedDate: "25 Aug 2026",
    permissions: modules.map((module) => ({
      module,
      view: true,
      create: module === "Support Center",
      edit: module === "Support Center",
      delete: false,
      export: module === "Support Center",
    })),
    assignedUsers: supportAdminUsers,
    activities: createActivity("Support Admin", 3),
  },
  {
    id: "role-4",
    name: "Finance Admin",
    description: "Manage billing, invoices, payments and subscriptions.",
    users: 5,
    systemRole: true,
    createdDate: "08 Jan 2026",
    updatedDate: "23 Aug 2026",
    permissions: modules.map((module) => ({
      module,
      view:
        module === "Dashboard" ||
        module === "Finance & Billing" ||
        module === "Subscriptions & Plans",
      create:
        module === "Finance & Billing" ||
        module === "Subscriptions & Plans",
      edit:
        module === "Finance & Billing" ||
        module === "Subscriptions & Plans",
      delete: false,
      export:
        module === "Finance & Billing" ||
        module === "Subscriptions & Plans",
    })),
    assignedUsers: financeAdminUsers,
    activities: createActivity("Finance Admin", 4),
  },
  {
    id: "role-5",
    name: "Security Admin",
    description:
      "Manage security settings, access controls and audit activities.",
    users: 4,
    systemRole: true,
    createdDate: "10 Jan 2026",
    updatedDate: "22 Aug 2026",
    permissions: modules.map((module) => ({
      module,
      view:
        module === "Dashboard" ||
        module === "Security Center" ||
        module === "Audit Logs" ||
        module === "Platform Users",
      create: false,
      edit:
        module === "Security Center" ||
        module === "Platform Users",
      delete: false,
      export:
        module === "Security Center" ||
        module === "Audit Logs",
    })),
    assignedUsers: securityAdminUsers,
    activities: createActivity("Security Admin", 5),
  },
  {
    id: "role-6",
    name: "HR Admin",
    description: "Manage company users and HR-related platform activities.",
    users: 12,
    systemRole: true,
    createdDate: "12 Jan 2026",
    updatedDate: "20 Aug 2026",
    permissions: modules.map((module) => ({
      module,
      view:
        module === "Dashboard" ||
        module === "Tenant Management" ||
        module === "Platform Users",
      create: module === "Platform Users",
      edit: module === "Platform Users",
      delete: false,
      export: module === "Platform Users",
    })),
    assignedUsers: hrAdminUsers,
    activities: createActivity("HR Admin", 6),
  },
];

const moduleIconMap: Record<string, React.ReactNode> = {
  Dashboard: <ShieldCheck className="w-4 h-4" />,
  "Tenant Management": <Building2 className="w-4 h-4" />,
  "Finance & Billing": <CreditCard className="w-4 h-4" />,
  "Subscriptions & Plans": <Layers className="w-4 h-4" />,
  "Platform Users": <Users className="w-4 h-4" />,
  "Platform Analytics": <Activity className="w-4 h-4" />,
  "Support Center": <LifeBuoy className="w-4 h-4" />,
  "Operations & Health": <Sliders className="w-4 h-4" />,
  "Security Center": <ShieldCheck className="w-4 h-4" />,
  "Feature Access": <Puzzle className="w-4 h-4" />,
  "Audit Logs": <FileText className="w-4 h-4" />,
  Configuration: <Settings className="w-4 h-4" />,
};

export const RolesPermissionsView: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    initialRoles[0].id
  );

  const [activeSection, setActiveSection] = useState<
    "overview" | "permissions" | "users"
  >("overview");

  const [searchTerm, setSearchTerm] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [showCloneModal, setShowCloneModal] =
    useState(false);

  const [openMenu, setOpenMenu] = useState<string | null>(
    null
  );

  const [newRoleName, setNewRoleName] = useState("");

  const [newRoleDescription, setNewRoleDescription] =
    useState("");

  const [cloneRoleName, setCloneRoleName] =
    useState("");

  const [selectedUserIds, setSelectedUserIds] =
    useState<string[]>([]);

  const [saveMessage, setSaveMessage] =
    useState(false);

  const selectedRole =
    roles.find((role) => role.id === selectedRoleId) ||
    roles[0];

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        role.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const totalAssignedUsers = roles.reduce(
    (total, role) => total + role.users,
    0
  );

  const customRoles = roles.filter(
    (role) => !role.systemRole
  ).length;

  const systemRoles = roles.filter(
    (role) => role.systemRole
  ).length;

  const handleSelectRole = (role: Role) => {
    setSelectedRoleId(role.id);
    setActiveSection("overview");
    setOpenMenu(null);
    setSaveMessage(false);
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: newRoleName.trim(),
      description:
        newRoleDescription.trim() ||
        "Custom administrator role created by the platform administrator.",
      users: 0,
      systemRole: false,
      createdDate: "01 Sep 2026",
      updatedDate: "01 Sep 2026",
      permissions: createPermissions(
        true,
        false,
        false,
        false,
        false
      ),
      assignedUsers: [],
      activities: [
        {
          id: `activity-${Date.now()}`,
          action: "Role created",
          description: `${newRoleName.trim()} was created.`,
          timestamp: "Just now",
          type: "role",
        },
      ],
    };

    setRoles((previous) => [...previous, newRole]);
    setSelectedRoleId(newRole.id);

    setNewRoleName("");
    setNewRoleDescription("");

    setShowCreateModal(false);
    setActiveSection("overview");
  };

  const handleDeleteRole = (role: Role) => {
    if (role.systemRole) return;

    const updatedRoles = roles.filter(
      (item) => item.id !== role.id
    );

    setRoles(updatedRoles);

    if (selectedRoleId === role.id) {
      if (updatedRoles.length > 0) {
        setSelectedRoleId(updatedRoles[0].id);
      }
    }

    setOpenMenu(null);
  };

  const handleCloneRole = () => {
    if (!cloneRoleName.trim()) return;

    const clonedRole: Role = {
      ...selectedRole,
      id: `role-${Date.now()}`,
      name: cloneRoleName.trim(),
      description: `Custom role cloned from ${selectedRole.name}.`,
      users: 0,
      systemRole: false,
      createdDate: "01 Sep 2026",
      updatedDate: "01 Sep 2026",
      assignedUsers: [],
      activities: [
        {
          id: `activity-${Date.now()}`,
          action: "Role cloned",
          description: `${cloneRoleName.trim()} was cloned from ${selectedRole.name}.`,
          timestamp: "Just now",
          type: "role",
        },
      ],
    };

    setRoles((previous) => [
      ...previous,
      clonedRole,
    ]);

    setSelectedRoleId(clonedRole.id);

    setCloneRoleName("");
    setShowCloneModal(false);
    setActiveSection("overview");
    setOpenMenu(null);
  };

  const updatePermission = (
    moduleName: string,
    permission: keyof Omit<Permission, "module">
  ) => {
    if (selectedRole.systemRole) return;

    const updatedPermissions =
      selectedRole.permissions.map((item) =>
        item.module === moduleName
          ? {
              ...item,
              [permission]: !item[permission],
            }
          : item
      );

    const updatedRole: Role = {
      ...selectedRole,
      permissions: updatedPermissions,
      updatedDate: "01 Sep 2026",
    };

    setRoles((previous) =>
      previous.map((role) =>
        role.id === updatedRole.id
          ? updatedRole
          : role
      )
    );

    setSaveMessage(false);
  };

  const handleSaveChanges = () => {
    setSaveMessage(true);

    setTimeout(() => {
      setSaveMessage(false);
    }, 2500);
  };

  const handleAssignUsers = () => {
    if (selectedUserIds.length === 0) {
      setShowAssignModal(false);
      return;
    }

    const availableUsers: AssignedUser[] = [
      ...superAdminUsers,
      ...platformAdminUsers,
      ...supportAdminUsers,
      ...financeAdminUsers,
      ...securityAdminUsers,
      ...hrAdminUsers,
    ];

    const usersToAssign = availableUsers.filter(
      (user) =>
        selectedUserIds.includes(user.id) &&
        !selectedRole.assignedUsers.some(
          (assigned) => assigned.id === user.id
        )
    );

    const updatedUsers = [
      ...selectedRole.assignedUsers,
      ...usersToAssign,
    ];

    const updatedRole: Role = {
      ...selectedRole,
      assignedUsers: updatedUsers,
      users: updatedUsers.length,
      activities: [
        {
          id: `activity-${Date.now()}`,
          action: "Users assigned",
          description: `${usersToAssign.length} user(s) were assigned to ${selectedRole.name}.`,
          timestamp: "Just now",
          type: "user",
        },
        ...selectedRole.activities,
      ],
    };

    setRoles((previous) =>
      previous.map((role) =>
        role.id === updatedRole.id
          ? updatedRole
          : role
      )
    );

    setSelectedUserIds([]);
    setShowAssignModal(false);
  };

  const availableUsers: AssignedUser[] = [
    ...superAdminUsers,
    ...platformAdminUsers,
    ...supportAdminUsers,
    ...financeAdminUsers,
    ...securityAdminUsers,
    ...hrAdminUsers,
  ];

  const uniqueAvailableUsers =
    availableUsers.filter(
      (user, index, array) =>
        array.findIndex(
          (item) => item.id === user.id
        ) === index
    );

  const unassignedUsers =
    uniqueAvailableUsers.filter(
      (user) =>
        !selectedRole.assignedUsers.some(
          (assigned) => assigned.id === user.id
        )
    );

  const permissionColumns: {
    key: keyof Omit<Permission, "module">;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "view",
      label: "View",
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    {
      key: "create",
      label: "Create",
      icon: <Plus className="w-3.5 h-3.5" />,
    },
    {
      key: "edit",
      label: "Edit",
      icon: <Edit3 className="w-3.5 h-3.5" />,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="w-3.5 h-3.5" />,
    },
    {
      key: "export",
      label: "Export",
      icon: <Download className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />

            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Access Control
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Roles & Permissions
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage administrator roles, permissions and platform access.
          </p>

        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4B41E1] hover:bg-[#3B33C5] text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <SummaryCard
          label="Total Roles"
          value={roles.length}
          icon={<ShieldCheck className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />

        <SummaryCard
          label="System Roles"
          value={systemRoles}
          icon={<Lock className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />

        <SummaryCard
          label="Custom Roles"
          value={customRoles}
          icon={<Settings className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />

        <SummaryCard
          label="Assigned Users"
          value={totalAssignedUsers}
          icon={<Users className="w-5 h-5 text-violet-600" />}
          iconBg="bg-violet-50"
        />

      </div>

      {/* MAIN ROLE WORKSPACE */}

      <div className="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-6">

        {/* ROLE LIST */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="p-4 border-b border-slate-200">

            <div className="flex items-center justify-between">

              <h2 className="text-sm font-bold text-slate-900">
                Administrator Roles
              </h2>

              <span className="text-[10px] font-semibold text-slate-400">
                {roles.length} roles
              </span>

            </div>

            <div className="relative mt-3">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search roles..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />

            </div>

          </div>

          <div className="p-2 max-h-[620px] overflow-y-auto">

            {filteredRoles.map((role) => {

              const isSelected =
                selectedRole.id === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors mb-1 ${
                    isSelected
                      ? "bg-indigo-50 border border-indigo-100"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <p className="text-xs font-bold text-slate-900 truncate">
                          {role.name}
                        </p>

                        {role.systemRole && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                            SYSTEM
                          </span>
                        )}

                      </div>

                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {role.users} users
                      </p>

                    </div>

                  </div>

                  <div className="relative">

                    <button
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenMenu(
                          openMenu === role.id
                            ? null
                            : role.id
                        );
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenu === role.id && (

                      <div className="absolute right-0 top-9 z-30 w-40 bg-white border border-slate-200 rounded-xl shadow-xl p-1">

                        <button
                          onClick={(event) => {
                            event.stopPropagation();

                            handleSelectRole(role);

                            setActiveSection(
                              "permissions"
                            );

                            setOpenMenu(null);
                          }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Permissions
                        </button>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();

                            handleSelectRole(role);

                            setShowCloneModal(true);

                            setOpenMenu(null);
                          }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Clone Role
                        </button>

                        {!role.systemRole && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();

                              handleDeleteRole(role);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Role
                          </button>
                        )}

                      </div>

                    )}

                  </div>

                </div>
              );
            })}

            {filteredRoles.length === 0 && (
              <div className="py-10 text-center">

                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />

                <p className="text-xs text-slate-500 mt-2">
                  No roles found.
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ROLE DETAILS */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {/* ROLE HEADER */}

          <div className="p-5 border-b border-slate-200">

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

              <div className="flex items-start gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">

                  <ShieldCheck className="w-6 h-6 text-indigo-600" />

                </div>

                <div>

                  <div className="flex items-center gap-2 flex-wrap">

                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedRole.name}
                    </h2>

                    {selectedRole.systemRole && (
                      <span className="text-[9px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
                        SYSTEM ROLE
                      </span>
                    )}

                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {selectedRole.description}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => setShowCloneModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Clone
                </button>

                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#4B41E1] hover:bg-[#3B33C5] rounded-xl"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Assign User
                </button>

              </div>

            </div>

            {/* TABS */}

            <div className="flex items-center gap-1 mt-6 border-b border-slate-100">

              <RoleTab
                active={activeSection === "overview"}
                onClick={() =>
                  setActiveSection("overview")
                }
                icon={<FileText className="w-3.5 h-3.5" />}
                label="Overview"
              />

              <RoleTab
                active={activeSection === "permissions"}
                onClick={() =>
                  setActiveSection("permissions")
                }
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
                label="Permissions"
              />

              <RoleTab
                active={activeSection === "users"}
                onClick={() =>
                  setActiveSection("users")
                }
                icon={<Users className="w-3.5 h-3.5" />}
                label={`Assigned Users (${selectedRole.users})`}
              />

            </div>

          </div>

          {/* OVERVIEW */}

          {activeSection === "overview" && (

            <div className="p-5 space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <InfoBox
                  label="Assigned Users"
                  value={selectedRole.users.toString()}
                  icon={<Users className="w-4 h-4" />}
                />

                <InfoBox
                  label="Created"
                  value={selectedRole.createdDate}
                  icon={<Clock className="w-4 h-4" />}
                />

                <InfoBox
                  label="Last Updated"
                  value={selectedRole.updatedDate}
                  icon={<Activity className="w-4 h-4" />}
                />

              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">

                <div className="p-4 bg-slate-50 border-b border-slate-200">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-sm font-bold text-slate-900">
                        Access Summary
                      </h3>

                      <p className="text-[11px] text-slate-500 mt-1">
                        Current permissions assigned to this role.
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        setActiveSection("permissions")
                      }
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      Manage
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>

                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

                  {permissionColumns.map(
                    (column) => {

                      const count =
                        selectedRole.permissions.filter(
                          (permission) =>
                            permission[column.key]
                        ).length;

                      return (
                        <div
                          key={column.key}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                        >

                          <div className="flex items-center gap-2 text-slate-500">

                            {column.icon}

                            <span className="text-[10px] font-semibold uppercase">
                              {column.label}
                            </span>

                          </div>

                          <p className="text-lg font-bold text-slate-900 mt-2">
                            {count}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            modules
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* RECENT ACTIVITY */}

              <div className="border border-slate-200 rounded-xl overflow-hidden">

                <div className="p-4 border-b border-slate-200">

                  <div className="flex items-center gap-2">

                    <Activity className="w-4 h-4 text-indigo-600" />

                    <h3 className="text-sm font-bold text-slate-900">
                      Recent Role Activity
                    </h3>

                  </div>

                </div>

                <div className="divide-y divide-slate-100">

                  {selectedRole.activities.map(
                    (activity) => (

                      <div
                        key={activity.id}
                        className="p-4 flex items-start gap-3"
                      >

                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">

                          {activity.type ===
                            "permission" && (
                            <ShieldCheck className="w-4 h-4" />
                          )}

                          {activity.type === "user" && (
                            <UserCheck className="w-4 h-4" />
                          )}

                          {activity.type === "role" && (
                            <Settings className="w-4 h-4" />
                          )}

                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center justify-between gap-3">

                            <p className="text-xs font-semibold text-slate-800">
                              {activity.action}
                            </p>

                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {activity.timestamp}
                            </span>

                          </div>

                          <p className="text-[11px] text-slate-500 mt-1">
                            {activity.description}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}

          {/* PERMISSIONS */}

          {activeSection === "permissions" && (

            <div className="p-5">

              {selectedRole.systemRole && (

                <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">

                  <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />

                  <div>

                    <p className="text-xs font-semibold text-amber-800">
                      Protected system role
                    </p>

                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Permissions for system roles are protected and cannot be modified.
                    </p>

                  </div>

                </div>

              )}

              <div className="border border-slate-200 rounded-xl overflow-x-auto">

                <table className="w-full min-w-[760px]">

                  <thead>

                    <tr className="bg-slate-50 border-b border-slate-200">

                      <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Module
                      </th>

                      {permissionColumns.map(
                        (column) => (

                          <th
                            key={column.key}
                            className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500"
                          >

                            <div className="flex flex-col items-center gap-1">

                              {column.icon}

                              <span>
                                {column.label}
                              </span>

                            </div>

                          </th>

                        )
                      )}

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {selectedRole.permissions.map(
                      (permission) => (

                        <tr
                          key={permission.module}
                          className="hover:bg-slate-50/70"
                        >

                          <td className="px-4 py-3">

                            <div className="flex items-center gap-2">

                              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">

                                {moduleIconMap[
                                  permission.module
                                ] || (
                                  <Settings className="w-4 h-4" />
                                )}

                              </div>

                              <span className="text-xs font-semibold text-slate-700">
                                {permission.module}
                              </span>

                            </div>

                          </td>

                          {permissionColumns.map(
                            (column) => (

                              <td
                                key={column.key}
                                className="px-3 py-3 text-center"
                              >

                                <button
                                  disabled={
                                    selectedRole.systemRole
                                  }
                                  onClick={() =>
                                    updatePermission(
                                      permission.module,
                                      column.key
                                    )
                                  }
                                  className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors ${
                                    permission[
                                      column.key
                                    ]
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-slate-100 text-slate-300"
                                  } ${
                                    selectedRole.systemRole
                                      ? "cursor-not-allowed"
                                      : "hover:ring-2 hover:ring-indigo-200 cursor-pointer"
                                  }`}
                                >

                                  {permission[
                                    column.key
                                  ] ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}

                                </button>

                              </td>

                            )
                          )}

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              {!selectedRole.systemRole && (

                <div className="mt-4 flex items-center justify-between gap-4">

                  <p className="text-[11px] text-slate-400">
                    Click the permission controls to enable or disable access.
                  </p>

                  <button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4B41E1] hover:bg-[#3B33C5] text-white rounded-xl text-xs font-semibold"
                  >

                    <Save className="w-3.5 h-3.5" />

                    Save Changes

                  </button>

                </div>

              )}

              {saveMessage && (

                <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
                  Permissions saved successfully.
                </div>

              )}

            </div>

          )}

          {/* ASSIGNED USERS */}

          {activeSection === "users" && (

            <div className="p-5">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h3 className="text-sm font-bold text-slate-900">
                    Assigned Users
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Users currently assigned to {selectedRole.name}.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setShowAssignModal(true)
                  }
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#4B41E1] hover:bg-[#3B33C5] text-white rounded-xl text-xs font-semibold"
                >

                  <UserPlus className="w-3.5 h-3.5" />

                  Assign User

                </button>

              </div>

              {selectedRole.assignedUsers.length ===
              0 ? (

                <div className="border border-dashed border-slate-300 rounded-xl py-12 text-center">

                  <Users className="w-8 h-8 text-slate-300 mx-auto" />

                  <p className="text-xs font-semibold text-slate-600 mt-3">
                    No users assigned
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Assign users to this role to give them access.
                  </p>

                  <button
                    onClick={() =>
                      setShowAssignModal(true)
                    }
                    className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold"
                  >

                    <UserPlus className="w-3.5 h-3.5" />

                    Assign User

                  </button>

                </div>

              ) : (

                <div className="border border-slate-200 rounded-xl overflow-hidden">

                  <div className="divide-y divide-slate-100">

                    {selectedRole.assignedUsers.map(
                      (user) => (

                        <div
                          key={user.id}
                          className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {user.avatar}
                            </div>

                            <div className="min-w-0">

                              <p className="text-xs font-bold text-slate-800">
                                {user.name}
                              </p>

                              <p className="text-[11px] text-slate-500 truncate">
                                {user.email}
                              </p>

                            </div>

                          </div>

                          <div className="hidden md:block text-right">

                            <p className="text-[10px] text-slate-400">
                              Last login
                            </p>

                            <p className="text-[11px] font-medium text-slate-600">
                              {user.lastLogin}
                            </p>

                          </div>

                          <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                            {user.status}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

      {/* CREATE ROLE MODAL */}

      {showCreateModal && (

        <ModalOverlay
          onClose={() => setShowCreateModal(false)}
        >

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">

            <ModalHeader
              title="Create New Role"
              description="Create a custom administrator role."
              onClose={() =>
                setShowCreateModal(false)
              }
            />

            <div className="p-5 space-y-4">

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Role Name
                </label>

                <input
                  value={newRoleName}
                  onChange={(event) =>
                    setNewRoleName(event.target.value)
                  }
                  placeholder="Example: Operations Admin"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>

                <textarea
                  value={newRoleDescription}
                  onChange={(event) =>
                    setNewRoleDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe what this role is responsible for..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />

              </div>

            </div>

            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateRole}
                disabled={!newRoleName.trim()}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#4B41E1] hover:bg-[#3B33C5] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
              >
                Create Role
              </button>

            </div>

          </div>

        </ModalOverlay>

      )}

      {/* ASSIGN USER MODAL */}

      {showAssignModal && (

        <ModalOverlay
          onClose={() => {
            setShowAssignModal(false);
            setSelectedUserIds([]);
          }}
        >

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">

            <ModalHeader
              title="Assign Users"
              description={`Select users to assign to ${selectedRole.name}.`}
              onClose={() => {
                setShowAssignModal(false);
                setSelectedUserIds([]);
              }}
            />

            <div className="p-5">

              {unassignedUsers.length === 0 ? (

                <div className="py-8 text-center">

                  <UserCheck className="w-8 h-8 text-emerald-500 mx-auto" />

                  <p className="text-xs font-semibold text-slate-700 mt-3">
                    All available users are assigned
                  </p>

                </div>

              ) : (

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">

                  {unassignedUsers.map(
                    (user) => {

                      const checked =
                        selectedUserIds.includes(
                          user.id
                        );

                      return (
                        <label
                          key={user.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer border-b border-slate-100 last:border-b-0 ${
                            checked
                              ? "bg-indigo-50"
                              : "hover:bg-slate-50"
                          }`}
                        >

                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {

                              setSelectedUserIds(
                                (previous) =>
                                  previous.includes(
                                    user.id
                                  )
                                    ? previous.filter(
                                        (id) =>
                                          id !==
                                          user.id
                                      )
                                    : [
                                        ...previous,
                                        user.id,
                                      ]
                              );

                            }}
                            className="w-4 h-4 accent-indigo-600"
                          />

                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[9px] font-bold">
                            {user.avatar}
                          </div>

                          <div className="flex-1 min-w-0">

                            <p className="text-xs font-semibold text-slate-800">
                              {user.name}
                            </p>

                            <p className="text-[10px] text-slate-500 truncate">
                              {user.email}
                            </p>

                          </div>

                        </label>
                      );

                    }
                  )}

                </div>

              )}

            </div>

            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedUserIds([]);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleAssignUsers}
                disabled={
                  selectedUserIds.length === 0
                }
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#4B41E1] hover:bg-[#3B33C5] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
              >
                Assign{" "}
                {selectedUserIds.length > 0
                  ? `(${selectedUserIds.length})`
                  : ""}
              </button>

            </div>

          </div>

        </ModalOverlay>

      )}

      {/* CLONE ROLE MODAL */}

      {showCloneModal && (

        <ModalOverlay
          onClose={() => setShowCloneModal(false)}
        >

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">

            <ModalHeader
              title="Clone Role"
              description={`Create a new role based on ${selectedRole.name}.`}
              onClose={() =>
                setShowCloneModal(false)
              }
            />

            <div className="p-5 space-y-4">

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">

                <p className="text-[10px] uppercase font-bold text-indigo-500">
                  Original Role
                </p>

                <p className="text-sm font-bold text-slate-800 mt-1">
                  {selectedRole.name}
                </p>

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Role Name
                </label>

                <input
                  value={cloneRoleName}
                  onChange={(event) =>
                    setCloneRoleName(
                      event.target.value
                    )
                  }
                  placeholder="Example: Operations Admin"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />

              </div>

              <p className="text-[11px] text-slate-400">
                The new role will inherit the same permissions but will not inherit assigned users.
              </p>

            </div>

            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowCloneModal(false)
                }
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleCloneRole}
                disabled={!cloneRoleName.trim()}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#4B41E1] hover:bg-[#3B33C5] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
              >
                Clone Role
              </button>

            </div>

          </div>

        </ModalOverlay>

      )}

    </div>
  );
};

/* SUMMARY CARD */

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  icon,
  iconBg,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {value}
          </p>

        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

/* ROLE TAB */

interface RoleTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const RoleTab: React.FC<RoleTabProps> = ({
  active,
  onClick,
  icon,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
        active
          ? "text-indigo-600 border-indigo-600"
          : "text-slate-500 border-transparent hover:text-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

/* INFO BOX */

interface InfoBoxProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">

      <div className="flex items-center gap-2 text-slate-400">

        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>

      </div>

      <p className="text-sm font-bold text-slate-800 mt-2">
        {value}
      </p>

    </div>
  );
};

/* MODAL OVERLAY */

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  children,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full flex justify-center">
        {children}
      </div>

    </div>
  );
};

/* MODAL HEADER */

interface ModalHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <div className="p-5 border-b border-slate-200 flex items-center justify-between">

      <div>

        <h3 className="text-base font-bold text-slate-900">
          {title}
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>

      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
      >
        <X className="w-5 h-5" />
      </button>

    </div>
  );
};
