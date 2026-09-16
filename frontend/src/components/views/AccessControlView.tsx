import React from 'react';
import { Clock3, LockKeyhole, ShieldCheck } from 'lucide-react';
import { JITToken, Patient, RiskTier } from '../../types/hdims';
import { evaluateAccessScope } from '../../engine/accessLattice';

interface Props {
  patient: Patient;
  riskTier: RiskTier;
  activeJITToken: JITToken | null;
  onOpenTokenInspector: () => void;
}

const labels = [
  { role: 'STAFF_NURSE', title: 'Assigned nurse', purpose: 'Routine observations and medication review' },
  { role: 'ATTENDING_PHYSICIAN', title: 'Attending physician', purpose: 'Clinical assessment and care plan' },
  { role: 'ON_CALL_CARDIOLOGIST', title: 'On-call specialist', purpose: 'Escalation review when risk rises' },
  { role: 'RAPID_RESPONSE_LEAD', title: 'Rapid-response team', purpose: 'Critical-risk response' },
] as const;

export const AccessControlView: React.FC<Props> = ({ patient, riskTier, activeJITToken, onOpenTokenInspector }) => {
  const token = activeJITToken?.patientId === patient.id && activeJITToken.expiresAt > Date.now() ? activeJITToken : null;
  return <div className="mx-auto max-w-6xl space-y-5 p-5 md:p-8">
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#63805d]">Risk-based access · interactive demo</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#17281c]">Who can see this patient’s record?</h2><p className="mt-2 text-sm text-slate-600">{patient.name} · {patient.id} · current tier: <strong>{riskTier.toLowerCase()}</strong>. These scopes are calculated in the browser; no real user identity or backend enforcement is connected.</p></div>
    <div className="grid gap-3 md:grid-cols-2">{labels.map(item => {
      const scope = evaluateAccessScope(item.role, riskTier, token, patient.id);
      const allowed = Object.entries(scope).filter(([, value]) => value).map(([key]) => ({ liveVitals: 'Vitals', routineMeds: 'Medicines', historicalEHR: 'History', cardiacCatheterization: 'Cardiac procedures', stentProcedure: 'Stent records', allergyAdverseReactions: 'Allergies', interventionOverride: 'Intervention controls' }[key] || key));
      const isTemporary = item.role === 'ON_CALL_CARDIOLOGIST' && Boolean(token);
      return <section key={item.role} className="rounded-[22px] border border-[#dfe8da] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-lg font-bold text-[#17281c]"><ShieldCheck size={20} className="text-[#63805d]" />{item.title}</div><p className="mt-1 text-sm text-slate-500">{item.purpose}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${isTemporary ? 'bg-amber-100 text-amber-900' : allowed.length ? 'bg-[#e8f1e2] text-[#315b39]' : 'bg-slate-100 text-slate-600'}`}>{isTemporary ? 'Expires automatically' : allowed.length ? 'Calculated scope' : 'No active scope'}</span></div><div className="mt-5 flex flex-wrap gap-2">{allowed.length ? allowed.map(label => <span key={label} className="rounded-full border border-[#dfe8da] bg-[#f7faf5] px-3 py-1.5 text-xs font-semibold text-[#39533c]">{label}</span>) : <span className="text-sm text-slate-500">No patient data available to this role at this tier.</span>}</div>{isTemporary && <button onClick={onOpenTokenInspector} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#38643e] underline underline-offset-4"><Clock3 size={16} /> Expires {new Date(token!.expiresAt).toLocaleTimeString()} · inspect grant</button>}</section>;
    })}</div>
    <section className="rounded-[22px] border border-[#dfe8da] bg-white p-5"><div className="flex items-center gap-2 text-lg font-bold text-[#17281c]"><LockKeyhole size={20} className="text-[#63805d]" />Referral and family sharing</div><p className="mt-2 text-sm leading-relaxed text-slate-600">The referral hospital and designated family contact are part of the intended access model. This demo does not issue their credentials or share the patient record. A real handoff would need recipient verification, patient consent or a documented lawful basis, a limited purpose, expiry, and an audit record.</p></section>
  </div>;
};
