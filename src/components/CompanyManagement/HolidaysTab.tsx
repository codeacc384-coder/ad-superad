import React, { useState } from 'react';
import {
  Palmtree,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { HolidayItem } from '../../types';
import { Modal } from '../Modal';

interface HolidaysTabProps {
  holidays: HolidayItem[];
  onAddHoliday: (holiday: Partial<HolidayItem>) => Promise<boolean>;
  onUpdateHoliday: (id: string, holiday: Partial<HolidayItem>) => Promise<boolean>;
  onDeleteHoliday: (id: string) => Promise<boolean>;
}

export const HolidaysTab: React.FC<HolidaysTabProps> = ({
  holidays,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingHoliday, setEditingHoliday] = useState<HolidayItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getHolidayTypeBadge = (type: HolidayItem['holidayType']) => {
    switch (type) {
      case 'NATIONAL':
        return { label: 'National Paid Holiday', bg: 'bg-emerald-100', text: 'text-emerald-900' };
      case 'FESTIVAL':
        return { label: 'Festival Holiday', bg: 'bg-amber-100', text: 'text-amber-900' };
      case 'STATE':
        return { label: 'State / Regional Holiday', bg: 'bg-blue-100', text: 'text-blue-900' };
      case 'OPTIONAL_RESTRICTED':
      default:
        return { label: 'Restricted / Optional', bg: 'bg-purple-100', text: 'text-purple-900' };
    }
  };

  const filteredHolidays = holidays.filter((h) => {
    const matchesFilter = filterType === 'ALL' || h.holidayType === filterType;
    const matchesSearch =
      h.holidayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.holidayDate.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingHoliday({
      id: '',
      companyId: '',
      holidayName: '',
      holidayDate: new Date().toISOString().split('T')[0],
      holidayType: 'NATIONAL',
      isRecurringAnnually: true,
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h: HolidayItem) => {
    setEditingHoliday({ ...h });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday) return;
    if (!editingHoliday.holidayName.trim() || !editingHoliday.holidayDate) {
      alert('Holiday Name and Date are required.');
      return;
    }

    setIsSaving(true);
    let success = false;
    if (!editingHoliday.id) {
      success = await onAddHoliday(editingHoliday);
    } else {
      success = await onUpdateHoliday(editingHoliday.id, editingHoliday);
    }
    setIsSaving(false);

    if (success) {
      setIsModalOpen(false);
      setEditingHoliday(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    const success = await onDeleteHoliday(id);
    setIsSaving(false);
    if (success) {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Filter */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Statutory Holiday Calendar (2026)</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Configured paid holidays feed directly into attendance registers and payroll daily rate calculations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#76777d]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-white focus:outline-none"
            >
              <option value="ALL">All Types ({holidays.length})</option>
              <option value="NATIONAL">National Statutory</option>
              <option value="FESTIVAL">Festival</option>
              <option value="STATE">State / Regional</option>
              <option value="OPTIONAL_RESTRICTED">Restricted / Optional</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#131b2e] text-white rounded-xl text-[13px] font-semibold hover:bg-[#131b2e]/90 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holiday</span>
          </button>
        </div>
      </div>

      {/* Holidays Table */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#c6c6cd]/40 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" />
            <input
              type="text"
              placeholder="Search holiday name or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[13px] focus:outline-none bg-[#fcf8fa] focus:bg-white"
            />
          </div>

          <span className="text-[12.5px] font-semibold text-[#505f76]">
            Showing {filteredHolidays.length} of {holidays.length} Holidays
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13.5px]">
            <thead>
              <tr className="bg-[#fcf8fa] border-b border-[#c6c6cd]/40 text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                <th className="py-3 px-6">Holiday Name</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Day</th>
                <th className="py-3 px-6">Category / Type</th>
                <th className="py-3 px-6">Recurrence</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c6c6cd]/30">
              {filteredHolidays.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#76777d] text-[14px]">
                    No holidays match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredHolidays.map((holiday) => {
                  const badge = getHolidayTypeBadge(holiday.holidayType);
                  const dateObj = new Date(holiday.holidayDate);
                  const dayOfWeek = isNaN(dateObj.getTime())
                    ? ''
                    : dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                  return (
                    <tr key={holiday.id} className="hover:bg-[#f6f3f5]/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <p className="font-bold text-[#1b1b1d]">{holiday.holidayName}</p>
                        {holiday.description && (
                          <p className="text-[11.5px] text-[#505f76] mt-0.5">{holiday.description}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-6 font-mono font-medium text-[#1b1b1d]">
                        {holiday.holidayDate}
                      </td>
                      <td className="py-3.5 px-6 text-[#505f76] font-medium">{dayOfWeek}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        {holiday.isRecurringAnnually ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Annual Recurring
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#76777d]">One-time</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(holiday)}
                            className="p-1.5 rounded-lg text-[#505f76] hover:text-[#1b1b1d] hover:bg-[#f6f3f5]"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(holiday.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Add / Edit Holiday Modal */}
      {editingHoliday && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingHoliday.id ? 'Edit Statutory Holiday' : 'Add New Statutory Holiday'}
        >
          <form onSubmit={handleSaveModal} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                Holiday Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editingHoliday.holidayName}
                onChange={(e) =>
                  setEditingHoliday({ ...editingHoliday, holidayName: e.target.value })
                }
                placeholder="e.g. Mahatma Gandhi Jayanti"
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Holiday Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={editingHoliday.holidayDate}
                  onChange={(e) =>
                    setEditingHoliday({ ...editingHoliday, holidayDate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Holiday Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editingHoliday.holidayType}
                  onChange={(e) =>
                    setEditingHoliday({
                      ...editingHoliday,
                      holidayType: e.target.value as HolidayItem['holidayType'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                >
                  <option value="NATIONAL">National Gazetted Holiday (Paid)</option>
                  <option value="FESTIVAL">Festival Holiday</option>
                  <option value="STATE">State / Regional Holiday</option>
                  <option value="OPTIONAL_RESTRICTED">Restricted / Optional Holiday</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                Description / Statutory Notes
              </label>
              <textarea
                value={editingHoliday.description || ''}
                onChange={(e) =>
                  setEditingHoliday({ ...editingHoliday, description: e.target.value })
                }
                placeholder="e.g. Gazetted statutory national paid holiday across all company facilities."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingHoliday.isRecurringAnnually}
                  onChange={(e) =>
                    setEditingHoliday({
                      ...editingHoliday,
                      isRecurringAnnually: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-[#c6c6cd] text-[#131b2e] focus:ring-[#131b2e]"
                />
                <span className="text-[13px] font-semibold text-[#1b1b1d]">
                  Repeats annually on the same calendar date
                </span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#c6c6cd]/40 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#c6c6cd] text-[13px] font-semibold text-[#505f76] hover:bg-[#f6f3f5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#131b2e] text-white text-[13px] font-semibold hover:bg-[#131b2e]/90 shadow-sm"
              >
                {isSaving ? 'Saving...' : 'Save Holiday'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Holiday?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-[13px] leading-relaxed">
                Are you sure you want to remove this holiday from the statutory calendar? Attendance computations will be recalculated.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[#c6c6cd] text-[13px] font-semibold text-[#505f76]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-[13px] font-semibold hover:bg-rose-700 shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
