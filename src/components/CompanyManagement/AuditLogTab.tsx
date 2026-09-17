import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  User,
  Clock,
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronUp,
  FileCode2
} from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogTabProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogTab: React.FC<AuditLogTabProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const getActionBadge = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'CREATE':
        return { label: 'CREATE', bg: 'bg-emerald-100', text: 'text-emerald-900' };
      case 'UPDATE':
        return { label: 'UPDATE', bg: 'bg-blue-100', text: 'text-blue-900' };
      case 'DELETE':
        return { label: 'DELETE', bg: 'bg-rose-100', text: 'text-rose-900' };
      case 'CONFIGURATION_CHANGE':
        return { label: 'POLICY CHANGE', bg: 'bg-purple-100', text: 'text-purple-900' };
      default:
        return { label: action, bg: 'bg-slate-100', text: 'text-slate-900' };
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch =
      log.changeSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Filter */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Statutory Audit & Policy Trail</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Immutable log of all administrative actions, profile updates, and payroll configuration modifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#76777d]" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-white focus:outline-none"
            >
              <option value="ALL">All Actions ({auditLogs.length})</option>
              <option value="UPDATE">Update Actions</option>
              <option value="CREATE">Create Actions</option>
              <option value="DELETE">Delete Actions</option>
              <option value="CONFIGURATION_CHANGE">Policy & Config</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#c6c6cd]/40 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" />
            <input
              type="text"
              placeholder="Search user, entity, or change summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[13px] focus:outline-none bg-[#fcf8fa] focus:bg-white"
            />
          </div>

          <span className="text-[12.5px] font-semibold text-[#505f76]">
            Showing {filteredLogs.length} Audit Events
          </span>
        </div>

        <div className="divide-y divide-[#c6c6cd]/30">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-[#76777d] text-[14px]">
              No audit logs recorded for this filter.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const isExpanded = expandedLogId === log.id;
              const dateStr = new Date(log.timestamp).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <div key={log.id} className="p-5 hover:bg-[#fcf8fa] transition-colors">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={`inline-block text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-[#1b1b1d]">
                          {log.changeSummary}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#505f76] mt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#76777d]" />
                            <strong className="text-[#1b1b1d]">{log.performedBy.userName}</strong> (
                            {log.performedBy.role})
                          </span>
                          <span>•</span>
                          <span className="font-mono bg-[#f6f3f5] px-2 py-0.5 rounded text-[#505f76]">
                            Target: {log.entityName} ({log.entityId})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-[#76777d]" />
                            {dateStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11.5px] font-mono text-[#76777d] hidden lg:inline">
                        IP: {log.ipAddress}
                      </span>

                      {(log.previousValue || log.newValue) && (
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="flex items-center gap-1 px-3 py-1 text-[12px] font-semibold text-[#131b2e] bg-[#f6f3f5] hover:bg-[#eae7e9] rounded-lg transition-colors"
                        >
                          <FileCode2 className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Hide Payload' : 'View Payload Diff'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded JSON diff container */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-[#131b2e] text-white font-mono text-[12px] overflow-x-auto space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {log.previousValue && (
                          <div>
                            <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1">
                              — Previous State
                            </p>
                            <pre className="p-3 bg-black/30 rounded-lg text-rose-200 overflow-x-auto">
                              {JSON.stringify(log.previousValue, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.newValue && (
                          <div>
                            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                              + New Applied State
                            </p>
                            <pre className="p-3 bg-black/30 rounded-lg text-emerald-200 overflow-x-auto">
                              {JSON.stringify(log.newValue, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
