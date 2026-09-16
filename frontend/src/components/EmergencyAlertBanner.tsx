import React, { useState } from 'react';
import { Siren, AlertOctagon, Bell, BellOff, ArrowRight, ShieldAlert, Key, Ambulance } from 'lucide-react';
import { Patient, RiskTier, DoctorThresholds } from '../types/hdims';

interface EmergencyAlertBannerProps {
  patient: Patient;
  riskTier: RiskTier;
  news2Score: number;
  thresholds: DoctorThresholds;
  onOpenJITInspector: () => void;
  onSilenceAlarm: () => void;
  onOpenReferral?: () => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  patient,
  riskTier,
  news2Score,
  thresholds,
  onOpenJITInspector,
  onSilenceAlarm,
  onOpenReferral,
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [silenced, setSilenced] = useState(false);

  // Check if vitals breached doctor's custom threshold
  const isSpo2Breached = patient.vitals.spo2 < thresholds.lowSpo2;
  const isPulseBreached = patient.vitals.pulseRate > thresholds.highPulse;
  const isBpBreached = patient.vitals.systolicBp < thresholds.lowSystolicBp;
  const isThresholdBreached = isSpo2Breached || isPulseBreached || isBpBreached;

  const isCritical = riskTier === 'CRITICAL' || isThresholdBreached;

  if (!isCritical) return null;

  const handleSilence = () => {
    setSilenced(true);
    onSilenceAlarm();
    setTimeout(() => setSilenced(false), 120000); // 2 min silence
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-2 border-rose-500 p-4 shadow-2xl shadow-rose-950/80 animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
      {/* Background Animated Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-red-500 animate-pulse"></div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Siren and Core Deterioration Message */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/30 border border-rose-400 flex items-center justify-center text-rose-200 animate-bounce flex-shrink-0">
            <Siren className="w-6 h-6 text-rose-300" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-wider animate-pulse">
                🚨 CRITICAL CLINICAL ALERT
              </span>
              <span className="font-mono text-xs text-rose-200 font-bold">
                {patient.bedNumber} ({patient.name}, {patient.age}y)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950/80 border border-rose-400/50 text-rose-300 font-mono">
                NEWS2 Score: {news2Score} (Tier 3 Critical)
              </span>
            </div>

            <p className="text-sm font-semibold text-white mt-1 leading-snug">
              Acute Deterioration Detected:{' '}
              <span className="text-amber-300 font-mono font-bold">
                SpO2 at {patient.vitals.spo2}%
              </span>{' '}
              {isSpo2Breached && (
                <span className="text-rose-200 text-xs font-normal">
                  (Below Doctor's Custom Limit of {thresholds.lowSpo2}%)
                </span>
              )}
              {' • '}
              <span className="text-amber-300 font-mono font-bold">
                HR: {patient.vitals.pulseRate} bpm
              </span>
              {' — '}
              <strong className="text-emerald-300">
                Dr. Alok Verma (Cardiology) Paged via JIT Token
              </strong>
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-rose-200/90 mt-1.5 font-medium">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                Rapid Response Team: <strong>Standby Ward 4B</strong>
              </span>
              <span>•</span>
              <span>
                Catheterization & Stent Records: <strong className="text-emerald-300">Decrypted for Specialist</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls for Doctor */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenReferral && (
            <button
              onClick={onOpenReferral}
              className="px-3 py-1.5 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-400/60 text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-950/60 animate-pulse"
              title="Activate Cross-Hospital Green Corridor Telemetry to AIIMS"
            >
              <Ambulance className="w-3.5 h-3.5 text-purple-300" />
              Green Corridor Referral
            </button>
          )}

          <button
            onClick={onOpenJITInspector}
            className="px-3 py-1.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-purple-200 border border-purple-400/50 text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-950/50"
          >
            <Key className="w-3.5 h-3.5 text-purple-300" />
            View JIT Token Proof
          </button>

          <button
            onClick={handleSilence}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              silenced
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 border-rose-400/40'
            }`}
          >
            {silenced ? <BellOff className="w-3.5 h-3.5 text-slate-400" /> : <Bell className="w-3.5 h-3.5 text-rose-300" />}
            {silenced ? 'Silenced (2m)' : 'Silence Alarm'}
          </button>

          <button
            onClick={() => setAcknowledged(true)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              acknowledged
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-950 shadow-md'
            }`}
          >
            {acknowledged ? '✓ Acknowledged' : 'Acknowledge Alert'}
          </button>
        </div>
      </div>
    </div>
  );
};
