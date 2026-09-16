import React from 'react';
import { DashboardView, Patient, NEWS2Score } from '../types/hdims';
import { 
  Activity, 
  FileText, 
  ShieldCheck, 
  Ambulance, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  HeartCrack, 
  Wifi, 
  KeyRound,
  UserCheck
} from 'lucide-react';

interface DashboardExecutiveBarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  selectedPatient: Patient;
  currentScore: NEWS2Score;
  jitActiveCount: number;
  patientsCount: number;
  onOpenLabAnalyzer: () => void;
  onOpenAbhaQr: () => void;
}

export const DashboardExecutiveBar: React.FC<DashboardExecutiveBarProps> = ({
  currentView,
  onSelectView,
  selectedPatient,
  currentScore,
  jitActiveCount,
  patientsCount,
  onOpenLabAnalyzer,
  onOpenAbhaQr,
}) => {
  const isCritical = currentScore.tier === 'CRITICAL';

  return (
    <div className="flex flex-col gap-3.5 mb-1">
      {/* Top KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Ward Capacity & Monitoring */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ward 4B Inpatients</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white font-mono">{patientsCount}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">100% Telemetry Active</span>
          </div>
        </div>

        {/* Metric 2: Active Clinical Risk Index */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
          isCritical 
            ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/40' 
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Acuity</span>
            <HeartCrack className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-xl font-extrabold font-mono ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
              NEWS2: {currentScore.total}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isCritical ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {currentScore.tierLabel}
            </span>
          </div>
        </div>

        {/* Metric 3: Zero-Trust JIT Access Scopes */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
          jitActiveCount > 0 
            ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/40' 
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dynamic JIT Tokens</span>
            <KeyRound className={`w-3.5 h-3.5 ${jitActiveCount > 0 ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white font-mono">{jitActiveCount}</span>
            <span className={`text-[11px] font-semibold ${jitActiveCount > 0 ? 'text-purple-300' : 'text-slate-400'}`}>
              {jitActiveCount > 0 ? 'Cardiologist Granted' : 'Zero Standing Access'}
            </span>
          </div>
        </div>

        {/* Metric 4: ABDM Interoperability Sync */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ABDM Gateway FHIR</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-400 font-mono">12ms</span>
            <span className="text-[11px] text-slate-300">NRCES Certified</span>
          </div>
        </div>

        {/* Metric 5: Zero-Touch Patient Operating Burden */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Patient Burden</span>
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-cyan-400 font-mono">0 OTPs</span>
            <span className="text-[11px] text-slate-300">Elderly/Rural Ready</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Navigation Bar with Views */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C172E] via-[#0E1B38] to-[#0C172E] border border-clinical-border p-2 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 ml-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Dashboard Views:
          </span>

          {/* Option 1: Live Bedside Telemetry */}
          <button
            onClick={() => onSelectView('TELEMETRY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentView === 'TELEMETRY'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. Bedside Telemetry &amp; Waveforms</span>
          </button>

          {/* Option 2: Longitudinal EHR Profile */}
          <button
            onClick={() => onSelectView('HISTORY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentView === 'HISTORY'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Longitudinal Health Profile (ABDM)</span>
          </button>

          {/* Option 3: Dynamic JIT Access Lattice */}
          <button
            onClick={() => onSelectView('SECURITY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentView === 'SECURITY'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Zero-Trust Access Lattice &amp; JIT</span>
          </button>

          {/* Option 4: Green Corridor Referral */}
          <button
            onClick={() => onSelectView('REFERRAL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentView === 'REFERRAL'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Ambulance className="w-4 h-4" />
            <span>4. Green Corridor Referral</span>
          </button>

          {/* Option 5: Family Advocate & Legal Audit */}
          <button
            onClick={() => onSelectView('FAMILY_AUDIT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentView === 'FAMILY_AUDIT'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>5. Family SMS &amp; Legal Audit</span>
          </button>

          {/* Option 6: Unified Complete Command View */}
          <button
            onClick={() => onSelectView('UNIFIED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentView === 'UNIFIED'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>6. Unified All-In-One View</span>
          </button>
        </div>

        {/* Quick Launch Shortcuts on the Right */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onOpenAbhaQr}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5"
            title="Open patient's ABHA Digital Health Card & 5s Fast Brief"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            ABHA QR
          </button>

          <button
            onClick={onOpenLabAnalyzer}
            className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center gap-1.5"
            title="Upload laboratory documents or physical prescription slip"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            OCR Uploader
          </button>
        </div>
      </div>
    </div>
  );
};
