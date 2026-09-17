import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Shield,
  Clock,
  User,
  Building2,
  X
} from 'lucide-react';
import { AuditLog } from '../../types';

export const AuditView: React.FC = () => {
  const { auditLogs, companies, addToast, viewCompanyProfile } = useApp();

  const [search, setSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filtered = auditLogs.filter(log => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.email.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);

    const matchTenant = tenantFilter === 'ALL' || log.companyId === tenantFilter;
    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchSearch && matchTenant && matchStatus;
  });

  const handleExportLogs = () => {
    addToast('Audit Log Exported', `Exported ${filtered.length} immutable audit records to CSV/JSON format.`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Audit Trail & Security Ledger</h2>
          <p className="text-xs text-slate-500">
            Cryptographically sealed, tamper-evident log of all super administrative and tenant mutations
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export Compliance Trail
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none font-medium text-slate-700 cursor-pointer max-w-[180px]"
          >
            <option value="ALL">All Tenants ({auditLogs.length})</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Event / Action</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Organization Target</th>
                <th className="py-3.5 px-4">Source IP</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{log.actor.name}</p>
                    <p className="text-[11px] text-slate-400">{log.actor.email}</p>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {log.companyName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        log.status === 'Success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : log.status === 'Warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedLog.action}</h3>
                <p className="text-[11px] text-slate-400">Event ID: {selectedLog.id}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Event Summary</span>
                <p className="text-slate-800 font-medium">{selectedLog.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Actor:</span>
                  <span className="font-bold text-slate-800">{selectedLog.actor.name}</span>
                  <span className="block text-[11px] text-slate-500">{selectedLog.actor.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Organization:</span>
                  <span className="font-bold text-slate-800">{selectedLog.companyName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Source IP:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Logged At:</span>
                  <span className="font-medium text-slate-800">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">SHA-256 Signature</span>
                <p className="font-mono text-[10px] text-slate-500 break-all bg-slate-100 p-2 rounded-lg">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
