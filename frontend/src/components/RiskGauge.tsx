import React from 'react';
import { NEWS2Score } from '../types/hdims';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface RiskGaugeProps {
  score: NEWS2Score;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const { total, tier, subscores, clinicalAction } = score;

  const isCritical = tier === 'CRITICAL';
  const isMedium = tier === 'MEDIUM';

  let gaugeColor = 'bg-emerald-500';
  let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let textGrad = 'from-emerald-400 to-teal-300';

  if (isCritical) {
    gaugeColor = 'bg-rose-500';
    badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
    textGrad = 'from-rose-400 to-red-500';
  } else if (isMedium) {
    gaugeColor = 'bg-amber-500';
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    textGrad = 'from-amber-400 to-orange-400';
  }

  const scorePercentage = Math.min(100, (total / 14) * 100);

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-clinical-border flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Clinical Deterioration Engine
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            NEWS2 Score Index
          </h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeBg}`}>
          {score.tierLabel}
        </span>
      </div>

      {/* Main Score Readout + Bar */}
      <div className="flex items-center gap-4">
        <div className={`text-3xl font-extrabold font-mono bg-gradient-to-br ${textGrad} bg-clip-text text-transparent`}>
          {total}
          <span className="text-xs font-normal text-slate-500 ml-1">/ 20</span>
        </div>

        <div className="flex-1">
          {/* Progress track */}
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${gaugeColor}`}
              style={{ width: `${Math.max(8, scorePercentage)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0-4: Low (Ward)</span>
            <span>5-6: Med (Doctor)</span>
            <span>7+: Crit (Specialist JIT)</span>
          </div>
        </div>
      </div>

      {/* Subscores Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase">Resp</span>
          <span className={`font-mono text-xs font-bold ${subscores.respirationRate > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            +{subscores.respirationRate}
          </span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase">SpO2</span>
          <span className={`font-mono text-xs font-bold ${subscores.spo2 > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            +{subscores.spo2}
          </span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase">Air/O2</span>
          <span className={`font-mono text-xs font-bold ${subscores.oxygenSupplement > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            +{subscores.oxygenSupplement}
          </span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase">Sys BP</span>
          <span className={`font-mono text-xs font-bold ${subscores.systolicBp > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            +{subscores.systolicBp}
          </span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase">Pulse</span>
          <span className={`font-mono text-xs font-bold ${subscores.pulseRate > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            +{subscores.pulseRate}
          </span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase">ACVPU</span>
          <span className={`font-mono text-xs font-bold ${subscores.consciousness > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            +{subscores.consciousness}
          </span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase">Temp</span>
          <span className={`font-mono text-xs font-bold ${subscores.temperature > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            +{subscores.temperature}
          </span>
        </div>
      </div>

      {/* Clinical Guidance */}
      <div className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
        isCritical
          ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          : isMedium
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
      }`}>
        {isCritical ? (
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
        ) : isMedium ? (
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
        ) : (
          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
        )}
        <span className="leading-snug">{clinicalAction}</span>
      </div>
    </div>
  );
};
