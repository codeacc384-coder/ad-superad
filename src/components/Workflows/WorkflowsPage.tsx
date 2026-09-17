import React, { useState } from 'react';
import {
  Workflow,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { MOCK_WORKFLOWS, WorkflowRule } from '../../mockData/hrmsData';
import { Modal } from '../Modal';

interface WorkflowsPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, msg?: string) => void;
}

export const WorkflowsPage: React.FC<WorkflowsPageProps> = ({ onShowToast }) => {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(MOCK_WORKFLOWS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newRule, setNewRule] = useState({
    title: '',
    triggerEvent: 'ONBOARDING_INIT' as WorkflowRule['triggerEvent'],
    description: 'Dispatch Hardware Laptop & Welcome Email',
    slaHours: 24,
    approverRole: 'IT Ops Lead'
  });

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const next = !w.isActive;
          onShowToast(
            'info',
            'Rule Updated',
            `Automation rule "${w.title}" is now ${next ? 'Active' : 'Paused'}.`
          );
          return { ...w, isActive: next };
        }
        return w;
      })
    );
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.title.trim() || !newRule.description.trim()) {
      onShowToast('error', 'Validation Error', 'Rule Title and Description are required.');
      return;
    }

    const created: WorkflowRule = {
      id: `wf_${Date.now()}`,
      title: newRule.title,
      triggerEvent: newRule.triggerEvent,
      description: newRule.description,
      approvalLevels: [
        {
          level: 1,
          approverRole: newRule.approverRole,
          slaHours: Number(newRule.slaHours),
          autoEscalate: true
        }
      ],
      isActive: true,
      totalExecutions: 0,
      lastTriggered: 'Just now'
    };

    setWorkflows((prev) => [created, ...prev]);
    setIsCreateModalOpen(false);
    onShowToast('success', 'Workflow Created', `Automation rule "${created.title}" is armed.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#1b1b1d] tracking-tight">
              Automated Business Rules & Workflows
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold">
              {workflows.filter((w) => w.isActive).length} Rules Armed
            </span>
          </div>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Event-driven HR triggers, SLA auto-escalation matrix, and multi-tier approval chains.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#131b2e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#131b2e]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`bg-white border rounded-2xl p-5 shadow-sm transition-all space-y-4 ${
              wf.isActive
                ? 'border-[#c6c6cd]/60 hover:border-[#131b2e]'
                : 'border-dashed border-[#c6c6cd] bg-[#fcf8fa]/60 opacity-75'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-bold uppercase">
                  {wf.triggerEvent.replace(/_/g, ' ')}
                </span>
                <h3 className="font-bold text-[#1b1b1d] text-[15px] mt-1.5">{wf.title}</h3>
              </div>

              <button
                onClick={() => handleToggleWorkflow(wf.id)}
                className="p-1 text-[#131b2e] hover:opacity-80 transition-opacity"
                title={wf.isActive ? 'Disable Rule' : 'Enable Rule'}
              >
                {wf.isActive ? (
                  <ToggleRight className="w-7 h-7 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-[#76777d]" />
                )}
              </button>
            </div>

            {/* Workflow Action Step */}
            <div className="p-3 rounded-xl bg-[#f6f3f5] border border-[#c6c6cd]/40 text-[12.5px] space-y-1">
              <span className="text-[11px] font-bold uppercase text-[#505f76] flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-[#131b2e]" /> Automated Action Trigger
              </span>
              <p className="font-semibold text-[#1b1b1d]">{wf.description}</p>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between text-[12px] pt-1 border-t border-[#c6c6cd]/30 text-[#505f76]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> SLA:{' '}
                {wf.approvalLevels[0]?.slaHours || 24} Hours
              </span>
              <span>
                Approver: <strong>{wf.approvalLevels[0]?.approverRole || 'Manager'}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Workflow Automation Rule"
          size="md"
        >
          <form onSubmit={handleCreateRule} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1b1b1d] mb-1">
                Rule Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Probation Milestone 90-Day Review"
                value={newRule.title}
                onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#1b1b1d] mb-1">
                Trigger Event *
              </label>
              <select
                value={newRule.triggerEvent}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    triggerEvent: e.target.value as WorkflowRule['triggerEvent']
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] bg-white focus:outline-none"
              >
                <option value="LEAVE_APPLICATION">When Leave is Applied</option>
                <option value="ONBOARDING_INIT">When New Hire is Enrolled</option>
                <option value="SALARY_INCREMENT">When Salary Hike is Initiated</option>
                <option value="REIMBURSEMENT_CLAIM">When Expense is Claimed</option>
                <option value="ASSET_REQUEST">When Device Request is Submitted</option>
              </select>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#1b1b1d] mb-1">
                Automated Action & Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Notify Department Head & Generate Performance Questionnaire"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#1b1b1d] mb-1">
                  SLA Timeout (Hours) *
                </label>
                <input
                  type="number"
                  required
                  value={newRule.slaHours}
                  onChange={(e) => setNewRule({ ...newRule, slaHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#1b1b1d] mb-1">
                  Approver Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head of HR"
                  value={newRule.approverRole}
                  onChange={(e) => setNewRule({ ...newRule, approverRole: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd] text-[13px] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#c6c6cd]/40">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#c6c6cd] text-[13px] font-semibold text-[#505f76] hover:bg-[#f6f3f5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#131b2e] text-white text-[13px] font-semibold hover:bg-[#131b2e]/90 shadow-sm"
              >
                Arm Workflow
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
