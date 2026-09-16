import { MOCK_PATIENTS } from '../data/mockPatients';
import { Patient, Vitals } from '../types/hdims';

type BackendVitals = {
  respiration_rate: number;
  spo2: number;
  oxygen_supplement: boolean;
  systolic_bp: number;
  pulse_rate: number;
  consciousness: Vitals['consciousness'];
  temperature: number;
};

type PatientBrief = {
  id: string;
  bed_number: string;
  name: string;
  age: number;
  gender: 'F' | 'M';
  abha_id: string;
  admission_diagnosis: string;
  is_zero_touch: boolean;
  abdm_status: Patient['abdmStatus'];
  current_vitals: BackendVitals | null;
};

type PatientDetail = PatientBrief & {
  emergency_contact: Patient['emergencyContact'];
  vitals: (BackendVitals & { timestamp: string })[];
  prescriptions: {
    drug_name: string;
    dosage: string;
    frequency: string;
    route: string;
    prescribed_by: string;
    prescribed_date: string;
    is_active: boolean;
  }[];
  lab_reports: {
    id: string;
    test_name: string;
    category: Patient['labReports'][number]['category'];
    value: string;
    numeric_value: number;
    unit: string;
    reference_range: string;
    status: Patient['labReports'][number]['status'];
    clinical_interpretation: string;
    collected_at: string;
  }[];
  encounters: {
    id: string;
    date: string;
    facility: string;
    doctor_name: string;
    specialty: string;
    chief_complaint: string;
    clinical_findings: string;
    plan_and_discharge: string;
  }[];
  appointments: {
    id: string;
    date: string;
    time: string;
    department: string;
    doctor_name: string;
    location: string;
    purpose: string;
    status: 'CONFIRMED' | 'SCHEDULED';
  }[];
  referral: {
    hospital_name: string;
    receiving_physician: string;
    distance_km: number;
    transit_time_mins: number;
    icu_capacity: string;
    corridor_status: string;
    status: 'READY' | 'DISPATCHED' | 'STANDBY';
  } | null;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const toVitals = (vitals: BackendVitals | null | undefined): Vitals | null => {
  if (!vitals) return null;
  return {
    respirationRate: vitals.respiration_rate,
    spo2: vitals.spo2,
    oxygenSupplement: vitals.oxygen_supplement,
    systolicBp: vitals.systolic_bp,
    pulseRate: vitals.pulse_rate,
    consciousness: vitals.consciousness,
    temperature: vitals.temperature,
  };
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) throw new Error(`HDIMS API ${response.status}: ${response.statusText}`);
  return response.json() as Promise<T>;
};

const mergePatient = (brief: PatientBrief, detail: PatientDetail | null, fallback: Patient): Patient => {
  const detailVitals = detail?.vitals?.[0] ? toVitals(detail.vitals[0]) : toVitals(brief.current_vitals);
  return {
    ...fallback,
    id: brief.id,
    bedNumber: brief.bed_number,
    name: brief.name,
    age: brief.age,
    gender: brief.gender,
    abhaId: brief.abha_id,
    admissionDiagnosis: brief.admission_diagnosis,
    isZeroTouch: brief.is_zero_touch,
    abdmStatus: brief.abdm_status,
    vitals: detailVitals || fallback.vitals,
    emergencyContact: detail?.emergency_contact || fallback.emergencyContact,
    prescriptions: detail?.prescriptions?.map((item) => ({
      medicineName: item.drug_name,
      dosage: item.dosage,
      frequency: item.frequency,
      route: item.route,
      prescribedBy: item.prescribed_by,
      dateStarted: item.prescribed_date,
      status: item.is_active ? 'ACTIVE' : 'DISCONTINUED',
    })) || fallback.prescriptions,
    labReports: detail?.lab_reports?.map((item) => ({
      id: item.id,
      testName: item.test_name,
      category: item.category,
      value: item.value,
      numericValue: item.numeric_value,
      unit: item.unit,
      referenceRange: item.reference_range,
      status: item.status,
      clinicalInterpretation: item.clinical_interpretation,
      collectedAt: item.collected_at,
    })) || fallback.labReports,
    previousVisits: detail?.encounters?.map((item) => ({
      id: item.id,
      date: item.date,
      encounterDate: item.date,
      facility: item.facility,
      doctorName: item.doctor_name,
      attendingDoctor: item.doctor_name,
      specialty: item.specialty,
      chiefComplaint: item.chief_complaint,
      clinicalFindings: item.clinical_findings,
      planAndDischarge: item.plan_and_discharge,
    })) || fallback.previousVisits,
    upcomingAppointments: detail?.appointments?.map((item) => ({
      id: item.id,
      date: item.date,
      time: item.time,
      specialty: item.department,
      doctorName: item.doctor_name,
      location: item.location,
      purpose: item.purpose,
      bookingStatus: item.status,
    })) || fallback.upcomingAppointments,
    referralHospital: detail?.referral ? {
      name: detail.referral.hospital_name,
      icuCapacity: detail.referral.icu_capacity,
      distanceKm: detail.referral.distance_km,
      transitTimeMins: detail.referral.transit_time_mins,
      status: detail.referral.status,
      receivingPhysician: detail.referral.receiving_physician,
      corridorStatus: detail.referral.corridor_status,
    } : fallback.referralHospital,
  };
};

export const loadBackendPatients = async (): Promise<Patient[]> => {
  const briefs = await request<PatientBrief[]>('/api/patients');
  const patients = await Promise.all(briefs.map(async (brief, index) => {
    const detail = await request<PatientDetail>(`/api/patients/${brief.id}`);
    return mergePatient(brief, detail, MOCK_PATIENTS[index % MOCK_PATIENTS.length]);
  }));
  return patients;
};

export const submitBackendVitals = async (patientId: string, vitals: Vitals) => {
  return request(`/api/patients/${patientId}/vitals`, {
    method: 'POST',
    body: JSON.stringify({
      respiration_rate: vitals.respirationRate,
      spo2: vitals.spo2,
      oxygen_supplement: vitals.oxygenSupplement,
      systolic_bp: vitals.systolicBp,
      pulse_rate: vitals.pulseRate,
      consciousness: vitals.consciousness,
      temperature: vitals.temperature,
    }),
  });
};
