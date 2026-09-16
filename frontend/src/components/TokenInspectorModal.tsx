import React, { useState } from 'react';
import { JITToken } from '../types/hdims';
import { Key, ShieldCheck, Copy, Check, X, Lock, Code2 } from 'lucide-react';

interface TokenInspectorModalProps {
  token: JITToken;
  isOpen: boolean;
  onClose: () => void;
  secondsRemaining: number;
}

export const TokenInspectorModal: React.FC<TokenInspectorModalProps> = ({
  token,
  isOpen,
  onClose,
  secondsRemaining,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jwtHeader = {
    alg: 'ES256',
    typ: 'JWT',
    kid: 'hdims-vault-ec256-01',
  };

  const jwtPayload = {
    sub: 'dr_alok_verma_dm',
    name: token.recipientName,
    role: token.recipientRole,
    iss: 'hdims_dynamic_abac_lattice_gateway',
    aud: 'gmch_hospital_ward_4b',
    patient_id: token.patientId,
    target_bed: 'Bed 07',
    risk_trigger: {
      score: 8,
      tier: 'TIER_3_CRITICAL',
      condition: 'Acute Physiological Desaturation & Presumed Cardiac Decompensation',
    },
    statutory_basis: 'DISHA_EMERGENCY_OVERRIDE_SECTION_4_SUB_B',
    ephemeral_scopes: [
      'abdm.fhir.diagnostic_report.cath_lab:read',
      'abdm.fhir.procedure.stent_specifications:read',
      'abdm.fhir.allergy_intolerance:read',
      'hospital.icu.resuscitation_protocol:execute',
    ],
    iat: Math.floor(Date.now() / 1000) - (2700 - secondsRemaining),
    exp: Math.floor(Date.now() / 1000) + secondsRemaining,
    ttl_seconds_remaining: secondsRemaining,
    non_repudiation_hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  };

  const simulatedCompactToken =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imhk..."' +
    '.' +
    'eyJzdWIiOiJkcl9hbG9rX3Zlcm1hX2RtIiwibmFtZSI6IkRyLiBB..."' +
    '.' +
    'MEUCIQDR7k6b3e8c9Z_xQ21oKp90LmV3X1...signature_es256_verified';

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify({ header: jwtHeader, payload: jwtPayload }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1527] border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Zero-Trust Ephemeral JIT Token Inspector
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal border border-emerald-500/30">
                  ES256 Cryptographically Signed
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Verifiable Attribute-Based Access Control (ABAC) Proof
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Status Row */}
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Token ID: <strong className="font-mono">{token.id}</strong>
              </span>
            </div>
            <span className="text-purple-300 font-bold">
              Expires in: {Math.floor(secondsRemaining / 60)}m {secondsRemaining % 60}s
            </span>
          </div>

          {/* Decoded Header */}
          <div>
            <span className="text-[11px] text-slate-400 font-sans font-semibold flex items-center gap-1.5 mb-1">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              JWT Header (JOSE)
            </span>
            <pre className="p-3 rounded-xl bg-[#070D18] border border-slate-800 text-cyan-300 overflow-x-auto text-[11px]">
              {JSON.stringify(jwtHeader, null, 2)}
            </pre>
          </div>

          {/* Decoded Payload */}
          <div>
            <span className="text-[11px] text-slate-400 font-sans font-semibold flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              JWT Claims & Dynamic ABAC Scopes
            </span>
            <pre className="p-3 rounded-xl bg-[#070D18] border border-slate-800 text-purple-300 overflow-x-auto text-[11px]">
              {JSON.stringify(jwtPayload, null, 2)}
            </pre>
          </div>

          {/* Simulated Compact Signature */}
          <div>
            <span className="text-[11px] text-slate-400 font-sans font-semibold mb-1 block">
              Raw Compact Representation
            </span>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[10px] break-all select-all">
              {simulatedCompactToken}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Auditable under DISHA Statutory Standard §4
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Proof!' : 'Copy Decoded Token'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
