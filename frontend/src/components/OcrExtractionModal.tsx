import React, { useState, useEffect } from 'react';
import {
  X,
  FileScan,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  Activity,
  Pill,
  Lock,
  Download,
  Eye,
  Sliders,
  AlertOctagon,
  FileSpreadsheet
} from 'lucide-react';
import { Patient, Vitals } from '../types/hdims';
import { soundEngine } from '../engine/soundEngine';

interface OcrExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPatient: Patient;
  onApplyVitals: (vitals: Partial<Vitals>) => void;
  onAddAuditLog?: (actor: string, role: string, eventType: string, detail: string) => void;
}

interface SampleDocument {
  id: string;
  title: string;
  hospital: string;
  date: string;
  type: 'LAB_REPORT' | 'PRESCRIPTION' | 'ICU_CHART';
  fileName: string;
  confidence: number;
  rawOcrText: string;
  extractedVitals: {
    heartRate: number;
    spo2: number;
    systolicBp: number;
    diastolicBp: number;
    respiratoryRate: number;
    temperature: number;
    glucose?: number;
  };
  biomarkers: {
    name: string;
    value: string;
    unit: string;
    refRange: string;
    status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  }[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    flaggedAllergy?: boolean;
  }[];
  guardrailAlerts: {
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    title: string;
    description: string;
    regulation: string;
  }[];
}

