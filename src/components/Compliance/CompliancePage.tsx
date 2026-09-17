import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  Search,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  Building,
  Calendar
} from 'lucide-react';
import { MOCK_STATUTORY_FILINGS, StatutoryFiling } from '../../mockData/hrmsData';

interface CompliancePageProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, msg?: string) => void;
}

export const CompliancePage: React.FC<CompliancePageProps> = ({ onShowToast }) => {
  const [filings, setFilings] = useState<StatutoryFiling[]>(MOCK_STATUTORY_FILINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredFilings = filings.filter((f) => {
    const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesSearch =
      f.statuteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.filingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.targetMonth.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMarkFiled = (id: string) => {
    const challan = `CHALLAN_${Date.now().toString().substring(5, 12)}`;
    setFilings((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              filingStatus: 'FILED',
              challanNumber: challan,
              filedDate: '2026-08-25',
              penaltyRisk: 'NONE'
            }
          : f
      )
    );
    onShowToast('success', 'Statutory Return Filed', `Generated Challan Receipt: ${challan}`);
  };

  const getStatusBadge = (status: StatutoryFiling['filingStatus']) => {
    switch (status) {
      case 'FILED':
      case 'COMPLIANT':
        return { label: 'Filed / Compliant', bg: 'bg-emerald-100', text: 'text-emerald-900' };
      case 'DUE_SOON':
        return { label: 'Due Soon', bg: 'bg-amber-100', text: 'text-amber-900' };
      case 'OVERDUE':
        return { label: 'Overdue (Penalty)', bg: 'bg-rose-100', text: 'text-rose-900' };
      default:
        return { label: status, bg: 'bg-slate-100', text: 'text-slate-900' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#1b1b1d] tracking-tight">
              Statutory Compliance & Legal Returns
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
              100% Compliant
            </span>
          </div>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            EPFO PF Electronic Challan Returns (ECR), ESIC returns, PT Form 5A, and Form 24Q TDS deposits.
          </p>
        </div>

        <button
          onClick={() =>
            onShowToast(
              'info',
              'Audit Dossier Prepared',
              'Downloaded comprehensive Statutory Audit Pack (PDF + ECR Text files).'
            )
          }
          className="flex items-center gap-2 px-4 py-2 bg-[#131b2e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#131b2e]/90 transition-all shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Statutory Pack</span>
        </button>
      </div>

      {/* Compliance Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-emerald-700">Audit Health Score</span>
          <p className="text-[24px] font-extrabold text-emerald-900 mt-1">98.5 / 100</p>
          <p className="text-[12px] text-[#76777d] mt-0.5">Zero penalty citations recorded</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-purple-700">EPFO Electronic Challan</span>
          <p className="text-[20px] font-extrabold text-purple-900 mt-1">₹5.76 Lakhs</p>
          <p className="text-[12px] text-[#76777d] mt-0.5">Due on 15 Sept 2026</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-amber-700">ESIC Health Return</span>
          <p className="text-[20px] font-extrabold text-amber-900 mt-1">₹64.8k</p>
          <p className="text-[12px] text-[#76777d] mt-0.5">Due on 15 Sept 2026</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c6c6cd]/60 shadow-sm">
          <span className="text-[11.5px] font-bold uppercase text-blue-700">TDS 24Q Quarterly</span>
          <p className="text-[20px] font-extrabold text-blue-900 mt-1">Q1 Filed</p>
          <p className="text-[12px] text-[#76777d] mt-0.5">Q2 Due: 31 Oct 2026</p>
        </div>
      </div>

      {/* Statutory Register Table Card */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#c6c6cd]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" />
            <input
              type="text"
              placeholder="Search by statute or filing code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[13px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[13px] bg-white focus:outline-none"
          >
            <option value="ALL">All Statutory Acts ({filings.length})</option>
            <option value="EPFO_PF">Employees Provident Fund (EPF)</option>
            <option value="ESIC">Employees State Insurance (ESIC)</option>
            <option value="TDS_INCOME_TAX">Income Tax TDS</option>
            <option value="PROFESSIONAL_TAX">Professional Tax (PT)</option>
          </select>
        </div>

        {/* Filings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#f6f3f5] text-[#505f76] uppercase text-[11px] font-bold tracking-wider border-b border-[#c6c6cd]/40">
              <tr>
                <th className="px-6 py-3.5">Statutory Act & Purpose</th>
                <th className="px-6 py-3.5">Filing Frequency</th>
                <th className="px-6 py-3.5">Target Period</th>
                <th className="px-6 py-3.5">Statutory Due Date</th>
                <th className="px-6 py-3.5">Amount Payable</th>
                <th className="px-6 py-3.5">Filing Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c6c6cd]/30">
              {filteredFilings.map((filing) => {
                const badge = getStatusBadge(filing.filingStatus);
                return (
                  <tr key={filing.id} className="hover:bg-[#fcf8fa] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1b1b1d]">{filing.statuteName}</p>
                      <p className="text-[12px] text-[#505f76] font-mono">{filing.filingCode}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-[#f6f3f5] text-[11.5px] font-semibold text-[#505f76]">
                        {filing.frequency}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-[#1b1b1d]">{filing.targetMonth}</td>

                    <td className="px-6 py-4 font-mono font-semibold text-[#1b1b1d]">
                      {filing.dueDate}
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-[#1b1b1d]">
                      ₹{filing.amountDue.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                      {filing.challanNumber && (
                        <p className="text-[10.5px] font-mono text-[#76777d] mt-0.5">
                          Ref: {filing.challanNumber}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {filing.filingStatus === 'DUE_SOON' ? (
                        <button
                          onClick={() => handleMarkFiled(filing.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-[12px] hover:bg-emerald-800 transition-colors shadow-sm"
                        >
                          Mark Filed
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onShowToast(
                              'success',
                              'Challan Downloaded',
                              `Exported payment confirmation for ${filing.filingCode}.`
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#f6f3f5] text-[#131b2e] font-semibold text-[12px] hover:bg-[#eae7e9]"
                        >
                          View Challan
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
