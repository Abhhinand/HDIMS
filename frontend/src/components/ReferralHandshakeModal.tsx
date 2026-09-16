import React, { useState } from 'react';
import { Patient, NEWS2Score } from '../types/hdims';
import { Ambulance, CheckCircle2, ShieldCheck, X, Navigation, Radio, Key, Clock, Hospital } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

interface ReferralHandshakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentScore: NEWS2Score;
  onReferralDispatched: (logText: string) => void;
}

export const ReferralHandshakeModal: React.FC<ReferralHandshakeModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentScore,
  onReferralDispatched,
}) => {
  const [dispatched, setDispatched] = useState<boolean>(false);

  if (!isOpen) return null;

  const { referralHospital } = patient;

  const handleDispatch = () => {
    soundEngine.playEmergencyChime();
    setDispatched(true);
    onReferralDispatched(
      `CROSS-HOSPITAL REFERRAL HANDSHAKE: Live telemetry token minted for ${referralHospital.name}. Receiving Physician: ${referralHospital.receivingPhysician}. 2 Cardiac ICU beds locked.`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1527] border border-cyan-500/40 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Cross-Hospital Green Corridor Referral Handshake
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-normal border border-purple-500/30">
                  Pre-Provisioning Protocol
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pre-authorizes the destination ICU specialist team before transit begins
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

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Destination Hospital Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Hospital className="w-4 h-4 text-cyan-400" />
                {referralHospital.name}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {referralHospital.icuCapacity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-300 text-xs">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">Receiving Consultant:</span>
                <div className="font-semibold text-white mt-0.5">{referralHospital.receivingPhysician}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">Green Corridor Transit:</span>
                <div className="font-semibold text-cyan-300 mt-0.5">
                  {referralHospital.transitTimeMins} mins ({referralHospital.distanceKm} km)
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Status Card */}
          {dispatched ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                HANDSHAKE ACTIVE: Live Telemetry Pre-Provisioned to AIIMS
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">
                The receiving cardiac team at AIIMS has been issued an ephemeral token. 
                They can view Ramesh Kumar's live ECG waveform, stent records, and current NEWS2 score ({currentScore.total}) 
                in their Cath Lab dashboard while the ambulance is en route.
              </p>
              <div className="p-2 rounded bg-slate-950 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                <span>Ambulance Telemetry Link: 108-GPS-LIVESTREAM</span>
                <span className="text-emerald-400 font-bold">STATUS: STREAMING</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-slate-300 text-xs leading-relaxed space-y-1">
              <div className="text-purple-300 font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Why this stands apart from traditional referrals:
              </div>
              <p className="text-slate-300">
                Normally, a referred patient arrives at a new hospital with zero history, and doctors start from scratch. 
                HDIMS <strong>pre-provisions the destination team before the crisis peaks</strong>, eliminating 45 minutes of critical triage delay.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Inter-Hospital Protocol §11.4
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
            >
              Close
            </button>
            {!dispatched ? (
              <button
                onClick={handleDispatch}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <Radio className="w-3.5 h-3.5" />
                Initiate Green Corridor Handshake
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                Handshake Confirmed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
