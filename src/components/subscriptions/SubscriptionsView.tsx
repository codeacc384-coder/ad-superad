import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Check,
  Plus,
  Edit,
  Copy,
  Archive,
  Building2,
  Users,
  HardDrive,
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { SubscriptionPlan, SubscriptionPlanTier } from '../../types';

export const SubscriptionsView: React.FC = () => {
  const {
    plans,
    companies,
    addPlan,
    updatePlan,
    duplicatePlan,
    archivePlan,
    viewCompanyProfile,
    addToast
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPlanForTenants, setSelectedPlanForTenants] = useState<SubscriptionPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form states for New / Edit Plan
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState(500);
  const [userLimit, setUserLimit] = useState(100);
  const [storageLimitGB, setStorageLimitGB] = useState(100);
  const [featuresList, setFeaturesList] = useState<string>('Employee Directory\nAutomated Payroll\nAttendance Tracking');

  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setDescription(plan.description);
    setMonthlyPrice(plan.monthlyPrice);
    setUserLimit(plan.userLimit);
    setStorageLimitGB(plan.storageLimitGB);
    setFeaturesList(plan.features.join('\n'));
    setCreateModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const splitFeatures = featuresList.split('\n').filter(f => f.trim().length > 0);

    if (editingPlan) {
      updatePlan(editingPlan.id, {
        name: planName as SubscriptionPlanTier,
        description,
        monthlyPrice,
        annualPrice: monthlyPrice * 10,
        userLimit,
        storageLimitGB,
        features: splitFeatures
      });
    } else {
      addPlan({
        name: (planName || 'Custom Plan') as SubscriptionPlanTier,
        tier: (planName || 'Starter') as SubscriptionPlanTier,
        description,
        monthlyPrice,
        annualPrice: monthlyPrice * 10,
        userLimit,
        storageLimitGB,
        features: splitFeatures,
        status: 'Active'
      });
    }

    setCreateModalOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Subscriptions & Pricing Plans</h2>
          <p className="text-xs text-slate-500">
            Define packaging tiers, seat allocations, storage ceilings, and feature matrices
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlan(null);
            setPlanName('');
            setDescription('');
            setMonthlyPrice(990);
            setUserLimit(250);
            setStorageLimitGB(250);
            setFeaturesList('Core HR Directory\nLeave Approvals\nPayroll Automation\nEmail Support');
            setCreateModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Plan Tier
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const matchingCompanies = companies.filter(c => c.plan === plan.tier);
          const totalRevMonthly = matchingCompanies.reduce((acc, c) => acc + c.monthlyPrice, 0);

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border flex flex-col justify-between p-6 transition-all relative ${
                plan.isPopular
                  ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">{plan.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      plan.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

                {/* Price */}
                <div className="mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">${plan.monthlyPrice.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-slate-400">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    ${plan.annualPrice.toLocaleString()} billed annually
                  </p>
                </div>

                {/* Quotas */}
                <div className="py-3.5 space-y-2 text-xs border-b border-slate-100">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5" /> Max Users:
                    </span>
                    <span className="font-bold">{plan.userLimit.toLocaleString()} seats</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <HardDrive className="w-3.5 h-3.5" /> Storage Cap:
                    </span>
                    <span className="font-bold">{plan.storageLimitGB} GB</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Included Features:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {(plan.features || []).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Subscribers & Actions */}
              <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
                <button
                  onClick={() => setSelectedPlanForTenants(plan)}
                  className="w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 p-2.5 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                      {matchingCompanies.length} Subscribed Tenants
                    </span>
                    <p className="text-[10px] text-slate-400">${totalRevMonthly.toLocaleString()}/mo MRR</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => duplicatePlan(plan.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Duplicate Tier"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {plan.tier !== 'Free' && (
                    <button
                      onClick={() => archivePlan(plan.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                      title="Archive Tier"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer / Modal: Subscribed Tenants Drilldown */}
      {selectedPlanForTenants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tenants on {selectedPlanForTenants.name} Plan
                </h3>
                <p className="text-xs text-slate-500">${selectedPlanForTenants.monthlyPrice}/mo per tenant</p>
              </div>
              <button
                onClick={() => setSelectedPlanForTenants(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar divide-y divide-slate-100 flex-1">
              {companies.filter(c => c.plan === selectedPlanForTenants.tier).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active companies currently enrolled on this plan.
                </div>
              ) : (
                companies
                  .filter(c => c.plan === selectedPlanForTenants.tier)
                  .map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => {
                        setSelectedPlanForTenants(null);
                        viewCompanyProfile(comp.id);
                      }}
                      className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${comp.logoBgColor} ${comp.logoTextColor} flex items-center justify-center font-bold text-xs`}>
                          {comp.logoText}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-800 group-hover:text-indigo-600">{comp.name}</p>
                          <p className="text-[11px] text-slate-400">{comp.tenantId} • {comp.employeesCount} seats used</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                        Profile →
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create or Edit Plan Tier */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-base font-bold text-slate-900">
                {editingPlan ? `Edit Tier: ${editingPlan.name}` : 'Create Subscription Plan Tier'}
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Tier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Plus"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Target audience & core value proposition"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Price ($)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">User Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={userLimit}
                    onChange={(e) => setUserLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={storageLimitGB}
                    onChange={(e) => setStorageLimitGB(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Features Included (One feature per line)
                </label>
                <textarea
                  rows={5}
                  value={featuresList}
                  onChange={(e) => setFeaturesList(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="Automated Payroll&#10;Biometric Attendance&#10;ATS Recruitment"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg shadow-xs cursor-pointer"
                >
                  {editingPlan ? 'Save Changes' : 'Publish Plan Tier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
