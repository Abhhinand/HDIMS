import React, { useState } from 'react';
import { Patient, AccessScope, CaregiverRole } from '../types/hdims';
import { Pill, Calendar, HeartPulse, Lock, Unlock, CheckCircle2, Clock, MapPin, User, Stethoscope, AlertTriangle, FileText, FlaskConical, FileUp, Sparkles } from 'lucide-react';

interface PatientHistoryTabsProps {
  patient: Patient;
  accessScope: AccessScope;
  currentRole: CaregiverRole;
  onOpenLabAnalyzer?: () => void;
}

export const PatientHistoryTabs: React.FC<PatientHistoryTabsProps> = ({
  patient,
  accessScope,
  currentRole,
  onOpenLabAnalyzer,
}) => {
  const [activeTab, setActiveTab] = useState<'PRESCRIPTIONS' | 'LABS' | 'VISITS' | 'APPOINTMENTS' | 'CATH_STENT'>('PRESCRIPTIONS');

  const { prescriptions, upcomingAppointments, history, labReports, previousVisits } = patient;

  return (
    <div className="rounded-2xl bg-[#0B1527] border border-clinical-border p-5 flex flex-col gap-4 shadow-xl">
      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Longitudinal Health Profile (ABDM Linked)
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-normal border border-cyan-500/30">
              ABHA: {patient.abhaId}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Prescription history, laboratory biomarker panels, previous clinical encounters, and cath vault
          </p>
        </div>

        {/* Upload Medical Papers Quick Button */}
        {onOpenLabAnalyzer && (
          <button
            onClick={onOpenLabAnalyzer}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <FileUp className="w-3.5 h-3.5" />
            Upload / Analyze Lab Report
          </button>
        )}
      </div>

      {/* Tab Pill Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setActiveTab('PRESCRIPTIONS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'PRESCRIPTIONS'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          Prescription Regimen ({prescriptions.length})
        </button>

        <button
          onClick={() => setActiveTab('LABS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'LABS'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Lab Biomarker Diagnostics ({labReports.length})
        </button>

        <button
          onClick={() => setActiveTab('VISITS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'VISITS'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          Previous Doctor Visits ({previousVisits.length})
        </button>

        <button
          onClick={() => setActiveTab('APPOINTMENTS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'APPOINTMENTS'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Next Appointments ({upcomingAppointments.length})
        </button>

        <button
          onClick={() => setActiveTab('CATH_STENT')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'CATH_STENT'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          Cath & Stent Vault
        </button>
      </div>

      {/* TAB 1: PRESCRIPTIONS */}
      {activeTab === 'PRESCRIPTIONS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Verified through ABDM Medication Statement FHIR Resources</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {prescriptions.filter((p) => p.status === 'ACTIVE').length} Active Prescriptions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prescriptions.map((med, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                  med.status === 'ACTIVE'
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-850 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${med.status === 'ACTIVE' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{med.medicineName}</div>
                      <div className="text-xs font-mono text-cyan-300 font-semibold">
                        {med.dosage} • {med.frequency}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    med.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {med.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[200px]">By: {med.prescribedBy}</span>
                  <span className="font-mono text-[10px]">Since: {med.dateStarted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LAB BIOMARKER DIAGNOSTICS */}
      {activeTab === 'LABS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Synchronized with Hospital Laboratory Information System (LIS) & Point-of-Care Blood Gas</span>
            <span className="text-cyan-400 font-semibold font-mono">
              {labReports.length} Biomarkers Indexed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {labReports.map((lab) => {
              const isCrit = lab.status === 'ELEVATED_CRITICAL' || lab.status === 'LOW_ALERT';
              return (
                <div
                  key={lab.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                    isCrit
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-sm shadow-rose-950/40'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{lab.testName}</div>
                      <span className="text-[10px] text-slate-500 font-mono">Ref: {lab.referenceRange}</span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`text-base font-mono font-extrabold ${isCrit ? 'text-rose-400' : 'text-white'}`}>
                        {lab.value}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isCrit ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-slate-400">Interpretation: </strong>
                    {lab.clinicalInterpretation}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>Sample: Venous/Arterial</span>
                    <span>Reported: {lab.collectedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PREVIOUS DOCTOR VISITS */}
      {activeTab === 'VISITS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Historical Clinical Encounters & Hospital Admissions (ABDM Encounter Bundles)</span>
            <span className="text-cyan-400 font-semibold font-mono">
              {previousVisits.length} Documented Visits
            </span>
          </div>

          <div className="space-y-3">
            {previousVisits.map((vis) => (
              <div
                key={vis.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold">
                      {vis.date}
                    </span>
                    <span className="text-xs font-bold text-white">{vis.facility}</span>
                  </div>
                  <span className="text-xs font-semibold text-cyan-300">
                    {vis.doctorName} ({vis.specialty})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Chief Complaint:</span>
                    <div className="text-slate-200 mt-0.5">{vis.chiefComplaint}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Clinical Findings:</span>
                    <div className="text-slate-200 mt-0.5">{vis.clinicalFindings}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
                  <strong>Plan & Discharge Order: </strong> {vis.planAndDischarge}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: UPCOMING APPOINTMENTS */}
      {activeTab === 'APPOINTMENTS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Synchronized with Hospital Appointment Registry & ABDM Scheduler</span>
            <span className="text-cyan-400 font-semibold font-mono">
              {upcomingAppointments.length} Booked Encounters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {upcomingAppointments.map((app, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{app.department}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {app.bookingStatus}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{app.hospital}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1 justify-end">
                      <Calendar className="w-3.5 h-3.5" />
                      {app.date}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      {app.time}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/90 text-xs text-slate-300">
                  <div className="font-semibold text-slate-200">Consultant: {app.doctorName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{app.purpose}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CATH & STENT VAULT */}
      {activeTab === 'CATH_STENT' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Specialized Interventional Cardiology Vault</span>
            {accessScope.cardiacCatheterization ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" /> UNLOCKED (JIT Emergency Scope Active)
              </span>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> SHIELDED (Least-Privilege Protocol)
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Originating Institution
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {history.abhaLinkedHospital}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Prior Hospitalization: {history.lastAdmission}
              </div>
            </div>

            {accessScope.cardiacCatheterization ? (
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-cyan-300 mb-1">
                    Angiography & Catheterization Findings:
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed">
                    {history.cardiacCathSummary}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/40">
                  <div className="text-xs font-bold text-purple-300 mb-1">
                    Implanted Stent Specifications:
                  </div>
                  <p className="text-xs font-mono text-purple-200">
                    {history.stentDetails}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <Lock className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="text-sm font-bold text-slate-200">
                  Sensitive Interventional History Shielded
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  To protect patient privacy, catheterization images and stent dimensions are masked during normal risk. When the patient reaches Tier 3 Critical (or SpO2 &lt; 91%), HDIMS automatically pre-provisions JIT access.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
