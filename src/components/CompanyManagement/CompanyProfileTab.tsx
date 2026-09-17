import React, { useState } from 'react';
import {
  Building2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Globe,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { TenantCompany } from '../../types';

interface CompanyProfileTabProps {
  company: TenantCompany;
  onSaveProfile: (updated: Partial<TenantCompany>) => Promise<boolean>;
}

export const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({
  company,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<TenantCompany>({ ...company });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Company Name is required.';
    if (!formData.legalName.trim()) errs.legalName = 'Legal Registered Entity Name is required.';
    if (!formData.panNumber.trim()) errs.panNumber = 'Income Tax PAN is required.';
    if (!formData.cinNumber.trim()) errs.cinNumber = 'Corporate Identity Number (CIN) is required.';
    if (!formData.gstinNumber.trim()) errs.gstinNumber = 'GSTIN is required for tax reporting.';
    if (!formData.domain.trim()) errs.domain = 'Company domain is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field: keyof TenantCompany, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    await onSaveProfile(formData);
    setIsSaving(false);
  };

  const handleReset = () => {
    setFormData({ ...company });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with Save / Reset buttons */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Company Profile & Legal Details</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Configure statutory corporate identities, registrations, and primary branding metadata.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#c6c6cd] text-[#1b1b1d] rounded-xl text-[13px] font-semibold hover:bg-[#f6f3f5] transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#76777d]" />
            <span>Reset Changes</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-[#131b2e] text-white rounded-xl text-[13px] font-semibold hover:bg-[#131b2e]/90 transition-all shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Update'}</span>
          </button>
        </div>
      </div>

      {/* Form Fields Section 1: General Business Identity */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#c6c6cd]/40">
          <Building2 className="w-5 h-5 text-[#131b2e]" />
          <h3 className="text-[16px] font-bold text-[#1b1b1d]">General Business Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Company Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. TechNova Solutions"
              className={`w-full px-3.5 py-2 rounded-xl border text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20 transition-all ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-[#c6c6cd]'
              }`}
            />
            {errors.name && <p className="text-[11.5px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Legal Registered Entity Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => handleInputChange('legalName', e.target.value)}
              placeholder="e.g. TechNova Solutions India Pvt Ltd"
              className={`w-full px-3.5 py-2 rounded-xl border text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20 transition-all ${
                errors.legalName ? 'border-rose-400 bg-rose-50/20' : 'border-[#c6c6cd]'
              }`}
            />
            {errors.legalName && <p className="text-[11.5px] text-rose-600 mt-1">{errors.legalName}</p>}
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Brand / Trade Name
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => handleInputChange('brandName', e.target.value)}
              placeholder="e.g. TechNova HRMS"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Domain / Work Email Domain <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => handleInputChange('domain', e.target.value)}
              placeholder="e.g. technova.io"
              className={`w-full px-3.5 py-2 rounded-xl border text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20 ${
                errors.domain ? 'border-rose-400' : 'border-[#c6c6cd]'
              }`}
            />
            {errors.domain && <p className="text-[11.5px] text-rose-600 mt-1">{errors.domain}</p>}
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Industry Vertical
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="e.g. Enterprise SaaS & FinTech"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Incorporation / Founding Date
            </label>
            <input
              type="date"
              value={formData.foundedDate}
              onChange={(e) => handleInputChange('foundedDate', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Official Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://technovasolutions.com"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Company Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              <option value="Asia/Kolkata (GMT+05:30)">Asia/Kolkata (GMT+05:30 - IST)</option>
              <option value="America/New_York (GMT-04:00)">America/New_York (GMT-04:00 - EST)</option>
              <option value="Europe/London (GMT+01:00)">Europe/London (GMT+01:00 - BST)</option>
              <option value="Asia/Singapore (GMT+08:00)">Asia/Singapore (GMT+08:00 - SGT)</option>
              <option value="Asia/Dubai (GMT+04:00)">Asia/Dubai (GMT+04:00 - GST)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Account Status
            </label>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full border border-emerald-300">
                ACTIVE & COMPLIANT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields Section 2: Statutory Registrations & Tax IDs */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#c6c6cd]/40">
          <FileCheck className="w-5 h-5 text-[#131b2e]" />
          <h3 className="text-[16px] font-bold text-[#1b1b1d]">
            Statutory, Tax & Compliance Registrations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Corporate Identity Number (CIN) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.cinNumber}
              onChange={(e) => handleInputChange('cinNumber', e.target.value.toUpperCase())}
              placeholder="e.g. U72200KA2018PTC112345"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
            {errors.cinNumber && <p className="text-[11.5px] text-rose-600 mt-1">{errors.cinNumber}</p>}
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Permanent Account Number (PAN) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
              placeholder="e.g. AABCT1234F"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
            {errors.panNumber && <p className="text-[11.5px] text-rose-600 mt-1">{errors.panNumber}</p>}
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              GST Registration No. (GSTIN) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.gstinNumber}
              onChange={(e) => handleInputChange('gstinNumber', e.target.value.toUpperCase())}
              placeholder="e.g. 29AABCT1234F1Z5"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
            {errors.gstinNumber && <p className="text-[11.5px] text-rose-600 mt-1">{errors.gstinNumber}</p>}
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Tax Deduction Account Number (TAN)
            </label>
            <input
              type="text"
              value={formData.tanNumber || ''}
              onChange={(e) => handleInputChange('tanNumber', e.target.value.toUpperCase())}
              placeholder="e.g. BLRT12345E"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Provident Fund (PF) Code No.
            </label>
            <input
              type="text"
              value={formData.pfRegistrationNumber || ''}
              onChange={(e) => handleInputChange('pfRegistrationNumber', e.target.value)}
              placeholder="e.g. KN/BLR/1098765/000"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              ESI Registration No.
            </label>
            <input
              type="text"
              value={formData.esiRegistrationNumber || ''}
              onChange={(e) => handleInputChange('esiRegistrationNumber', e.target.value)}
              placeholder="e.g. 53000987650001001"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] font-mono text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
