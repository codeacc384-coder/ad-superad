import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  MoreVertical,
  Send,
  Clock,
  CheckCircle2,
  Archive,
  Eye,
  Edit3,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';

type AnnouncementStatus = 'Published' | 'Scheduled' | 'Draft' | 'Archived';
type AnnouncementPriority = 'Normal' | 'Important' | 'Critical';

interface Announcement {
  id: number;
  title: string;
  message: string;
  category: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  audience: string;
  createdBy: string;
  createdAt: string;
  publishDate: string;
  recipients: number;
  readCount: number;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Scheduled Platform Maintenance',
    message:
      'CoreHR platform will undergo scheduled maintenance this weekend. Some services may be temporarily unavailable.',
    category: 'Maintenance',
    priority: 'Important',
    status: 'Scheduled',
    audience: 'All Companies',
    createdBy: 'Super Admin',
    createdAt: 'Aug 30, 2026',
    publishDate: 'Sep 05, 2026',
    recipients: 245,
    readCount: 0,
  },
  {
    id: 2,
    title: 'New Payroll Features Available',
    message:
      'New payroll reporting and tax configuration features are now available for Enterprise customers.',
    category: 'Product Update',
    priority: 'Normal',
    status: 'Published',
    audience: 'Enterprise Customers',
    createdBy: 'Admin Team',
    createdAt: 'Aug 28, 2026',
    publishDate: 'Aug 28, 2026',
    recipients: 86,
    readCount: 71,
  },
  {
    id: 3,
    title: 'Security Policy Update',
    message:
      'A new security policy requires all administrators to enable multi-factor authentication.',
    category: 'Security',
    priority: 'Critical',
    status: 'Published',
    audience: 'Administrators',
    createdBy: 'Security Team',
    createdAt: 'Aug 25, 2026',
    publishDate: 'Aug 25, 2026',
    recipients: 412,
    readCount: 398,
  },
  {
    id: 4,
    title: 'Welcome to the New CoreHR Experience',
    message:
      'We have introduced an updated administration experience with improved navigation and reporting.',
    category: 'General',
    priority: 'Normal',
    status: 'Draft',
    audience: 'All Companies',
    createdBy: 'Super Admin',
    createdAt: 'Aug 22, 2026',
    publishDate: '-',
    recipients: 245,
    readCount: 0,
  },
];

