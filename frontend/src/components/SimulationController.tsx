import React from 'react';
import { Vitals, ConsciousnessLevel } from '../types/hdims';
import { Sliders, RotateCcw, Zap, HeartCrack, Activity, Flame } from 'lucide-react';

interface SimulationControllerProps {
  vitals: Vitals;
  onUpdateVitals: (updated: Partial<Vitals>) => void;
  onApplyPreset: (presetName: string) => void;
  onReset: () => void;
}

export const SimulationController: React.FC<SimulationControllerProps> = ({
  vitals,
  onUpdateVitals,
  onApplyPreset,
  onReset,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0F1C33] to-[#0B1527] border border-cyan-500/40 p-4 shadow-2xl flex flex-col gap-3.5">
      {/* Dock Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Judge Interactive Simulation Dock
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-normal border border-cyan-500/30">
                Touch & Test Live Response
              </span>
            </h4>
          </div>
        </div>

        {/* 1-Click Clinical Scenario Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Scenarios:</span>
          
          <button
            onClick={() => onApplyPreset('BASELINE_NORMAL')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Activity className="w-3 h-3" />
            1. Normal Baseline
          </button>

          <button
            onClick={() => onApplyPreset('ACUTE_CARDIAC_DESATURATION')}
            className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/50 text-xs font-bold flex items-center gap-1 transition-all shadow-sm shadow-rose-950/50"
          >
            <HeartCrack className="w-3 h-3 text-rose-400" />
            2. Acute Desaturation (Crit)
          </button>

          <button
            onClick={() => onApplyPreset('SEPTIC_SHOCK')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/50 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            3. Septic Shock
          </button>

          <button
            onClick={() => onApplyPreset('POST_OP_RECOVERY')}
            className="px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-500/50 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Zap className="w-3 h-3 text-sky-400" />
            4. Post-Intervention
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-all ml-1"
            title="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SpO2 Slider */}
        <div className="flex flex-col gap-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">SpO2 Oxygen Saturation</span>
            <span className={`font-mono font-bold ${vitals.spo2 <= 91 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {vitals.spo2}%
            </span>
          </div>
          <input
            type="range"
            min="75"
            max="100"
            value={vitals.spo2}
            onChange={(e) => onUpdateVitals({ spo2: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>75% (Crit)</span>
            <span>92%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Pulse / Heart Rate Slider */}
        <div className="flex flex-col gap-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Pulse / Heart Rate</span>
            <span className={`font-mono font-bold ${vitals.pulseRate >= 120 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {vitals.pulseRate} bpm
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="160"
            value={vitals.pulseRate}
            onChange={(e) => onUpdateVitals({ pulseRate: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>40</span>
            <span>90 (Normal)</span>
            <span>160</span>
          </div>
        </div>

        {/* Systolic BP Slider */}
        <div className="flex flex-col gap-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Systolic Blood Pressure</span>
            <span className={`font-mono font-bold ${vitals.systolicBp <= 90 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {vitals.systolicBp} mmHg
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="200"
            value={vitals.systolicBp}
            onChange={(e) => onUpdateVitals({ systolicBp: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>70 (Shock)</span>
            <span>120 (Normal)</span>
            <span>200</span>
          </div>
        </div>

        {/* Respiration Rate Slider */}
        <div className="flex flex-col gap-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Respiration Rate</span>
            <span className={`font-mono font-bold ${vitals.respirationRate >= 25 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {vitals.respirationRate} /min
            </span>
          </div>
          <input
            type="range"
            min="8"
            max="36"
            value={vitals.respirationRate}
            onChange={(e) => onUpdateVitals({ respirationRate: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>8 (Bradypnea)</span>
            <span>16 (Normal)</span>
            <span>36 (Tachypnea)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
