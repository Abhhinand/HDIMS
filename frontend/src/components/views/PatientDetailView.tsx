import React, { useState } from 'react';
import { Patient, NEWS2Score, JITToken, Vitals } from '../../types/hdims';
import { 
  ArrowLeft, 
  Heart, 
  Thermometer, 
  Wind, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  FileText, 
  KeyRound, 
  PlusCircle, 
  Lock,
  ChevronRight,
  Sparkles,
  UserCheck,
  QrCode,
  Ambulance,
  MessageSquare,
  Sliders,
  Pill,
  Calendar,
  Stethoscope,
  FlaskConical,
  CheckCircle2,
  FileSpreadsheet,
  AlertOctagon,
  Eye,
  TrendingDown,
  TrendingUp,
  Radio
} from 'lucide-react';
import { BedsideMonitor } from '../BedsideMonitor';
import { soundEngine } from '../../engine/soundEngine';

interface PatientDetailViewProps {
  patient: Patient;
  score: NEWS2Score;
  activeJITToken: JITToken | null;
  onBack: () => void;
  onOpenJITInspector: () => void;
  onOpenCareTimeline: () => void;
  onOpenOcrModal: () => void;
  onOpenAuditTrail: () => void;
  onUpdateVitalsModal: () => void;
  onOpenAbhaQr?: () => void;
  onOpenReferral?: () => void;
  onOpenFamilySms?: () => void;
  onOpenThresholds?: () => void;
  onSimulateVitals?: (vitals: Partial<Vitals>) => void;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  score,
  activeJITToken,
  onBack,
  onOpenJITInspector,
  onOpenCareTimeline,
  onOpenOcrModal,
  onOpenAuditTrail,
  onUpdateVitalsModal,
  onOpenAbhaQr,
  onOpenReferral,
  onOpenFamilySms,
  onOpenThresholds,
  onSimulateVitals,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VITALS' | 'RECORDS' | 'ACCESS'>('OVERVIEW');
  const [recordsSubTab, setRecordsSubTab] = useState<'PRESCRIPTIONS' | 'VISITS' | 'LABS' | 'ALLERGIES_CATH' | 'APPOINTMENTS'>('PRESCRIPTIONS');

  const { vitals, prescriptions, labReports, previousVisits, upcomingAppointments, history } = patient;
  const isElevated = score.total >= 5;

