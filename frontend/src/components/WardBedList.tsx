import React from 'react';
import { Patient, NEWS2Score } from '../types/hdims';
import { Heart, Activity, User, ShieldAlert } from 'lucide-react';

interface WardBedListProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patient: Patient) => void;
  currentPatientScore: NEWS2Score;
}

export const WardBedList: React.FC<WardBedListProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  currentPatientScore
}) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Ward 4B Inpatients ({patients.length})
        </h2>
        <span className="text-[11px] text-slate-500 font-mono">Live Telemetry</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {patients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          
          // If selected patient, use the live reactive score, otherwise compute baseline
          const isCritical = isSelected && currentPatientScore.tier === 'CRITICAL';
          const isMedium = isSelected && currentPatientScore.tier === 'MEDIUM';

          let borderClass = 'border-slate-800 hover:border-slate-700 bg-slate-900/60';
          let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          let badgeText = 'Tier 1 • Stable';

          if (isCritical) {
            borderClass = 'border-rose-500/60 bg-rose-950/20 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/40';
            badgeBg = 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
            badgeText = `Tier 3 • CRIT (${currentPatientScore.total})`;
          } else if (isMedium) {
            borderClass = 'border-amber-500/50 bg-amber-950/20';
            badgeBg = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
            badgeText = `Tier 2 • Alert (${currentPatientScore.total})`;
          } else if (isSelected) {
            borderClass = 'border-cyan-500/50 bg-cyan-950/20 ring-1 ring-cyan-500/30';
          }

          return (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${borderClass}`}
            >
              {/* Active Indicator Bar */}
              {isSelected && (
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500"></div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-cyan-300">
                    {patient.bedNumber}
                  </span>
                  <span className="text-slate-200 font-semibold text-sm truncate max-w-[130px]">
                    {patient.name}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                  {isSelected ? badgeText : 'Tier 1 • Stable'}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" />
                  {patient.age}y / {patient.gender}
                </span>
                <span>•</span>
                <span className="truncate max-w-[150px] text-[11px] text-slate-400">
                  {patient.admissionDiagnosis}
                </span>
              </div>

              {/* Vitals preview row */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Heart className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>
                    {isSelected ? patient.vitals.pulseRate : patient.vitals.pulseRate}{' '}
                    <span className="text-[10px] text-slate-500">bpm</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-[10px] text-slate-500">SpO2:</span>
                  <span className={isSelected && patient.vitals.spo2 <= 91 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                    {isSelected ? patient.vitals.spo2 : patient.vitals.spo2}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {isSelected ? patient.vitals.systolicBp : patient.vitals.systolicBp}/
                  {Math.round((isSelected ? patient.vitals.systolicBp : patient.vitals.systolicBp) * 0.65)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Zero Burden Banner */}
      <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/20 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
          <ShieldAlert className="w-4 h-4" />
          Zero Patient Burden
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Patients are not asked to authenticate OTPs or unlock phones. HDIMS operates purely through clinical early-warning triggers.
        </p>
      </div>
    </div>
  );
};
