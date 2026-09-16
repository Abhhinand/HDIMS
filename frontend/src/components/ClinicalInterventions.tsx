import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, Siren, Pill, HeartPulse, Wind } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

interface ClinicalInterventionsProps {
  isCritical: boolean;
  onExecuteOrder: (orderName: string, detail: string) => void;
  onStabilizePatient: () => void;
}

export const ClinicalInterventions: React.FC<ClinicalInterventionsProps> = ({
  isCritical,
  onExecuteOrder,
  onStabilizePatient,
}) => {
  const [executedOrders, setExecutedOrders] = useState<Record<string, boolean>>({});

  const handleOrder = (id: string, title: string, detail: string) => {
    soundEngine.playOrderConfirmation();
    setExecutedOrders((prev) => ({ ...prev, [id]: true }));
    onExecuteOrder(title, detail);
  };

  return (
    <div className={`rounded-2xl border p-4 transition-all ${
      isCritical
        ? 'bg-gradient-to-r from-rose-950/30 via-slate-900 to-purple-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
        : 'bg-slate-900/60 border-slate-800'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isCritical ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-cyan-500/20 text-cyan-400'}`}>
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Clinical Action & Emergency Intervention Tray
              {isCritical && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-normal border border-rose-500/40 animate-pulse">
                  Emergency Protocol Active
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              One-click statutory orders for on-call specialist and resuscitation team
            </p>
          </div>
        </div>

        {isCritical && (
          <button
            onClick={onStabilizePatient}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Simulate Response & Recovery
          </button>
        )}
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
        {/* Action 1 */}
        <button
          onClick={() => handleOrder('ord-1', 'STAT High-Sensitivity Troponin-I & 12-Lead ECG', 'Urgent lab order placed; ECG tech paged to Bed 07.')}
          className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
            executedOrders['ord-1']
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
              : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-200'
          }`}
        >
          <HeartPulse className={`w-4 h-4 flex-shrink-0 mt-0.5 ${executedOrders['ord-1'] ? 'text-emerald-400' : 'text-cyan-400'}`} />
          <div>
            <div className="text-xs font-bold">1. Stat Troponin-I & ECG</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {executedOrders['ord-1'] ? '✓ Ordered & Dispatched' : 'Rules out STEMI / NSTEMI'}
            </div>
          </div>
        </button>

        {/* Action 2 */}
        <button
          onClick={() => handleOrder('ord-2', 'Titrate High-Flow O2 via Non-Rebreather', 'Flow increased to 15 L/min to stabilize alveolar desaturation.')}
          className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
            executedOrders['ord-2']
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
              : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-200'
          }`}
        >
          <Wind className={`w-4 h-4 flex-shrink-0 mt-0.5 ${executedOrders['ord-2'] ? 'text-emerald-400' : 'text-sky-400'}`} />
          <div>
            <div className="text-xs font-bold">2. High-Flow O2 Titration</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {executedOrders['ord-2'] ? '✓ 15 L/min Non-Rebreather' : 'Target SpO2 &gt; 94%'}
            </div>
          </div>
        </button>

        {/* Action 3 */}
        <button
          onClick={() => handleOrder('ord-3', 'Initiate IV Anticoagulation (Heparin 70u/kg)', 'Bolus delivered under acute coronary protocol.')}
          className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
            executedOrders['ord-3']
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
              : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-200'
          }`}
        >
          <Pill className={`w-4 h-4 flex-shrink-0 mt-0.5 ${executedOrders['ord-3'] ? 'text-emerald-400' : 'text-purple-400'}`} />
          <div>
            <div className="text-xs font-bold">3. IV Anticoagulation</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {executedOrders['ord-3'] ? '✓ Heparin 5000 IU Given' : 'Prevents in-stent thrombosis'}
            </div>
          </div>
        </button>

        {/* Action 4 */}
        <button
          onClick={() => handleOrder('ord-4', 'Mobilize Emergency Cardiac Cath Lab Team', 'Cath Lab Team 2 put on 15-min standby for primary PCI.')}
          className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
            executedOrders['ord-4']
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
              : 'bg-rose-950/30 hover:bg-rose-900/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <Siren className={`w-4 h-4 flex-shrink-0 mt-0.5 ${executedOrders['ord-4'] ? 'text-emerald-400 animate-spin' : 'text-rose-400'}`} />
          <div>
            <div className="text-xs font-bold">4. Mobilize Cath Lab</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {executedOrders['ord-4'] ? '✓ Cath Lab Standby Confirmed' : 'Door-to-balloon readiness'}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
