import React from 'react';
import { Patient } from '../../types/hdims';
import { 
  HeartHandshake, 
  ShieldCheck, 
  FileCheck, 
  AlertCircle, 
  Lock, 
  CheckCircle2, 
  Users,
  Download
} from 'lucide-react';

interface ConsentManagementViewProps {
  patients: Patient[];
  onOpenGuardrails: () => void;
}

export const ConsentManagementView: React.FC<ConsentManagementViewProps> = ({
  patients,
  onOpenGuardrails,
}) => {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Consent Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero-Touch patient consent governance &amp; statutory emergency exception tracking
          </p>
        </div>

        <button
          onClick={onOpenGuardrails}
          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>View 5 Security Guardrails</span>
        </button>
      </div>

      {/* Statutory Banner: Zero-Touch Philosophy */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 border border-cyan-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-bold flex-shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Zero Patient Operating Burden Protocol
            </h3>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              Critically ill, elderly, or rural patients cannot operate smartphone OTP apps during resuscitation. 
              HDIMS eliminates patient friction by deriving authorization dynamically from verified physiological risk under 
              <strong> DISHA Section 4</strong> and <strong>DPDP Act 2023 Section 7(a)</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-white text-cyan-800 border border-cyan-300 font-bold text-xs shadow-xs">
            ✓ Statutory Exemption Active
          </span>
        </div>
      </div>

      {/* Patient Consent Statuses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Inpatient Consent Registry (ABDM Linked)</h3>
          <span className="text-xs text-slate-400 font-medium">All 5 Inpatients Covered</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {patients.map((p) => (
            <div key={p.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                  {p.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                  <div className="text-slate-400 text-xs">
                    {p.id} • {p.bedNumber} • ABHA: {p.abhaId}
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-xs">
                <span className="text-slate-400">Consent Framework:</span>
                <span className="font-semibold text-slate-700">Admission Implied + Dynamic Emergency JIT</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Zero-Touch
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
