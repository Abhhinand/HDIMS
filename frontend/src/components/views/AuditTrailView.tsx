import React, { useState } from 'react';
import { Download, ScrollText } from 'lucide-react';
import { AuditEntry, Patient } from '../../types/hdims';

interface Props { logs: AuditEntry[]; patient: Patient }

export const AuditTrailView: React.FC<Props> = ({ logs, patient }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? logs : logs.filter(log => log.patientBed.includes(patient.bedNumber) || log.patientBed.includes(patient.id));
  const exportVisible = () => {
    const blob = new Blob([JSON.stringify(visible, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hdims-demo-audit-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return <div className="mx-auto max-w-5xl space-y-5 p-5 md:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#63805d]">Readable change history</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#17281c]">Risk and access audit</h2><p className="mt-2 text-sm text-slate-600">Changes for {showAll ? 'all sample patients' : `${patient.name} (${patient.id})`}, newest first. These entries exist only in this browser session.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setShowAll(value => !value)} className="rounded-full border border-[#d4e1cf] bg-white px-4 py-2.5 text-sm font-bold text-[#315b39] hover:bg-[#f5f9f2]">{showAll ? 'Selected patient' : 'All patients'}</button><button onClick={exportVisible} className="inline-flex items-center gap-2 rounded-full bg-[#24472b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#38643e]"><Download size={16} /> Export demo log</button></div></div>
    <div className="overflow-hidden rounded-[24px] border border-[#dfe8da] bg-white shadow-sm"><div className="flex items-center gap-2 border-b border-[#e9eee6] bg-[#fbfcfa] px-5 py-4 text-sm font-bold text-[#29442e]"><ScrollText size={18} /> {visible.length} recorded events</div>{visible.length ? <ol className="divide-y divide-[#edf1e9]">{visible.map(log => <li key={log.id} className="grid gap-2 px-5 py-4 md:grid-cols-[110px_minmax(0,1fr)_115px] md:gap-4"><time className="text-xs font-semibold text-slate-500">{log.timestamp}</time><div><strong className="text-sm text-[#17281c]">{log.plainLanguage}</strong><p className="mt-1 text-xs text-slate-500">{log.actor} · {log.patientBed} · {log.eventType.replace(/_/g, ' ').toLowerCase()}</p></div><span className="h-fit rounded-full bg-[#f1f5ee] px-3 py-1.5 text-center text-xs font-bold text-[#315b39]">NEWS2 {log.riskScore} · {log.riskTier.toLowerCase()}</span></li>)}</ol> : <p className="px-5 py-10 text-center text-sm text-slate-500">No changes recorded for this patient in this session.</p>}</div>
    <p className="text-xs leading-relaxed text-slate-500">This browser log is a workflow demonstration, not a tamper-resistant clinical audit. Production use requires authenticated actors, an append-only backend ledger, verified timestamps, and access-denial records.</p>
  </div>;
};
