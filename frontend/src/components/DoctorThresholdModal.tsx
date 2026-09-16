import React from 'react';
import { DoctorThresholds, Vitals } from '../types/hdims';
import { Sliders, X, Check, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface DoctorThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholds: DoctorThresholds;
  onSaveThresholds: (updated: DoctorThresholds) => void;
  currentVitals: Vitals;
}

export const DoctorThresholdModal: React.FC<DoctorThresholdModalProps> = ({
  isOpen,
  onClose,
  thresholds,
  onSaveThresholds,
  currentVitals,
}) => {
  const [localThresholds, setLocalThresholds] = React.useState<DoctorThresholds>(thresholds);

  if (!isOpen) return null;

  const isCurrentSpo2Breached = currentVitals.spo2 < localThresholds.lowSpo2;
  const isCurrentPulseBreached = currentVitals.pulseRate > localThresholds.highPulse;

  const handleApplyPreset = (preset: 'STANDARD' | 'COPD' | 'STRICT') => {
    if (preset === 'STANDARD') {
      setLocalThresholds({ lowSpo2: 92, highPulse: 120, lowSystolicBp: 90 });
    } else if (preset === 'COPD') {
      setLocalThresholds({ lowSpo2: 88, highPulse: 125, lowSystolicBp: 85 });
    } else if (preset === 'STRICT') {
      setLocalThresholds({ lowSpo2: 94, highPulse: 110, lowSystolicBp: 100 });
    }
  };

  const handleSave = () => {
    onSaveThresholds(localThresholds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1527] border border-cyan-500/40 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Doctor Custom Alarm Cutoff & Sensitivity Controls
              </h3>
              <p className="text-[11px] text-slate-400">
                Adjust clinical measuring thresholds to trigger doctor escalation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Doctor Presets:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleApplyPreset('STANDARD')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-medium transition"
              >
                Standard (92%)
              </button>
              <button
                onClick={() => handleApplyPreset('COPD')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-medium transition"
                title="For chronic CO2 retainers where target is 88-92%"
              >
                COPD Retention (88%)
              </button>
              <button
                onClick={() => handleApplyPreset('STRICT')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-medium transition"
                title="Strict post-cardiac surgery monitoring"
              >
                Strict Post-PCI (94%)
              </button>
            </div>
          </div>

          {/* Slider 1: SpO2 Low Cutoff */}
          <div className={`p-4 rounded-xl border transition-all ${
            isCurrentSpo2Breached
              ? 'bg-rose-950/30 border-rose-500/60 ring-1 ring-rose-500/40'
              : 'bg-slate-900/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">
                SpO2 Low Alarm Threshold (Doctor Set)
              </span>
              <span className="font-mono font-bold text-base text-cyan-400">
                &lt; {localThresholds.lowSpo2}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              System alerts the doctor immediately if patient's SpO2 drops below this adjusted level.
            </p>
            <input
              type="range"
              min="85"
              max="96"
              value={localThresholds.lowSpo2}
              onChange={(e) =>
                setLocalThresholds({ ...localThresholds, lowSpo2: Number(e.target.value) })
              }
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg mt-3"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>85% (Loose)</span>
              <span>92% (Normal)</span>
              <span>96% (High Sensitivity)</span>
            </div>

            {/* Live Breach Evaluation */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Current Patient SpO2: <strong>{currentVitals.spo2}%</strong></span>
              {isCurrentSpo2Breached ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> BREACHED — ALARM TRIGGERED!
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Within Safe Range
                </span>
              )}
            </div>
          </div>

          {/* Slider 2: Pulse High Cutoff */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Heart Rate / Tachycardia Ceiling</span>
              <span className="font-mono font-bold text-base text-rose-400">
                &gt; {localThresholds.highPulse} bpm
              </span>
            </div>
            <input
              type="range"
              min="90"
              max="150"
              value={localThresholds.highPulse}
              onChange={(e) =>
                setLocalThresholds({ ...localThresholds, highPulse: Number(e.target.value) })
              }
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-3"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>90 bpm</span>
              <span>120 bpm (Standard)</span>
              <span>150 bpm</span>
            </div>
          </div>

          {/* Slider 3: Systolic BP Low Cutoff */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Systolic Blood Pressure Floor</span>
              <span className="font-mono font-bold text-base text-amber-400">
                &lt; {localThresholds.lowSystolicBp} mmHg
              </span>
            </div>
            <input
              type="range"
              min="75"
              max="110"
              value={localThresholds.lowSystolicBp}
              onChange={(e) =>
                setLocalThresholds({ ...localThresholds, lowSystolicBp: Number(e.target.value) })
              }
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg mt-3"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>75 mmHg (Shock)</span>
              <span>90 mmHg (Standard)</span>
              <span>110 mmHg</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Applies directly to Bed 07 Telemetry Guard
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Check className="w-3.5 h-3.5" />
              Save & Arm Thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
