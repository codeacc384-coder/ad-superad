import React, { useState } from 'react';
import {
  Calendar,
  Save,
  RotateCcw,
  Coins,
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { FinancialYearConfig } from '../../types';

interface FinancialYearTabProps {
  financialYear: FinancialYearConfig;
  onSaveFinancialYear: (updated: Partial<FinancialYearConfig>) => Promise<boolean>;
}

export const FinancialYearTab: React.FC<FinancialYearTabProps> = ({
  financialYear,
  onSaveFinancialYear,
}) => {
  const [formData, setFormData] = useState<FinancialYearConfig>({ ...financialYear });
  const [isSaving, setIsSaving] = useState(false);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April (Standard for India / UK)' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July (Standard for Australia)' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October (Standard for US Federal)' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR - ₹)' },
    { code: 'USD', symbol: '$', name: 'US Dollar (USD - $)' },
    { code: 'EUR', symbol: '€', name: 'Euro (EUR - €)' },
    { code: 'GBP', symbol: '£', name: 'British Pound (GBP - £)' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED - د.إ)' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD - S$)' },
  ];

  const handleStartMonthChange = (startMonthNum: number) => {
    const endMonthNum = startMonthNum === 1 ? 12 : startMonthNum - 1;
    setFormData((prev) => ({
      ...prev,
      startMonth: startMonthNum,
      endMonth: endMonthNum,
    }));
  };

  const handleCurrencyChange = (code: string) => {
    const found = currencies.find((c) => c.code === code);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        currencyCode: found.code,
        currencySymbol: found.symbol,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveFinancialYear(formData);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Financial Year & Currency Setup</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Define fiscal accounting calendar boundaries, monetary display units, and rounding precision.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...financialYear })}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c6c6cd] text-[#1b1b1d] rounded-xl text-[13px] font-semibold hover:bg-[#f6f3f5]"
          >
            <RotateCcw className="w-4 h-4 text-[#76777d]" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#131b2e] text-white rounded-xl text-[13px] font-semibold hover:bg-[#131b2e]/90 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Fiscal Cycle Box */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#c6c6cd]/40">
          <Calendar className="w-5 h-5 text-[#131b2e]" />
          <h3 className="text-[16px] font-bold text-[#1b1b1d]">Fiscal Accounting Year</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Financial Year Start Month <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.startMonth}
              onChange={(e) => handleStartMonthChange(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-[11.5px] text-[#505f76] mt-1">
              Indian statutory mandates April - March.
            </p>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Financial Year End Month
            </label>
            <input
              type="text"
              readOnly
              value={months.find((m) => m.value === formData.endMonth)?.label.split(' ')[0] || 'March'}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#f6f3f5] text-[#505f76] cursor-not-allowed font-medium"
            />
            <p className="text-[11.5px] text-[#505f76] mt-1">Calculated automatically (12 months).</p>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Current Financial Year Label <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.currentFYName}
              onChange={(e) => setFormData({ ...formData, currentFYName: e.target.value })}
              placeholder="e.g. FY 2026-2027"
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
          </div>
        </div>
      </div>

      {/* Monetary Currency & Precision Box */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#c6c6cd]/40">
          <Coins className="w-5 h-5 text-[#131b2e]" />
          <h3 className="text-[16px] font-bold text-[#1b1b1d]">Base Currency & Rounding Standards</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Company Base Currency <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.currencyCode}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Decimal Precision
            </label>
            <select
              value={formData.decimalPlaces}
              onChange={(e) => setFormData({ ...formData, decimalPlaces: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              <option value={0}>0 (No Decimals, e.g. ₹ 50,000)</option>
              <option value={2}>2 (Standard, e.g. ₹ 50,000.00)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Salary Rounding Method
            </label>
            <select
              value={formData.roundingMethod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roundingMethod: e.target.value as FinancialYearConfig['roundingMethod'],
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              <option value="NEAREST_ONE">Round to Nearest 1.00 (Standard)</option>
              <option value="NEAREST_TEN">Round to Nearest 10.00</option>
              <option value="DECIMAL_ROUND">Standard 2 Decimal Floating</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};
