import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  UserX,
  Globe,
  Radio,
  FileCheck,
  Cpu,
  Trash2,
  Plus
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { addToast } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [blockedIPs, setBlockedIPs] = useState<string[]>(['198.51.100.44', '203.0.113.195']);
  const [newIP, setNewIP] = useState('');

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addToast('Zero-Day Vulnerability Scan Complete', 'Scanned 14 ingress gateways and 82 API endpoints. Zero high-severity CVEs detected.', 'success');
    }, 800);
  };

  const handleAddBlockedIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIP.trim()) return;
    setBlockedIPs([...blockedIPs, newIP.trim()]);
    setNewIP('');
    addToast('IP Rule Applied', `Blocked incoming traffic from IP ${newIP.trim()}`, 'warning');
  };

  const handleRemoveIP = (ip: string) => {
    setBlockedIPs(blockedIPs.filter(i => i !== ip));
    addToast('IP Rule Removed', `Unblocked IP ${ip}`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Security Command & Compliance Center</h2>
          <p className="text-xs text-slate-500">
            SOC2 Type II compliance policies, cross-tenant isolation, threat intelligence, and zero-trust federation
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="px-4 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Running CVE Scan...' : 'Trigger Vulnerability Scan'}
        </button>
      </div>

      {/* Security Posture Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl shrink-0">
            96
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Posture Score</span>
            <h4 className="font-extrabold text-sm text-slate-900">Grade A (Robust)</h4>
            <p className="text-[11px] text-slate-500">SOC2 & ISO 27001 active</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Vault Encryption</span>
            <h4 className="font-bold text-xs text-slate-900">AES-256-GCM</h4>
            <p className="text-[11px] text-slate-500">KMS Auto-Rotation (90d)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Zero-Trust Isolation</span>
            <h4 className="font-bold text-xs text-slate-900">Row-Level Security</h4>
            <p className="text-[11px] text-slate-500">Enforced on every query</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Audit Redundancy</span>
            <h4 className="font-bold text-xs text-slate-900">Write-Once Ledger</h4>
            <p className="text-[11px] text-slate-500">Zero tampering risk</p>
          </div>
        </div>
      </div>

      {/* Security Policies Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Security Policies */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Platform Access Policies</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="font-bold text-slate-800">Enforce Multi-Factor Authentication (2FA)</p>
                <p className="text-slate-500 mt-0.5">Mandatory for all tenant administrator & Super Admin roles</p>
              </div>
              <button
                onClick={() => {
                  setEnforce2FA(!enforce2FA);
                  addToast(
                    enforce2FA ? '2FA Enforcement Relaxed' : '2FA Enforced Globally',
                    enforce2FA ? 'Tenants can now optionally opt-out.' : 'All tenant admins must configure authenticator app.',
                    'info'
                  );
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  enforce2FA ? 'bg-[#4F46E5]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    enforce2FA ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Super Admin Idle Session Timeout</p>
                <p className="text-slate-500 mt-0.5">Auto-terminate inactive console sessions</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => {
                  setSessionTimeout(e.target.value);
                  addToast('Session Policy Updated', `Idle timeout adjusted to ${e.target.value} minutes.`, 'success');
                }}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="120">2 Hours</option>
              </select>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Tenant Impersonation Audit Strictness</p>
                <p className="text-slate-500 mt-0.5">Require mandatory reason justification on impersonate</p>
              </div>
              <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">
                Always Enforced
              </span>
            </div>
          </div>
        </div>

        {/* IP Access Control Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Ingress Gateway IP Blacklist</h3>
              <span className="text-xs text-slate-500">{blockedIPs.length} Active Rules</span>
            </div>

            <form onSubmit={handleAddBlockedIP} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Enter IP or CIDR (e.g. 192.0.2.1)..."
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Block IP
              </button>
            </form>

            <div className="mt-3 space-y-2 max-h-44 overflow-y-auto custom-scrollbar">
              {blockedIPs.map((ip) => (
                <div key={ip} className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-100 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span className="font-mono font-bold text-slate-800">{ip}</span>
                    <span className="text-[10px] text-slate-400">Suspicious brute-force attempts</span>
                  </div>
                  <button
                    onClick={() => handleRemoveIP(ip)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Rules apply within 5 seconds across edge Cloudflare and AWS WAF endpoints.
          </p>
        </div>
      </div>
    </div>
  );
};
