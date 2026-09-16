import React from 'react';
import { MOCK_SECURITY_GUARDRAILS } from '../data/mockPatients';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  FileText, 
  KeyRound, 
  AlertTriangle,
  Download
} from 'lucide-react';

interface SecurityGuardrailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityGuardrailsDrawer: React.FC<SecurityGuardrailsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Healthcare Security &amp; Confidentiality Guardrails
              </h3>
              <p className="text-xs text-slate-500">
                DISHA 2026 §4 &amp; DPDP Act 2023 §7(a) Automated Enforcement Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrails List */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span><strong>All 5 Active Guardrails are currently ENFORCED.</strong> Zero standing privilege is maintained.</span>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_SECURITY_GUARDRAILS.map((gr) => (
              <div
                key={gr.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2 hover:border-cyan-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-900">{gr.title}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                    {gr.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {gr.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-500">{gr.category}</span>
                  <span className="font-mono text-cyan-700 font-medium">{gr.statutoryBasis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Compliance: NRCES / ABDM Gateway Level 3</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
