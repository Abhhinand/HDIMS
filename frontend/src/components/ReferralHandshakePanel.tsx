import React, { useState } from 'react';
import { Patient, NEWS2Score } from '../types/hdims';
import { Ambulance, CheckCircle2, ShieldCheck, Navigation, Radio, Key, Clock, Hospital, HeartHandshake, Phone, ArrowRight } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

interface ReferralHandshakePanelProps {
  patient: Patient;
  currentScore: NEWS2Score;
  onReferralDispatched: (logText: string) => void;
}

export const ReferralHandshakePanel: React.FC<ReferralHandshakePanelProps> = ({
  patient,
  currentScore,
  onReferralDispatched,
}) => {
  const [dispatched, setDispatched] = useState<boolean>(false);
  const { referralHospital } = patient;

  const handleDispatch = () => {
    soundEngine.playEmergencyChime();
    setDispatched(true);
    onReferralDispatched(
      `CROSS-HOSPITAL REFERRAL HANDSHAKE DISPATCHED: Encrypted live telemetry linked to ${referralHospital.name}. Receiving Physician: ${referralHospital.receivingPhysician}. 2 Cardiac ICU beds locked.`
    );
  };

  return (
    <div className="rounded-2xl bg-[#0B1527] border border-purple-500/40 p-5 shadow-2xl flex flex-col gap-5">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Cross-Hospital Green Corridor Referral Handshake
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40">
                Non-ABDM Innovation
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live encrypted telemetry uplink with advance tertiary ICU bed reservation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-400">AIIMS Telemetry Gateway: Online</span>
        </div>
      </div>

      {/* Target Hospital & Route Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receiving Hospital Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-purple-400 font-bold">
            <Hospital className="w-4 h-4" />
            <span>TERTIARY DESTINATION</span>
          </div>
          <h4 className="text-sm font-bold text-white">{referralHospital.name}</h4>
          <p className="text-xs text-slate-400">Department of Interventional Cardiology &amp; ICU</p>
          <div className="mt-2 text-xs text-slate-300">
            <span>Receiving Physician:</span>
            <div className="font-semibold text-white">{referralHospital.receivingPhysician}</div>
          </div>
        </div>

        {/* Real-time Logistics Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
            <Navigation className="w-4 h-4" />
            <span>LOGISTICS &amp; GREEN CORRIDOR</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {referralHospital.distanceKm} km • {referralHospital.transitTimeMins}m
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {referralHospital.corridorStatus}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{referralHospital.icuCapacity}</span>
          </div>
        </div>

        {/* Cryptographic Telemetry Pipeline */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <Radio className="w-4 h-4" />
            <span>TELEMETRY TUNNEL SCOPE</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Streaming live 60 FPS waveforms (ECG, SpO2, Respiration) + full ABDM longitudinal medication vault.
          </p>
          <div className="mt-auto p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300 break-all">
            TOKEN: jwt-telemetry-{patient.abhaId.replace(/-/g, '')}-aiims-green-corridor
          </div>
        </div>
      </div>

      {/* Handshake Dispatch Action */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-950/40 border border-purple-500/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-white">Statutory Handshake Authority</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pursuant to DISHA Section 4 &amp; DPDP Act Section 7(a) — Zero patient friction transfer authorization
          </p>
        </div>

        <div>
          {!dispatched ? (
            <button
              onClick={handleDispatch}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Ambulance className="w-4 h-4" />
              Dispatch Handshake &amp; Transmit Live Telemetry
            </button>
          ) : (
            <div className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              Handshake Active: AIIMS Receiving Live Vitals
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