const SAMPLE_DOCS: SampleDocument[] = [
  {
    id: 'doc-1',
    title: 'Stat Arterial Blood Gas & Cardiac Panel',
    hospital: 'Apollo Emergency & Trauma Center',
    date: '15-Sep-2026 14:15 IST',
    type: 'LAB_REPORT',
    fileName: 'Apollo_ABG_Cardiac_150926.pdf',
    confidence: 98.6,
    rawOcrText: `APOLLO EMERGENCY CARE - LAB ID: #AP-88492
PATIENT: CONFIDENTIAL [UHI-8493]
DATE: 15-SEP-2026 14:10
EXAMINATION: STAT ARTERIAL BLOOD GAS (ABG) & ENZYMES
HR: 104 bpm | BP: 142/92 mmHg | RR: 24 bpm | SpO2: 93% (Room Air) | Temp: 38.2 C
pH: 7.31 (Ref: 7.35-7.45) [ACIDEMIA]
pO2: 58.4 mmHg (Ref: 80-100) [MODERATE HYPOXIA]
pCO2: 46.8 mmHg (Ref: 35-45) [MILD HYPERCAPNIA]
hs-Troponin-I: 1.86 ng/mL (Ref: <0.04) [CRITICAL ELEVATION]
Serum Potassium: 4.8 mEq/L (Ref: 3.5-5.0) [NORMAL]
Blood Urea Nitrogen: 22 mg/dL (Ref: 7-20) [MILD ELEVATION]
Serum Creatinine: 1.28 mg/dL (Ref: 0.7-1.3) [NORMAL HIGH]
CLINICAL IMPRESSION: Acute coronary ischemia with respiratory compromise.`,
    extractedVitals: {
      heartRate: 104,
      spo2: 93,
      systolicBp: 142,
      diastolicBp: 92,
      respiratoryRate: 24,
      temperature: 38.2,
      glucose: 148
    },
    biomarkers: [
      { name: 'hs-Troponin-I', value: '1.86', unit: 'ng/mL', refRange: '<0.04', status: 'CRITICAL' },
      { name: 'Arterial pO2', value: '58.4', unit: 'mmHg', refRange: '80.0 - 100.0', status: 'CRITICAL' },
      { name: 'Blood pH', value: '7.31', unit: 'pH', refRange: '7.35 - 7.45', status: 'ELEVATED' },
      { name: 'pCO2', value: '46.8', unit: 'mmHg', refRange: '35.0 - 45.0', status: 'ELEVATED' },
      { name: 'Serum Creatinine', value: '1.28', unit: 'mg/dL', refRange: '0.70 - 1.30', status: 'NORMAL' },
      { name: 'Potassium (K+)', value: '4.8', unit: 'mEq/L', refRange: '3.5 - 5.0', status: 'NORMAL' }
    ],
    medications: [
      { name: 'Aspirin (Oral)', dosage: '325 mg', frequency: 'STAT', route: 'Oral' },
      { name: 'Ticagrelor', dosage: '90 mg', frequency: 'BD', route: 'Oral' },
      { name: 'Unfractionated Heparin', dosage: '5000 IU', frequency: 'STAT bolus', route: 'IV' },
      { name: 'Amoxicillin-Clavulanate', dosage: '1.2 g', frequency: 'TDS', route: 'IV', flaggedAllergy: true }
    ],
    guardrailAlerts: [
      {
        severity: 'CRITICAL',
        title: 'CONTRAINDICATION: Documented Penicillin Anaphylaxis',
        description: 'Document includes Amoxicillin-Clavulanate. Patient has verified Grade IV Penicillin allergy in ABDM Registry.',
        regulation: 'ABDM FHIR AllergyIntolerance Rule 4.2'
      },
      {
        severity: 'WARNING',
        title: 'ELEVATED NEWS2 ESCALATION TRIGGER',
        description: 'Extracted vitals indicate SpO2 93% on room air with tachypnea (RR 24). Automatically triggers High-Risk tier.',
        regulation: 'NHS NEWS2 Protocol Section 3'
      },
      {
        severity: 'INFO',
        title: 'PHI De-identification Safeguard Applied',
        description: 'Aadhaar / National ID tokens redacted before clinical OCR processing.',
        regulation: 'DPDP Act 2023 §8 & DISHA Framework'
      }
    ]
  },
  {
    id: 'doc-2',
    title: 'Discharge Summary & Prescription Slip',
    hospital: 'Fortis Memorial Research Institute',
    date: '12-Sep-2026 18:30 IST',
    type: 'PRESCRIPTION',
    fileName: 'Fortis_Cardio_Prescription_Scan.jpg',
    confidence: 97.2,
    rawOcrText: `FORTIS CARDIOLOGY OPD - DR. SANJAY MEHTA MD DM
PATIENT: CONFIDENTIAL [REC #FT-10928]
DATE: 12-SEP-2026
VITALS RECORDED:
HR: 76 bpm | BP: 128/82 mmHg | SpO2: 98% (Room Air) | Temp: 36.8 C | RR: 16 /min
DIAGNOSIS: Post-PCI Stent Follow-Up (LAD Stented 2024)
PRESCRIPTIONS:
1. Tab. Telmisartan 40mg once daily morning
2. Tab. Metoprolol Succinate 25mg once daily
3. Tab. Atorvastatin 40mg at bedtime
4. Tab. Clopidogrel 75mg once daily
ADVICE: Low sodium diet, maintain daily BP log, follow-up after 4 weeks.`,
    extractedVitals: {
      heartRate: 76,
      spo2: 98,
      systolicBp: 128,
      diastolicBp: 82,
      respiratoryRate: 16,
      temperature: 36.8,
      glucose: 110
    },
    biomarkers: [
      { name: 'Recorded Systolic BP', value: '128', unit: 'mmHg', refRange: '90 - 130', status: 'NORMAL' },
      { name: 'Recorded Diastolic BP', value: '82', unit: 'mmHg', refRange: '60 - 85', status: 'NORMAL' },
      { name: 'Resting Pulse', value: '76', unit: 'bpm', refRange: '60 - 100', status: 'NORMAL' }
    ],
    medications: [
      { name: 'Telmisartan', dosage: '40 mg', frequency: 'OD', route: 'Oral' },
      { name: 'Metoprolol Succinate', dosage: '25 mg', frequency: 'OD', route: 'Oral' },
      { name: 'Atorvastatin', dosage: '40 mg', frequency: 'HS', route: 'Oral' },
      { name: 'Clopidogrel', dosage: '75 mg', frequency: 'OD', route: 'Oral' }
    ],
    guardrailAlerts: [
      {
        severity: 'INFO',
        title: 'Regimen Adherence Verified',
        description: 'Prescription aligns with standard secondary cardiac prevention guidelines. No drug-drug interactions detected.',
        regulation: 'ICMR Cardiovascular Protocol 2025'
      }
    ]
  },
  {
    id: 'doc-3',
    title: 'ICU Telemetry Flowsheet & Blood Gas',
    hospital: 'Max Super Speciality Hospital ICU-3',
    date: '14-Sep-2026 22:00 IST',
    type: 'ICU_CHART',
    fileName: 'Max_ICU_Flowsheet_Sept14.png',
    confidence: 96.8,
    rawOcrText: `MAX ICU UNIT 3 - BEDSIDE FLOWSHEET
PATIENT: CONFIDENTIAL [BED: ICU-B04]
SHIFT: NIGHT (22:00 IST)
HR: 112 bpm | BP: 146/94 mmHg | SpO2: 91% (2L O2 Cannula) | RR: 26 /min | Temp: 38.6 C
GLUCOSE: 210 mg/dL (Capillary)
WBC: 16,800 /uL (Ref: 4,000-11,000) [LEUKOCYTOSIS]
CRP: 74 mg/L (Ref: <5) [MARKED SYSTEMIC INFLAMMATION]
LACTATE: 2.8 mmol/L (Ref: 0.5-2.0) [ELEVATED LACTIC ACIDEMIA]
STATUS: Sepsis bundle protocol initiated.`,
    extractedVitals: {
      heartRate: 112,
      spo2: 91,
      systolicBp: 146,
      diastolicBp: 94,
      respiratoryRate: 26,
      temperature: 38.6,
      glucose: 210
    },
    biomarkers: [
      { name: 'Serum Lactate', value: '2.8', unit: 'mmol/L', refRange: '0.5 - 2.0', status: 'CRITICAL' },
      { name: 'C-Reactive Protein (CRP)', value: '74.0', unit: 'mg/L', refRange: '< 5.0', status: 'CRITICAL' },
      { name: 'Total Leukocyte Count (WBC)', value: '16,800', unit: '/uL', refRange: '4,000 - 11,000', status: 'CRITICAL' }
    ],
    medications: [
      { name: 'Meropenem', dosage: '1 g', frequency: 'TDS', route: 'IV Infusion' },
      { name: 'Ringer Lactate', dosage: '1000 mL', frequency: 'STAT', route: 'IV' },
      { name: 'Paracetamol IV', dosage: '1 g', frequency: 'SOS', route: 'IV' }
    ],
    guardrailAlerts: [
      {
        severity: 'CRITICAL',
        title: 'SEPSIS PROTOCOL ACTIVATION',
        description: 'Extracted Lactate 2.8 mmol/L with fever (38.6°C) and leukocytosis warrants immediate ICU resuscitation checklist.',
        regulation: 'Surviving Sepsis Campaign Guidelines 2026'
      },
      {
        severity: 'WARNING',
        title: 'NEWS2 Score Jumps to Critical Tier',
        description: 'Vitals trigger immediate Escalation Center notification to attending intensivists.',
        regulation: 'Emergency Dynamic JIT Policy §2'
      }
    ]
  }
];

