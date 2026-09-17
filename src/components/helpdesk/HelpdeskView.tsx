import React from 'react';
import { useApp } from '../../context/useApp';

import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
  ChevronRight,
  Search,
  ExternalLink,
  LifeBuoy,
  Settings,
} from 'lucide-react';

export const HelpdeskView: React.FC = () => {
  const { setActiveTab } = useApp();

  const helpResources = [
    {
      icon: BookOpen,
      title: 'Admin Documentation',
      description:
        'Learn how to manage tenants, users, billing, security, and platform settings.',
    },
    {
      icon: FileText,
      title: 'Platform Guides',
      description:
        'Step-by-step guides for common Super Admin workflows and operations.',
    },
    {
      icon: ShieldCheck,
      title: 'Security & Access',
      description:
        'Review authentication, permissions, security controls, and account protection.',
    },
    {
      icon: Settings,
      title: 'Configuration Help',
      description:
        'Understand platform configuration, feature access, and administrative controls.',
    },
  ];

  const faqs = [
    {
      question: 'How do I manage a company tenant?',
      answer:
        'Open Tenant Management from the sidebar and select the required company to view or manage its profile.',
    },
    {
      question: 'Where can I manage customer support tickets?',
      answer:
        'Use Support Center from the sidebar. It contains the customer and company ticket queue.',
    },
    {
      question: 'Where can I update platform configuration?',
      answer:
        'Use Configuration from the sidebar or the settings icon in the header.',
    },
    {
      question: 'How can I review administrator activity?',
      answer:
        'Open Admin Profile for account information or Audit Logs for system-level activity.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* ========================================================
         HEADER
      ======================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Support & Helpdesk
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Platform assistance, resources, documentation, and administrative help.
              </p>
            </div>

          </div>

        </div>

        <button
          onClick={() => setActiveTab('support')}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            rounded-xl
            bg-[#4F46E5]
            hover:bg-[#4338CA]
            text-white
            text-xs
            font-bold
            shadow-sm
            transition-colors
          "
        >
          <LifeBuoy className="w-4 h-4" />
          Open Support Center
        </button>

      </div>

      {/* ========================================================
         SEARCH
      ======================================================== */}

      <div
        className="
          bg-gradient-to-r
          from-indigo-50
          via-white
          to-purple-50
          border
          border-indigo-100
          rounded-2xl
          p-6
        "
      >

        <div className="max-w-2xl mx-auto text-center">

          <h3 className="text-base font-extrabold text-slate-900">
            How can we help?
          </h3>

          <p className="text-xs text-slate-500 mt-1 mb-4">
            Search documentation, guides, FAQs, and administrative resources.
          </p>

          <div className="relative">

            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search help articles and resources..."
              className="
                w-full
                pl-11
                pr-4
                py-3
                bg-white
                border
                border-slate-200
                rounded-xl
                text-xs
                outline-none
                focus:ring-2
                focus:ring-indigo-500
                shadow-sm
              "
            />

          </div>

        </div>

      </div>

      {/* ========================================================
         QUICK SUPPORT
      ======================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <HelpContactCard
          icon={<MessageSquare className="w-5 h-5" />}
          title="Internal Assistance"
          description="Get assistance with platform administration and operational questions."
          action="Start Conversation"
        />

        <HelpContactCard
          icon={<Mail className="w-5 h-5" />}
          title="Email Support"
          description="Send a detailed request to the platform support team."
          action="Send Email"
        />

        <HelpContactCard
          icon={<Phone className="w-5 h-5" />}
          title="Priority Assistance"
          description="Contact the administrative support team for critical issues."
          action="Contact Support"
        />

      </div>

      {/* ========================================================
         RESOURCES
      ======================================================== */}

      <div>

        <div className="flex items-center justify-between mb-4">

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Help Resources
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Useful resources for Super Admin operations.
            </p>
          </div>

          <button
            className="
              text-xs
              font-bold
              text-indigo-600
              hover:text-indigo-700
              flex
              items-center
              gap-1
            "
          >
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {helpResources.map((resource) => {

            const Icon = resource.icon;

            return (
              <button
                key={resource.title}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-5
                  text-left
                  hover:border-indigo-200
                  hover:shadow-sm
                  hover:-translate-y-0.5
                  transition-all
                  group
                "
              >

                <div className="flex items-start gap-4">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-slate-50
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                      shrink-0
                      group-hover:bg-indigo-50
                      transition-colors
                    "
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between gap-3">

                      <h4 className="text-xs font-bold text-slate-900">
                        {resource.title}
                      </h4>

                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />

                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      {resource.description}
                    </p>

                  </div>

                </div>

              </button>
            );
          })}

        </div>

      </div>

      {/* ========================================================
         FAQ
      ======================================================== */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          shadow-xs
          overflow-hidden
        "
      >

        <div className="p-5 border-b border-slate-100">

          <h3 className="text-sm font-extrabold text-slate-900">
            Frequently Asked Questions
          </h3>

          <p className="text-[11px] text-slate-500 mt-1">
            Common questions about administration and platform operations.
          </p>

        </div>

        <div className="divide-y divide-slate-100">

          {faqs.map((faq) => (

            <button
              key={faq.question}
              className="
                w-full
                p-5
                text-left
                hover:bg-slate-50
                transition-colors
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div>

                <p className="text-xs font-bold text-slate-900">
                  {faq.question}
                </p>

                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {faq.answer}
                </p>

              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

            </button>

          ))}

        </div>

      </div>

      {/* ========================================================
         SUPPORT CENTER EXPLANATION
      ======================================================== */}

      <div
        className="
          bg-slate-900
          rounded-2xl
          p-5
          text-white
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
        "
      >

        <div className="flex items-start gap-3">

          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-4 h-4 text-indigo-300" />
          </div>

          <div>

            <h3 className="text-xs font-bold">
              Need to manage a customer issue?
            </h3>

            <p className="text-[11px] text-slate-400 mt-1">
              Customer/company tickets are handled separately in Support Center.
            </p>

          </div>

        </div>

        <button
          onClick={() => setActiveTab('support')}
          className="
            shrink-0
            px-4
            py-2
            rounded-xl
            bg-white
            text-slate-900
            text-xs
            font-bold
            hover:bg-slate-100
            transition-colors
          "
        >
          Go to Support Center
        </button>

      </div>

    </div>
  );
};

/* ============================================================
   CONTACT CARD
   ============================================================ */

interface HelpContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

const HelpContactCard: React.FC<HelpContactCardProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-5
        hover:border-indigo-200
        hover:shadow-sm
        transition-all
      "
    >

      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="text-xs font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 min-h-[34px]">
        {description}
      </p>

      <button
        className="
          mt-4
          text-[11px]
          font-bold
          text-indigo-600
          hover:text-indigo-700
          flex
          items-center
          gap-1
        "
      >
        {action}
        <ChevronRight className="w-3 h-3" />
      </button>

    </div>
  );
};