import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Mail,
  CreditCard,
  Globe,
  Lock,
  Save,
  CheckCircle2,
  Shield,
  Server,
  Zap
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { addToast } = useApp();

  const [platformName, setPlatformName] = useState('CoreHR Global Enterprise');
  const [supportEmail, setSupportEmail] = useState('support@corehr-platform.com');
  const [billingEmail, setBillingEmail] = useState('billing@corehr-platform.com');
  const [defaultCurrency, setDefaultCurrency] = useState('USD ($)');
  const [smtpHost, setSmtpHost] = useState('smtp.postmarkapp.com');
  const [stripeLive, setStripeLive] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.corehr.com/v1/webhooks/stripe');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Platform Settings Updated', 'Global configuration changes propagated across all cluster workers.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Global Platform Configuration</h2>
          <p className="text-xs text-slate-500">
            Configure platform branding, SMTP transactional relay, Stripe gateway keys, and regional endpoints
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Card 1: Platform Branding */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Platform Identity & Brand</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Platform Brand Title</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Currency Default</label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="USD ($)">USD ($) — United States Dollar</option>
                <option value="EUR (€)">EUR (€) — Euro</option>
                <option value="GBP (£)">GBP (£) — British Pound</option>
                <option value="SGD ($)">SGD ($) — Singapore Dollar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Transactional Email / SMTP */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Mail className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Transactional Email & Notifications (SMTP)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">System Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoicing Billing Email</label>
              <input
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Gateway Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Payment Gateway & Webhooks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Stripe Billing & Automated Invoicing Gateway</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-900">Live Production Keys Connected</span>
                  <span className="block text-[11px] text-slate-500">Stripe Connect Account: acct_1K92842xL9</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Verified Nominal
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Live Webhook Endpoint</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
};
