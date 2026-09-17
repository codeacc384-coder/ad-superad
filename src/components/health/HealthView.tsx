import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Database,
  Cpu,
  HardDrive,
  ShieldCheck,
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import { PlatformService, HealthStatus } from '../../types';

export const HealthView: React.FC = () => {
  const { services, toggleServiceStatus, addToast } = useApp();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const safeServices = services || [];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('Cluster Health Refreshed', 'Telemetry pinged across 8 cluster nodes. All systems operational.', 'success');
    }, 600);
  };

  const handleFlushCache = () => {
    addToast('Global Redis Cache Flushed', 'Cleared 4.2 GB of temporary cached tenant session queries.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform System Status & Node Health</h2>
          <p className="text-xs text-slate-500">
            Real-time infrastructure health, microservice latency telemetry, and failover monitoring
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleFlushCache}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Flush Edge Cache
          </button>
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            Run Ping Check
          </button>
        </div>
      </div>

      {/* Health Overview Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">All Microservices Fully Operational</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                99.99% Uptime (Past 90d)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero active critical outages. Kubernetes worker nodes operating within normal thermal and RAM envelopes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Global P95 Latency</span>
            <span className="text-lg font-black text-slate-900">28ms</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Database IOPS</span>
            <span className="text-lg font-black text-slate-900">14,200/s</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Connections</span>
            <span className="text-lg font-black text-slate-900">8,412</span>
          </div>
        </div>
      </div>

      {/* Microservices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {safeServices.map((svc) => (
          <div key={svc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate pr-2">{svc.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                  svc.status === 'Operational'
                    ? 'bg-emerald-100 text-emerald-700'
                    : svc.status === 'Degraded'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    svc.status === 'Operational' ? 'bg-emerald-500' : svc.status === 'Degraded' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  {svc.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Response Latency:</span>
                  <span className="font-semibold text-slate-800 font-mono">{svc.responseTimeMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Availability:</span>
                  <span className="font-semibold text-emerald-600">{svc.uptimePercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Requests / Min:</span>
                  <span className="font-semibold text-slate-800 font-mono">{svc.rpm?.toLocaleString()} RPM</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Region: {svc.region || 'us-east-1'}</span>
              <button
                onClick={() => {
                  const nextStatus: HealthStatus = svc.status === 'Operational' ? 'Degraded' : 'Operational';
                  toggleServiceStatus(svc.id, nextStatus);
                  addToast('Service Health State Updated', `${svc.name} marked as ${nextStatus}`, 'info');
                }}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Simulate Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cluster Resource Monitoring Bento */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Cluster Infrastructure Saturation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" /> CPU Core Saturation
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">32.4%</span>
              <span className="text-[11px] text-emerald-600 font-semibold">128 vCPU Allocated</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '32.4%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-600" /> RAM Memory Pool
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">54.8%</span>
              <span className="text-[11px] text-slate-500">280 GB / 512 GB</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '54.8%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-600" /> NVMe Database Storage
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">41.2%</span>
              <span className="text-[11px] text-slate-500">4.1 TB / 10 TB</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '41.2%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-600" /> WebSocket Worker Threads
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">18.6%</span>
              <span className="text-[11px] text-slate-500">8,412 open sockets</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '18.6%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
