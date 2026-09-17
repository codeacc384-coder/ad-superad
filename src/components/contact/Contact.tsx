import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Phone, MapPin, Users, Plus, CheckCircle2, Trash2, Mail, Briefcase, Globe } from 'lucide-react';

export interface CompanyContactItem {
  id: string;
  name: string;
  phone: string;
  type: string;
  location: string;
  email: string;
  size: string;
  address: string;
  dateAdded: string;
}

export const Contact: React.FC = () => {
  const { addToast } = useApp();

  // Local state to manage the list of companies submitted in this session
  const [contacts, setContacts] = useState<CompanyContactItem[]>([
    {
      id: '1',
      name: 'Acme Global Corp',
      phone: '+1 (555) 382-9100',
      type: 'Software',
      location: 'Silicon Valley, CA',
      email: 'contact@acmeglobal.com',
      size: '100-200',
      address: '742 Evergreen Terrace, Springfield, OR',
      dateAdded: '2026-06-12'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Software',
    location: '',
    email: '',
    size: '50-100',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.address.trim()) {
      addToast('Validation Error', 'Please fill out all required fields.', 'error');
      return;
    }

    const newContact: CompanyContactItem = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      location: formData.location || 'N/A',
      email: formData.email,
      size: formData.size,
      address: formData.address,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setContacts([newContact, ...contacts]);
    addToast('Success', 'Company contact successfully added to database.', 'success');

    // Reset Form
    setFormData({
      name: '',
      phone: '',
      type: 'Software',
      location: '',
      email: '',
      size: '50-100',
      address: ''
    });
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    addToast('Deleted', 'Company record removed.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Company Contacts Directory</h1>
        <p className="text-xs text-slate-500 mt-0.5">Register new company profiles, manage business details, track company sizes, and view records in real time.</p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#4B41E1]" />
          Add New Company Contact
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Company Name *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Nexus Enterprises"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B41E1] transition-colors"
              />
            </div>
          </div>

          {/* Company Contact No */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Contact Number *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B41E1] transition-colors"
              />
            </div>
          </div>

          {/* Company Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Company Email *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@company.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B41E1] transition-colors"
              />
            </div>
          </div>

          {/* Company Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Company Type</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </span>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B41E1] transition-colors cursor-pointer"
              >
                <option value="Software">Software</option>
                <option value="Sales">Sales</option>
                <option value="Advertising">Advertising</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Logistics">Logistics</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Company Size Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Company Size</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </span>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B41E1] transition-colors cursor-pointer"
              >
                <option value="50-100">50 - 100 Employees</option>
                <option value="100-200">100 - 200 Employees</option>
                <option value="200-500">200 - 500 Employees</option>
                <option value="500-1000">500 - 1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
          </div>

          {/* Company Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Company Location</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New York, NY"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B41E1] transition-colors"
              />
            </div>
          </div>

          {/* Company Address (Full width span across columns) */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Street Address *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, City, Country"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B41E1] transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#4B41E1] hover:bg-[#3B33C5] text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Company Contact</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Body Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800">Submitted Company Records</h2>
          <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-full border border-indigo-100">
            {contacts.length} {contacts.length === 1 ? 'Record' : 'Records'} Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-50/80">
                <th className="py-3.5 px-6 font-bold">Company Name</th>
                <th className="py-3.5 px-6 font-bold">Type</th>
                <th className="py-3.5 px-6 font-bold">Contact Info</th>
                <th className="py-3.5 px-6 font-bold">Size</th>
                <th className="py-3.5 px-6 font-bold">Location</th>
                <th className="py-3.5 px-6 font-bold">Address</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No company contacts found. Fill out the form above to add your first record.
                  </td>
                </tr>
              ) : (
                contacts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4B41E1] flex items-center justify-center font-bold text-xs shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{item.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-md">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{item.phone}</div>
                      <div className="text-slate-400 text-[11px]">{item.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 font-semibold text-slate-700 rounded-md">
                        {item.size}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{item.location}</td>
                    <td className="py-4 px-6 text-slate-600 truncate max-w-xs">{item.address}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};