  const handleQuickSimulate = (simVitals: Partial<Vitals>) => {
    if (onSimulateVitals) {
      onSimulateVitals(simVitals);
      soundEngine.playOrderConfirmation();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Back Button matching screenshot */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenAbhaQr && (
            <button
              onClick={onOpenAbhaQr}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>ABHA QR &amp; Fast-Digest</span>
            </button>
          )}

          {onOpenReferral && (
            <button
              onClick={onOpenReferral}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Ambulance className="w-3.5 h-3.5 text-purple-600" />
              <span>Inter-Facility Referral</span>
            </button>
          )}

          {onOpenFamilySms && (
            <button
              onClick={onOpenFamilySms}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Family SMS Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient Identity Header Card matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-lg text-blue-700">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold text-slate-900">{patient.name}</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                score.total >= 7
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : score.total >= 5
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {score.total >= 7 ? 'High Risk' : score.total >= 5 ? 'Medium Risk (Score 6)' : 'Stable'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              ID: <span className="font-mono text-slate-700">{patient.id}</span> • {patient.bedNumber} • Age {patient.age} • {patient.gender === 'F' ? 'Female' : 'Male'} • ABHA: <span className="font-mono text-slate-700">{patient.abhaId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <button onClick={onOpenCareTimeline} className="flex items-center gap-1.5 rounded-xl border border-[#cbdcc5] bg-[#edf3e9] px-4 py-2 font-bold text-[#345b36] hover:bg-[#e1ecdc]"><FileText className="h-4 w-4" /> Tests &amp; medicines</button>
          <button
            onClick={onOpenOcrModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>AI OCR Paper Analyzer</span>
          </button>
        </div>
      </div>

      {/* Horizontal Tabs matching screenshot */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 border-b-2 transition cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('VITALS')}
          className={`px-4 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'VITALS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Live Telemetry &amp; ECG</span>
        </button>
        <button
          onClick={() => setActiveTab('RECORDS')}
          className={`px-4 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'RECORDS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Clinical Records &amp; History ({prescriptions.length + labReports.length + previousVisits.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ACCESS')}
          className={`px-4 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ACCESS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Access Lattice Proof</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW (Matching Reference Screen 2) */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Vitals Cards + Current Access Matrix */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Vital Signs Grid (4 Cards) matching screenshot */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Vital Signs</h3>
                <span className="text-[11px] text-slate-400 font-medium">Sample vitals · Interactive demonstration</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Heart Rate */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Heart Rate</span>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-800">{vitals.pulseRate}</span>
                    <span className="text-xs text-slate-500 font-medium ml-1">bpm</span>
                    <div className="text-[10px] text-rose-600 font-semibold mt-0.5">● Tachycardia (Ref: 60-100)</div>
                  </div>
                </div>

                {/* Temperature */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Temperature</span>
                    <Thermometer className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-800">{vitals.temperature}</span>
                    <span className="text-xs text-slate-500 font-medium ml-1">°C</span>
                    <div className="text-[10px] text-amber-600 font-semibold mt-0.5">● Febrile (Ref: 36.5-37.5)</div>
                  </div>
                </div>

                {/* SpO2 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>SpO2</span>
                    <Wind className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-800">{vitals.spo2}%</span>
                    <div className="text-[10px] text-rose-600 font-semibold mt-0.5">● Desaturation (Ref: 95-100)</div>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Blood Pressure</span>
                    <Activity className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-800">{vitals.systolicBp}/{Math.round(vitals.systolicBp * 0.65)}</span>
                    <span className="text-[10px] text-slate-500 font-medium ml-1">mmHg</span>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Normal: 120/80</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Access Matrix Table matching screenshot */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Current Access Matrix</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Caregiver scopes and time-limited specialist access</p>
                </div>
                <button 
                  onClick={onOpenJITInspector}
                  disabled={!activeJITToken}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{activeJITToken ? 'Inspect demo token' : 'No active token'}</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="grid grid-cols-3 px-5 py-2.5 font-semibold text-slate-400 bg-slate-50/70">
                  <span>Healthcare Role</span>
                  <span>Access Scope</span>
                  <span className="text-right">Grant Expiry</span>
                </div>

                {/* Row 1: Staff Nurse */}
                <div className="grid grid-cols-3 px-5 py-3 items-center hover:bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-800">Staff Nurse (Priya)</span>
                  </div>
                  <span className="text-slate-600">Full Bedside Telemetry &amp; Routine Meds</span>
                  <span className="text-slate-400 text-right font-mono font-medium">Standing Shift</span>
                </div>

                {/* Row 2: Attending Physician */}
                <div className="grid grid-cols-3 px-5 py-3 items-center hover:bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-800">Attending Physician (Dr. Smith)</span>
                  </div>
                  <span className="text-slate-600">Full Clinical Data &amp; Override Orders</span>
                  <span className="text-slate-400 text-right font-mono font-medium">Primary Care</span>
                </div>

                {/* Row 3: On-call Specialist */}
                <div className={`grid grid-cols-3 px-5 py-3 items-center ${activeJITToken ? 'bg-blue-50/40' : 'bg-slate-50/40'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${activeJITToken ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                    <span className="font-bold text-slate-900">On-Call Cardiologist (Dr. Rajesh)</span>
                  </div>
                  <span className={activeJITToken ? 'text-blue-700 font-semibold' : 'text-slate-400'}>{activeJITToken ? 'Specialist review scope' : 'Specialist scope restricted'}</span>
                  <span className={`font-bold text-right font-mono ${activeJITToken ? 'text-blue-700' : 'text-slate-400'}`}>{activeJITToken ? 'Time-limited demo grant' : 'No active grant'}</span>
                </div>

                {/* Row 4: External Hospital */}
                <div className="grid grid-cols-3 px-5 py-3 items-center hover:bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="font-bold text-slate-800">City Apex Multi-Specialty Hospital</span>
                  </div>
                  <span className="text-slate-500">Inter-Facility Emergency Handshake Ready</span>
                  <span className="text-slate-400 text-right font-mono">Standby</span>
                </div>
              </div>

              {/* Bottom Actions inside Card matching screenshot */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={onOpenJITInspector}
                  disabled={!activeJITToken}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{activeJITToken ? 'Inspect Specialist Token' : 'No Specialist Token'}</span>
                </button>
                <button 
                  onClick={onOpenAuditTrail}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Tamper-Evident Ledger</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Risk Score Gauge + Quick Actions Tray */}
          <div className="flex flex-col gap-6">
            {/* Risk Score Gauge matching screenshot */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center text-center gap-3">
              <div className="w-full flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Physiological Triage</h3>
                <span className="text-[11px] font-semibold text-slate-400">NHS NEWS2 Protocol</span>
              </div>

              {/* Semi-circular gauge */}
              <div className="relative w-44 h-24 flex items-end justify-center mt-1">
                <svg className="w-44 h-24" viewBox="0 0 100 50">
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="10"
                    strokeDasharray="125.6"
                    strokeDashoffset="50"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute bottom-1 flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">{score.total}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">NEWS2 Score</span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full border font-bold text-xs ${score.tier === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' : score.tier === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {score.tierLabel}
              </span>

              <div className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                <span>Current risk: {score.tier.toLowerCase()}</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Subscores: SpO2 (+{score.subscores.spo2}), HR (+{score.subscores.pulseRate}), RR (+{score.subscores.respirationRate}), Temp (+{score.subscores.temperature}).
              </p>
            </div>

            {/* Quick Actions Tray matching screenshot */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions Tray</h3>

              <div className="flex flex-col gap-2 text-xs">
                <button
                  onClick={() => setActiveTab('RECORDS')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    <span>Medicine History &amp; Doctor Visits</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={onOpenOcrModal}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI OCR Paper Lab/Rx Extractor</span>
                  </div>
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                </button>

                {onOpenAbhaQr && (
                  <button
                    onClick={onOpenAbhaQr}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-purple-600" />
                      <span>ABHA QR Scan &amp; Clinical Digest</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}

                {onOpenReferral && (
                  <button
                    onClick={onOpenReferral}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Ambulance className="w-4 h-4 text-rose-600" />
                      <span>Inter-Facility Referral Handshake</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}

                {onOpenFamilySms && (
                  <button
                    onClick={onOpenFamilySms}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Family SMS Advocate Notification</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}

                {onOpenThresholds && (
                  <button
                    onClick={onOpenThresholds}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-600" />
                      <span>Adjust Doctor Alert Thresholds</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE TELEMETRY & ECG MONITOR */}
      {activeTab === 'VITALS' && (
        <div className="space-y-6">
          <BedsideMonitor
            patient={patient}
            score={score}
            onOpenAbhaQr={onOpenAbhaQr}
            onOpenLabAnalyzer={onOpenOcrModal}
            onOpenFamilySms={onOpenFamilySms}
          />

          {/* Real-time Physiological Simulation Controls */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Bedside Simulation Controls (Test Emergency Engine)</h4>
                <p className="text-xs text-slate-500">Inject clinical scenarios to test automatic NEWS2 scoring and JIT access escalation</p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                Interactive Simulator
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleQuickSimulate({ pulseRate: 74, spo2: 98, respirationRate: 16, temperature: 36.8 })}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 block">Normal Sinus</span>
                <span className="text-[11px] text-slate-500">HR 74, SpO2 98% (Stable)</span>
              </button>

              <button
                onClick={() => handleQuickSimulate({ pulseRate: 104, spo2: 93, respirationRate: 24, temperature: 38.2 })}
                className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition cursor-pointer"
              >
                <span className="text-xs font-bold text-amber-800 block">Medium Deterioration</span>
                <span className="text-[11px] text-amber-600">HR 104, SpO2 93% (NEWS 6)</span>
              </button>

              <button
                onClick={() => handleQuickSimulate({ pulseRate: 128, spo2: 89, respirationRate: 28, systolicBp: 92, temperature: 38.8 })}
                className="p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-left transition cursor-pointer"
              >
                <span className="text-xs font-bold text-rose-800 block">Acute Cardiac Desat</span>
                <span className="text-[11px] text-rose-600">SpO2 89%, HR 128 (Critical JIT)</span>
              </button>

              <button
                onClick={() => onOpenOcrModal()}
                className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition cursor-pointer"
              >
                <span className="text-xs font-bold text-blue-800 block">Extract via OCR</span>
                <span className="text-[11px] text-blue-600">Scan paper lab slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL RECORDS (Medicine History, Doctor Visits, Lab Reports, Allergies) */}
      {activeTab === 'RECORDS' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Sub-Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => setRecordsSubTab('PRESCRIPTIONS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                recordsSubTab === 'PRESCRIPTIONS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Medicine History ({prescriptions.length})</span>
            </button>

            <button
              onClick={() => setRecordsSubTab('VISITS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                recordsSubTab === 'VISITS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Previous Doctor Visits ({previousVisits.length})</span>
            </button>

            <button
              onClick={() => setRecordsSubTab('LABS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                recordsSubTab === 'LABS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Lab Reports &amp; Biomarkers ({labReports.length})</span>
            </button>

            <button
              onClick={() => setRecordsSubTab('ALLERGIES_CATH')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                recordsSubTab === 'ALLERGIES_CATH'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Allergies &amp; Cath Vault</span>
            </button>

            <button
              onClick={() => setRecordsSubTab('APPOINTMENTS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                recordsSubTab === 'APPOINTMENTS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Next Appointments ({upcomingAppointments.length})</span>
            </button>
          </div>

          {/* Sub-Tab 1: Medicine History */}
          {recordsSubTab === 'PRESCRIPTIONS' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Active Medication Regimen &amp; Prescription History</h4>
                  <p className="text-xs text-slate-500">Cross-verified against ABDM e-Pharmacy Health Registry</p>
                </div>
                <button
                  onClick={onOpenOcrModal}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Upload Prescription Slip
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Medication Name</th>
                      <th className="py-3 px-4">Dosage</th>
                      <th className="py-3 px-4">Frequency</th>
                      <th className="py-3 px-4">Route</th>
                      <th className="py-3 px-4">Prescribed By</th>
                      <th className="py-3 px-4">Date Started</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescriptions.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-blue-600" />
                          <span>{med.medicineName}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{med.dosage}</td>
                        <td className="py-3 px-4 text-slate-600">{med.frequency}</td>
                        <td className="py-3 px-4 text-slate-600">{med.route}</td>
                        <td className="py-3 px-4 text-slate-700">{med.prescribedBy}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{med.dateStarted}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            med.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {med.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Previous Doctor Visits */}
          {recordsSubTab === 'VISITS' && (
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Historical Clinical Encounters &amp; OPD Doctor Visits</h4>
                <p className="text-xs text-slate-500">Longitudinal visit history retrieved across networked facilities</p>
              </div>

              <div className="space-y-3">
                {previousVisits.map((vis) => (
                  <div key={vis.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{vis.facility}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          {vis.specialty || 'General Medicine'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Attending: <b>{vis.doctorName || vis.attendingDoctor}</b></span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{vis.date || vis.encounterDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="font-semibold text-slate-500 uppercase text-[10px]">Diagnosis / Chief Complaint</span>
                        <p className="text-slate-800 font-medium mt-0.5">{vis.diagnosis || vis.chiefComplaint}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500 uppercase text-[10px]">Clinical Findings &amp; Discharge Plan</span>
                        <p className="text-slate-600 mt-0.5">{vis.clinicalFindings || vis.summaryNotes || vis.planAndDischarge}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Lab Reports */}
          {recordsSubTab === 'LABS' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Laboratory Diagnostics &amp; Biomarker Panels</h4>
                  <p className="text-xs text-slate-500">Automated reference range classification and critical analyte alerts</p>
                </div>
                <button
                  onClick={onOpenOcrModal}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Extract from Paper Lab Report
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Test Name / Analyte</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Extracted Value</th>
                      <th className="py-3 px-4">Reference Range</th>
                      <th className="py-3 px-4">Interpretation</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labReports.map((lab) => (
                      <tr key={lab.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">{lab.testName}</td>
                        <td className="py-3 px-4 text-slate-500 font-medium">{lab.category}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {lab.value} <span className="font-normal text-slate-500">{lab.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{lab.referenceRange}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{lab.clinicalInterpretation}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lab.status === 'NORMAL'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {lab.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Allergies & Cath Vault */}
          {recordsSubTab === 'ALLERGIES_CATH' && (
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Cardiovascular Cath Vault &amp; Critical Allergy Registry</h4>
                <p className="text-xs text-slate-500">High-confidentiality records protected under Emergency Access Lattice</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Critical Allergies */}
                <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Documented Critical Allergies</span>
                  </div>
                  <div className="space-y-2">
                    {history.criticalAllergies.map((allergy, idx) => (
                      <div key={idx} className="p-2.5 bg-white border border-rose-200 rounded-lg text-xs font-semibold text-rose-900 flex items-center gap-2">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span>{allergy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stent & Cath Details */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Cardiac Angiography &amp; Stent Registry</span>
                  </div>
                  <div className="text-xs space-y-2 text-slate-700">
                    <p><b>Catheterization Summary:</b> {history.cardiacCathSummary}</p>
                    <p><b>Deployed Stents:</b> {history.stentDetails}</p>
                    <p><b>Linked Hospital:</b> {history.abhaLinkedHospital}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Next Appointments */}
          {recordsSubTab === 'APPOINTMENTS' && (
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Upcoming Care Coordination &amp; Scheduled Appointments</h4>
                <p className="text-xs text-slate-500">Verified through ABDM Appointment Booking Gateway</p>
              </div>

              <div className="space-y-3">
                {upcomingAppointments.map((apt, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{apt.specialty || apt.department || 'Follow-Up Clinic'}</h5>
                        <p className="text-[11px] text-slate-500">Doctor: <b>{apt.doctorName}</b> • Location: {apt.location || apt.hospital}</p>
                        <p className="text-[11px] text-blue-600 font-medium mt-0.5">{apt.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-800 block">{apt.date}</span>
                      <span className="text-[11px] text-slate-500">{apt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ACCESS LATTICE PROOF */}
      {activeTab === 'ACCESS' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Dynamic Access Control Proof &amp; Ephemeral JWT</h3>
              <p className="text-xs text-slate-500">Mathematical lattice mapping patient physiological risk to caregiver data scopes</p>
            </div>
            <button
              onClick={onOpenJITInspector}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" /> Inspect Cryptographic Token
            </button>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Access policy: {score.tierLabel}</span>
            </div>
            <p>
              The patient's current NEWS2 score is <b>{score.total} ({score.tier.toLowerCase()} risk)</b>. Access scopes in this demo follow the calculated risk tier.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Caregiver Role</th>
                  <th className="py-3 px-4">Live Vitals</th>
                  <th className="py-3 px-4">Routine Meds</th>
                  <th className="py-3 px-4">Historical EHR</th>
                  <th className="py-3 px-4">Cath / Stent Vault</th>
                  <th className="py-3 px-4 text-right">Authorization Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Staff Nurse</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-3 px-4 text-slate-400">— Redacted</td>
                  <td className="py-3 px-4 text-slate-400">— Redacted</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600">Standing Shift</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Attending Physician</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600">Primary Admission</td>
                </tr>
                <tr className="bg-blue-50/50">
                  <td className="py-3 px-4 font-bold text-blue-900">On-Call Cardiologist</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-3 px-4 text-slate-400">— Redacted</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Unlocked</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Unlocked</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700">45-min JIT Ephemeral</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
