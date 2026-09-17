import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { CompanyContact } from '../../types';
import { Modal } from '../Modal';

interface CompanyContactsTabProps {
  contacts: CompanyContact[];
  onSaveContacts: (contacts: CompanyContact[]) => Promise<boolean>;
}

export const CompanyContactsTab: React.FC<CompanyContactsTabProps> = ({
  contacts,
  onSaveContacts,
}) => {
  const [contactList, setContactList] = useState<CompanyContact[]>([...contacts]);
  const [editingContact, setEditingContact] = useState<CompanyContact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getRoleBadge = (type: CompanyContact['type']) => {
    switch (type) {
      case 'PRIMARY_ADMIN':
        return { label: 'Primary Admin', bg: 'bg-[#dae2fd]', text: 'text-[#131b2e]' };
      case 'HR_HEAD':
        return { label: 'Head of HR', bg: 'bg-emerald-100', text: 'text-emerald-900' };
      case 'PAYROLL_OFFICER':
        return { label: 'Senior Payroll Officer', bg: 'bg-amber-100', text: 'text-amber-900' };
      case 'COMPLIANCE_OFFICER':
        return { label: 'Statutory Compliance Lead', bg: 'bg-purple-100', text: 'text-purple-900' };
      default:
        return { label: 'Legal Advisor', bg: 'bg-slate-100', text: 'text-slate-900' };
    }
  };

  const handleOpenAdd = () => {
    setEditingContact({
      id: '',
      companyId: '',
      type: 'HR_HEAD',
      fullName: '',
      designation: '',
      email: '',
      phone: '',
      isEmergencyEscalation: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: CompanyContact) => {
    setEditingContact({ ...contact });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    if (!editingContact.fullName.trim() || !editingContact.email.trim() || !editingContact.phone.trim()) {
      alert('Full Name, Official Email, and Phone number are required.');
      return;
    }

    let updated: CompanyContact[];
    if (!editingContact.id) {
      const newC: CompanyContact = {
        ...editingContact,
        id: `cont_${Date.now()}`,
      };
      updated = [...contactList, newC];
    } else {
      updated = contactList.map((c) => (c.id === editingContact.id ? editingContact : c));
    }

    setIsSaving(true);
    const success = await onSaveContacts(updated);
    setIsSaving(false);
    if (success) {
      setContactList(updated);
      setIsModalOpen(false);
      setEditingContact(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (contactList.length <= 1) {
      alert('At least one primary administrative officer is required.');
      return;
    }
    const updated = contactList.filter((c) => c.id !== id);
    setIsSaving(true);
    const success = await onSaveContacts(updated);
    setIsSaving(false);
    if (success) {
      setContactList(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Key Stakeholders & Officers</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Designate primary administrative, HR, payroll, and statutory escalation contacts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#131b2e] text-white rounded-xl text-[13px] font-semibold hover:bg-[#131b2e]/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Key Officer</span>
        </button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contactList.map((contact) => {
          const roleBadge = getRoleBadge(contact.type);
          return (
            <div
              key={contact.id}
              className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#131b2e]/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${roleBadge.bg} ${roleBadge.text}`}
                  >
                    {roleBadge.label}
                  </span>
                  {contact.isEmergencyEscalation && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
                      Escalation Contact
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#131b2e] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {contact.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#1b1b1d] text-[15px] truncate">
                      {contact.fullName}
                    </h3>
                    <p className="text-[12.5px] text-[#505f76] truncate">{contact.designation}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#c6c6cd]/40 text-[13px]">
                  <div className="flex items-center gap-2.5 text-[#505f76]">
                    <Mail className="w-4 h-4 text-[#76777d] shrink-0" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-blue-600 truncate text-[#1b1b1d] font-medium"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#505f76]">
                    <Phone className="w-4 h-4 text-[#76777d] shrink-0" />
                    <span className="font-mono text-[#1b1b1d]">{contact.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#c6c6cd]/40 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="p-2 rounded-lg text-[#505f76] hover:text-[#1b1b1d] hover:bg-[#f6f3f5] transition-colors"
                  title="Edit Officer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {contactList.length > 1 && (
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove Officer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Contact Modal */}
      {editingContact && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingContact.id ? 'Edit Officer Information' : 'Add Key Organization Officer'}
        >
          <form onSubmit={handleSaveModal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Officer Role / Designation Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editingContact.type}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      type: e.target.value as CompanyContact['type'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                >
                  <option value="PRIMARY_ADMIN">Primary Company Admin</option>
                  <option value="HR_HEAD">Head of Human Resources</option>
                  <option value="PAYROLL_OFFICER">Senior Payroll Officer</option>
                  <option value="COMPLIANCE_OFFICER">Statutory Compliance Lead</option>
                  <option value="LEGAL_REPRESENTATIVE">Legal Representative</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingContact.fullName}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, fullName: e.target.value })
                  }
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                Official Job Title / Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editingContact.designation}
                onChange={(e) =>
                  setEditingContact({ ...editingContact, designation: e.target.value })
                }
                placeholder="e.g. VP of People Operations"
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Corporate Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={editingContact.email}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, email: e.target.value })
                  }
                  placeholder="e.g. sarah.jenkins@technova.io"
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1b1b1d] mb-1">
                  Phone / Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={editingContact.phone}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, phone: e.target.value })
                  }
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingContact.isEmergencyEscalation}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      isEmergencyEscalation: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-[#c6c6cd] text-[#131b2e] focus:ring-[#131b2e]"
                />
                <span className="text-[13px] font-semibold text-[#1b1b1d]">
                  Designate as Statutory & Compliance Escalation Contact
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
                {isSaving ? 'Saving...' : 'Save Officer'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
