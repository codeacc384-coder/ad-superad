import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Calendar,
  Globe,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const revenueData = [
  { month: 'Jan', arr: 1100000, mrr: 92000, newTenants: 8 },
  { month: 'Feb', arr: 1250000, mrr: 104000, newTenants: 11 },
  { month: 'Mar', arr: 1380000, mrr: 115000, newTenants: 14 },
  { month: 'Apr', arr: 1540000, mrr: 128000, newTenants: 16 },
  { month: 'May', arr: 1720000, mrr: 143000, newTenants: 19 },
  { month: 'Jun', arr: 1910000, mrr: 159000, newTenants: 22 },
  { month: 'Jul', arr: 2050000, mrr: 171000, newTenants: 24 },
  { month: 'Aug', arr: 2210400, mrr: 184200, newTenants: 28 },
];

const industryData = [
  { name: 'Technology & SaaS', value: 45, color: '#4F46E5' },
  { name: 'Financial Services', value: 25, color: '#06B6D4' },
  { name: 'Healthcare & Biotech', value: 15, color: '#10B981' },
  { name: 'Media & Entertainment', value: 10, color: '#F59E0B' },
  { name: 'Logistics & Retail', value: 5, color: '#8B5CF6' },
];

export const AnalyticsView: React.FC = () => {
  const { companies, plans, addToast } = useApp();
  const [metricView, setMetricView] = useState<'mrr' | 'arr'>('mrr');

  const totalMRR = companies.reduce((acc, c) => acc + (c.status === 'Active' ? c.monthlyPrice : 0), 0);
  const totalEmployees = companies.reduce((acc, c) => acc + c.employeesCount, 0);
  const totalQuota = companies.reduce((acc, c) => acc + c.quotaEmployees, 0);
  const arpu = Math.round(totalMRR / (companies.filter(c => c.status === 'Active').length || 1));

  const handleExportAnalytics = () => {
    addToast('Executive Report Generated', 'Exported comprehensive SaaS metrics to PDF/CSV summary.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Analytics & Growth Intelligence</h2>
          <p className="text-xs text-slate-500">
            Real-time SaaS financial performance, unit economics, tenant churn, and capacity projections
          </p>
        </div>

        <button
          onClick={handleExportAnalytics}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export Executive Deck
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Current MRR</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">${totalMRR.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Normalized monthly recurring revenue</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">ARR Run Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">${(totalMRR * 12).toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600">+19.8% YoY</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Annualized contract value run rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Avg Revenue Per Tenant (ARPU)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">${arpu.toLocaleString()}</span>
            <span className="text-xs font-bold text-indigo-600">/month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">High enterprise tier density</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Global Seat Utilization</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {Math.round((totalEmployees / (totalQuota || 1)) * 100)}%
            </span>
            <span className="text-xs font-bold text-slate-500">
              {totalEmployees.toLocaleString()} / {totalQuota.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Occupied employee seats across cluster</p>
        </div>
      </div>

      {/* Main Growth Graph */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recurring Revenue & Expansion Velocity</h3>
            <p className="text-xs text-slate-500">Trailing 8-month trajectory with linear projection</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMetricView('mrr')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                metricView === 'mrr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              MRR ($)
            </button>
            <button
              onClick={() => setMetricView('arr')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                metricView === 'arr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ARR ($)
            </button>
          </div>
        </div>

        <div className="h-72 pt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (metricView === 'arr' ? `$${v / 1000000}M` : `$${v / 1000}k`)}
              />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, metricView.toUpperCase()]}
              />
              <Area
                type="monotone"
                dataKey={metricView === 'mrr' ? 'mrr' : 'arr'}
                stroke="#4F46E5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorArr)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Visuals: Industry Breakdown & Top 5 Tenants by Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Sector Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Industry Vertical Concentration</h3>
            <p className="text-xs text-slate-500">Tenant composition by market sector</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Tenants by Monthly Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Revenue Contributing Tenants</h3>
              <p className="text-xs text-slate-500">Highest MRR enterprise accounts</p>
            </div>
            <span className="text-xs font-bold text-slate-400">MRR Share</span>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {[...companies]
              .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
              .slice(0, 5)
              .map((c, idx) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-slate-400 w-4">#{idx + 1}</span>
                    <div className={`w-8 h-8 rounded-lg ${c.logoBgColor} ${c.logoTextColor} flex items-center justify-center font-bold text-xs`}>
                      {c.logoText}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{c.name}</p>
                      <p className="text-[11px] text-slate-400">{c.plan} • {c.employeesCount} seats</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xs text-slate-900">${c.monthlyPrice.toLocaleString()}/mo</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">${(c.monthlyPrice * 12).toLocaleString()} ARR</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