export const AnnouncementsView: React.FC = () => {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    category: 'General',
    priority: 'Normal' as AnnouncementPriority,
    audience: 'All Companies',
    publishDate: '',
  });

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      announcement.message
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      announcement.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = announcements.filter(
    (a) => a.status === 'Published'
  ).length;

  const scheduledCount = announcements.filter(
    (a) => a.status === 'Scheduled'
  ).length;

  const draftCount = announcements.filter(
    (a) => a.status === 'Draft'
  ).length;

  const totalRecipients = announcements.reduce(
    (total, announcement) =>
      total + announcement.recipients,
    0
  );

  const getStatusStyle = (status: AnnouncementStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'Archived':
        return 'bg-slate-100 text-slate-600 border-slate-200';

      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityStyle = (priority: AnnouncementPriority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700';

      case 'Important':
        return 'bg-orange-50 text-orange-700';

      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const handleCreateAnnouncement = () => {
    if (
      !newAnnouncement.title.trim() ||
      !newAnnouncement.message.trim()
    ) {
      return;
    }

    const announcement: Announcement = {
      id: Date.now(),
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      category: newAnnouncement.category,
      priority: newAnnouncement.priority,
      status: newAnnouncement.publishDate
        ? 'Scheduled'
        : 'Draft',
      audience: newAnnouncement.audience,
      createdBy: 'Super Admin',
      createdAt: 'Sep 01, 2026',
      publishDate: newAnnouncement.publishDate || '-',
      recipients: 245,
      readCount: 0,
    };

    setAnnouncements((prev) => [announcement, ...prev]);

    setNewAnnouncement({
      title: '',
      message: '',
      category: 'General',
      priority: 'Normal',
      audience: 'All Companies',
      publishDate: '',
    });

    setShowCreateModal(false);
  };

  const handleDelete = (id: number) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id)
    );

    setSelectedAnnouncement(null);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-indigo-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                System Announcements
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Communicate important updates and platform notices
                to your customers and administrators.
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Published
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {publishedCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Scheduled
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {scheduledCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Drafts
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {draftCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-amber-600" />
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Recipients
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {totalRecipients.toLocaleString()}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Send className="w-5 h-5 text-indigo-600" />
            </div>

          </div>
        </div>

      </div>

      {/* Main Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                  Announcement
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                  Category
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                  Priority
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                  Audience
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                  Status
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                  Date
                </th>

                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredAnnouncements.map((announcement) => (

                <tr
                  key={announcement.id}
                  className="border-b border-slate-100 hover:bg-slate-50/70 transition"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-start gap-3">

                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Megaphone className="w-4 h-4 text-indigo-600" />
                      </div>

                      <div className="min-w-[220px]">

                        <p className="text-sm font-semibold text-slate-900">
                          {announcement.title}
                        </p>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {announcement.message}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-slate-600">
                      {announcement.category}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${getPriorityStyle(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-600">
                      {announcement.audience}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getStatusStyle(
                        announcement.status
                      )}`}
                    >
                      {announcement.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        {announcement.publishDate}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Created {announcement.createdAt}
                      </p>
                    </div>

                  </td>

                  <td className="px-5 py-4 text-right">

                    <button
                      onClick={() =>
                        setSelectedAnnouncement(announcement)
                      }
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredAnnouncements.length === 0 && (
            <div className="py-16 text-center">

              <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />

              <p className="text-sm font-semibold text-slate-700 mt-3">
                No announcements found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try changing your search or filter.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create Announcement
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Publish an important message to your platform users.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="p-6 space-y-5">

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Announcement Title
                </label>

                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter announcement title"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Message
                </label>

                <textarea
                  value={newAnnouncement.message}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      message: e.target.value,
                    })
                  }
                  placeholder="Write your announcement..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Category
                  </label>

                  <select
                    value={newAnnouncement.category}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option>General</option>
                    <option>Maintenance</option>
                    <option>Product Update</option>
                    <option>Security</option>
                    <option>Billing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Priority
                  </label>

                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        priority:
                          e.target.value as AnnouncementPriority,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option>Normal</option>
                    <option>Important</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Audience
                  </label>

                  <select
                    value={newAnnouncement.audience}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        audience: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option>All Companies</option>
                    <option>Enterprise Customers</option>
                    <option>Administrators</option>
                    <option>Company Admins</option>
                    <option>Employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Schedule Date
                  </label>

                  <input
                    type="date"
                    value={newAnnouncement.publishDate}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        publishDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">

                <AlertCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />

                <p className="text-xs text-indigo-700 leading-relaxed">
                  Leaving the schedule date empty will save this
                  announcement as a draft.
                </p>

              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">

              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateAnnouncement}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
              >
                Create Announcement
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Action Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setSelectedAnnouncement(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">

            <div className="p-6">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-xs font-semibold text-indigo-600">
                    {selectedAnnouncement.category}
                  </p>

                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedAnnouncement.title}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setSelectedAnnouncement(null)
                  }
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <p className="text-sm text-slate-600 leading-relaxed mt-4">
                {selectedAnnouncement.message}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400">
                    Audience
                  </p>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {selectedAnnouncement.audience}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400">
                    Status
                  </p>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {selectedAnnouncement.status}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400">
                    Recipients
                  </p>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {selectedAnnouncement.recipients}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400">
                    Read
                  </p>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {selectedAnnouncement.readCount}
                  </p>
                </div>

              </div>

              <div className="flex gap-2 mt-6">

                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>

                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(selectedAnnouncement.id)
                  }
                  className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};