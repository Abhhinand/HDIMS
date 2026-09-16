import React, { useState } from 'react';
import { EscalationItem } from '../../types/hdims';
import { 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  ArrowRight,
  BellRing,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';

interface EscalationCenterViewProps {
  escalationItems: EscalationItem[];
  onTriggerAction: (item: EscalationItem) => void;
}

export const EscalationCenterView: React.FC<EscalationCenterViewProps> = ({
  escalationItems,
  onTriggerAction,
}) => {
  const [notifiedMap, setNotifiedMap] = useState<Record<string, boolean>>({});

  const handleAction = (item: EscalationItem) => {
    soundEngine.playEmergencyChime();
    setNotifiedMap((prev) => ({ ...prev, [item.id]: true }));
    onTriggerAction(item);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Title Header matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Escalation Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Patients that require immediate attention and access review
          </p>
        </div>
      </div>

      {/* Top Warning Banner matching screenshot */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
            !
          </div>
          <div>
            <span className="font-bold text-rose-800 block">
              1 Patient requires immediate attention
            </span>
            <span className="text-rose-600">
              Based on recent risk score trends and vital desaturation
            </span>
          </div>
        </div>

        <button className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Escalation Patient Cards List matching screenshot */}
      <div className="flex flex-col gap-4">
        {escalationItems.map((item) => {
          let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
          let btnColor = 'bg-slate-800 hover:bg-slate-700 text-white';

          if (item.riskTier === 'HIGH') {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
            btnColor = 'bg-rose-600 hover:bg-rose-500 text-white';
          } else if (item.riskTier === 'MEDIUM') {
            badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
            btnColor = 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold';
          }

          const isDone = notifiedMap[item.id];

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 hover:border-slate-300 transition"
            >
              {/* Patient Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700">
                  {item.patientName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">{item.patientName}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                      {item.riskTier === 'HIGH' ? `High Risk • NEWS2: ${item.news2Score}` : item.riskTier === 'MEDIUM' ? `Medium Risk • NEWS2: ${item.news2Score}` : `Low Risk • NEWS2: ${item.news2Score}`}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">
                    {item.patientId} • {item.wardBed}
                  </div>
                </div>
              </div>

              {/* Suggested Team matching screenshot */}
              <div className="flex flex-col text-xs">
                <span className="text-slate-400 font-medium">Suggested Team:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.suggestedTeam.map((team, tIdx) => (
                    <span key={tIdx} className="font-semibold text-slate-700">
                      {team}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button matching screenshot */}
              <div>
                {!isDone ? (
                  <button
                    onClick={() => handleAction(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${btnColor}`}
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{item.actionLabel}</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Dispatched
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Privacy Safeguard Callout matching screenshot */}
      <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 flex items-center gap-3 text-xs text-slate-700">
        <ShieldCheck className="w-5 h-5 text-cyan-600 flex-shrink-0" />
        <div>
          <strong className="text-cyan-900">PRIVACY SAFEGUARD: </strong>
          <span>Pre-authorizations and specialist emergency JIT tokens expire automatically after 45 minutes with zero lingering access.</span>
        </div>
      </div>
    </div>
  );
};
