import React, { useState } from 'react';
import { AuditEntry } from '../types/hdims';
import { ScrollText, ChevronDown, ChevronUp, Download, ShieldCheck, MessageSquare, AlertTriangle, Key } from 'lucide-react';

interface AuditLedgerProps {
  logs: AuditEntry[];
}

export const AuditLedger: React.FC<AuditLedgerProps> = ({ logs }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

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
    <div className="rounded-2xl bg-[#0B1527] border border-clinical-border p-4 flex flex-col gap-3 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ScrollText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Explainable Plain-Language Audit Trail
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-normal border border-emerald-500/30">
                DISHA / ABDM Statutory Ledger
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            Export Legal Audit
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs transition-all"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Logs Table / Stream */}
      {isExpanded && (
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {logs.map((log) => {
            let badgeBg = 'bg-slate-800 text-slate-300';
            let Icon = ShieldCheck;

            if (log.eventType === 'JIT_GRANT') {
              badgeBg = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
              Icon = Key;
            } else if (log.eventType === 'RISK_ELEVATION') {
              badgeBg = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
              Icon = AlertTriangle;
            } else if (log.eventType === 'FAMILY_SMS') {
              badgeBg = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
              Icon = MessageSquare;
            } else if (log.eventType === 'AUTO_REVOCATION') {
              badgeBg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
              Icon = ShieldCheck;
            }

            return (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-start gap-3 text-xs hover:border-slate-700 transition-all"
              >
                <div className="font-mono text-[11px] text-slate-500 pt-0.5 flex-shrink-0">
                  {log.timestamp}
                </div>

                <div className={`p-1 rounded-md flex-shrink-0 ${badgeBg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1">
                  <p className="text-slate-200 leading-snug font-sans">
                    {log.plainLanguage}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>Target: {log.patientBed}</span>
                    <span>•</span>
                    <span>Actor: {log.actor}</span>
                    <span>•</span>
                    <span>Score: {log.riskScore} ({log.riskTier})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
