import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, ShieldCheck, Mail, ExternalLink, Terminal } from 'lucide-react';

interface HelpPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, msg?: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onShowToast }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-[#1b1b1d] tracking-tight">
            Enterprise HRMS Knowledge Base & Support
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold">
            24/7 SLA
          </span>
        </div>
        <p className="text-[13px] text-[#505f76] mt-0.5">
          Guides for statutory PF calculations, biometric punch sync, NACH salary batch exports, and RBAC governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#1b1b1d] text-[15px]">Payroll Calculation Manual</h3>
          <p className="text-[12.5px] text-[#505f76]">
            Understand how Gross-to-Net computations, EPF 12% rules, Professional Tax slabs, and Section 192 TDS withholdings work.
          </p>
          <button
            onClick={() => onShowToast('info', 'Docs Opened', 'Opening Indian Statutory Payroll Guide.')}
            className="text-[12.5px] font-bold text-[#131b2e] hover:underline flex items-center gap-1"
          >
            <span>View Statutory Guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#1b1b1d] text-[15px]">RBAC Security & 2FA Guide</h3>
          <p className="text-[12.5px] text-[#505f76]">
            Configuring Company Admin vs HR Manager roles, biometric turnstile webhooks, and enforcing FIDO2 hardware keys.
          </p>
          <button
            onClick={() => onShowToast('info', 'Docs Opened', 'Opening Security & Access Control Guide.')}
            className="text-[12.5px] font-bold text-[#131b2e] hover:underline flex items-center gap-1"
          >
            <span>View Security Matrix</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#1b1b1d] text-[15px]">Dedicated SaaS Support Desk</h3>
          <p className="text-[12.5px] text-[#505f76]">
            Priority enterprise phone and ticketing support for salary day cutoffs and statutory filing assistance.
          </p>
          <button
            onClick={() => onShowToast('success', 'Ticket Opened', 'Dedicated Support Agent assigned (Ticket #HD-8912).')}
            className="px-3.5 py-1.5 rounded-xl bg-[#131b2e] text-white text-[12px] font-semibold hover:bg-[#131b2e]/90"
          >
            Create Priority Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
