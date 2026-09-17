import React, { useState } from 'react';
import {
  CreditCard,
  Save,
  RotateCcw,
  Clock,
  DollarSign,
  AlertTriangle,
  Info,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { PayrollCycleConfig } from '../../types';

interface PayrollConfigTabProps {
  payrollConfig: PayrollCycleConfig;
  onSavePayrollConfig: (updated: Partial<PayrollCycleConfig>) => Promise<boolean>;
}

export const PayrollConfigTab: React.FC<PayrollConfigTabProps> = ({
  payrollConfig,
  onSavePayrollConfig,
}) => {
  const [formData, setFormData] = useState<PayrollCycleConfig>({ ...payrollConfig });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cutOffDay < 1 || formData.cutOffDay > 31) {
      alert('Cut-off Day must be between 1 and 31.');
      return;
    }
    if (formData.payDay < 1 || formData.payDay > 31) {
      alert('Pay Day must be between 1 and 31.');
      return;
    }

    setIsSaving(true);
    await onSavePayrollConfig(formData);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Payroll Processing Cycle Rules</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Configure monthly calculation cut-offs, disbursement schedules, and daily rate formulas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...payrollConfig })}
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
            <span>{isSaving ? 'Saving...' : 'Save Payroll Rules'}</span>
          </button>
        </div>
      </div>

      {/* Cycle Parameters */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#c6c6cd]/40">
          <CreditCard className="w-5 h-5 text-[#131b2e]" />
          <h3 className="text-[16px] font-bold text-[#1b1b1d]">Cycle Schedule & Cut-offs</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Payment Frequency <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.payFrequency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payFrequency: e.target.value as PayrollCycleConfig['payFrequency'],
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              <option value="MONTHLY">Monthly (Standard)</option>
              <option value="BI_WEEKLY">Bi-Weekly (Every 2 Weeks)</option>
              <option value="SEMI_MONTHLY">Semi-Monthly (Twice a Month)</option>
              <option value="WEEKLY">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Monthly Cut-Off Day <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={formData.cutOffDay}
              onChange={(e) => setFormData({ ...formData, cutOffDay: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
              required
            />
            <p className="text-[11.5px] text-[#505f76] mt-1">
              Attendance & claims lock on this day (e.g. 25th).
            </p>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Salary Disbursement Pay Day <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={formData.payDay}
              onChange={(e) => setFormData({ ...formData, payDay: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
              required
            />
            <p className="text-[11.5px] text-[#505f76] mt-1">
              Bank transfers scheduled on this day (e.g. 31st or 1st).
            </p>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Attendance Cut-Off Day
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={formData.attendanceCutOffDay}
              onChange={(e) =>
                setFormData({ ...formData, attendanceCutOffDay: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            />
            <p className="text-[11.5px] text-[#505f76] mt-1">Leave and swipe regularizations lock.</p>
          </div>
        </div>
      </div>

      {/* Salary Calculation & Rules */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#c6c6cd]/40">
          <CalendarCheck className="w-5 h-5 text-[#131b2e]" />
          <h3 className="text-[16px] font-bold text-[#1b1b1d]">Daily Rate & Calculation Logic</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Salary Calculation Basis <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.salaryCalculationBasis}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salaryCalculationBasis: e.target.value as PayrollCycleConfig['salaryCalculationBasis'],
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              <option value="ACTUAL_WORKING_DAYS">
                Actual Working Days in Month (excluding weekends & holidays)
              </option>
              <option value="FIXED_30_DAYS">Fixed 30 Days Basis (Standard Corporate 30/360)</option>
              <option value="CALENDAR_DAYS">Total Calendar Days in Month (28, 29, 30, 31)</option>
            </select>
            <p className="text-[11.5px] text-[#505f76] mt-1">
              Determines per-day salary divisor: <code>(Monthly Base Salary / Basis Days)</code>
            </p>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Overtime Calculation Multiplier
            </label>
            <select
              value={formData.overtimeCalculationRate}
              onChange={(e) =>
                setFormData({ ...formData, overtimeCalculationRate: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#131b2e]/20"
            >
              <option value={1.0}>1.0x (Standard Hourly Rate)</option>
              <option value={1.5}>1.5x (Time and a Half - Standard)</option>
              <option value={2.0}>2.0x (Double Time for Weekends/Holidays)</option>
            </select>
          </div>
        </div>

        {/* Switches */}
        <div className="pt-4 border-t border-[#c6c6cd]/40 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.prorateFirstMonth}
              onChange={(e) =>
                setFormData({ ...formData, prorateFirstMonth: e.target.checked })
              }
              className="w-4 h-4 rounded border-[#c6c6cd] text-[#131b2e] focus:ring-[#131b2e] mt-1"
            />
            <div>
              <p className="text-[13.5px] font-semibold text-[#1b1b1d]">
                Prorate First Month Salary for Mid-Cycle Joiners
              </p>
              <p className="text-[12px] text-[#505f76]">
                Automatically calculates pay for exact active days when an employee joins mid-month.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.allowNegativeSalary}
              onChange={(e) =>
                setFormData({ ...formData, allowNegativeSalary: e.target.checked })
              }
              className="w-4 h-4 rounded border-[#c6c6cd] text-[#131b2e] focus:ring-[#131b2e] mt-1"
            />
            <div>
              <p className="text-[13.5px] font-semibold text-[#1b1b1d]">
                Allow Negative Net Pay Calculations
              </p>
              <p className="text-[12px] text-[#505f76]">
                When disabled (recommended), deductions exceeding total earnings will be capped at ₹ 0 and carried forward.
              </p>
            </div>
          </label>
        </div>
      </div>
    </form>
  );
};
