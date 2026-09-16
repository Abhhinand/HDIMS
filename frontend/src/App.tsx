import React, { useState, useEffect, useMemo } from 'react';
import { 
  MOCK_PATIENTS, 
  MOCK_RECENT_ALERTS, 
  MOCK_ESCALATION_ITEMS 
} from './data/mockPatients';
import { 
  Patient, 
  Vitals, 
  CaregiverRole, 
  JITToken, 
  AuditEntry, 
  DoctorThresholds, 
  NavPage, 
  AlertItem, 
  EscalationItem 
} from './types/hdims';
import { calculateNEWS2 } from './engine/news2Engine';
import { evaluateAccessScope } from './engine/accessLattice';
import { createAuditLog } from './engine/auditLogger';
import { soundEngine } from './engine/soundEngine';
import { loadBackendPatients, submitBackendVitals } from './api/hdimsApi';

import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/views/DashboardView';
import { ClinicVisitView } from './components/views/ClinicVisitView';
import { CareTimelineView, TestEntry, MedicineEntry } from './components/views/CareTimelineView';
import { PatientDetailView } from './components/views/PatientDetailView';
import { AccessControlView } from './components/views/AccessControlView';
import { AuditTrailView } from './components/views/AuditTrailView';
import { ConsentManagementView } from './components/views/ConsentManagementView';
import { EscalationCenterView } from './components/views/EscalationCenterView';

