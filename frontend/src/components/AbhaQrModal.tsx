import React from 'react';
import { Patient, NEWS2Score } from '../types/hdims';
import { QrCode, ShieldCheck, X, Download, Stethoscope, AlertTriangle, Pill, Heart, Zap, FileText } from 'lucide-react';

interface AbhaQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentScore: NEWS2Score;
}

export const AbhaQrModal: React.FC<AbhaQrModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentScore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1527] border border-cyan-500/40 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ABHA Digital Health QR Code & 5-Second Doctor Digest
              </h3>
              <p className="text-xs text-slate-400">
                Instant clinician situational awareness without reading 50 pages of paperwork
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column: The ABHA QR ID Card */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900 via-[#0A162B] to-[#071120] border border-cyan-500/30 flex flex-col items-center text-center justify-between shadow-lg">
              <div className="w-full pb-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Ayushman Bharat
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>

              {/* Simulated QR Code Graphic */}
              <div className="my-3 p-3 bg-white rounded-xl shadow-md border-2 border-cyan-400 flex flex-col items-center">
                <svg
                  className="w-32 h-32 text-slate-950"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="25" height="25" fill="#000" />
                  <rect x="9" y="9" width="17" height="17" fill="#fff" />
                  <rect x="13" y="13" width="9" height="9" fill="#000" />

                  <rect x="70" y="5" width="25" height="25" fill="#000" />
                  <rect x="74" y="9" width="17" height="17" fill="#fff" />
                  <rect x="78" y="13" width="9" height="9" fill="#000" />

                  <rect x="5" y="70" width="25" height="25" fill="#000" />
                  <rect x="9" y="74" width="17" height="17" fill="#fff" />
                  <rect x="13" y="78" width="9" height="9" fill="#000" />

                  {/* Matrix Patterns */}
                  <rect x="35" y="10" width="6" height="6" fill="#000" />
                  <rect x="45" y="15" width="8" height="8" fill="#000" />
                  <rect x="58" y="10" width="6" height="6" fill="#000" />
                  <rect x="10" y="35" width="7" height="7" fill="#000" />
                  <rect x="25" y="45" width="8" height="8" fill="#000" />
                  <rect x="38" y="35" width="24" height="24" fill="#0077B6" />
                  <rect x="70" y="40" width="8" height="8" fill="#000" />
                  <rect x="85" y="45" width="6" height="6" fill="#000" />
                  <rect x="35" y="70" width="8" height="8" fill="#000" />
                  <rect x="50" y="75" width="12" height="12" fill="#000" />
                  <rect x="75" y="75" width="15" height="15" fill="#000" />
                </svg>
                <span className="text-[9px] text-slate-800 font-mono font-bold mt-1">
                  ABHA Scan: Verified
                </span>
              </div>

              <div className="w-full">
                <div className="text-sm font-bold text-white">{patient.name}</div>
                <div className="text-[11px] text-slate-400">
                  {patient.age}y / {patient.gender === 'M' ? 'Male' : 'Female'} • {patient.bedNumber}
                </div>
                <div className="mt-1 p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300">
                  {patient.abhaId}
                </div>
              </div>
            </div>

            {/* Right 2 Columns: The 5-Second Clinician Digest */}
            <div className="md:col-span-2 flex flex-col justify-between gap-3">
              {/* Alert / Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    5-Second Clinical Fast-Brief
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentScore.tier === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {currentScore.tierLabel}
                  </span>
                </div>

                {/* Grid of Key Clinical Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Diagnosis */}
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-cyan-400" />
                      PRIMARY DIAGNOSIS
                    </div>
                    <div className="font-semibold text-slate-200 mt-0.5">
                      {patient.admissionDiagnosis}
                    </div>
                  </div>

                  {/* Stent Spec */}
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-purple-400" />
                      CARDIAC IMPLANT HISTORY
                    </div>
                    <div className="font-semibold text-purple-200 mt-0.5">
                      {patient.history.stentDetails}
                    </div>
                  </div>
                </div>

                {/* Fatal Allergies */}
                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs">
                  <div className="text-[10px] font-bold text-rose-400 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    CRITICAL CONTRAINDICATIONS & ALLERGIES
                  </div>
                  <div className="text-rose-200 text-[11px] font-mono">
                    {patient.history.criticalAllergies.join(' • ')}
                  </div>
                </div>

                {/* Active Prescriptions */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="text-[10px] font-bold text-cyan-400 flex items-center gap-1 mb-1">
                    <Pill className="w-3.5 h-3.5" />
                    ACTIVE PRESCRIPTION REGIMEN
                  </div>
                  <div className="text-slate-300 text-[11px] font-mono">
                    {patient.prescriptions.map((p) => `${p.medicineName} (${p.dosage})`).join(' • ')}
                  </div>
                </div>
              </div>

              {/* Instant Clinician Action Recommendation */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-slate-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300">Doctor's Action Summary: </strong>
                  Patient's vitals are monitored at 1 Hz. If SpO2 drops below doctor's threshold, 
                  the emergency cardiac catheterization vault unmasks automatically with zero patient interaction required.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            National Health Authority (NHA) ABDM QR Spec v3.2
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Print / Save Digest
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
