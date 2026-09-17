import React, { useState, useEffect } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  Search,
  Building2,
  Users,
  CreditCard,
  Layers,
  LifeBuoy,
  Shield,
  Puzzle,
  ChevronRight,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    companies,
    users,
    invoices,
    tickets,
    features,
    plans,
    setActiveTab,
    viewCompanyProfile,
    setActiveTicketId,
    setActiveInvoiceId
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (globalSearchOpen) {
      setQuery('');
    }
  }, [globalSearchOpen]);

  if (!globalSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedCompanies = companies.filter(
    c =>
      c.name.toLowerCase().includes(trimmed) ||
      c.tenantId.toLowerCase().includes(trimmed) ||
      c.contactEmail.toLowerCase().includes(trimmed) ||
      c.industry.toLowerCase().includes(trimmed)
  );

  const matchedUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(trimmed) ||
      u.email.toLowerCase().includes(trimmed) ||
      u.companyName.toLowerCase().includes(trimmed) ||
      u.role.toLowerCase().includes(trimmed)
  );

  const matchedInvoices = invoices.filter(
    i =>
      i.invoiceNumber.toLowerCase().includes(trimmed) ||
      i.companyName.toLowerCase().includes(trimmed) ||
      i.status.toLowerCase().includes(trimmed)
  );

  const matchedTickets = tickets.filter(
    t =>
      t.ticketNumber.toLowerCase().includes(trimmed) ||
      t.subject.toLowerCase().includes(trimmed) ||
      t.companyName.toLowerCase().includes(trimmed) ||
      t.requesterName.toLowerCase().includes(trimmed)
  );

  const matchedFeatures = features.filter(
    f =>
      f.name.toLowerCase().includes(trimmed) ||
      f.code.toLowerCase().includes(trimmed) ||
      f.category.toLowerCase().includes(trimmed)
  );

  const hasMatches =
    trimmed.length > 0 &&
    (matchedCompanies.length > 0 ||
      matchedUsers.length > 0 ||
      matchedInvoices.length > 0 ||
      matchedTickets.length > 0 ||
      matchedFeatures.length > 0);

  const navigateTo = (tab: NavTab, action?: () => void) => {
    setGlobalSearchOpen(false);
    if (action) {
      action();
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search companies, users, invoices, tickets, features..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[11px] bg-white text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {!trimmed ? (
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 mb-3">Quick Navigation Shortcuts</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => navigateTo('companies')}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-700">All Companies</span>
                </button>
                <button
                  onClick={() => navigateTo('billing')}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">Invoices & Billing</span>
                </button>
                <button
                  onClick={() => navigateTo('users')}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-semibold text-slate-700">User Directory</span>
                </button>
                <button
                  onClick={() => navigateTo('support')}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer"
                >
                  <LifeBuoy className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-semibold text-slate-700">Support Center</span>
                </button>
                <button
                  onClick={() => navigateTo('analytics')}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-slate-700">Platform Analytics</span>
                </button>
                <button
                  onClick={() => navigateTo('security')}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-slate-700">Security Center</span>
                </button>
              </div>
            </div>
          ) : !hasMatches ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching for a company name, invoice #, ticket ID, or user email.</p>
            </div>
          ) : (
            <>
              {/* Companies Results */}
              {matchedCompanies.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Companies ({matchedCompanies.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedCompanies.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => navigateTo('company-detail', () => viewCompanyProfile(c.id))}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${c.logoBgColor} ${c.logoTextColor} flex items-center justify-center font-bold text-xs shrink-0`}>
                            {c.logoText}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 flex items-center gap-2">
                              {c.name}
                              <span className="text-[10px] font-normal text-slate-400">({c.tenantId})</span>
                            </p>
                            <p className="text-[11px] text-slate-500">{c.industry} • {c.plan} Plan • {c.employeesCount} employees</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Results */}
              {matchedUsers.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Users ({matchedUsers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedUsers.slice(0, 4).map((u) => (
                      <div
                        key={u.id}
                        onClick={() => navigateTo('users')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600">
                              {u.name} <span className="text-[10px] font-normal text-slate-400">({u.role})</span>
                            </p>
                            <p className="text-[11px] text-slate-500">{u.email} • {u.companyName}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices Results */}
              {matchedInvoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Invoices ({matchedInvoices.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedInvoices.slice(0, 3).map((i) => (
                      <div
                        key={i.id}
                        onClick={() => navigateTo('billing', () => setActiveInvoiceId(i.id))}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors cursor-pointer group"
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600">
                            {i.invoiceNumber} - ${i.total.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-500">{i.companyName} • Status: {i.status}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets Results */}
              {matchedTickets.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <LifeBuoy className="w-3.5 h-3.5" />
                    <span>Support Tickets ({matchedTickets.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedTickets.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => navigateTo('support', () => setActiveTicketId(t.id))}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors cursor-pointer group"
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 truncate max-w-md">
                            [{t.ticketNumber}] {t.subject}
                          </p>
                          <p className="text-[11px] text-slate-500">{t.companyName} • Priority: {t.priority} • Status: {t.status}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Results */}
              {matchedFeatures.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Puzzle className="w-3.5 h-3.5" />
                    <span>Platform Features ({matchedFeatures.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedFeatures.slice(0, 3).map((f) => (
                      <div
                        key={f.id}
                        onClick={() => navigateTo('features')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors cursor-pointer group"
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600">
                            {f.name}
                          </p>
                          <p className="text-[11px] text-slate-500">{f.category} • Status: {f.status}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 px-4">
          <div className="flex items-center gap-3">
            <span>Tip: Press <b>ESC</b> to close</span>
            <span>•</span>
            <span>Use search to jump anywhere in the console</span>
          </div>
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="text-slate-500 hover:text-slate-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
