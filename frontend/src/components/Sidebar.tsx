import React from 'react';
import { NavPage } from '../types/hdims';
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  ScrollText, 
  HeartHandshake, 
  AlertOctagon, 
  Settings,
  ShieldAlert,
  Sparkles,
  ClipboardList,
  HousePlus
} from 'lucide-react';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  escalationCount: number;
  onOpenOcrModal: () => void;
  onOpenGuardrails: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  escalationCount,
  onOpenOcrModal,
  onOpenGuardrails,
}) => {
  const navItems: { id: NavPage; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'DASHBOARD', label: 'Risk view', icon: LayoutDashboard },
    { id: 'CLINIC_VISIT', label: 'Clinic visit', icon: HousePlus },
    { id: 'PATIENTS', label: 'Patients', icon: Users },
    { id: 'CARE_TIMELINE', label: 'Care timeline', icon: ClipboardList },
    { id: 'ACCESS_CONTROL', label: 'Access', icon: ShieldCheck },
    { id: 'AUDIT_TRAIL', label: 'Audit', icon: ScrollText },
    { id: 'CONSENT', label: 'Consent', icon: HeartHandshake },
    { id: 'ESCALATION', label: 'Escalations', icon: AlertOctagon, badge: escalationCount },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-40 h-16 w-full flex-shrink-0 select-none border-t border-slate-200 bg-white text-slate-700 lg:static lg:flex lg:h-20 lg:flex-row lg:items-center lg:justify-between lg:border-b lg:border-t-0 lg:px-8">
      {/* Top Section */}
      <div className="flex min-w-0 flex-1 items-center justify-between">
        {/* Brand Header */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="w-10 h-10 rounded-xl bg-[#7d9d67] flex items-center justify-center text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#193020] tracking-wider flex items-center gap-1.5">
              HDIMS
            </h1>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              Healthcare Dynamic Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex h-16 flex-1 items-center justify-around gap-1 overflow-x-auto px-2 lg:h-auto lg:flex-none lg:justify-end lg:gap-0.5 lg:overflow-visible lg:rounded-full lg:bg-[#f6f7f7] lg:p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                title={item.label}
                aria-label={item.label}
                onClick={() => onNavigate(item.id)}
                className={`relative flex min-w-10 items-center justify-center rounded-full px-2 py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer lg:w-auto lg:px-3 ${
                  isActive
                    ? 'bg-[#728f5e] text-white font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute right-0 top-0 rounded-full px-1 text-[9px] font-bold lg:static lg:px-1.5 lg:py-0.5 lg:text-[10px] ${
                    isActive ? 'bg-white text-[#728f5e]' : 'bg-rose-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Tools Strip */}
        <div className="hidden px-3 mt-4 flex-col gap-2">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Clinical Tools
          </div>

          <button
            onClick={onOpenOcrModal}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 text-xs font-semibold transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Lab &amp; Rx OCR Tool</span>
          </button>

          <button
            onClick={onOpenGuardrails}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security Guardrails</span>
          </button>
        </div>
      </div>

      {/* Bottom Settings Button */}
      <div className="hidden p-4 border-t border-slate-800/80">
        <button
          onClick={() => onNavigate('SETTINGS')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>System &amp; Privacy Settings</span>
        </button>
      </div>
    </aside>
  );
};