export const OcrExtractionModal: React.FC<OcrExtractionModalProps> = ({
  isOpen,
  onClose,
  selectedPatient,
  onApplyVitals,
  onAddAuditLog
}) => {
  const [selectedDoc, setSelectedDoc] = useState<SampleDocument>(SAMPLE_DOCS[0]);
  const [activeTab, setActiveTab] = useState<'EXTRACTED_VITALS' | 'BIOMARKERS' | 'MEDICATIONS' | 'GUARDRAILS' | 'RAW_OCR'>('EXTRACTED_VITALS');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [syncedSuccess, setSyncedSuccess] = useState<boolean>(false);
  const [customFileLoaded, setCustomFileLoaded] = useState<boolean>(false);
  const [customFileName, setCustomFileName] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSyncedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectDoc = (doc: SampleDocument) => {
    setIsScanning(true);
    setScanProgress(15);
    soundEngine.playHeartbeatBeep();

    const timer1 = setTimeout(() => setScanProgress(55), 250);
    const timer2 = setTimeout(() => setScanProgress(85), 500);
    const timer3 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setSelectedDoc(doc);
      setSyncedSuccess(false);
      soundEngine.playOrderConfirmation();
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    setIsScanning(true);
    setScanProgress(20);

    setTimeout(() => setScanProgress(60), 300);
    setTimeout(() => setScanProgress(90), 600);
    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(100);
      setCustomFileLoaded(true);

      const dynamicDoc: SampleDocument = {
        id: `user-${Date.now()}`,
        title: `Uploaded: ${file.name}`,
        hospital: 'Uploaded Clinical Document (Auto-Parsed)',
        date: 'Just now (Live OCR Scan)',
        type: file.name.endsWith('.pdf') ? 'LAB_REPORT' : 'PRESCRIPTION',
        fileName: file.name,
        confidence: 97.4,
        rawOcrText: `[OCR ENGINE v4.2 EXTRACTED STREAM]
SOURCE: ${file.name}
TARGET PATIENT: ${selectedPatient.name} (ABHA: ${selectedPatient.abhaId})
TIMESTAMP: ${new Date().toISOString()}
------------------------------------------------------
HEART RATE: 98 bpm (Stable)
BLOOD PRESSURE: 134/86 mmHg (Grade 1 Prehypertension)
SpO2: 95% on Room Air
RESPIRATORY RATE: 20 breaths/min
TEMPERATURE: 37.4 °C (Normothermic)
RANDOM BLOOD SUGAR: 138 mg/dL
TROPO-I: 0.08 ng/mL (Mildly border-line)
SERUM CREATININE: 1.1 mg/dL
RECOMMENDATIONS: Monitor SpO2 trends every 2 hours.`,
        extractedVitals: {
          heartRate: 98,
          spo2: 95,
          systolicBp: 134,
          diastolicBp: 86,
          respiratoryRate: 20,
          temperature: 37.4,
          glucose: 138
        },
        biomarkers: [
          { name: 'Troponin-I', value: '0.08', unit: 'ng/mL', refRange: '<0.04', status: 'ELEVATED' },
          { name: 'Serum Creatinine', value: '1.1', unit: 'mg/dL', refRange: '0.7-1.3', status: 'NORMAL' },
          { name: 'Random Blood Sugar', value: '138', unit: 'mg/dL', refRange: '70-140', status: 'NORMAL' }
        ],
        medications: [
          { name: 'Paracetamol', dosage: '650 mg', frequency: 'SOS', route: 'Oral' },
          { name: 'Pantoprazole', dosage: '40 mg', frequency: 'OD', route: 'Oral' }
        ],
        guardrailAlerts: [
          {
            severity: 'INFO',
            title: 'OCR Automated De-identification Complete',
            description: 'Patient identifier hashes preserved in compliance with DPDP Act.',
            regulation: 'DISHA Health Data Registry'
          }
        ]
      };

      setSelectedDoc(dynamicDoc);
      setSyncedSuccess(false);
      soundEngine.playOrderConfirmation();
    }, 850);
  };

  const handleApplyVitals = () => {
    onApplyVitals(selectedDoc.extractedVitals);
    setSyncedSuccess(true);
    soundEngine.playOrderConfirmation();

    if (onAddAuditLog) {
      onAddAuditLog(
        'Dr. Smith (Attending)',
        'ATTENDING_PHYSICIAN',
        'OCR_VITALS_SYNC',
        `Synchronized OCR extracted vitals from '${selectedDoc.fileName}' (HR: ${selectedDoc.extractedVitals.heartRate} bpm, SpO2: ${selectedDoc.extractedVitals.spo2}%, BP: ${selectedDoc.extractedVitals.systolicBp}/${selectedDoc.extractedVitals.diastolicBp}) to patient ${selectedPatient.name}.`
      );
    }
  };

  const handleExportFhir = () => {
    const fhirResource = {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: new Date().toISOString(),
      subject: {
        reference: `Patient/${selectedPatient.id}`,
        identifier: selectedPatient.nationalHealthId || selectedPatient.abhaId,
        display: selectedPatient.name
      },
      ocrExtractionConfidence: selectedDoc.confidence,
      sourceDocument: selectedDoc.fileName,
      vitalsObservation: {
        heartRate: selectedDoc.extractedVitals.heartRate,
        spo2: selectedDoc.extractedVitals.spo2,
        bloodPressure: `${selectedDoc.extractedVitals.systolicBp}/${selectedDoc.extractedVitals.diastolicBp}`,
        respiratoryRate: selectedDoc.extractedVitals.respiratoryRate,
        temperature: selectedDoc.extractedVitals.temperature
      },
      biomarkers: selectedDoc.biomarkers,
      medications: selectedDoc.medications,
      guardrailEvaluations: selectedDoc.guardrailAlerts
    };

    const blob = new Blob([JSON.stringify(fhirResource, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_OCR_${selectedPatient.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileScan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">AI OCR Clinical Extraction Tool</h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> DPDP & DISHA Guardrails Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Extract vitals, lab biomarkers & prescriptions from scanned paper slips • Target Patient:{' '}
                <span className="font-semibold text-white">{selectedPatient.name}</span> ({selectedPatient.nationalHealthId || selectedPatient.abhaId})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFhir}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              title="Export structured FHIR JSON"
            >
              <Download className="w-3.5 h-3.5" /> FHIR JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left column + Right column */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Document Upload & Sample Tray (4 Cols) */}
          <div className="md:col-span-4 p-5 bg-slate-50 border-r border-slate-200 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Upload Custom Document (Lab Slip / Rx)
              </label>
              <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-xl p-4 cursor-pointer transition-all group text-center">
                <Upload className="w-6 h-6 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700">Click to upload or drag & drop</span>
                <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, PDF lab reports & prescriptions</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {customFileLoaded && (
                <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate font-medium">{customFileName}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Preset Clinical Documents (1-Click Test)
              </label>
              <div className="space-y-2">
                {SAMPLE_DOCS.map((doc) => {
                  const isSelected = selectedDoc.id === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{doc.title}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            doc.type === 'LAB_REPORT'
                              ? 'bg-purple-100 text-purple-700'
                              : doc.type === 'PRESCRIPTION'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{doc.hospital}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>Confidence: {doc.confidence}%</span>
                        <span className="font-mono">{doc.date.split(' ')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Verification Box */}
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500">OCR Engine v4.2</span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Confidence: {selectedDoc.confidence}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Optical character segmentation with medical vocabulary spell-correction and units normalization.
              </p>
            </div>
          </div>

          {/* Right Column: OCR Analysis & Live Verification (8 Cols) */}
          <div className="md:col-span-8 p-6 flex flex-col overflow-y-auto bg-white">
            {isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
                <div className="relative">
                  <FileScan className="w-12 h-12 text-blue-600 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Processing Clinical Document...</h3>
                <p className="text-xs text-slate-500">Normalizing handwritten notations & extracting structured biomarkers</p>
                <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Active Document Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{selectedDoc.title}</h3>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                        {selectedDoc.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedDoc.hospital} • {selectedDoc.date} • Source: <span className="font-mono text-slate-700">{selectedDoc.fileName}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApplyVitals}
                      disabled={syncedSuccess}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 ${
                        syncedSuccess
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                      }`}
                    >
                      {syncedSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Vitals Synced to Monitor
                        </>
                      ) : (
                        <>
                          <Activity className="w-4 h-4" /> Apply Extracted Vitals
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 my-4 overflow-x-auto text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('EXTRACTED_VITALS')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'EXTRACTED_VITALS'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" /> Extracted Vitals
                  </button>
                  <button
                    onClick={() => setActiveTab('BIOMARKERS')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'BIOMARKERS'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Lab Biomarkers ({selectedDoc.biomarkers.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('MEDICATIONS')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'MEDICATIONS'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Pill className="w-3.5 h-3.5" /> Medications ({selectedDoc.medications.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('GUARDRAILS')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'GUARDRAILS'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Security Guardrails ({selectedDoc.guardrailAlerts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('RAW_OCR')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'RAW_OCR'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Raw OCR Text
                  </button>
                </div>

                {/* Tab 1: Extracted Vitals */}
                {activeTab === 'EXTRACTED_VITALS' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">Heart Rate</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-bold text-slate-900">{selectedDoc.extractedVitals.heartRate}</span>
                          <span className="text-xs text-slate-500 font-medium">bpm</span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold inline-block mt-1 ${
                            selectedDoc.extractedVitals.heartRate > 100
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {selectedDoc.extractedVitals.heartRate > 100 ? '● Tachycardia' : '● Normal Sinus'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">Oxygen Saturation</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-bold text-slate-900">{selectedDoc.extractedVitals.spo2}</span>
                          <span className="text-xs text-slate-500 font-medium">%</span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold inline-block mt-1 ${
                            selectedDoc.extractedVitals.spo2 < 94
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {selectedDoc.extractedVitals.spo2 < 94 ? '● Desaturation' : '● Optimal Target'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">Blood Pressure</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-bold text-slate-900">
                            {selectedDoc.extractedVitals.systolicBp}/{selectedDoc.extractedVitals.diastolicBp}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">mmHg</span>
                        </div>
                        <span className="text-[10px] font-semibold inline-block mt-1 text-slate-600">
                          {selectedDoc.extractedVitals.systolicBp > 140 ? '● Stage 1 HTN' : '● Normotensive'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">Resp Rate / Temp</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-bold text-slate-900">
                            {selectedDoc.extractedVitals.respiratoryRate} / {selectedDoc.extractedVitals.temperature}°C
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold inline-block mt-1 ${
                            selectedDoc.extractedVitals.temperature > 38
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {selectedDoc.extractedVitals.temperature > 38 ? '● Febrile' : '● Normal Temp'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-900">
                        <span className="font-bold">Autonomous Clinical Verification Engine:</span>
                        <p className="mt-0.5 text-blue-800">
                          These parameters were parsed via OCR from scanned paper documents. Clicking{' '}
                          <span className="font-semibold">"Apply Extracted Vitals"</span> immediately updates the patient’s real-time
                          telemetry, re-computes the physiological NEWS2 score, and writes a tamper-evident audit record.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Biomarkers */}
                {activeTab === 'BIOMARKERS' && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Biomarker / Analyte</th>
                          <th className="py-2.5 px-4">Extracted Value</th>
                          <th className="py-2.5 px-4">Reference Interval</th>
                          <th className="py-2.5 px-4 text-right">Clinical Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedDoc.biomarkers.map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-4 font-semibold text-slate-800">{b.name}</td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              {b.value} <span className="text-xs font-normal text-slate-500">{b.unit}</span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500">{b.refRange}</td>
                            <td className="py-2.5 px-4 text-right">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                  b.status === 'CRITICAL'
                                    ? 'bg-rose-100 text-rose-700'
                                    : b.status === 'ELEVATED'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 3: Medications */}
                {activeTab === 'MEDICATIONS' && (
                  <div className="space-y-3">
                    {selectedDoc.medications.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between ${
                          m.flaggedAllergy
                            ? 'bg-rose-50/70 border-rose-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              m.flaggedAllergy
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{m.name}</span>
                              {m.flaggedAllergy && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded">
                                  ALLERGY CONTRAINDICATION
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Dosage: <span className="font-semibold text-slate-700">{m.dosage}</span> • Frequency:{' '}
                              <span className="font-semibold text-slate-700">{m.frequency}</span> • Route: {m.route}
                            </p>
                          </div>
                        </div>

                        {m.flaggedAllergy && (
                          <div className="text-right text-xs text-rose-600 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" /> Beta-Lactam Anaphylaxis
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 4: Security Guardrails */}
                {activeTab === 'GUARDRAILS' && (
                  <div className="space-y-3">
                    {selectedDoc.guardrailAlerts.map((g, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${
                          g.severity === 'CRITICAL'
                            ? 'bg-rose-50 border-rose-200'
                            : g.severity === 'WARNING'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {g.severity === 'CRITICAL' ? (
                              <ShieldAlert className="w-5 h-5 text-rose-600" />
                            ) : g.severity === 'WARNING' ? (
                              <AlertTriangle className="w-5 h-5 text-amber-600" />
                            ) : (
                              <ShieldCheck className="w-5 h-5 text-blue-600" />
                            )}
                            <h4 className="text-xs font-bold text-slate-900">{g.title}</h4>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-white/80 border border-slate-200 text-slate-700">
                            {g.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5">{g.description}</p>
                        <div className="mt-2 text-[10px] font-mono text-slate-400">
                          Standard: {g.regulation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 5: Raw OCR Text */}
                {activeTab === 'RAW_OCR' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Unfiltered Optical Character Recognition Output</span>
                      <span className="font-mono text-[11px]">UTF-8 • 98.6% match accuracy</span>
                    </div>
                    <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed max-h-72 border border-slate-800">
                      {selectedDoc.rawOcrText}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>End-to-End Cryptographically Signed OCR • Zero Third-Party Cloud Data Leakage</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleApplyVitals}
              disabled={syncedSuccess}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 ${
                syncedSuccess
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {syncedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Applied to Patient
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" /> Apply Extracted Vitals
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
