import React, { useState } from 'react';
import { Patient, AuditEntry } from '../types/hdims';
import { MessageSquare, Send, ShieldCheck, Download, ScrollText, User, Phone, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

interface FamilyAuditPanelProps {
  patient: Patient;
  logs: AuditEntry[];
  onSendCustomSms: (smsText: string) => void;
}

export const FamilyAuditPanel: React.FC<FamilyAuditPanelProps> = ({
  patient,
  logs,
  onSendCustomSms,
}) => {
  const [customMsg, setCustomMsg] = useState('');
  const [messages, setMessages] = useState<string[]>([
    `[14:00 PM] GMCH Ward 4B: Patient Ramesh Kumar is under continuous monitoring. Zero action or OTP required from patient.`,
    `[14:15 PM] CLINICAL UPDATE: Dr. Alok Verma (Cardiology) has stepped in for oxygen titration. Emergency care team is actively attending.`,
    `[14:28 PM] COMFORT NOTICE: Oxygen saturation stabilized at 97%. Dual antiplatelet regimen verified against AIIMS digital history.`
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    soundEngine.playOrderConfirmation();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatted = `[${timestamp}] GMCH Ward 4B (Direct from Doctor): ${customMsg.trim()}`;
    setMessages((prev) => [...prev, formatted]);
    onSendCustomSms(customMsg.trim());
    setCustomMsg('');
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HDIMS_Plain_Language_Audit_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left Column: Family SMS Advocate Feed */}
      <div className="rounded-2xl bg-[#0B1527] border border-emerald-500/30 p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Automated Family SMS Advocate Feed
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Rural Inclusivity
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Continuous reassurance to relatives with zero patient smartphone burden
              </p>
            </div>
          </div>
        </div>

        {/* Relative Contact Info Pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-200">
              {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <Phone className="w-3.5 h-3.5" />
            <span>{patient.emergencyContact.phone}</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 flex flex-col gap-2.5 max-h-72 overflow-y-auto p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          {messages.map((msg, i) => (
            <div key={i} className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>SMS Dispatched via NIC Telecom Gateway</span>
              </div>
              {msg}
            </div>
          ))}
        </div>

        {/* Send Direct Message Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Type clinical update to Sunil Kumar..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* Right Column: Statutory Explainable Legal Audit Trail */}
      <div className="rounded-2xl bg-[#0B1527] border border-clinical-border p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Explainable Plain-Language Audit Trail
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  DISHA / ABDM Statutory
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographic immutable ledger for statutory audits and privacy compliance
              </p>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Legal JSON
          </button>
        </div>

        {/* Audit Log Stream */}
        <div className="flex-1 flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col gap-1 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono font-bold text-cyan-400">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {log.actor} ({log.actorRole})
                </span>
                <span className={`px-1.5 py-0.2 rounded font-bold ${
                  log.eventType === 'JIT_GRANT' ? 'bg-purple-900 text-purple-200' :
                  log.eventType === 'RISK_ELEVATION' ? 'bg-rose-900 text-rose-200' :
                  log.eventType === 'FAMILY_SMS' ? 'bg-emerald-900 text-emerald-200' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {log.eventType}
                </span>
              </div>
              <p className="text-slate-200 text-xs mt-1 leading-relaxed">{log.plainLanguage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
