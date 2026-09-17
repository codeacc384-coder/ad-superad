import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  User,
  MessageSquare,
  Building2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { SupportTicket, TicketPriority, TicketStatus } from '../../types';

export const SupportView: React.FC = () => {
  const {
    tickets,
    companies,
    activeTicketId,
    setActiveTicketId,
    updateTicketStatus,
    updateTicketPriority,
    addTicketMessage,
    viewCompanyProfile
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    activeTicketId ? tickets.find(t => t.id === activeTicketId) || null : tickets[0] || null
  );

  const [replyText, setReplyText] = useState('');

  // Sync active ticket
  React.useEffect(() => {
    if (activeTicketId) {
      const t = tickets.find(ticket => ticket.id === activeTicketId);
      if (t) setSelectedTicket(t);
    }
  }, [activeTicketId, tickets]);

  const filtered = tickets.filter(t => {
    const matchSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.companyName.toLowerCase().includes(search.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    addTicketMessage(selectedTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Support Desk & SLA Management</h2>
          <p className="text-xs text-slate-500">
            Tenant inquiries, critical incident response, and SLA resolution tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Avg First Response: 14 Mins (99.4% SLA Compliance)
          </span>
        </div>
      </div>

      {/* 2-Column Split: Ticket List on Left, Active Ticket Thread on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden max-h-[82vh]">
          {/* Queue Filters */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket #, tenant, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none font-medium text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Statuses ({tickets.length})</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none font-medium text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Ticket Items List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No tickets matching current filters.
              </div>
            ) : (
              filtered.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setActiveTicketId(ticket.id);
                    }}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-4 border-[#4F46E5]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-indigo-600">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : ticket.priority === 'High'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{ticket.subject}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="truncate font-semibold text-slate-700">{ticket.companyName}</span>
                      <span className="shrink-0">{ticket.createdDate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Resolution */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-[600px] max-h-[82vh] overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Top Meta */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => viewCompanyProfile(selectedTicket.companyId)}
                      className="text-xs font-bold text-slate-800 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      {selectedTicket.companyName}
                    </button>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1">{selectedTicket.subject}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => {
                      updateTicketStatus(selectedTicket.id, e.target.value as TicketStatus);
                      setSelectedTicket(prev => prev ? { ...prev, status: e.target.value as TicketStatus } : null);
                    }}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting on Customer">Waiting on Customer</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>

                  {/* Priority Dropdown */}
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => {
                      updateTicketPriority(selectedTicket.id, e.target.value as TicketPriority);
                      setSelectedTicket(prev => prev ? { ...prev, priority: e.target.value as TicketPriority } : null);
                    }}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-slate-50/30">
                {(selectedTicket?.messages || []).map((msg) => {
                  const isSuperAdmin = msg.senderRole === 'Super Admin' || msg.senderRole === 'Support Specialist';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSuperAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {msg.senderRole}
                        </span>
                        <span>• {msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed shadow-2xs ${
                          isSuperAdmin
                            ? 'bg-[#1E293B] text-white rounded-tr-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type an official administrative response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center flex-1">
              <LifeBuoy className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-bold text-sm">No ticket selected</p>
              <p className="text-xs text-slate-400">Choose a ticket from the left queue to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
