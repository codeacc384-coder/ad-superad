import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Plus,
  Sliders,
  CheckCircle2,
  Building2,
  Layers,
  Search,
  Filter,
  Zap,
  X,
  Shield,
  Code
} from 'lucide-react';
import { PlatformFeature, SubscriptionPlanTier } from '../../types';

export const FeaturesView: React.FC = () => {
  const { features, updateFeatureStatus, toggleFeaturePlanTier, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const safeFeatures = features || [];

  const categories = ['all', 'Core HR', 'Finance', 'Productivity', 'Security & AI', 'Developer'];

  const filtered = safeFeatures.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.code.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allTiers: SubscriptionPlanTier[] = ['Free', 'Starter', 'Professional', 'Enterprise'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Feature Access & Plan Entitlements</h2>
          <p className="text-xs text-slate-500">
            Control progressive feature rollouts, experimental modules, and tier-based tenant capability entitlements
          </p>
        </div>

        <button
          onClick={() => addToast('Feature Configuration', 'New capability modules can be registered into the runtime registry.', 'info')}
          className="px-4 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Register Feature Module
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search features by name, code, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#4F46E5] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((flag) => {
          const isEnabled = flag.status === 'Enabled' || flag.status === 'Beta';

          return (
            <div
              key={flag.id}
              className={`bg-white p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isEnabled
                  ? 'border-indigo-200 shadow-xs ring-1 ring-indigo-50/50'
                  : 'border-slate-200 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900">{flag.name}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                        {flag.category}
                      </span>
                      {flag.status === 'Beta' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Beta
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-slate-400 mt-0.5">{flag.code}</p>
                  </div>

                  {/* Status Toggle */}
                  <select
                    value={flag.status}
                    onChange={(e) => {
                      const nextStatus = e.target.value as PlatformFeature['status'];
                      updateFeatureStatus(flag.id, nextStatus);
                      addToast('Feature Status Updated', `${flag.name} is now ${nextStatus}`, 'success');
                    }}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                      flag.status === 'Enabled'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : flag.status === 'Beta'
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Beta">Beta (Opt-in)</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{flag.description}</p>

                {/* Plan Tiers Pill Badges */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Plan Tier Entitlements:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {allTiers.map((tier) => {
                      const hasTier = flag.planTiers?.includes(tier);
                      return (
                        <button
                          key={tier}
                          onClick={() => {
                            toggleFeaturePlanTier(flag.id, tier);
                            addToast('Entitlement Modified', `${tier} tier access updated for ${flag.name}`, 'info');
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            hasTier
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Flag Meta Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong className="text-slate-800 font-bold">{flag.activeTenantsCount || 0}</strong> active tenants
                  </span>
                </div>
                {flag.betaEnrollments > 0 && (
                  <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                    {flag.betaEnrollments} beta testers
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
