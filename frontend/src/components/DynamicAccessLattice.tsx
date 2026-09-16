import React from 'react';
import { CaregiverRole, RiskTier, AccessScope, JITToken, ConfidentialHistory } from '../types/hdims';
import { ROLE_DEFINITIONS } from '../engine/accessLattice';
import { Shield, Lock, Unlock, Clock, AlertTriangle, KeyRound, CheckCircle2, FileText, HeartPulse } from 'lucide-react';

interface DynamicAccessLatticeProps {
  currentRole: CaregiverRole;
  onRoleChange: (role: CaregiverRole) => void;
  riskTier: RiskTier;
  accessScope: AccessScope;
  activeJITToken: JITToken | null;
  history: ConfidentialHistory;
  secondsRemaining: number;
  onOpenTokenInspector?: () => void;
}

export const DynamicAccessLattice: React.FC<DynamicAccessLatticeProps> = ({
  currentRole,
  onRoleChange,
  riskTier,
  accessScope,
  activeJITToken,
  history,
  secondsRemaining,
  onOpenTokenInspector,
}) => {
  const currentRoleDef = ROLE_DEFINITIONS[currentRole];
  const isJITActive = activeJITToken !== null && activeJITToken.isActive;

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl bg-[#0B1527] border border-clinical-border p-5 flex flex-col gap-5 shadow-xl">
      {/* Component Title & Role Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Dynamic Access Lattice (JIT Orchestration Engine)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based & Attribute-Based Access Control (ABAC) dynamically reconfigured by clinical risk tier
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {(Object.keys(ROLE_DEFINITIONS) as CaregiverRole[]).map((roleKey) => {
            const roleDef = ROLE_DEFINITIONS[roleKey];
            const isSelected = currentRole === roleKey;
            return (
              <button
                key={roleKey}
                onClick={() => onRoleChange(roleKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {roleDef.title.split(' ')[0]} {roleDef.title.split(' ')[1] || ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Persona Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-400">
            {currentRoleDef.name.substring(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">{currentRoleDef.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentRoleDef.badgeColor}`}>
                {currentRoleDef.title}
              </span>
            </div>
            <p className="text-xs text-slate-400">{currentRoleDef.department}</p>
          </div>
        </div>

        {/* JIT Countdown or Baseline Status */}
        {isJITActive ? (
          <div className="flex flex-wrap items-center gap-2.5 px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/60 text-purple-300 shadow-md shadow-purple-950/50">
            <div className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-purple-400 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-purple-200">EPHEMERAL JIT TOKEN: </span>
                <span className="font-mono font-bold text-purple-300 ml-1">
                  {formatCountdown(secondsRemaining)} remaining
                </span>
              </div>
            </div>
            {onOpenTokenInspector && (
              <button
                onClick={onOpenTokenInspector}
                className="px-2 py-0.5 rounded-md bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 border border-purple-400/40 text-[10px] font-bold transition flex items-center gap-1 shadow-sm"
                title="View cryptographically signed JSON Web Token and ABAC claims"
              >
                <KeyRound className="w-3 h-3" />
                Inspect Proof (JWT)
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Least-Privilege Enforcement: Standard Scopes
          </div>
        )}
      </div>

      {/* Dynamic Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Cardiac Catheterization & Angiography Record (The Protected Vault) */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-4 overflow-hidden flex flex-col justify-between min-h-[170px]">
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">
                ABDM Record: Cardiac Angiography & Stent Report
              </span>
            </div>
            {accessScope.cardiacCatheterization ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Unlock className="w-3 h-3 text-emerald-400" /> UNLOCKED
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-400" /> SHIELDED
              </span>
            )}
          </div>

          {/* Body Content: Clear vs Blurred */}
          {accessScope.cardiacCatheterization ? (
            <div className="mt-3 flex flex-col gap-2 text-xs z-10 transition-opacity duration-300">
              <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                {history.cardiacCathSummary}
              </p>
              <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-[11px]">
                <strong>De-identified Stent Spec: </strong> {history.stentDetails}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Source: {history.abhaLinkedHospital}</span>
              </div>
            </div>
          ) : (
            <div className="relative mt-3 flex-1 flex flex-col items-center justify-center text-center p-3">
              {/* Fake blurred background lines */}
              <div className="absolute inset-0 filter blur-sm opacity-20 pointer-events-none select-none text-[10px] font-mono text-slate-300">
                {history.cardiacCathSummary}
              </div>
              <div className="z-10 flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  Access Restricted by Least-Privilege Protocol
                </span>
                <p className="text-[11px] text-slate-400 max-w-xs leading-snug">
                  This sensitive interventional history is shielded. If the patient deteriorates into 
                  <strong className="text-rose-400 ml-1">Tier 3 Critical Risk</strong>, HDIMS will automatically pre-provision JIT access.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Drug Allergies & Emergency Counter-Indications */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-slate-200">
                Critical Drug Allergies (ABDM Linked)
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Unlock className="w-3 h-3 text-emerald-400" /> WIDE CLINICAL SCOPE
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-2 text-xs">
            {history.criticalAllergies.map((allergy, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>{allergy}</span>
              </div>
            ))}
            <div className="mt-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <strong>Active Maintenance: </strong>
              {history.currentMaintenanceMeds.join(' • ')}
            </div>
          </div>
        </div>
      </div>

      {/* Access Permissions Breakdown Pill Strip */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium">Active Scopes for {currentRoleDef.title}:</span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            accessScope.liveVitals ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500 line-through'
          }`}>
            Live Telemetry
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            accessScope.routineMeds ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500 line-through'
          }`}>
            Routine Meds
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            accessScope.cardiacCatheterization ? 'bg-purple-500/20 text-purple-300 font-bold' : 'bg-slate-800 text-slate-500 line-through'
          }`}>
            Cardiac Cath Lab
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            accessScope.stentProcedure ? 'bg-purple-500/20 text-purple-300 font-bold' : 'bg-slate-800 text-slate-500 line-through'
          }`}>
            Stent Specifications
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            accessScope.interventionOverride ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-500 line-through'
          }`}>
            Code Blue Override
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Governed by DISHA & ABAC Dynamic Policy §12
        </div>
      </div>
    </div>
  );
};
