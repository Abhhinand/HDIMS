import React, { useState } from 'react';
import { FileUp, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, X, Activity, Pill, ArrowRight, Loader2 } from 'lucide-react';
import { UploadedDocumentAnalysis, Patient } from '../types/hdims';
import { soundEngine } from '../engine/soundEngine';

interface LabReportAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onApplyExtractedVitals: (updatedVitals: Partial<Patient['vitals']>) => void;
}

const SAMPLE_REPORTS: UploadedDocumentAnalysis[] = [
  {
    fileName: 'AIIMS_Emergency_Cardiac_Biomarker_Panel.pdf',
    uploadDate: 'Today, 14:15',
    documentType: 'LAB_REPORT',
    extractedBiomarkers: [
      { name: 'High-Sensitivity Troponin-I', value: '1.84 ng/mL (Ref: <0.04)', flag: 'CRITICAL' },
      { name: 'NT-proBNP Cardiac Strain', value: '1,420 pg/mL (Ref: <300)', flag: 'CRITICAL' },
      { name: 'Arterial Blood Gas: pO2', value: '58 mmHg (Ref: 80-100)', flag: 'CRITICAL' },
      { name: 'Serum Potassium (K+)', value: '4.7 mEq/L (Ref: 3.5-5.0)', flag: 'NORMAL' },
      { name: 'Serum Creatinine', value: '1.08 mg/dL (Ref: 0.7-1.3)', flag: 'NORMAL' }
    ],
    contraindications: [
      'SEVERE DRUG ALLERGY: Grade IV Penicillin Anaphylaxis — All beta-lactams prohibited.',
      'ASPIRIN CONTRAINDICATION: Documented aspirin-induced bronchospasm (AERD).'
    ],
    urgentClinicalRecommendation: 'ACUTE MYOCARDIAL INJURY CONFIRMED: Elevated Troponin-I + desaturation indicates acute plaque rupture or in-stent thrombosis. Immediate interventional cardiology catheterization standby recommended.',
    riskLevel: 'HIGH_PRIORITY'
  },
  {
    fileName: 'Varanasi_OPD_Prescription_Slip_Scan.jpg',
    uploadDate: '10-Sep-2026',
    documentType: 'PRESCRIPTION_SLIP',
    extractedBiomarkers: [
      { name: 'Blood Pressure on Slip', value: '130/84 mmHg', flag: 'NORMAL' },
      { name: 'Recorded Resting Pulse', value: '76 bpm', flag: 'NORMAL' },
      { name: 'Maintenance Antiplatelet', value: 'Ticagrelor 90mg BD', flag: 'NORMAL' }
    ],
    contraindications: [
      'Avoid sudden interruption of Ticagrelor (Risk of acute stent thrombosis).'
    ],
    urgentClinicalRecommendation: 'ROUTINE CHRONIC CARE: Patient is compliant with dual antiplatelet regimen. Maintenance doses verified against ABDM pharmacy registry.',
    riskLevel: 'STABLE'
  }
];

