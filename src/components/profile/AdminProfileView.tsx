
import React, { useRef, useState } from 'react';
import { useApp } from '../../context/useApp';

import {
  User,
  Mail,
  ShieldCheck,
  Building2,
  Phone,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  KeyRound,
  Smartphone,
  Activity,
  LogIn,
  Settings,
  Pencil,
  ArrowLeft,
  Save,
  X,
  Eye,
  EyeOff,
  Monitor,
  Globe,
  MapPin,
  CalendarDays,
  AlertTriangle,
  Trash2,
  Laptop,
  Tablet,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';

type ProfileSection =
  | 'overview'
  | 'edit-profile'
  | 'login-activity'
  | 'password'
  | 'devices';

interface AdminProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  status: string;
  lastLogin: string;
  profileImage: string;
}

interface LoginRecord {
  id: number;
  device: string;
  browser: string;
  location: string;
  ip: string;
  date: string;
  status: 'Successful' | 'Failed';
  current?: boolean;
}

interface DeviceRecord {
  id: number;
  name: string;
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

export const AdminProfileView: React.FC = () => {
  const { setActiveTab, addToast } = useApp();

  const [activeSection, setActiveSection] =
    useState<ProfileSection>('overview');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ============================================================
     DEFAULT PROFILE IMAGE
     ============================================================ */

  const defaultProfileImage =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=85';

  /* ============================================================
     ADMIN PROFILE DATA
     ============================================================ */

  const [admin, setAdmin] = useState<AdminProfile>({
    name: 'Admin User',
    email: 'admin@corehr.com',
    role: 'HRMS Super Admin',
    department: 'Platform Administration',
    phone: '+91 98765 43210',
    status: 'Active',
    lastLogin: 'Today, 09:42 AM',
    profileImage: defaultProfileImage,
  });

  /* ============================================================
     EDIT PROFILE STATE
     ============================================================ */

  const [editForm, setEditForm] = useState<AdminProfile>(admin);

  const handleEditProfile = () => {
    setEditForm(admin);
    setActiveSection('edit-profile');
  };

  const handleProfileChange = (
    field: keyof AdminProfile,
    value: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ============================================================
     PROFILE IMAGE UPLOAD
     ============================================================ */

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast(
        'Invalid Image',
        'Please select a valid image file.',
        'warning'
      );

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      addToast(
        'Image Too Large',
        'Profile image must be smaller than 5 MB.',
        'warning'
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        setEditForm((prev) => ({
          ...prev,
          profileImage: result,
        }));

        addToast(
          'Image Selected',
          'Your new profile image is ready to be saved.',
          'success'
        );
      }
    };

    reader.readAsDataURL(file);

    event.target.value = '';
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setEditForm((prev) => ({
      ...prev,
      profileImage: '',
    }));

    addToast(
      'Profile Image Removed',
      'The profile image will be removed when you save the changes.',
      'info'
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editForm.name.trim()) {
      addToast(
        'Profile Update Failed',
        'Admin name cannot be empty.',
        'warning'
      );
      return;
    }

    if (!editForm.email.trim()) {
      addToast(
        'Profile Update Failed',
        'Email address cannot be empty.',
        'warning'
      );
      return;
    }

    if (!editForm.phone.trim()) {
      addToast(
        'Profile Update Failed',
        'Phone number cannot be empty.',
        'warning'
      );
      return;
    }

    if (!editForm.department.trim()) {
      addToast(
        'Profile Update Failed',
        'Department cannot be empty.',
        'warning'
      );
      return;
    }

    setAdmin({
      ...editForm,
      status: 'Active',
      role: admin.role,
    });

    addToast(
      'Profile Updated',
      'Your administrator profile details have been successfully updated.',
      'success'
    );

    setActiveSection('overview');
  };

  const handleCancelEdit = () => {
    setEditForm(admin);
    setActiveSection('overview');
  };

