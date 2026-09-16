import React, { useMemo, useState } from 'react';
import { Activity, ArrowRight, ChevronRight, SearchX } from 'lucide-react';
import { Patient, AlertItem, RiskTier, AuditEntry, JITToken } from '../../types/hdims';
import { calculateNEWS2 } from '../../engine/news2Engine';
import { RiskMonitorPanel } from '../RiskMonitorPanel';

interface Props {
  patients: Patient[];
  alerts: AlertItem[];
  onSelectPatient: (patient: Patient) => void;
  onNavigateToEscalation: () => void;
  monitoredPatient: Patient;
  riskHistory: { score: number; at: string }[];
  activeToken: JITToken | null;
  recentLog?: AuditEntry;
  lastEnteredAt?: string;
  testCount: number;
  onOpenClinic: () => void;
  onOpenPatient: () => void;
  onOpenAccess: () => void;
  onOpenAudit: () => void;
}

type Filter = 'ALL' | RiskTier;
const label: Record<RiskTier, string> = { LOW: 'Stable', MEDIUM: 'Review soon', CRITICAL: 'Urgent review' };
const pill: Record<RiskTier, string> = { LOW: 'bg-[#e9f2e5] text-[#315b39]', MEDIUM: 'bg-amber-100 text-amber-900', CRITICAL: 'bg-rose-100 text-rose-800' };

export const DashboardView: React.FC<Props> = ({ patients, alerts, onSelectPatient, onNavigateToEscalation, monitoredPatient, riskHistory, activeToken, recentLog, lastEnteredAt, testCount, onOpenClinic, onOpenPatient, onOpenAccess, onOpenAudit }) => {
  const [filter, setFilter] = useState<Filter>('ALL');
  const scored = useMemo(() => patients.map(patient => ({ patient, score: calculateNEWS2(patient.vitals) })).sort((a, b) => b.score.total - a.score.total), [patients]);
  const counts = { CRITICAL: scored.filter(row => row.score.tier === 'CRITICAL').length, MEDIUM: scored.filter(row => row.score.tier === 'MEDIUM').length, LOW: scored.filter(row => row.score.tier === 'LOW').length };
  const visible = scored.filter(row => filter === 'ALL' || row.score.tier === filter);

  return <div className="hdims-dashboard mx-auto max-w-[1400px] px-5 py-7 md:px-8 md:py-9">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#63805d]">HDIMS · Community care</p><h2 className="mt-2 text-4xl font-extrabold tracking-tight text-[#17281c] md:text-5xl">Patient risk monitor</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">A clear view of who needs attention, what changed, and who can respond.</p></div><span className="rounded-full border border-[#dce7d6] bg-white px-4 py-2 text-xs font-semibold text-[#58754d]">Live backend</span></div>

    <RiskMonitorPanel patient={monitoredPatient} history={riskHistory} token={activeToken} recentLog={recentLog} enteredAt={lastEnteredAt} testCount={testCount} onOpenClinic={onOpenClinic} onOpenPatient={onOpenPatient} onOpenAccess={onOpenAccess} onOpenAudit={onOpenAudit} />

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.75fr)]">
      <section className="overflow-hidden rounded-[26px] border border-[#dfe8da] bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9eee6] px-5 py-5 md:px-6"><div><h3 className="text-xl font-bold text-[#17281c]">People to watch</h3><p className="mt-1 text-sm text-slate-500">Select a patient to update the monitor above</p></div><span className="text-sm font-semibold text-[#315b39]">{patients.length} patients</span></div><div className="flex flex-wrap gap-2 border-b border-[#e9eee6] px-5 py-3 md:px-6" aria-label="Filter patients by risk">{(['ALL', 'CRITICAL', 'MEDIUM', 'LOW'] as Filter[]).map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${filter === item ? 'bg-[#24472b] text-white' : 'bg-[#f3f6f0] text-[#456747] hover:bg-[#e8f0e4]'}`}>{item === 'ALL' ? `All ${patients.length}` : `${label[item]} ${counts[item]}`}</button>)}</div><div className="divide-y divide-[#edf1e9]">{visible.length ? visible.map(({ patient, score }) => <button key={patient.id} onClick={() => onSelectPatient(patient)} aria-current={patient.id === monitoredPatient.id ? 'true' : undefined} className={`flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[#f6faf3] md:px-6 ${patient.id === monitoredPatient.id ? 'bg-[#f8fbf5]' : ''}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8f0e4] text-xs font-extrabold text-[#315b39]">{patient.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#17281c]">{patient.name}</strong><small className="text-xs text-slate-500">{patient.age} years · {patient.id}</small></span><span className="text-lg font-extrabold tabular-nums text-[#17281c]">{score.total}</span><span className={`hidden rounded-full px-3 py-1.5 text-xs font-bold sm:inline-block ${pill[score.tier]}`}>{label[score.tier]}</span><ChevronRight size={17} className="text-slate-400" /></button>) : <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-slate-500"><SearchX size={22} /><strong className="text-sm">No patients in this view</strong></div>}</div></section>
      <div className="space-y-5"><section className="rounded-[26px] border border-[#dfe8da] bg-white p-5 shadow-sm md:p-6"><div className="flex items-center gap-2"><Activity size={19} className="text-[#63805d]" /><h3 className="text-lg font-bold text-[#17281c]">Attention today</h3></div><div className="mt-5 space-y-3">{(['CRITICAL', 'MEDIUM', 'LOW'] as RiskTier[]).map(tier => <button key={tier} onClick={() => setFilter(tier)} className="flex w-full items-center justify-between rounded-2xl bg-[#f7f9f5] px-4 py-3 text-left hover:bg-[#edf4e9]"><span className="text-sm font-semibold text-[#29442e]">{label[tier]}</span><strong className="text-xl text-[#17281c]">{counts[tier]}</strong></button>)}</div><button onClick={onNavigateToEscalation} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#38643e] underline underline-offset-4">Open response workflow <ArrowRight size={16} /></button></section><section className="rounded-[26px] border border-[#dfe8da] bg-white p-5 shadow-sm md:p-6"><h3 className="text-lg font-bold text-[#17281c]">Recent activity</h3><p className="mt-1 text-xs text-slate-500">Examples from the supplied project</p><div className="mt-4 divide-y divide-[#edf1e9]">{alerts.slice(0, 3).map(alert => <div key={alert.id} className="py-3"><strong className="block text-sm text-[#17281c]">{alert.title}</strong><span className="mt-1 block text-xs text-slate-500">{alert.subtitle}</span></div>)}</div></section></div>
    </div>
    <p className="mt-6 text-xs leading-relaxed text-slate-500">A score supports a clinician’s assessment; it does not replace it. Trend and record availability are shown as context, not a validated prediction of future events.</p>
  </div>;
};