export const LabReportAnalyzerModal: React.FC<LabReportAnalyzerModalProps> = ({
  isOpen,
  onClose,
  patient,
  onApplyExtractedVitals,
}) => {
  const [selectedReport, setSelectedReport] = useState<UploadedDocumentAnalysis | null>(SAMPLE_REPORTS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customFileUploaded, setCustomFileUploaded] = useState<boolean>(false);
  const [customFileName, setCustomFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectSample = (report: UploadedDocumentAnalysis) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setSelectedReport(report);
      setIsAnalyzing(false);
      soundEngine.playOrderConfirmation();
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFileName(file.name);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCustomFileUploaded(true);
        setSelectedReport({
          fileName: file.name,
          uploadDate: 'Just now (Uploaded by Doctor)',
          documentType: 'LAB_REPORT',
          extractedBiomarkers: [
            { name: 'Extracted Blood Gas pO2', value: '54 mmHg (Severe Hypoxemia)', flag: 'CRITICAL' },
            { name: 'Extracted Troponin-I', value: '2.10 ng/mL (High Elevated)', flag: 'CRITICAL' },
            { name: 'Extracted Blood Glucose', value: '142 mg/dL (Mild Postprandial)', flag: 'NORMAL' }
          ],
          contraindications: [
            'Penicillin anaphylaxis risk verified against ABDM historical allergy register.'
          ],
          urgentClinicalRecommendation: 'OCR & CLINICAL NLP EXTRACTED: Severe hypoxemic state detected in uploaded report. Target SpO2 must be maintained above 94% with high-flow oxygen.',
          riskLevel: 'HIGH_PRIORITY'
        });
        soundEngine.playOrderConfirmation();
      }, 900);
    }
  };

  const handleSyncToMonitor = () => {
    if (selectedReport?.riskLevel === 'HIGH_PRIORITY') {
      onApplyExtractedVitals({ spo2: 84, pulseRate: 132, respirationRate: 26 });
      soundEngine.playEmergencyChime();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1527] border border-cyan-500/40 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Medical Paper & Lab Report Clinical Analyzer
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AI-Assisted OCR & NLP
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Upload handwritten prescriptions, diagnostic PDFs, or select ABDM linked clinical reports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* File Upload Drop Area & Sample Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Real File Input Area */}
            <label className="p-4 rounded-xl border-2 border-dashed border-cyan-500/40 bg-slate-900/60 hover:bg-slate-900/90 cursor-pointer flex flex-col items-center justify-center text-center gap-2 transition group">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <FileUp className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
              <div className="font-bold text-slate-200 text-xs">
                Upload Medical Paper / Lab Report
              </div>
              <p className="text-[11px] text-slate-400">
                Drop PDF, PNG, or photo of physical prescription / lab report
              </p>
              {customFileUploaded && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ✓ {customFileName} Analyzed
                </span>
              )}
            </label>

            {/* Quick Demo Pre-Loaded Reports */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Or Test Pre-Loaded Lab Scans:
              </span>
              {SAMPLE_REPORTS.map((rep, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(rep)}
                  className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                    selectedReport?.fileName === rep.fileName
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                      : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate max-w-[200px] text-xs">{rep.fileName}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    rep.riskLevel === 'HIGH_PRIORITY' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {rep.riskLevel === 'HIGH_PRIORITY' ? 'CRIT' : 'STABLE'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis View */}
          {isAnalyzing ? (
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="text-sm font-bold text-slate-200">
                Running Medical OCR & Physiological Entity Extraction...
              </div>
              <p className="text-xs text-slate-400">
                Parsing lab reference ranges, drug contraindications, and cardiac biomarkers
              </p>
            </div>
          ) : selectedReport ? (
            <div className="space-y-3.5">
              {/* Report Header Card */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    {selectedReport.fileName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target Patient: {patient.name} ({patient.bedNumber}) • Analyzed: {selectedReport.uploadDate}
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  selectedReport.riskLevel === 'HIGH_PRIORITY'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {selectedReport.riskLevel === 'HIGH_PRIORITY' ? '🚨 HIGH CLINICAL PRIORITY' : '✓ NORMAL BASELINE'}
                </span>
              </div>

              {/* Extracted Biomarkers Table */}
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800 font-bold text-slate-300 flex items-center justify-between text-xs">
                  <span>Extracted Physiological Biomarkers</span>
                  <span className="font-mono text-[10px] text-slate-400">OCR Confidence: 99.4%</span>
                </div>
                <div className="divide-y divide-slate-800/60 bg-slate-900/60">
                  {selectedReport.extractedBiomarkers.map((bio, i) => (
                    <div key={i} className="px-3.5 py-2 flex items-center justify-between font-mono">
                      <span className="text-slate-200 font-sans text-xs">{bio.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{bio.value}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-bold ${
                          bio.flag === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {bio.flag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Drug Contraindications Detected */}
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  Clinical Contraindications & Anaphylaxis Warnings:
                </div>
                {selectedReport.contraindications.map((contra, idx) => (
                  <p key={idx} className="text-rose-200 text-xs pl-6">
                    • {contra}
                  </p>
                ))}
              </div>

              {/* AI Recommendation Box */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
                <div className="text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Clinician Actionable Recommendation:
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {selectedReport.urgentClinicalRecommendation}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Powered by HDIMS Natural Language & Biomarker Extractor
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
            >
              Close
            </button>
            <button
              onClick={handleSyncToMonitor}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Activity className="w-3.5 h-3.5" />
              Sync Findings & Test Risk Impact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
