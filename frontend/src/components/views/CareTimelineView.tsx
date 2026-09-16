import React, { useState } from 'react';
import { CalendarClock, Download, FilePlus2, FileText, Pill, Plus, Printer, Stethoscope } from 'lucide-react';
import { Patient } from '../../types/hdims';

export interface TestEntry {
  id: string;
  patientId: string;
  name: string;
  collectedOn: string;
  facility: string;
  sampleType: string;
  result: string;
  reviewOn: string;
  clinician: string;
  note: string;
  attachment?: File;
}

export interface MedicineEntry {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  frequency: string;
  route: string;
  startedOn: string;
  endsOn: string;
  clinician: string;
  sideEffects: string;
  note: string;
}

interface Props {
  patients: Patient[];
  selectedPatientId: string;
  onPatientChange: (id: string) => void;
  tests: TestEntry[];
  medicines: MedicineEntry[];
  onAddTest: (entry: TestEntry) => void;
  onAddMedicine: (entry: MedicineEntry) => void;
}

const today = () => new Date().toLocaleDateString('en-CA');
const formatDate = (value: string) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not recorded';
const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

export const CareTimelineView: React.FC<Props> = ({ patients, selectedPatientId, onPatientChange, tests, medicines, onAddTest, onAddMedicine }) => {
  const [activeForm, setActiveForm] = useState<'test' | 'medicine' | null>(null);
  const [formError, setFormError] = useState('');
  const [test, setTest] = useState({ name: '', collectedOn: today(), facility: '', sampleType: '', result: '', reviewOn: '', clinician: '', note: '' });
  const [medicine, setMedicine] = useState({ name: '', dose: '', frequency: '', route: 'Oral', startedOn: today(), endsOn: '', clinician: '', sideEffects: '', note: '' });
  const [attachment, setAttachment] = useState<File | undefined>();
  const patient = patients.find(item => item.id === selectedPatientId) || patients[0];
  const patientTests = tests.filter(item => item.patientId === patient.id).sort((a, b) => b.collectedOn.localeCompare(a.collectedOn));
  const patientMedicines = medicines.filter(item => item.patientId === patient.id).sort((a, b) => b.startedOn.localeCompare(a.startedOn));
  const currentMeds = patientMedicines.filter(item => !item.endsOn || item.endsOn >= today());

  const addTest = (event: React.FormEvent) => {
    event.preventDefault();
    if (test.reviewOn && test.reviewOn < test.collectedOn) { setFormError('The review date must be on or after the sample date.'); return; }
    onAddTest({ ...test, id: newId(), patientId: patient.id, attachment });
    setTest({ name: '', collectedOn: today(), facility: '', sampleType: '', result: '', reviewOn: '', clinician: '', note: '' });
    setAttachment(undefined); setFormError(''); setActiveForm(null);
  };
  const addMedicine = (event: React.FormEvent) => {
    event.preventDefault();
    if (medicine.endsOn && medicine.endsOn < medicine.startedOn) { setFormError('The end date must be on or after the start date.'); return; }
    onAddMedicine({ ...medicine, id: newId(), patientId: patient.id });
    setMedicine({ name: '', dose: '', frequency: '', route: 'Oral', startedOn: today(), endsOn: '', clinician: '', sideEffects: '', note: '' });
    setFormError(''); setActiveForm(null);
  };
  const downloadAttachment = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a'); link.href = url; link.download = file.name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="care-timeline mx-auto max-w-6xl space-y-5 px-5 py-7 md:px-8 md:py-9">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#6a8a58]">Continuity of care</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#17281c] md:text-4xl">Tests & medicines</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">Bring the last result and current treatment into the next consultation.</p></div><button type="button" onClick={() => window.print()} className="no-print flex items-center gap-2 rounded-full border border-[#d9e3d3] bg-white px-4 py-2 text-xs font-bold text-[#345b36]"><Printer size={15} /> Print handoff summary</button></div>
    <div className="rounded-[22px] border border-[#dce6d7] bg-[#edf3e9] p-4 text-xs leading-relaxed text-[#344c36]"><strong>For the next clinician:</strong> check the previous report, specimen date, symptoms and treatment changes before ordering a repeat test. The review date below is entered by a clinician or staff member; it is not an automatic decision to skip or perform a test.</div>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-white p-5"><div><label htmlFor="care-patient" className="block text-xs font-bold text-slate-500">Patient record</label><select id="care-patient" value={patient.id} onChange={event => onPatientChange(event.target.value)} className="mt-1 max-w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900">{patients.map(item => <option key={item.id} value={item.id}>{item.name} · {item.id}</option>)}</select></div><span className="rounded-full bg-[#f6f7f6] px-3 py-1.5 text-xs text-slate-500">Local demo · entries last only while this page is open</span></div>
    <div className="grid gap-4 md:grid-cols-3"><div className="timeline-stat"><FileText size={19} /><strong>{patient.labReports.length + patientTests.length}</strong><span>Reports on record</span></div><div className="timeline-stat"><CalendarClock size={19} /><strong>{patientTests.filter(item => item.reviewOn && item.reviewOn <= today()).length}</strong><span>Review dates reached</span></div><div className="timeline-stat"><Pill size={19} /><strong>{patient.prescriptions.filter(item => item.status === 'ACTIVE').length + currentMeds.length}</strong><span>Listed current medicines</span></div></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="timeline-panel"><div className="flex items-start justify-between gap-3"><div><span className="timeline-icon"><FileText size={18} /></span><h3 className="mt-3 text-xl font-bold text-[#17281c]">Tests & reports</h3><p className="mt-1 text-xs text-slate-500">Collected date, previous result and next clinical review.</p></div><button type="button" onClick={() => { setFormError(''); setActiveForm(activeForm === 'test' ? null : 'test'); }} className="no-print timeline-add"><Plus size={15} /> Add test</button></div>
        {activeForm === 'test' && <form onSubmit={addTest} className="no-print timeline-form"><div className="grid gap-3 sm:grid-cols-2"><label>Test name *<input required value={test.name} onChange={e => setTest({ ...test, name: e.target.value })} placeholder="e.g. Complete blood count" /></label><label>Sample collected *<input required type="date" value={test.collectedOn} onChange={e => setTest({ ...test, collectedOn: e.target.value })} /></label><label>Hospital or lab *<input required value={test.facility} onChange={e => setTest({ ...test, facility: e.target.value })} placeholder="Source facility" /></label><label>Sample type<input value={test.sampleType} onChange={e => setTest({ ...test, sampleType: e.target.value })} placeholder="Blood, urine, imaging..." /></label><label className="sm:col-span-2">Result summary *<textarea required value={test.result} onChange={e => setTest({ ...test, result: e.target.value })} placeholder="Key values, units and reference range" /></label><label>Clinician review / repeat date<input type="date" value={test.reviewOn} onChange={e => setTest({ ...test, reviewOn: e.target.value })} /></label><label>Review set by<input value={test.clinician} onChange={e => setTest({ ...test, clinician: e.target.value })} placeholder="Clinician name" /></label><label className="sm:col-span-2">Reason or follow-up note<textarea value={test.note} onChange={e => setTest({ ...test, note: e.target.value })} placeholder="Why the review date was chosen" /></label><label className="sm:col-span-2">Attach report (PDF or image, up to 10 MB)<input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={e => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 10 * 1024 * 1024) { setFormError('Choose a file smaller than 10 MB.'); e.target.value = ''; return; } setFormError(''); setAttachment(file); }} /></label></div>{attachment && <p className="text-xs text-[#58754d]">Selected: {attachment.name}</p>}{formError && <p role="alert" className="text-xs font-semibold text-rose-700">{formError}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={() => setActiveForm(null)} className="timeline-secondary">Cancel</button><button type="submit" className="timeline-submit"><FilePlus2 size={15} /> Save test</button></div></form>}
        <div className="mt-5 space-y-3">{patientTests.map(item => <article key={item.id} className="timeline-entry"><div className="flex items-start justify-between gap-2"><div><h4 className="font-bold text-[#17281c]">{item.name}</h4><p className="mt-1 text-xs text-slate-500">{item.facility} · {formatDate(item.collectedOn)}{item.sampleType ? ` · ${item.sampleType}` : ''}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${item.reviewOn && item.reviewOn <= today() ? 'bg-amber-100 text-amber-800' : 'bg-[#edf3e9] text-[#58754d]'}`}>{item.reviewOn ? item.reviewOn <= today() ? 'Review date reached' : 'Prior result on file' : 'No date set'}</span></div><p className="mt-3 text-sm text-slate-700">{item.result}</p><p className="mt-3 text-xs font-semibold text-[#48684a]">{item.reviewOn && item.reviewOn > today() ? 'Planned review is later. Show this result before any repeat order.' : 'A clinician should decide whether a repeat test is needed.'}</p><p className="mt-2 text-xs text-slate-500">{item.reviewOn ? `Clinician review: ${formatDate(item.reviewOn)}` : 'Next review date not recorded'}{item.clinician ? ` · ${item.clinician}` : ''}</p>{item.note && <p className="mt-1 text-xs text-slate-500">{item.note}</p>}{item.attachment && <button type="button" onClick={() => downloadAttachment(item.attachment!)} className="no-print mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#58754d]"><Download size={14} /> {item.attachment.name}</button>}</article>)}{patient.labReports.map(item => <article key={item.id} className="timeline-entry"><h4 className="font-bold text-[#17281c]">{item.testName}</h4><p className="mt-1 text-xs text-slate-500">Supplied demo record · {item.collectedAt}</p><p className="mt-3 text-sm text-slate-700">{item.value} · Reference {item.referenceRange}</p><p className="mt-2 text-xs text-slate-500">No clinician repeat date recorded in source data.</p></article>)}{!patientTests.length && !patient.labReports.length && <p className="py-8 text-center text-sm text-slate-400">No reports yet. Add the last test to make it available at the next visit.</p>}</div>
      </section>
      <section className="timeline-panel"><div className="flex items-start justify-between gap-3"><div><span className="timeline-icon"><Pill size={18} /></span><h3 className="mt-3 text-xl font-bold text-[#17281c]">Current medicines</h3><p className="mt-1 text-xs text-slate-500">Dose, schedule, duration and reported side effects.</p></div><button type="button" onClick={() => { setFormError(''); setActiveForm(activeForm === 'medicine' ? null : 'medicine'); }} className="no-print timeline-add"><Plus size={15} /> Add medicine</button></div>
        {activeForm === 'medicine' && <form onSubmit={addMedicine} className="no-print timeline-form"><div className="grid gap-3 sm:grid-cols-2"><label>Medicine name *<input required value={medicine.name} onChange={e => setMedicine({ ...medicine, name: e.target.value })} placeholder="Generic or brand name" /></label><label>Dose *<input required value={medicine.dose} onChange={e => setMedicine({ ...medicine, dose: e.target.value })} placeholder="e.g. 500 mg" /></label><label>Frequency *<input required value={medicine.frequency} onChange={e => setMedicine({ ...medicine, frequency: e.target.value })} placeholder="e.g. Twice daily" /></label><label>Route<input value={medicine.route} onChange={e => setMedicine({ ...medicine, route: e.target.value })} placeholder="Oral, injection..." /></label><label>Started on *<input required type="date" value={medicine.startedOn} onChange={e => setMedicine({ ...medicine, startedOn: e.target.value })} /></label><label>Planned end date<input type="date" value={medicine.endsOn} onChange={e => setMedicine({ ...medicine, endsOn: e.target.value })} /></label><label className="sm:col-span-2">Prescribing clinician<input value={medicine.clinician} onChange={e => setMedicine({ ...medicine, clinician: e.target.value })} placeholder="Clinician or facility" /></label><label className="sm:col-span-2">Observed side effects<textarea value={medicine.sideEffects} onChange={e => setMedicine({ ...medicine, sideEffects: e.target.value })} placeholder="What happened and when; leave blank if none reported" /></label><label className="sm:col-span-2">Other instructions<textarea value={medicine.note} onChange={e => setMedicine({ ...medicine, note: e.target.value })} placeholder="With food, review date, etc." /></label></div>{formError && <p role="alert" className="text-xs font-semibold text-rose-700">{formError}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={() => setActiveForm(null)} className="timeline-secondary">Cancel</button><button type="submit" className="timeline-submit"><Plus size={15} /> Save medicine</button></div></form>}
        <div className="mt-5 space-y-3">{patientMedicines.map(item => <article key={item.id} className="timeline-entry"><div className="flex items-start justify-between gap-2"><h4 className="font-bold text-[#17281c]">{item.name}</h4><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${item.endsOn && item.endsOn < today() ? 'bg-slate-100 text-slate-600' : 'bg-[#edf3e9] text-[#58754d]'}`}>{item.endsOn && item.endsOn < today() ? 'Course ended' : 'Listed current'}</span></div><p className="mt-2 text-sm text-slate-700">{item.dose} · {item.frequency} · {item.route}</p><p className="mt-2 text-xs text-slate-500">{formatDate(item.startedOn)} → {item.endsOn ? formatDate(item.endsOn) : 'No end date recorded'}{item.clinician ? ` · ${item.clinician}` : ''}</p><p className="mt-2 text-xs text-slate-600">Side effects: {item.sideEffects || 'None reported in this entry'}</p>{item.note && <p className="mt-1 text-xs text-slate-500">{item.note}</p>}</article>)}{patient.prescriptions.map((item, index) => <article key={`${item.medicineName}-${index}`} className="timeline-entry"><div className="flex items-start justify-between gap-2"><h4 className="font-bold text-[#17281c]">{item.medicineName}</h4><span className="rounded-full bg-[#edf3e9] px-2 py-1 text-[10px] font-bold text-[#58754d]">{item.status}</span></div><p className="mt-2 text-sm text-slate-700">{item.dosage} · {item.frequency} · {item.route}</p><p className="mt-2 text-xs text-slate-500">Started {item.dateStarted} · {item.prescribedBy}</p><p className="mt-2 text-xs text-slate-500">Duration and side effects not recorded in source data.</p></article>)}{!patientMedicines.length && !patient.prescriptions.length && <p className="py-8 text-center text-sm text-slate-400">No medicines recorded yet.</p>}</div>
      </section>
    </div>
    <div className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500"><Stethoscope size={17} className="shrink-0 text-[#6a8a58]" /><span>This screen helps reconcile records. A clinician should decide whether a test is still relevant, whether to repeat it, and whether to start, stop or change a medicine. Attachments remain only in this browser session and are not shared with another hospital automatically.</span></div>
  </div>;
};
