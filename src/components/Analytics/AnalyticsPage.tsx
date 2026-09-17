import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Building,
  Award,
  ArrowUpRight,
  Download,
  Calendar,
  PieChart
} from 'lucide-react';
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES } from '../../mockData/hrmsData';

interface AnalyticsPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, msg?: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onShowToast }) => {
  const totalEmployees = MOCK_EMPLOYEES.length;
  const totalBudget = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.budgetAllocated, 0);

  const monthlyPayrollTrend = [
    { month: 'Mar 2026', amount: 33.2, headcount: 42 },
    { month: 'Apr 2026', amount: 34.5, headcount: 44 },
    { month: 'May 2026', amount: 35.1, headcount: 45 },
    { month: 'Jun 2026', amount: 35.8, headcount: 45 },
    { month: 'Jul 2026', amount: 37.6, headcount: 47 },
    { month: 'Aug 2026', amount: 38.4, headcount: 48 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#1b1b1d] tracking-tight">
              Workforce Intelligence & HR Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold">
              Real-Time Metrics
            </span>
          </div>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Headcount distribution, department budget burn rates, compensation trends, and retention indices.
          </p>
        </div>

        <button
          onClick={() =>
            onShowToast(
              'info',
              'Analytics Pack Exported',
              'Downloaded comprehensive Executive Workforce Report (PDF + Excel).'
            )
          }
          className="flex items-center gap-2 px-4 py-2 bg-[#131b2e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#131b2e]/90 transition-all shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics BI</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-[#505f76]">Annualized HR Budget</span>
          <p className="text-[22px] font-extrabold text-[#1b1b1d] mt-1">
            ₹{(totalBudget / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[12px] text-emerald-600 font-semibold mt-0.5 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" /> 92% Budget Utilization
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-purple-700">Attrition Rate (TTM)</span>
          <p className="text-[22px] font-extrabold text-purple-900 mt-1">4.2%</p>
          <p className="text-[12px] text-[#76777d] mt-0.5">Industry benchmark: 14.8%</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-emerald-700">Average Tenure</span>
          <p className="text-[22px] font-extrabold text-emerald-900 mt-1">2.8 Years</p>
          <p className="text-[12px] text-[#76777d] mt-0.5">High retention in Core Engineering</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-blue-700">Gender Ratio (F/M)</span>
          <p className="text-[22px] font-extrabold text-blue-900 mt-1">42% / 58%</p>
          <p className="text-[12px] text-[#76777d] mt-0.5">Diversity hiring index on track</p>
        </div>
      </div>

      {/* 2-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Department Headcount & Budget Distribution */}
        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#1b1b1d]">Department Headcount Distribution</h2>
            <span className="text-[12px] font-semibold text-[#505f76]">
              5 Core Business Units
            </span>
          </div>

          <div className="space-y-4">
            {MOCK_DEPARTMENTS.map((dept) => {
              const pct = Math.round((dept.headcount / 48) * 100);
              return (
                <div key={dept.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-bold text-[#1b1b1d]">{dept.name}</span>
                    <span className="font-mono font-semibold text-[#505f76]">
                      {dept.headcount} Staff ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#f6f3f5] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#131b2e] transition-all duration-500"
                      style={{ width: `${Math.min(pct * 2, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11.5px] text-[#76777d]">
                    Lead: {dept.headOfDept} • Budget: ₹{(dept.budgetAllocated / 100000).toFixed(0)} Lakhs
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 2: Monthly Payroll Cost Trajectory */}
        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#1b1b1d]">Monthly Payroll Cost Trajectory</h2>
            <span className="text-[12px] font-semibold text-[#505f76]">Last 6 Months (Lakhs INR)</span>
          </div>

          <div className="space-y-3 pt-2">
            {monthlyPayrollTrend.map((point) => (
              <div key={point.month} className="space-y-1">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-[#1b1b1d]">{point.month}</span>
                  <span className="font-mono font-bold text-emerald-800">
                    ₹{point.amount.toFixed(2)} Lakhs ({point.headcount} Staff)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#f6f3f5] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${(point.amount / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/60 text-[12px] text-blue-900 mt-4">
            Steady 2.4% monthly expansion aligned with planned engineering and product talent hiring.
          </div>
        </div>
      </div>
    </div>
  );
};
