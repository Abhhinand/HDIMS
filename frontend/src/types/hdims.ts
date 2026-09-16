export type ConsciousnessLevel = 'ALERT' | 'VOICE' | 'PAIN' | 'UNRESPONSIVE';

export interface Vitals {
  respirationRate: number;     // Breaths per min (normal: 12-20)
  spo2: number;                // Oxygen Saturation % (normal: 96-100)
  oxygenSupplement: boolean;   // On ambient air or supplemental O2
  systolicBp: number;          // Systolic Blood Pressure mmHg (normal: 111-219)
  pulseRate: number;           // Heart beats per min (normal: 51-90)
  consciousness: ConsciousnessLevel; // ACVPU Scale
  temperature: number;         // Body Temperature °C (normal: 36.1-38.0)
}

export type RiskTier = 'LOW' | 'MEDIUM' | 'CRITICAL';

export interface NEWS2Score {
  total: number;
  tier: RiskTier;
  tierLabel: string;
  subscores: {
    respirationRate: number;
    spo2: number;
    oxygenSupplement: number;
    systolicBp: number;
    pulseRate: number;
    consciousness: number;
    temperature: number;
  };
  triggersEscalation: boolean;
  clinicalAction: string;
}

export type CaregiverRole = 
  | 'STAFF_NURSE' 
  | 'ATTENDING_PHYSICIAN' 
  | 'ON_CALL_CARDIOLOGIST' 
  | 'RAPID_RESPONSE_LEAD'
  | 'HOSPITAL_AUDITOR';

export interface RoleDefinition {
  id: CaregiverRole;
  title: string;
  name: string;
  department: string;
  badgeColor: string;
}

export interface AccessScope {
  liveVitals: boolean;
  routineMeds: boolean;
  historicalEHR: boolean;
  cardiacCatheterization: boolean;
  stentProcedure: boolean;
  allergyAdverseReactions: boolean;
  interventionOverride: boolean;
}

export interface JITToken {
  id: string;
  patientId: string;
  recipientRole: CaregiverRole;
  recipientName: string;
  reason: string;
  grantedAt: string;
  durationSeconds: number;
  expiresAt: number; // unix timestamp in ms
  isActive: boolean;
  plainLanguageGrant: string;
}

export type AuditEventType = 
  | 'RISK_ELEVATION' 
  | 'JIT_GRANT' 
  | 'AUTO_REVOCATION' 
  | 'DATA_ACCESS' 
  | 'FAMILY_SMS' 
  | 'CONSENT_GRANTED' 
  | 'SECURITY_EVALUATION' 
  | 'DYNAMIC_ESCALATION' 
  | 'OCR_VITALS_SYNC'
  | string;

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: CaregiverRole;
  patientBed: string;
  eventType: AuditEventType;
  riskScore: number;
  riskTier: RiskTier;
  plainLanguage: string;
}

export interface ConfidentialHistory {
  abhaLinkedHospital: string;
  lastAdmission: string;
  cardiacCathSummary: string;
  stentDetails: string;
  criticalAllergies: string[];
  currentMaintenanceMeds: string[];
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedBy: string;
  dateStarted: string;
  status: 'ACTIVE' | 'DISCONTINUED';
}

export interface UpcomingAppointment {
  id?: string;
  date: string;
  time: string;
  department?: string;
  specialty?: string;
  hospital?: string;
  location?: string;
  doctorName: string;
  purpose: string;
  bookingStatus?: 'CONFIRMED' | 'SCHEDULED';
}

export interface DoctorThresholds {
  lowSpo2: number;        // Alert threshold for low SpO2 (e.g. 92%)
  highPulse: number;      // Alert threshold for tachycardia (e.g. 120 bpm)
  lowSystolicBp: number;  // Alert threshold for hypotension (e.g. 90 mmHg)
}

export interface LabReportItem {
  id: string;
  testName: string;
  category: 'CARDIAC_MARKERS' | 'BLOOD_GAS' | 'HEMATOLOGY' | 'RENAL_ELECTROLYTES';
  value: string;
  numericValue: number;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'ELEVATED_CRITICAL' | 'LOW_ALERT';
  clinicalInterpretation: string;
  collectedAt: string;
}

export interface DoctorVisitEncounter {
  id: string;
  date?: string;
  encounterDate?: string;
  facility: string;
  doctorName?: string;
  attendingDoctor?: string;
  specialty?: string;
  diagnosis?: string;
  chiefComplaint?: string;
  clinicalFindings?: string;
  summaryNotes?: string;
  planAndDischarge?: string;
}

export interface ReferralHospital {
  name: string;
  icuCapacity: string;
  distanceKm: number;
  transitTimeMins: number;
  status: 'READY' | 'DISPATCHED' | 'STANDBY';
  receivingPhysician: string;
  corridorStatus: string;
}

export interface UploadedDocumentAnalysis {
  fileName: string;
  uploadDate: string;
  documentType: 'LAB_REPORT' | 'PRESCRIPTION_SLIP' | 'DISCHARGE_SUMMARY';
  extractedBiomarkers: { name: string; value: string; flag: 'CRITICAL' | 'NORMAL' | 'WARNING' }[];
  contraindications: string[];
  urgentClinicalRecommendation: string;
  riskLevel: 'HIGH_PRIORITY' | 'MODERATE' | 'STABLE';
}

export interface Patient {
  id: string;
  bedNumber: string;
  name: string;
  age: number;
  gender: 'F' | 'M';
  abhaId: string;
  nationalHealthId?: string;
  admissionDiagnosis: string;
  diagnosis?: string;
  isZeroTouch: boolean;
  abdmStatus: 'SYNCED' | 'PARTIAL_CACHE' | 'OFFLINE';
  vitals: Vitals;
  history: ConfidentialHistory;
  prescriptions: PrescriptionItem[];
  upcomingAppointments: UpcomingAppointment[];
  labReports: LabReportItem[];
  previousVisits: DoctorVisitEncounter[];
  referralHospital: ReferralHospital;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export type NavPage = 
  | 'CLINIC_VISIT'
  | 'DASHBOARD' 
  | 'PATIENTS' 
  | 'CARE_TIMELINE'
  | 'ACCESS_CONTROL' 
  | 'AUDIT_TRAIL' 
  | 'CONSENT' 
  | 'ESCALATION'
  | 'SETTINGS';

export type DashboardView = 
  | 'TELEMETRY' 
  | 'HISTORY' 
  | 'REFERRAL' 
  | 'FAMILY_PORTAL'
  | 'SECURITY'
  | 'FAMILY_AUDIT'
  | 'UNIFIED';

export interface AlertItem {
  id: string;
  title: string;
  subtitle: string;
  severity: 'RED' | 'AMBER' | 'BLUE';
  timeAgo: string;
}

export interface AccessEntry {
  id: string;
  practitionerName: string;
  role: string;
  patientName: string;
  patientId: string;
  scope: string;
  status: 'ACTIVE' | 'TEMPORARY' | 'RESTRICTED';
  expiresText?: string;
  grantedAt?: string;
}

export interface EscalationItem {
  id: string;
  patientName: string;
  patientId: string;
  wardBed: string;
  riskTier: 'HIGH' | 'MEDIUM' | 'LOW';
  riskLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  news2Score: number;
  suggestedTeam: string[];
  actionLabel: string;
  actionType: 'NOTIFY' | 'ESCALATE' | 'UPDATE';
}

export interface SecurityGuardrail {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'ENFORCED' | 'ACTIVE';
  statutoryBasis: string;
}