import { OcrExtractionModal } from './components/OcrExtractionModal';
import { SecurityGuardrailsDrawer } from './components/SecurityGuardrailsDrawer';
import { TokenInspectorModal } from './components/TokenInspectorModal';
import { DoctorThresholdModal } from './components/DoctorThresholdModal';
import { AbhaQrModal } from './components/AbhaQrModal';
import { ReferralHandshakeModal } from './components/ReferralHandshakeModal';
import { FamilySmsDrawer } from './components/FamilySmsDrawer';
import { Settings, Sliders, Shield, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavPage>('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Clinical Patient State
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [enteredTests, setEnteredTests] = useState<TestEntry[]>([]);
  const [enteredMedicines, setEnteredMedicines] = useState<MedicineEntry[]>([]);
  const [clinicEntries, setClinicEntries] = useState<Record<string, string>>({});
  const [riskHistory, setRiskHistory] = useState<Record<string, { score: number; at: string }[]>>({});
  const [selectedPatientId, setSelectedPatientId] = useState<string>('HD-1007');
  const [currentRole, setCurrentRole] = useState<CaregiverRole>('ON_CALL_CARDIOLOGIST');

  // Dynamic JIT Security Token State
  const [activeJITToken, setActiveJITToken] = useState<JITToken | null>({
    id: 'jit-tok-84920',
    patientId: 'HD-1007',
    recipientRole: 'ON_CALL_CARDIOLOGIST',
    recipientName: 'Dr. Rajesh (Cardiologist)',
    reason: 'Elevated Cardiac Risk & Troponin Desaturation Review',
    grantedAt: '14:20',
    durationSeconds: 45 * 60,
    expiresAt: Date.now() + 45 * 60 * 1000,
    isActive: true,
    plainLanguageGrant: 'Pre-provisioned emergency interventional catheterization scopes.'
  });
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);

  // Audio mute
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  // Modals & Drawers
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);
  const [isGuardrailsOpen, setIsGuardrailsOpen] = useState<boolean>(false);
  const [isTokenInspectorOpen, setIsTokenInspectorOpen] = useState<boolean>(false);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [isAbhaQrOpen, setIsAbhaQrOpen] = useState<boolean>(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState<boolean>(false);
  const [isFamilySmsOpen, setIsFamilySmsOpen] = useState<boolean>(false);

  // Dynamic Alert / Escalation / Access state
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_RECENT_ALERTS);
  const [escalationItems, setEscalationItems] = useState<EscalationItem[]>(MOCK_ESCALATION_ITEMS);

  // Doctor Alert Thresholds
  const [thresholds, setThresholds] = useState<DoctorThresholds>({
    lowSpo2: 92,
    highPulse: 120,
    lowSystolicBp: 90,
  });

  // Audit Logs Ledger
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    let isMounted = true;
    loadBackendPatients()
      .then((backendPatients) => {
        if (!isMounted || backendPatients.length === 0) return;
        setPatients(backendPatients);
        setSelectedPatientId(backendPatients[0].id);
        setActiveJITToken(null);
      })
      .catch((error) => {
        console.warn('HDIMS backend unavailable; continuing with demo data.', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected Patient Memo
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Reactive NEWS2 Score
  const currentScore = useMemo(() => {
    return calculateNEWS2(selectedPatient.vitals);
  }, [selectedPatient.vitals]);

  // Evaluate Dynamic Access Scope
  const currentAccessScope = useMemo(() => {
    return evaluateAccessScope(currentRole, currentScore.tier, activeJITToken, selectedPatient.id);
  }, [currentRole, currentScore.tier, activeJITToken, selectedPatient.id]);

  // Filtered Patients for Global Search
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nationalHealthId && p.nationalHealthId.toLowerCase().includes(q)) ||
        p.bedNumber.toLowerCase().includes(q) ||
        p.admissionDiagnosis.toLowerCase().includes(q) ||
        p.abhaId.toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  // A demo token expires even when no page is open. The expiry is recorded in the audit view.
  useEffect(() => {
    if (!activeJITToken) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((activeJITToken.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        const patient = patients.find(item => item.id === activeJITToken.patientId);
        const risk = patient ? calculateNEWS2(patient.vitals) : currentScore;
        setLogs(previous => [createAuditLog('SYSTEM GATEWAY', 'HOSPITAL_AUDITOR', patient?.bedNumber || activeJITToken.patientId, 'AUTO_REVOCATION', risk.total, risk.tier, 'Time-limited specialist access expired in the demo.'), ...previous]);
        setActiveJITToken(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeJITToken, patients, currentScore]);

  // Handlers
  const handleSelectPatientFromList = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    soundEngine.playHeartbeatBeep();
  };

  const handleApplyExtractedVitals = (updatedVitals: Partial<Vitals>) => {
    const previousScore = calculateNEWS2(selectedPatient.vitals);
    const nextVitals = { ...selectedPatient.vitals, ...updatedVitals };
    const nextScore = calculateNEWS2(nextVitals);
    const now = new Date().toLocaleString();
    submitBackendVitals(selectedPatient.id, nextVitals).catch((error) => {
      console.warn('Unable to persist vitals to the HDIMS backend.', error);
    });
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            vitals: nextVitals,
          };
        }
        return p;
      })
    );
    setRiskHistory(previous => ({
      ...previous,
      [selectedPatient.id]: [...(previous[selectedPatient.id] || ( [{ score: previousScore.total, at: 'Before this entry' }] )), { score: nextScore.total, at: now }].slice(-8),
    }));
    if (previousScore.tier !== nextScore.tier) {
      setLogs(previous => [createAuditLog('RISK ENGINE', 'HOSPITAL_AUDITOR', selectedPatient.bedNumber, 'ACCESS_SCOPE_CHANGE', nextScore.total, nextScore.tier, `Risk changed from ${previousScore.tier} to ${nextScore.tier}. Caregiver scopes were recalculated in this demo.`), ...previous]);
    }
    if (nextScore.tier === 'CRITICAL' && previousScore.tier !== 'CRITICAL') {
      if (!isAudioMuted) soundEngine.playEmergencyChime();
      const duration = 45 * 60;
      const token: JITToken = {
        id: `jit-tok-${Date.now()}`, patientId: selectedPatient.id, recipientRole: 'ON_CALL_CARDIOLOGIST',
        recipientName: 'Demo on-call specialist', reason: 'Critical NEWS2 state in simulation',
        grantedAt: new Date().toLocaleTimeString(), durationSeconds: duration,
        expiresAt: Date.now() + duration * 1000, isActive: true,
        plainLanguageGrant: 'Time-limited specialist access in the interactive demo.',
      };
      setActiveJITToken(token);
      setSecondsRemaining(duration);
      setLogs(previous => [
        createAuditLog('RISK ENGINE', 'HOSPITAL_AUDITOR', selectedPatient.bedNumber, 'RISK_ELEVATION', nextScore.total, nextScore.tier, 'Current vital signs reached the critical tier.'),
        createAuditLog('ACCESS ENGINE', 'HOSPITAL_AUDITOR', selectedPatient.bedNumber, 'JIT_GRANT', nextScore.total, nextScore.tier, 'A 45-minute specialist demo grant was created.'),
        ...previous,
      ]);
    } else if (previousScore.tier === 'CRITICAL' && nextScore.tier !== 'CRITICAL' && activeJITToken?.patientId === selectedPatient.id) {
      setActiveJITToken(null);
      setSecondsRemaining(0);
      setLogs(previous => [createAuditLog('ACCESS ENGINE', 'HOSPITAL_AUDITOR', selectedPatient.bedNumber, 'AUTO_REVOCATION', nextScore.total, nextScore.tier, 'Risk fell below the critical tier; the specialist demo grant was revoked.'), ...previous]);
    }
  };

  const handleAddAuditLog = (actor: string, role: string, eventType: string, detail: string) => {
    const newLog: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor,
      actorRole: role as any,
      patientBed: `${selectedPatient.bedNumber} (${selectedPatient.name})`,
      eventType: eventType as any,
      riskScore: currentScore.total,
      riskTier: currentScore.tier,
      plainLanguage: detail,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleEscalationAction = (item: EscalationItem) => {
    if (!isAudioMuted) soundEngine.playEmergencyChime();

    // Create an audit entry
    const log: AuditEntry = {
      id: `aud-esc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Dr. Smith (Attending)',
      actorRole: 'ATTENDING_PHYSICIAN',
      patientBed: `${item.patientId} (${item.patientName})`,
      eventType: 'DYNAMIC_ESCALATION',
      riskScore: item.news2Score,
      riskTier: (item.riskTier || item.riskLevel || 'HIGH') as any,
      plainLanguage: `Action executed for ${item.patientName}: Rapid Response Team notified. Care protocol initiated.`,
    };
    setLogs((prev) => [log, ...prev]);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f4f5] font-sans text-slate-900 antialiased">
      {/* 1. Sidebar Navigation matching Screen Designs */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          soundEngine.playHeartbeatBeep();
        }}
        escalationCount={escalationItems.filter((i) => (i.riskLevel || i.riskTier) === 'HIGH').length}
        onOpenOcrModal={() => setIsOcrModalOpen(true)}
        onOpenGuardrails={() => setIsGuardrailsOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAudioMuted={isAudioMuted}
          onToggleAudio={() => {
            const nextMute = soundEngine.toggleMute();
            setIsAudioMuted(nextMute);
          }}
          onOpenOcrModal={() => setIsOcrModalOpen(true)}
          onOpenGuardrails={() => setIsGuardrailsOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {currentPage === 'CLINIC_VISIT' && (
            <ClinicVisitView
              patients={patients}
              selectedPatientId={selectedPatientId}
              onPatientChange={setSelectedPatientId}
              onSaveVitals={(vitals, enteredBy) => {
                handleApplyExtractedVitals(vitals);
                setClinicEntries(previous => ({ ...previous, [selectedPatient.id]: new Date().toLocaleString() }));
                const enteredScore = calculateNEWS2(vitals);
                setLogs(previous => [createAuditLog(enteredBy, 'STAFF_NURSE', selectedPatient.bedNumber, 'CLINIC_VITALS_ENTRY', enteredScore.total, enteredScore.tier, `Clinic staff entered vitals for ${selectedPatient.name}; NEWS2 recalculated to ${enteredScore.total} (${enteredScore.tier}).`), ...previous]);
              }}
              lastEnteredAt={clinicEntries[selectedPatient.id]}
              tests={enteredTests}
              medicines={enteredMedicines}
              onOpenRecords={() => setCurrentPage('CARE_TIMELINE')}
              onOpenPatient={() => setCurrentPage('PATIENTS')}
              onOpenRiskView={() => setCurrentPage('DASHBOARD')}
            />
          )}
          {currentPage === 'DASHBOARD' && (
            <DashboardView
              patients={filteredPatients}
              alerts={alerts}
              onSelectPatient={handleSelectPatientFromList}
              onNavigateToEscalation={() => setCurrentPage('ESCALATION')}
              monitoredPatient={selectedPatient}
              riskHistory={riskHistory[selectedPatient.id] || []}
              activeToken={activeJITToken?.patientId === selectedPatient.id ? activeJITToken : null}
              recentLog={logs.find(log => log.patientBed.includes(selectedPatient.bedNumber) && ['ACCESS_SCOPE_CHANGE', 'JIT_GRANT', 'AUTO_REVOCATION', 'RISK_ELEVATION'].includes(log.eventType))}
              lastEnteredAt={clinicEntries[selectedPatient.id]}
              testCount={enteredTests.filter(test => test.patientId === selectedPatient.id).length}
              onOpenClinic={() => setCurrentPage('CLINIC_VISIT')}
              onOpenPatient={() => setCurrentPage('PATIENTS')}
              onOpenAccess={() => setCurrentPage('ACCESS_CONTROL')}
              onOpenAudit={() => setCurrentPage('AUDIT_TRAIL')}
            />
          )}

          {currentPage === 'PATIENTS' && (
            <PatientDetailView
              patient={selectedPatient}
              score={currentScore}
              activeJITToken={activeJITToken?.patientId === selectedPatient.id ? activeJITToken : null}
              onBack={() => setCurrentPage('DASHBOARD')}
              onOpenJITInspector={() => setIsTokenInspectorOpen(true)}
              onOpenCareTimeline={() => setCurrentPage('CARE_TIMELINE')}
              onOpenOcrModal={() => setIsOcrModalOpen(true)}
              onOpenAuditTrail={() => setCurrentPage('AUDIT_TRAIL')}
              onUpdateVitalsModal={() => setIsOcrModalOpen(true)}
              onOpenAbhaQr={() => setIsAbhaQrOpen(true)}
              onOpenReferral={() => setIsReferralModalOpen(true)}
              onOpenFamilySms={() => setIsFamilySmsOpen(true)}
              onOpenThresholds={() => setIsThresholdModalOpen(true)}
              onSimulateVitals={handleApplyExtractedVitals}
            />
          )}

          {currentPage === 'CARE_TIMELINE' && (
            <CareTimelineView
              patients={patients}
              selectedPatientId={selectedPatientId}
              onPatientChange={setSelectedPatientId}
              tests={enteredTests}
              medicines={enteredMedicines}
              onAddTest={(entry) => setEnteredTests(previous => [entry, ...previous])}
              onAddMedicine={(entry) => setEnteredMedicines(previous => [entry, ...previous])}
            />
          )}

          {currentPage === 'ACCESS_CONTROL' && (
            <AccessControlView
              patient={selectedPatient}
              riskTier={currentScore.tier}
              activeJITToken={activeJITToken?.patientId === selectedPatient.id ? activeJITToken : null}
              onOpenTokenInspector={() => setIsTokenInspectorOpen(true)}
            />
          )}

          {currentPage === 'AUDIT_TRAIL' && (
            <AuditTrailView logs={logs} patient={selectedPatient} />
          )}

          {currentPage === 'CONSENT' && (
            <ConsentManagementView
              patients={patients}
              onOpenGuardrails={() => setIsGuardrailsOpen(true)}
            />
          )}

          {currentPage === 'ESCALATION' && (
            <EscalationCenterView
              escalationItems={escalationItems}
              onTriggerAction={handleEscalationAction}
            />
          )}

          {currentPage === 'SETTINGS' && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Demo settings</h2>
                  <p className="text-xs text-slate-500">Review clinical thresholds and planned data connections</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Local sample mode
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Clinical Alert Thresholds</span>
                  </div>
                  <p className="text-xs text-slate-500">Tune automated escalation boundaries for rapid response dispatch.</p>
                  <button
                    onClick={() => setIsThresholdModalOpen(true)}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition cursor-pointer"
                  >
                    Adjust Doctor Thresholds
                  </button>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Confidentiality & Guardrails</span>
                  </div>
                  <p className="text-xs text-slate-500">Review the example access and privacy rules included with the supplied project.</p>
                  <button
                    onClick={() => setIsGuardrailsOpen(true)}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer"
                  >
                    Open Security Guardrails Drawer
                  </button>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Planned data connections</h3>
                <div className="space-y-2 text-xs font-mono text-slate-600">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <span>FHIR R4 Gateway URL:</span>
                    <span className="text-slate-500">Not connected in this demo</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <span>Local SQLite Database:</span>
                    <span className="text-slate-500">Not used by this frontend session</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <span>Python FastAPI Backend:</span>
                    <span className="text-slate-500">Not required for the sample monitor</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Global Interactive Modals & Drawers */}
      <OcrExtractionModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        selectedPatient={selectedPatient}
        onApplyVitals={handleApplyExtractedVitals}
        onAddAuditLog={handleAddAuditLog}
      />

      <SecurityGuardrailsDrawer
        isOpen={isGuardrailsOpen}
        onClose={() => setIsGuardrailsOpen(false)}
      />

      {activeJITToken && (
        <TokenInspectorModal
          isOpen={isTokenInspectorOpen}
          onClose={() => setIsTokenInspectorOpen(false)}
          token={activeJITToken}
          secondsRemaining={secondsRemaining}
        />
      )}

      <DoctorThresholdModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        thresholds={thresholds}
        onSaveThresholds={(t) => {
          setThresholds(t);
          soundEngine.playOrderConfirmation();
        }}
        currentVitals={selectedPatient.vitals}
      />

      <AbhaQrModal
        isOpen={isAbhaQrOpen}
        onClose={() => setIsAbhaQrOpen(false)}
        patient={selectedPatient}
        currentScore={currentScore}
      />

      <ReferralHandshakeModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        patient={selectedPatient}
        currentScore={currentScore}
        onReferralDispatched={(msg) => handleAddAuditLog('SYSTEM_INTELLIGENCE', 'HOSPITAL_AUDITOR', 'INTER_FACILITY_REFERRAL', msg)}
      />

      <FamilySmsDrawer
        isOpen={isFamilySmsOpen}
        onClose={() => setIsFamilySmsOpen(false)}
        patient={selectedPatient}
        onSendCustomSms={(sms) => handleAddAuditLog('AUTOMATED_ADVOCATE', 'HOSPITAL_AUDITOR', 'FAMILY_SMS', sms)}
      />
    </div>
  );
};
export default App;
