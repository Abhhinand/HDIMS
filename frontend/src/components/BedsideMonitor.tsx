import React from 'react';
import { Patient, NEWS2Score } from '../types/hdims';
import { EcgCanvas } from './EcgCanvas';
import { Heart, Wind, Droplets, Thermometer, ShieldCheck, Stethoscope, AlertCircle, QrCode, FileUp, MessageSquare } from 'lucide-react';

interface BedsideMonitorProps {
  patient: Patient;
  score: NEWS2Score;
  onOpenAbhaQr?: () => void;
  onOpenLabAnalyzer?: () => void;
  onOpenFamilySms?: () => void;
}

export const BedsideMonitor: React.FC<BedsideMonitorProps> = ({
  patient,
  score,
  onOpenAbhaQr,
  onOpenLabAnalyzer,
  onOpenFamilySms,
}) => {
  const { vitals } = patient;
  const isCritical = score.tier === 'CRITICAL';
  const isMedium = score.tier === 'MEDIUM';

  const diastolic = Math.round(vitals.systolicBp * 0.65);

  return (
    <div className="rounded-2xl bg-[#0B1527] border border-clinical-border p-5 flex flex-col gap-4 shadow-xl">
      {/* Patient Bedside Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-lg text-cyan-400">
            {patient.bedNumber}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {patient.name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                {patient.age} yrs • {patient.gender === 'M' ? 'Male' : 'Female'}
              </span>

              {/* Clickable ABHA Badge */}
              <button
                onClick={onOpenAbhaQr}
                className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 flex items-center gap-1.5 transition cursor-pointer"
                title="Click to view ABHA QR & 5-Second Clinical Fast-Digest"
              >
                <QrCode className="w-3 h-3 text-cyan-400" />
                ABHA: {patient.abhaId}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
              <span>Dx: {patient.admissionDiagnosis}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Zero-Touch Assurance Badge */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenLabAnalyzer && (
            <button
              onClick={onOpenLabAnalyzer}
              className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition"
              title="Upload lab reports or prescription slip"
            >
              <FileUp className="w-3 h-3 text-blue-400" />
              Upload Slip
            </button>
          )}

          {onOpenFamilySms && (
            <button
              onClick={onOpenFamilySms}
              className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition"
              title="View or send plain SMS to Sunil Kumar"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              Family SMS
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Zero Patient Burden Mode
          </div>
        </div>
      </div>

      {/* Real-time Tri-Channel Waveform Canvas */}
      <EcgCanvas
        pulseRate={vitals.pulseRate}
        spo2={vitals.spo2}
        respirationRate={vitals.respirationRate}
        isCritical={isCritical}
      />

      {/* Vital Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Heart Rate / Pulse */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
          vitals.pulseRate >= 131 || vitals.pulseRate <= 40
            ? 'bg-rose-950/30 border-rose-500/60 shadow-md shadow-rose-950/40'
            : vitals.pulseRate >= 111
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Pulse Rate</span>
            <Heart className={`w-4 h-4 ${vitals.pulseRate >= 111 ? 'text-rose-400 animate-ping' : 'text-cyan-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-mono font-extrabold ${
              vitals.pulseRate >= 131 || vitals.pulseRate <= 40 ? 'text-rose-400' : 'text-white'
            }`}>
              {vitals.pulseRate}
            </span>
            <span className="text-xs text-slate-400 font-mono">BPM</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">Target: 51-90</span>
        </div>

        {/* SpO2 Oxygen Saturation */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
          vitals.spo2 <= 91
            ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/50 ring-1 ring-rose-500/40'
            : vitals.spo2 <= 95
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">SpO2 Saturation</span>
            <Droplets className={`w-4 h-4 ${vitals.spo2 <= 91 ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-mono font-extrabold ${
              vitals.spo2 <= 91 ? 'text-rose-400' : vitals.spo2 <= 95 ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {vitals.spo2}
            </span>
            <span className="text-xs text-slate-400 font-mono">%</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">
            {vitals.oxygenSupplement ? 'Supplemental O2' : 'Room Air'}
          </span>
        </div>

        {/* Non-Invasive Blood Pressure (NIBP) */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
          vitals.systolicBp <= 90 || vitals.systolicBp >= 220
            ? 'bg-rose-950/30 border-rose-500/50'
            : vitals.systolicBp <= 100
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Blood Pressure</span>
            <span className="text-[10px] font-mono text-slate-500">NIBP</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-mono font-extrabold ${
              vitals.systolicBp <= 90 ? 'text-rose-400' : 'text-white'
            }`}>
              {vitals.systolicBp}/{diastolic}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">Mean: {Math.round((2 * diastolic + vitals.systolicBp) / 3)}</span>
        </div>

        {/* Respiration Rate */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
          vitals.respirationRate >= 25 || vitals.respirationRate <= 8
            ? 'bg-rose-950/30 border-rose-500/50'
            : vitals.respirationRate >= 21
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Resp Rate</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-mono font-extrabold ${
              vitals.respirationRate >= 25 || vitals.respirationRate <= 8 ? 'text-rose-400' : 'text-white'
            }`}>
              {vitals.respirationRate}
            </span>
            <span className="text-xs text-slate-400 font-mono">/min</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">Target: 12-20</span>
        </div>

        {/* Temperature */}
        <div className="p-3.5 rounded-xl border bg-slate-900/70 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Temp</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-extrabold text-white">
              {vitals.temperature.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">°C</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">Conscious: {vitals.consciousness}</span>
        </div>
      </div>
    </div>
  );
};