  /* ============================================================
     PASSWORD STATE
     ============================================================ */

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      addToast(
        'Password Update Failed',
        'Please enter your current password.',
        'warning'
      );
      return;
    }

    if (!newPassword) {
      addToast(
        'Password Update Failed',
        'Please enter a new password.',
        'warning'
      );
      return;
    }

    if (newPassword.length < 8) {
      addToast(
        'Password Update Failed',
        'New password must contain at least 8 characters.',
        'warning'
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      addToast(
        'Password Update Failed',
        'New password must contain at least one uppercase letter.',
        'warning'
      );
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      addToast(
        'Password Update Failed',
        'New password must contain at least one number.',
        'warning'
      );
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      addToast(
        'Password Update Failed',
        'New password must contain at least one special character.',
        'warning'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast(
        'Password Update Failed',
        'New password and confirmation password do not match.',
        'warning'
      );
      return;
    }

    if (currentPassword === newPassword) {
      addToast(
        'Password Update Failed',
        'New password must be different from the current password.',
        'warning'
      );
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    addToast(
      'Password Updated',
      'Your administrator password has been successfully updated.',
      'success'
    );

    setActiveSection('overview');
  };

  /* ============================================================
     LOGIN ACTIVITY
     ============================================================ */

  const loginActivity: LoginRecord[] = [
    {
      id: 1,
      device: 'Windows Desktop',
      browser: 'Chrome 140',
      location: 'Hyderabad, India',
      ip: '192.168.1.24',
      date: 'Today, 09:42 AM',
      status: 'Successful',
      current: true,
    },
    {
      id: 2,
      device: 'Windows Laptop',
      browser: 'Microsoft Edge 140',
      location: 'Hyderabad, India',
      ip: '192.168.1.18',
      date: 'Yesterday, 06:31 PM',
      status: 'Successful',
    },
    {
      id: 3,
      device: 'Android Phone',
      browser: 'Chrome Mobile',
      location: 'Hyderabad, India',
      ip: '192.168.1.42',
      date: 'Sep 05, 2026, 08:17 AM',
      status: 'Successful',
    },
    {
      id: 4,
      device: 'Unknown Device',
      browser: 'Unknown Browser',
      location: 'Unknown',
      ip: '203.0.113.77',
      date: 'Sep 04, 2026, 11:23 PM',
      status: 'Failed',
    },
    {
      id: 5,
      device: 'Windows Desktop',
      browser: 'Chrome 140',
      location: 'Hyderabad, India',
      ip: '192.168.1.24',
      date: 'Sep 03, 2026, 09:14 AM',
      status: 'Successful',
    },
  ];

  /* ============================================================
     DEVICES
     ============================================================ */

  const [devices, setDevices] = useState<DeviceRecord[]>([
    {
      id: 1,
      name: 'Office Windows Desktop',
      type: 'desktop',
      browser: 'Chrome 140',
      location: 'Hyderabad, India',
      ip: '192.168.1.24',
      lastActive: 'Active now',
      current: true,
    },
    {
      id: 2,
      name: 'Work Windows Laptop',
      type: 'laptop',
      browser: 'Microsoft Edge 140',
      location: 'Hyderabad, India',
      ip: '192.168.1.18',
      lastActive: 'Yesterday, 06:31 PM',
      current: false,
    },
    {
      id: 3,
      name: 'Admin Mobile',
      type: 'mobile',
      browser: 'Chrome Mobile',
      location: 'Hyderabad, India',
      ip: '192.168.1.42',
      lastActive: 'Sep 05, 08:17 AM',
      current: false,
    },
  ]);

  const getDeviceIcon = (type: DeviceRecord['type']) => {
    if (type === 'desktop') {
      return <Monitor className="w-5 h-5" />;
    }

    if (type === 'laptop') {
      return <Laptop className="w-5 h-5" />;
    }

    if (type === 'tablet') {
      return <Tablet className="w-5 h-5" />;
    }

    return <Smartphone className="w-5 h-5" />;
  };

  const handleRevokeDevice = (device: DeviceRecord) => {
    if (device.current) {
      addToast(
        'Action Not Allowed',
        'The current device cannot be revoked from this session.',
        'warning'
      );
      return;
    }

    setDevices((prev) =>
      prev.filter((item) => item.id !== device.id)
    );

    addToast(
      'Device Revoked',
      `${device.name} has been removed from your trusted devices.`,
      'success'
    );
  };

  const handleRevokeAllOtherDevices = () => {
    const otherDevices = devices.filter(
      (device) => !device.current
    );

    if (otherDevices.length === 0) {
      addToast(
        'No Devices to Revoke',
        'There are no other active devices associated with this account.',
        'info'
      );
      return;
    }

    setDevices((prev) =>
      prev.filter((device) => device.current)
    );

    addToast(
      'Devices Revoked',
      'All other active sessions have been revoked.',
      'success'
    );
  };

  /* ============================================================
     NAVIGATION
     ============================================================ */

  const goBackToProfile = () => {
    setActiveSection('overview');
  };

  /* ============================================================
     SECTION HEADER
     ============================================================ */

  const renderSectionHeader = (
    title: string,
    description: string,
    icon: React.ReactNode
  ) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={goBackToProfile}
          className="
            w-9 h-9 rounded-xl border border-slate-200
            bg-white text-slate-600
            hover:bg-slate-50 hover:text-indigo-600
            transition-colors flex items-center justify-center
          "
          title="Back to Admin Profile"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div
          className="
            w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600
            flex items-center justify-center shrink-0
          "
        >
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  /* ============================================================
     EDIT PROFILE VIEW
     ============================================================ */

  const renderEditProfile = () => (
    <div className="space-y-6 animate-in fade-in duration-200">
      {renderSectionHeader(
        'Edit Admin Profile',
        'Update your personal information and profile photo.',
        <Pencil className="w-5 h-5" />
      )}

      <form onSubmit={handleSaveProfile}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

          {/* PROFILE IMAGE SECTION */}

          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              <div className="relative">
                <div
                  className="
                    w-28 h-28 rounded-2xl overflow-hidden
                    border-4 border-white shadow-lg
                    bg-slate-100
                    flex items-center justify-center
                  "
                >
                  {editForm.profileImage ? (
                    <img
                      src={editForm.profileImage}
                      alt={editForm.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleChooseImage}
                  className="
                    absolute -bottom-2 -right-2
                    w-9 h-9 rounded-full
                    bg-[#4F46E5] hover:bg-[#4338CA]
                    text-white shadow-md
                    flex items-center justify-center
                    transition-colors
                  "
                  title="Change profile image"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Profile Photo
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 max-w-md">
                  Upload a professional profile image. JPG, PNG, WEBP
                  and other standard image formats are supported.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">

                  <button
                    type="button"
                    onClick={handleChooseImage}
                    className="
                      px-3 py-2 rounded-lg
                      bg-indigo-50 text-indigo-700
                      border border-indigo-100
                      text-xs font-bold
                      hover:bg-indigo-100
                      transition-colors
                      flex items-center gap-1.5
                    "
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>

                  {editForm.profileImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="
                        px-3 py-2 rounded-lg
                        bg-rose-50 text-rose-700
                        border border-rose-100
                        text-xs font-bold
                        hover:bg-rose-100
                        transition-colors
                        flex items-center gap-1.5
                      "
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 mt-3">
                  Maximum file size: 5 MB
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* PERSONAL INFORMATION */}

          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">
              Personal Information
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Update the information associated with your administrator
              account.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            <FormField
              label="Full Name"
              icon={<User className="w-4 h-4" />}
              value={editForm.name}
              onChange={(value) =>
                handleProfileChange('name', value)
              }
              placeholder="Enter full name"
            />

            <FormField
              label="Email Address"
              icon={<Mail className="w-4 h-4" />}
              value={editForm.email}
              onChange={(value) =>
                handleProfileChange('email', value)
              }
              placeholder="Enter email address"
              type="email"
            />

            <FormField
              label="Phone Number"
              icon={<Phone className="w-4 h-4" />}
              value={editForm.phone}
              onChange={(value) =>
                handleProfileChange('phone', value)
              }
              placeholder="Enter phone number"
            />

            <FormField
              label="Department"
              icon={<Building2 className="w-4 h-4" />}
              value={editForm.department}
              onChange={(value) =>
                handleProfileChange('department', value)
              }
              placeholder="Enter department"
            />

            {/* ROLE */}

            <div>
              <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-400 mb-2">
                Role
              </label>

              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  value={admin.role}
                  disabled
                  className="
                    w-full pl-10 pr-3 py-2.5
                    rounded-xl border border-slate-200
                    bg-slate-100 text-xs font-semibold
                    text-slate-500 cursor-not-allowed
                  "
                />
              </div>

              <p className="text-[10px] text-slate-400 mt-1.5">
                Administrator role can only be changed by a
                higher-level platform administrator.
              </p>
            </div>

            {/* ACCOUNT STATUS */}

            <div>
              <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-400 mb-2">
                Account Status
              </label>

              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                <span className="text-xs font-bold text-emerald-700">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}

          <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row justify-end gap-2">

            <button
              type="button"
              onClick={handleCancelEdit}
              className="
                px-4 py-2.5 rounded-xl
                border border-slate-200 bg-white
                text-xs font-bold text-slate-700
                hover:bg-slate-50 transition-colors
                flex items-center justify-center gap-2
              "
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-4 py-2.5 rounded-xl
                bg-[#4F46E5] hover:bg-[#4338CA]
                text-white text-xs font-bold
                shadow-sm transition-colors
                flex items-center justify-center gap-2
              "
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* SECURITY NOTICE */}

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />

          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Account Security
            </h4>

            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Changes to your email address or phone number may require
              additional account verification in a production environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ============================================================
     LOGIN ACTIVITY VIEW
     ============================================================ */

  const renderLoginActivity = () => (
    <div className="space-y-6 animate-in fade-in duration-200">

      {renderSectionHeader(
        'Login Activity',
        'Review recent administrator account access and authentication events.',
        <Activity className="w-5 h-5" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <SummaryCard
          icon={<LogIn className="w-5 h-5" />}
          label="Successful Logins"
          value="24"
          description="Last 30 days"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Failed Attempts"
          value="1"
          description="Last 30 days"
          iconClass="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          icon={<Globe className="w-5 h-5" />}
          label="Known Locations"
          value="2"
          description="Trusted locations"
          iconClass="bg-indigo-50 text-indigo-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Recent Login History
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Recent successful and unsuccessful account access attempts.
            </p>
          </div>

          <button
            onClick={() =>
              addToast(
                'Activity Refreshed',
                'Latest login activity has been loaded.',
                'success'
              )
            }
            className="
              px-3 py-2 rounded-lg
              border border-slate-200 bg-white
              text-xs font-bold text-slate-700
              hover:bg-slate-50
              flex items-center gap-1.5
              transition-colors
            "
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="divide-y divide-slate-100">

          {loginActivity.map((login) => (
            <div
              key={login.id}
              className="p-5 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      login.status === 'Successful'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {login.status === 'Successful' ? (
                      <LogIn className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h4 className="text-xs font-bold text-slate-900">
                        {login.device}
                      </h4>

                      {login.current && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                          Current Session
                        </span>
                      )}

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          login.status === 'Successful'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {login.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {login.browser}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:min-w-[520px]">

                  <ActivityDetail
                    icon={<MapPin className="w-3.5 h-3.5" />}
                    label="Location"
                    value={login.location}
                  />

                  <ActivityDetail
                    icon={<Globe className="w-3.5 h-3.5" />}
                    label="IP Address"
                    value={login.ip}
                  />

                  <ActivityDetail
                    icon={<CalendarDays className="w-3.5 h-3.5" />}
                    label="Date & Time"
                    value={login.date}
                  />

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 text-white">

        <div className="flex items-start gap-3">

          <ShieldCheck className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />

          <div>
            <h4 className="text-xs font-bold">
              Security Monitoring
            </h4>

            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Login activity is monitored to identify unusual access
              patterns, failed authentication attempts, and potentially
              unauthorized account access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ============================================================
     PASSWORD VIEW
     ============================================================ */

  const renderPasswordView = () => (
    <div className="space-y-6 animate-in fade-in duration-200">

      {renderSectionHeader(
        'Update Password',
        'Change your administrator account password and maintain account security.',
        <KeyRound className="w-5 h-5" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <form
          onSubmit={handleUpdatePassword}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
        >

          <div className="p-5 border-b border-slate-100">

            <h3 className="text-sm font-extrabold text-slate-900">
              Change Password
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Enter your current password and choose a new secure password.
            </p>
          </div>

          <div className="p-6 space-y-5">

            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrentPassword}
              onToggle={() =>
                setShowCurrentPassword((prev) => !prev)
              }
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNewPassword}
              onToggle={() =>
                setShowNewPassword((prev) => !prev)
              }
              placeholder="Enter new password"
            />

            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              placeholder="Confirm new password"
            />

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

              <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400 mb-2">
                Password Requirements
              </p>

              <div className="space-y-1.5">

                <PasswordRequirement
                  valid={newPassword.length >= 8}
                  text="At least 8 characters"
                />

                <PasswordRequirement
                  valid={/[A-Z]/.test(newPassword)}
                  text="At least one uppercase letter"
                />

                <PasswordRequirement
                  valid={/[0-9]/.test(newPassword)}
                  text="At least one number"
                />

                <PasswordRequirement
                  valid={/[^A-Za-z0-9]/.test(newPassword)}
                  text="At least one special character"
                />

              </div>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex justify-end gap-2">

            <button
              type="button"
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setActiveSection('overview');
              }}
              className="
                px-4 py-2.5 rounded-xl
                border border-slate-200 bg-white
                text-xs font-bold text-slate-700
                hover:bg-slate-50 transition-colors
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-4 py-2.5 rounded-xl
                bg-[#4F46E5] hover:bg-[#4338CA]
                text-white text-xs font-bold
                shadow-sm transition-colors
                flex items-center gap-2
              "
            >
              <KeyRound className="w-3.5 h-3.5" />
              Update Password
            </button>
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 h-fit">

          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h3 className="text-sm font-bold text-slate-900">
            Password Security
          </h3>

          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            A strong administrator password helps protect your platform
            configuration, tenant data, billing information, and security
            controls.
          </p>

          <div className="mt-5 pt-4 border-t border-slate-100">

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Last password change
              </span>

              <span className="font-bold text-slate-900">
                24 days ago
              </span>
            </div>

            <div className="flex items-center justify-between text-xs mt-3">
              <span className="text-slate-500">
                Two-factor authentication
              </span>

              <span className="font-bold text-emerald-600">
                Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ============================================================
     MANAGE DEVICES VIEW
     ============================================================ */

  const renderDevicesView = () => (
    <div className="space-y-6 animate-in fade-in duration-200">

      {renderSectionHeader(
        'Manage Devices',
        'Review and manage devices currently associated with your administrator account.',
        <Smartphone className="w-5 h-5" />
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Trusted Devices
              </h3>

              <p className="text-[11px] text-slate-500 mt-1">
                {devices.length} device
                {devices.length !== 1 ? 's' : ''} currently associated
                with this account.
              </p>
            </div>
          </div>

          <button
            onClick={handleRevokeAllOtherDevices}
            className="
              px-3 py-2 rounded-lg
              border border-rose-200
              bg-rose-50 text-rose-700
              text-xs font-bold
              hover:bg-rose-100
              transition-colors
              flex items-center gap-1.5
            "
          >
            <Trash2 className="w-3.5 h-3.5" />
            Revoke Other Devices
          </button>
        </div>
      </div>

      <div className="space-y-3">

        {devices.map((device) => (
          <div
            key={device.id}
            className="
              bg-white rounded-2xl
              border border-slate-200
              shadow-xs p-5
              hover:border-indigo-200
              transition-colors
            "
          >

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

              <div className="flex items-start gap-4">

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    device.current
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-50 text-slate-500'
                  }`}
                >
                  {getDeviceIcon(device.type)}
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-sm font-bold text-slate-900">
                      {device.name}
                    </h3>

                    {device.current && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Current Device
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    {device.browser}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:min-w-[520px]">

                <DeviceDetail
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Location"
                  value={device.location}
                />

                <DeviceDetail
                  icon={<Globe className="w-3.5 h-3.5" />}
                  label="IP Address"
                  value={device.ip}
                />

                <DeviceDetail
                  icon={<Clock3 className="w-3.5 h-3.5" />}
                  label="Last Active"
                  value={device.lastActive}
                />

              </div>

              <button
                onClick={() => handleRevokeDevice(device)}
                disabled={device.current}
                className={`
                  px-3 py-2 rounded-lg
                  text-xs font-bold
                  flex items-center justify-center gap-1.5
                  transition-colors
                  ${
                    device.current
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }
                `}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Revoke
              </button>

            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <Smartphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <h3 className="text-sm font-bold text-slate-900">
              No trusted devices
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              No additional devices are currently associated with this
              administrator account.
            </p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">

        <div className="flex items-start gap-3">

          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Device Security
            </h4>

            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              If you don't recognize a device or location, revoke its
              access immediately and update your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ============================================================
     MAIN PROFILE VIEW
     ============================================================ */

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* PAGE HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Admin Profile
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Manage your administrator identity, account information,
            profile image, and security settings.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={handleEditProfile}
            className="
              inline-flex items-center justify-center gap-2
              px-4 py-2 rounded-xl
              bg-[#4F46E5] hover:bg-[#4338CA]
              text-white text-xs font-bold
              shadow-sm transition-colors
            "
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="
              inline-flex items-center justify-center gap-2
              px-4 py-2 rounded-xl
              bg-white border border-slate-200
              text-xs font-bold text-slate-700
              hover:bg-slate-50
              hover:border-slate-300
              transition-colors
            "
          >
            <Settings className="w-4 h-4" />
            Platform Settings
          </button>

        </div>
      </div>

      {/* PROFILE HERO */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        <div
          className="
            h-28
            bg-gradient-to-r
            from-[#4F46E5]
            via-[#6366F1]
            to-[#7C3AED]
          "
        />

        <div className="px-6 pb-6">

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">

            {/* AVATAR */}

            <div className="relative shrink-0">

              <div
                className="
                  w-24 h-24
                  rounded-2xl
                  overflow-hidden
                  border-4 border-white
                  shadow-lg
                  bg-slate-100
                  flex items-center justify-center
                "
              >
                {admin.profileImage ? (
                  <img
                    src={admin.profileImage}
                    alt={admin.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-300" />
                )}
              </div>

              {/* IMAGE EDIT BUTTON */}

              <button
                onClick={handleEditProfile}
                className="
                  absolute -bottom-2 -right-2
                  w-8 h-8 rounded-full
                  bg-white
                  border border-slate-200
                  shadow-md
                  text-indigo-600
                  hover:bg-indigo-50
                  transition-colors
                  flex items-center justify-center
                "
                title="Edit profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* NAME */}

            <div className="flex-1 pb-1">

              <div className="flex flex-wrap items-center gap-2">

                <h3 className="text-lg font-extrabold text-slate-900">
                  {admin.name}
                </h3>

                <span
                  className="
                    inline-flex items-center gap-1
                    px-2 py-1 rounded-full
                    bg-emerald-50 text-emerald-700
                    border border-emerald-200
                    text-[10px] font-bold
                  "
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {admin.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {admin.role}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                {admin.department}
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* ACCOUNT DETAILS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PERSONAL / PROFESSIONAL */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

          <div className="p-5 border-b border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Account Details
                </h3>

                <p className="text-[11px] text-slate-500">
                  Administrator identity and contact information
                </p>
              </div>
            </div>

            <button
              onClick={handleEditProfile}
              className="
                text-[11px] font-bold
                text-indigo-600
                hover:text-indigo-700
                flex items-center gap-1
              "
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          </div>

          <div className="p-5 space-y-1">

            <ProfileRow
              icon={<User className="w-4 h-4" />}
              label="Admin Name"
              value={admin.name}
            />

            <ProfileRow
              icon={<Mail className="w-4 h-4" />}
              label="Email Address"
              value={admin.email}
            />

            <ProfileRow
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Role"
              value={admin.role}
            />

            <ProfileRow
              icon={<Building2 className="w-4 h-4" />}
              label="Department"
              value={admin.department}
            />

            <ProfileRow
              icon={<Phone className="w-4 h-4" />}
              label="Phone Number"
              value={admin.phone}
            />

            <ProfileRow
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Account Status"
              value={admin.status}
              valueClass="text-emerald-600"
            />

          </div>
        </div>

        {/* SECURITY */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

          <div className="p-5 border-b border-slate-100">

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <LockKeyhole className="w-4 h-4" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Security & Account
                </h3>

                <p className="text-[11px] text-slate-500">
                  Security status and recent account activity
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-1">

            <ProfileRow
              icon={<LogIn className="w-4 h-4" />}
              label="Last Login"
              value={admin.lastLogin}
            />

            <ProfileRow
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Two-Factor Authentication"
              value="Enabled"
              valueClass="text-emerald-600"
            />

            <ProfileRow
              icon={<KeyRound className="w-4 h-4" />}
              label="Password"
              value="Last changed 24 days ago"
            />

            <ProfileRow
              icon={<Smartphone className="w-4 h-4" />}
              label="Trusted Devices"
              value={`${devices.length} active device${
                devices.length !== 1 ? 's' : ''
              }`}
            />

            <ProfileRow
              icon={<Activity className="w-4 h-4" />}
              label="Account Activity"
              value="Normal"
              valueClass="text-emerald-600"
            />

            <ProfileRow
              icon={<Clock3 className="w-4 h-4" />}
              label="Session Timeout"
              value="30 minutes"
            />

          </div>
        </div>
      </div>

      {/* SECURITY ACTIONS */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">

        <div className="flex items-center gap-2 mb-5">

          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Account Security
            </h3>

            <p className="text-[11px] text-slate-500">
              Manage your administrator account and security activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* UPDATE PASSWORD */}

          <button
            onClick={() => setActiveSection('password')}
            className="
              p-4 rounded-xl
              border border-slate-200
              text-left
              hover:border-indigo-300
              hover:bg-indigo-50/40
              hover:-translate-y-0.5
              transition-all
            "
          >
            <KeyRound className="w-4 h-4 text-indigo-600 mb-2" />

            <p className="text-xs font-bold text-slate-900">
              Update Password
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Update your administrator password.
            </p>

            <div className="mt-3 text-[10px] font-bold text-indigo-600">
              Open Password Settings →
            </div>
          </button>

          {/* MANAGE DEVICES */}

          <button
            onClick={() => setActiveSection('devices')}
            className="
              p-4 rounded-xl
              border border-slate-200
              text-left
              hover:border-indigo-300
              hover:bg-indigo-50/40
              hover:-translate-y-0.5
              transition-all
            "
          >
            <Smartphone className="w-4 h-4 text-indigo-600 mb-2" />

            <p className="text-xs font-bold text-slate-900">
              Manage Devices
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Review devices signed into this account.
            </p>

            <div className="mt-3 text-[10px] font-bold text-indigo-600">
              View {devices.length} Device
              {devices.length !== 1 ? 's' : ''} →
            </div>
          </button>

          {/* LOGIN ACTIVITY */}

          <button
            onClick={() => setActiveSection('login-activity')}
            className="
              p-4 rounded-xl
              border border-slate-200
              text-left
              hover:border-indigo-300
              hover:bg-indigo-50/40
              hover:-translate-y-0.5
              transition-all
            "
          >
            <Activity className="w-4 h-4 text-indigo-600 mb-2" />

            <p className="text-xs font-bold text-slate-900">
              Login Activity
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Review recent account access activity.
            </p>

            <div className="mt-3 text-[10px] font-bold text-indigo-600">
              View Activity →
            </div>
          </button>

        </div>
      </div>

      {/* SECURITY STATUS */}

      <div className="bg-slate-900 rounded-2xl p-5 text-white">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-indigo-300" />
            </div>

            <div>
              <h3 className="text-xs font-bold">
                Administrator Account Protected
              </h3>

              <p className="text-[11px] text-slate-400 mt-1">
                Two-factor authentication is enabled and your account
                currently has normal security activity.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveSection('login-activity')}
            className="
              shrink-0 px-4 py-2 rounded-xl
              bg-white text-slate-900
              text-xs font-bold
              hover:bg-slate-100
              transition-colors
            "
          >
            Review Activity
          </button>

        </div>
      </div>
    </div>
  );

  /* ============================================================
     MAIN RENDER
     ============================================================ */

  if (activeSection === 'edit-profile') {
    return renderEditProfile();
  }

  if (activeSection === 'login-activity') {
    return renderLoginActivity();
  }

  if (activeSection === 'password') {
    return renderPasswordView();
  }

  if (activeSection === 'devices') {
    return renderDevicesView();
  }

  return renderOverview();
};

/* ============================================================
   PROFILE ROW
   ============================================================ */

interface ProfileRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}

const ProfileRow: React.FC<ProfileRowProps> = ({
  icon,
  label,
  value,
  valueClass = 'text-slate-900',
}) => {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">

      <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="flex-1 min-w-0">

        <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
          {label}
        </p>

        <p
          className={`text-xs font-semibold mt-0.5 truncate ${valueClass}`}
        >
          {value}
        </p>

      </div>
    </div>
  );
};

/* ============================================================
   FORM FIELD
   ============================================================ */

interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => {
  return (
    <div>

      <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-400 mb-2">
        {label}
      </label>

      <div className="relative">

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-3 py-2.5
            rounded-xl border border-slate-200
            bg-white text-xs font-semibold
            text-slate-800 outline-none
            focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-300
            transition-all
          "
        />
      </div>
    </div>
  );
};

/* ============================================================
   PASSWORD FIELD
   ============================================================ */

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}) => {
  return (
    <div>

      <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-400 mb-2">
        {label}
      </label>

      <div className="relative">

        <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-11 py-2.5
            rounded-xl border border-slate-200
            bg-white text-xs font-semibold
            text-slate-800 outline-none
            focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-300
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute right-3 top-1/2
            -translate-y-1/2
            text-slate-400
            hover:text-slate-700
          "
          title={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   PASSWORD REQUIREMENT
   ============================================================ */

interface PasswordRequirementProps {
  valid: boolean;
  text: string;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({
  valid,
  text,
}) => {
  return (
    <div className="flex items-center gap-2">

      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          valid
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-slate-200 text-slate-400'
        }`}
      >
        <CheckCircle2 className="w-2.5 h-2.5" />
      </div>

      <span
        className={`text-[11px] ${
          valid
            ? 'text-emerald-700 font-semibold'
            : 'text-slate-500'
        }`}
      >
        {text}
      </span>

    </div>
  );
};

/* ============================================================
   SUMMARY CARD
   ============================================================ */

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  iconClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  description,
  iconClass,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">

      <div className="flex items-center gap-3">

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
            {label}
          </p>

          <div className="flex items-end gap-2 mt-0.5">

            <span className="text-xl font-extrabold text-slate-900">
              {value}
            </span>

            <span className="text-[10px] text-slate-400 mb-1">
              {description}
            </span>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   ACTIVITY DETAIL
   ============================================================ */

interface ActivityDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-2">

      <div className="text-slate-400 mt-0.5 shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] uppercase tracking-wide font-bold text-slate-400">
          {label}
        </p>

        <p className="text-[11px] font-semibold text-slate-700 truncate mt-0.5">
          {value}
        </p>

      </div>
    </div>
  );
};

/* ============================================================
   DEVICE DETAIL
   ============================================================ */

interface DeviceDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-2">

      <div className="text-slate-400 mt-0.5 shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] uppercase tracking-wide font-bold text-slate-400">
          {label}
        </p>

        <p className="text-[11px] font-semibold text-slate-700 truncate mt-0.5">
          {value}
        </p>

      </div>
    </div>
  );
};

