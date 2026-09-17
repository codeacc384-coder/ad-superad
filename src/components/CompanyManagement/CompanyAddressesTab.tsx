import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Building,
  Save,
  AlertTriangle
} from 'lucide-react';
import { CompanyAddress } from '../../types';
import { Modal } from '../Modal';

interface CompanyAddressesTabProps {
  addresses: CompanyAddress[];
  onSaveAddresses: (addresses: CompanyAddress[]) => Promise<boolean>;
}

export const CompanyAddressesTab: React.FC<CompanyAddressesTabProps> = ({
  addresses,
  onSaveAddresses,
}) => {
  const [addressList, setAddressList] = useState<CompanyAddress[]>([...addresses]);
  const [editingAddress, setEditingAddress] = useState<CompanyAddress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingAddress({
      id: '',
      companyId: '',
      type: 'CORPORATE',
      isPrimary: addressList.length === 0,
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      landmark: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: CompanyAddress) => {
    setEditingAddress({ ...addr });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    if (!editingAddress.addressLine1.trim() || !editingAddress.city.trim() || !editingAddress.postalCode.trim()) {
      alert('Address Line 1, City, and Postal Code are required.');
      return;
    }

    let updated: CompanyAddress[];
    if (!editingAddress.id) {
      const newAddr: CompanyAddress = {
        ...editingAddress,
        id: `addr_${Date.now()}`,
      };
      if (newAddr.isPrimary) {
        updated = addressList.map((a) => ({ ...a, isPrimary: false })).concat(newAddr);
      } else {
        updated = [...addressList, newAddr];
      }
    } else {
      updated = addressList.map((a) => {
        if (a.id === editingAddress.id) {
          return editingAddress;
        }
        if (editingAddress.isPrimary) {
          return { ...a, isPrimary: false };
        }
        return a;
      });
    }

    setIsSaving(true);
    const success = await onSaveAddresses(updated);
    setIsSaving(false);
    if (success) {
      setAddressList(updated);
      setIsModalOpen(false);
      setEditingAddress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (addressList.length <= 1) {
      alert('You must have at least one registered address.');
      return;
    }
    const updated = addressList.filter((a) => a.id !== id);
    // If we deleted the primary address, make the first one primary
    if (!updated.some((a) => a.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    setIsSaving(true);
    const success = await onSaveAddresses(updated);
    setIsSaving(false);
    if (success) {
      setAddressList(updated);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Locations & Address Directory</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Manage corporate headquarters, branch facilities, and statutory billing locations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#131b2e] text-white rounded-xl text-[13px] font-semibold hover:bg-[#131b2e]/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Location</span>
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {addressList.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all ${
              addr.isPrimary
                ? 'border-[#131b2e] ring-2 ring-[#131b2e]/10'
                : 'border-[#c6c6cd]/60 hover:border-[#c6c6cd]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#131b2e]">
                  {addr.type.replace('_', ' ')}
                </span>
                {addr.isPrimary && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    Primary HQ
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[13.5px]">
                <p className="font-bold text-[#1b1b1d] text-[15px]">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-[#505f76]">{addr.addressLine2}</p>}
                {addr.landmark && (
                  <p className="text-[12px] text-[#76777d]">Landmark: {addr.landmark}</p>
                )}
                <p className="text-[#1b1b1d] font-medium pt-2">
                  {addr.city}, {addr.state} - <span className="font-mono">{addr.postalCode}</span>
                </p>
                <p className="text-[#505f76]">{addr.country}</p>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[#c6c6cd]/40 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(addr)}
                className="p-2 rounded-lg text-[#505f76] hover:text-[#1b1b1d] hover:bg-[#f6f3f5] transition-colors"
                title="Edit Address"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {addressList.length > 1 && (
                <button
                  onClick={() => setDeleteConfirmId(addr.id)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Address Modal */}
      {editingAddress && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingAddress.id ? 'Edit Location Address' : 'Add New Location Address'}
          subtitle="All addresses are securely audited and linked to statutory payroll filings."
        >
          <form onSubmit={handleSaveModal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Location Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editingAddress.type}
                  onChange={(e) =>
                    setEditingAddress({
                      ...editingAddress,
                      type: e.target.value as CompanyAddress['type'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                >
                  <option value="REGISTERED">Registered Head Office</option>
                  <option value="CORPORATE">Corporate Branch Facility</option>
                  <option value="BILLING">Billing & Accounts Office</option>
                  <option value="BRANCH_HQ">Regional Branch HQ</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Country <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.country}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, country: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                Address Line 1 (Building, Street) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editingAddress.addressLine1}
                onChange={(e) =>
                  setEditingAddress({ ...editingAddress, addressLine1: e.target.value })
                }
                placeholder="e.g. TechNova Tower, 4th Floor, Outer Ring Road"
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                Address Line 2 (Area, Suite, Floor)
              </label>
              <input
                type="text"
                value={editingAddress.addressLine2 || ''}
                onChange={(e) =>
                  setEditingAddress({ ...editingAddress, addressLine2: e.target.value })
                }
                placeholder="e.g. Bellandur, Devarabisanahalli"
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.city}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, city: e.target.value })
                  }
                  placeholder="e.g. Bengaluru"
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  State / Province <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.state}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, state: e.target.value })
                  }
                  placeholder="e.g. Karnataka"
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Postal / PIN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.postalCode}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, postalCode: e.target.value })
                  }
                  placeholder="e.g. 560103"
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                Landmark / Nearby Location
              </label>
              <input
                type="text"
                value={editingAddress.landmark || ''}
                onChange={(e) =>
                  setEditingAddress({ ...editingAddress, landmark: e.target.value })
                }
                placeholder="e.g. Near EcoSpace Business Park"
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingAddress.isPrimary}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, isPrimary: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-[#c6c6cd] text-[#131b2e] focus:ring-[#131b2e]"
                />
                <span className="text-[13px] font-semibold text-[#1b1b1d]">
                  Set as Primary Registered Office
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
                {isSaving ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Location Address?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-[13px] leading-relaxed">
                Are you sure you want to delete this address? This change will be permanently logged in the audit trail.
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
