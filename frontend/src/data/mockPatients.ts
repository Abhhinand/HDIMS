import { Patient, AlertItem, AccessEntry, EscalationItem, SecurityGuardrail } from '../types/hdims';

export const MOCK_PATIENTS: Patient[] = [
  // --- PATIENT 1: Jane Doe (As shown in screenshot Screen 1 & Screen 2) ---
  {
    id: 'HD-1024',
    bedNumber: 'Ward 3 - Bed 12',
    name: 'Jane Doe',
    age: 67,
    gender: 'F',
    abhaId: '88-1024-3912-9011',
    admissionDiagnosis: 'Hypertensive Encephalopathy & Mild Cardiac Decompensation',
    isZeroTouch: true,
    abdmStatus: 'SYNCED',
    vitals: {
      respirationRate: 22,
      spo2: 94,
      oxygenSupplement: false,
      systolicBp: 138,
      pulseRate: 102,
      consciousness: 'ALERT',
      temperature: 38.1,
    },
    history: {
      abhaLinkedHospital: 'GMCH Hospital — Internal Medicine & Cardiology',
      lastAdmission: '6 months ago (Hypertensive Crisis)',
      cardiacCathSummary: 'Mild diffuse triple vessel CAD. Preserved ejection fraction LVEF 55%. No acute coronary occlusion.',
      stentDetails: 'None deployed. Medical management with ACE inhibitors and calcium channel blockers.',
      criticalAllergies: [
        'Sulfa drugs (Stevens-Johnson Syndrome history)',
        'Codeine (Severe Nausea & Bronchospasm)'
      ],
      currentMaintenanceMeds: [
        'Amlodipine 5mg OD',
        'Telmisartan 40mg OD',
        'Paracetamol 650mg SOS',
        'Atorvastatin 20mg HS'
      ]
    },
    prescriptions: [
      {
        medicineName: 'Amlodipine Besylate',
        dosage: '5 mg',
        frequency: 'Once Daily in Morning',
        route: 'Oral',
        prescribedBy: 'Dr. Smith, MD (Attending Physician)',
        dateStarted: '10-Aug-2026',
        status: 'ACTIVE'
      },
      {
        medicineName: 'Telmisartan (Micardis)',
        dosage: '40 mg',
        frequency: 'Once Daily at Bedtime',
        route: 'Oral',
        prescribedBy: 'Dr. Smith, MD',
        dateStarted: '10-Aug-2026',
        status: 'ACTIVE'
      },
      {
        medicineName: 'Atorvastatin (Lipitor)',
        dosage: '20 mg',
        frequency: 'Once Daily at Bedtime',
        route: 'Oral',
        prescribedBy: 'Dr. Smith, MD',
        dateStarted: '10-Aug-2026',
        status: 'ACTIVE'
      }
    ],
    upcomingAppointments: [
      {
        id: 'apt-jd-1',
        date: '22-Sep-2026',
        time: '11:00 AM',
        specialty: 'Hypertension Specialty Clinic',
        doctorName: 'Dr. Smith, MD',
        location: 'OPD Block B, Room 204',
        purpose: 'Blood pressure stabilization review & 24h Holter assessment'
      }
    ],
    labReports: [
      {
        id: 'lab-jd-1',
        testName: 'High-Sensitivity Troponin-I',
        category: 'CARDIAC_MARKERS',
        value: '0.038 ng/mL',
        numericValue: 0.038,
        unit: 'ng/mL',
        referenceRange: '< 0.04',
        status: 'NORMAL',
        clinicalInterpretation: 'Baseline cardiac biomarker within normal reference range. No acute myocardial necrosis.',
        collectedAt: 'Today, 08:30'
      },
      {
        id: 'lab-jd-2',
        testName: 'Serum Creatinine',
        category: 'RENAL_ELECTROLYTES',
        value: '1.12 mg/dL',
        numericValue: 1.12,
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3',
        status: 'NORMAL',
        clinicalInterpretation: 'Normal renal excretion. Adequate clearance for antihypertensive titration.',
        collectedAt: 'Today, 08:30'
      },
      {
        id: 'lab-jd-3',
        testName: 'Serum Potassium (K+)',
        category: 'RENAL_ELECTROLYTES',
        value: '4.2 mEq/L',
        numericValue: 4.2,
        unit: 'mEq/L',
        referenceRange: '3.5 - 5.0',
        status: 'NORMAL',
        clinicalInterpretation: 'Optimal serum electrolyte balance. Telmisartan safe to continue.',
        collectedAt: 'Today, 08:30'
      }
    ],
    previousVisits: [
      {
        id: 'vis-jd-1',
        encounterDate: '15-Jun-2026',
        facility: 'GMCH Hospital — OPD Ward 3',
        attendingDoctor: 'Dr. Smith, MD',
        diagnosis: 'Essential Hypertension Stage 2',
        summaryNotes: 'Patient presented with headache and dizziness. BP 155/95 mmHg. Commenced combination therapy.'
      }
    ],
    referralHospital: {
      name: 'City Apex Multi-Specialty Hospital',
      icuCapacity: '4 Cardiac ICU Beds Available',
      distanceKm: 8.2,
      transitTimeMins: 14,
      status: 'READY',
      receivingPhysician: 'Dr. Rajesh, DM (Cardiology)',
      corridorStatus: 'Direct Urban Green Corridor Active'
    },
    emergencyContact: {
      name: 'Robert Doe',
      relationship: 'Husband',
      phone: '+91 98451 22334'
    }
  },

  // --- PATIENT 2: Rahul Menon (Screenshot: High Risk, NEWS2: 8) ---
  {
    id: 'HD-1028',
    bedNumber: 'Ward 2 - Bed 04',
    name: 'Rahul Menon',
    age: 58,
    gender: 'M',
    abhaId: '44-9812-7634-1129',
    admissionDiagnosis: 'Acute Severe Bronchospasm & Respiratory Acidosis',
    isZeroTouch: true,
    abdmStatus: 'SYNCED',
    vitals: {
      respirationRate: 28,
      spo2: 91,
      oxygenSupplement: true,
      systolicBp: 142,
      pulseRate: 115,
      consciousness: 'ALERT',
      temperature: 37.8,
    },
    history: {
      abhaLinkedHospital: 'KMC Hospital — Pulmonology Dept',
      lastAdmission: '3 months ago (Severe Asthma Attack)',
      cardiacCathSummary: 'No coronary catheterization on record.',
      stentDetails: 'None.',
      criticalAllergies: ['Aspirin (AERD Triad)', 'NSAIDs'],
      currentMaintenanceMeds: ['Budesonide/Formoterol Turbuhaler', 'Montelukast 10mg']
    },
    prescriptions: [
      {
        medicineName: 'Nebulized Salbutamol + Ipratropium',
        dosage: '2.5 mg / 500 mcg',
        frequency: 'Every 4 Hours SOS',
        route: 'Inhalation',
        prescribedBy: 'Dr. Smith, MD',
        dateStarted: '14-Sep-2026',
        status: 'ACTIVE'
      },
      {
        medicineName: 'Hydrocortisone IV',
        dosage: '100 mg',
        frequency: 'Every 8 Hours',
        route: 'Intravenous',
        prescribedBy: 'Dr. Smith, MD',
        dateStarted: '14-Sep-2026',
        status: 'ACTIVE'
      }
    ],
    upcomingAppointments: [
      {
        id: 'apt-rm-1',
        date: '24-Sep-2026',
        time: '09:30 AM',
        specialty: 'Pulmonology Outpatient Clinic',
        doctorName: 'Dr. K. Nambiar',
        location: 'Chest OPD, 1st Floor',
        purpose: 'Spirometry & Peak Expiratory Flow Post-Discharge'
      }
    ],
    labReports: [
      {
        id: 'lab-rm-1',
        testName: 'Arterial Blood Gas: pO2',
        category: 'BLOOD_GAS',
        value: '62 mmHg',
        numericValue: 62.0,
        unit: 'mmHg',
        referenceRange: '80 - 100',
        status: 'LOW_ALERT',
        clinicalInterpretation: 'Moderate hypoxemia. Oxygen titration indicated with continuous SpO2 plethysmography.',
        collectedAt: 'Today, 09:15'
      }
    ],
    previousVisits: [
      {
        id: 'vis-rm-1',
        encounterDate: '12-Jul-2026',
        facility: 'District General Hospital',
        attendingDoctor: 'Dr. Jacob Mathew',
        diagnosis: 'Acute Bronchitis',
        summaryNotes: 'Wheezing and purulent sputum. Treated with antibiotics and bronchodilators.'
      }
    ],
    referralHospital: {
      name: 'Metro Apex Chest & Critical Care Center',
      icuCapacity: '3 High-Flow Beds Reserved',
      distanceKm: 12.0,
      transitTimeMins: 18,
      status: 'READY',
      receivingPhysician: 'Dr. Anoop Sen (Critical Pulmonologist)',
      corridorStatus: 'Emergency Rapid Response Green Corridor'
    },
    emergencyContact: {
      name: 'Maya Menon',
      relationship: 'Daughter',
      phone: '+91 97441 55667'
    }
  },

  // --- PATIENT 3: Anita Joseph (Screenshot: Low Risk, NEWS2: 1) ---
  {
    id: 'HD-1025',
    bedNumber: 'Ward 1 - Bed 03',
    name: 'Anita Joseph',
    age: 42,
    gender: 'F',
    abhaId: '55-3312-8874-9023',
    admissionDiagnosis: 'Elective Post-Operative Knee Arthroscopy',
    isZeroTouch: true,
    abdmStatus: 'SYNCED',
    vitals: {
      respirationRate: 16,
      spo2: 99,
      oxygenSupplement: false,
      systolicBp: 120,
      pulseRate: 72,
      consciousness: 'ALERT',
      temperature: 36.8,
    },
    history: {
      abhaLinkedHospital: 'Lourdes Hospital — Orthopedic Care',
      lastAdmission: 'None',
      cardiacCathSummary: 'Pre-operative ECG & Echo normal (EF 62%).',
      stentDetails: 'None.',
      criticalAllergies: [],
      currentMaintenanceMeds: ['Multivitamins OD']
    },
    prescriptions: [
      {
        medicineName: 'Paracetamol',
        dosage: '1000 mg',
        frequency: 'Three Times Daily',
        route: 'Oral',
        prescribedBy: 'Dr. Smith, MD',
        dateStarted: '14-Sep-2026',
        status: 'ACTIVE'
      }
    ],
    upcomingAppointments: [
      {
        id: 'apt-aj-1',
        date: '28-Sep-2026',
        time: '10:00 AM',
        specialty: 'Physical Rehabilitation',
        doctorName: 'Dr. George',
        location: 'Rehab Gym, Ground Floor',
        purpose: 'Quadriceps strength training'
      }
    ],
    labReports: [
      {
        id: 'lab-aj-1',
        testName: 'Complete Blood Count: Hemoglobin',
        category: 'HEMATOLOGY',
        value: '13.4 g/dL',
        numericValue: 13.4,
        unit: 'g/dL',
        referenceRange: '12.0 - 15.5',
        status: 'NORMAL',
        clinicalInterpretation: 'Adequate blood count. Minimal surgical blood loss.',
        collectedAt: 'Yesterday, 16:00'
      }
    ],
    previousVisits: [],
    referralHospital: {
      name: 'GMCH Main Center',
      icuCapacity: 'Standard Inpatient Ward',
      distanceKm: 0,
      transitTimeMins: 0,
      status: 'READY',
      receivingPhysician: 'Dr. Smith',
      corridorStatus: 'On-site Ward Transfer'
    },
    emergencyContact: {
      name: 'Philip Joseph',
      relationship: 'Spouse',
      phone: '+91 94471 88990'
    }
  },

  // --- PATIENT 4: Suresh Kumar (Screenshot: Low Risk, NEWS2: 2) ---
  {
    id: 'HD-1027',
    bedNumber: 'Ward 1 - Bed 07',
    name: 'Suresh Kumar',
    age: 61,
    gender: 'M',
    abhaId: '77-1129-4458-3310',
    admissionDiagnosis: 'Observation Post-Transient Ischemic Attack (Resolved)',
    isZeroTouch: true,
    abdmStatus: 'SYNCED',
    vitals: {
      respirationRate: 17,
      spo2: 97,
      oxygenSupplement: false,
      systolicBp: 126,
      pulseRate: 78,
      consciousness: 'ALERT',
      temperature: 36.9,
    },
    history: {
      abhaLinkedHospital: 'Govt Medical College — Neurology',
      lastAdmission: '1 year ago (Mild Concussion)',
      cardiacCathSummary: 'Carotid Doppler: Mild bilateral intimal thickening without hemodynamically significant stenosis.',
      stentDetails: 'None.',
      criticalAllergies: [],
      currentMaintenanceMeds: ['Clopidogrel 75mg OD', 'Rosuvastatin 10mg OD']
    },
    prescriptions: [
      {
        medicineName: 'Clopidogrel (Plavix)',
        dosage: '75 mg',
        frequency: 'Once Daily',
        route: 'Oral',
        prescribedBy: 'Dr. Smith, MD',
        dateStarted: '12-Sep-2026',
        status: 'ACTIVE'
      }
    ],
    upcomingAppointments: [],
    labReports: [],
    previousVisits: [],
    referralHospital: {
      name: 'Stroke Comprehensive Care Unit',
      icuCapacity: '2 Neuro Beds Ready',
      distanceKm: 6.4,
      transitTimeMins: 11,
      status: 'READY',
      receivingPhysician: 'Dr. N. Chandran (Neurologist)',
      corridorStatus: 'Ready on Standby'
    },
    emergencyContact: {
      name: 'Anita Kumar',
      relationship: 'Wife',
      phone: '+91 98950 11223'
    }
  },

  // --- PATIENT 5: Meera Nair (Screenshot: Elevated Risk, NEWS2: 5) ---
  {
    id: 'HD-1026',
    bedNumber: 'Ward 4 - Bed 01',
    name: 'Meera Nair',
    age: 74,
    gender: 'F',
    abhaId: '63-9901-2245-8812',
    admissionDiagnosis: 'Decompensated Heart Failure & Bilateral Pedal Edema',
    isZeroTouch: true,
    abdmStatus: 'SYNCED',
    vitals: {
      respirationRate: 24,
      spo2: 93,
      oxygenSupplement: false,
      systolicBp: 132,
      pulseRate: 96,
      consciousness: 'ALERT',
      temperature: 37.4,
    },
    history: {
      abhaLinkedHospital: 'Apex Heart Foundation — Dept of Cardiology',
      lastAdmission: '8 months ago (Congestive Cardiac Failure)',
      cardiacCathSummary: 'Echo: Dilated cardiomyopathy, moderate mitral regurgitation, LVEF 38%.',
      stentDetails: 'None.',
      criticalAllergies: ['Penicillin'],
      currentMaintenanceMeds: ['Torsemide 20mg OD', 'Spironolactone 25mg OD', 'Sacubitril/Valsartan 50mg BD']
    },
    prescriptions: [
      {
        medicineName: 'Furosemide IV (Lasix)',
        dosage: '40 mg',
        frequency: 'Twice Daily STAT',
        route: 'Intravenous',
        prescribedBy: 'Dr. Smith, MD',
        dateStarted: '14-Sep-2026',
        status: 'ACTIVE'
      }
    ],
    upcomingAppointments: [],
    labReports: [
      {
        id: 'lab-mn-1',
        testName: 'NT-proBNP Cardiac Strain',
        category: 'CARDIAC_MARKERS',
        value: '1,890 pg/mL',
        numericValue: 1890.0,
        unit: 'pg/mL',
        referenceRange: '< 300',
        status: 'ELEVATED_CRITICAL',
        clinicalInterpretation: 'Significant ventricular stretch and volume overload.',
        collectedAt: 'Today, 07:45'
      }
    ],
    previousVisits: [],
    referralHospital: {
      name: 'Tertiary Heart Institute',
      icuCapacity: '2 Cardiac Resuscitation Beds Locked',
      distanceKm: 14.5,
      transitTimeMins: 20,
      status: 'READY',
      receivingPhysician: 'Dr. S. Nair',
      corridorStatus: 'Green Corridor Traffic Cleared'
    },
    emergencyContact: {
      name: 'Gopinath Nair',
      relationship: 'Son',
      phone: '+91 94951 33445'
    }
  },

  // --- PATIENT 6: Ramesh Kumar (High-Dependency Cardiac Desaturation) ---
  {
    id: 'HD-1007',
    bedNumber: 'Ward 4B - Bed 04',
    name: 'Ramesh Kumar',
    age: 71,
    gender: 'M',
    abhaId: '91-8472-9102-1142',
    admissionDiagnosis: 'Acute Myocardial Desaturation & In-Stent Thrombosis Risk',
    isZeroTouch: true,
    abdmStatus: 'SYNCED',
    vitals: {
      respirationRate: 26,
      spo2: 83,
      oxygenSupplement: true,
      systolicBp: 92,
      pulseRate: 132,
      consciousness: 'ALERT',
      temperature: 37.4,
    },
    history: {
      abhaLinkedHospital: 'AIIMS New Delhi — Dept of Cardiology (Linked via ABDM)',
      lastAdmission: '18 months ago (Acute Coronary Syndrome)',
      cardiacCathSummary: 'Coronary Angiography: 85% proximal LAD lesion treated with Everolimus DES. High thrombotic risk.',
      stentDetails: 'Xience Sierra Drug-Eluting Stent (3.0 x 28mm) deployed in Mid-LAD.',
      criticalAllergies: [
        'Penicillin (Anaphylactic Shock - Grade IV)',
        'Aspirin-induced respiratory bronchospasm (AERD)'
      ],
      currentMaintenanceMeds: [
        'Ticagrelor 90mg BD',
        'Atorvastatin 40mg OD',
        'Ramipril 2.5mg OD'
      ]
    },
    prescriptions: [
      {
        medicineName: 'Ticagrelor (Brilinta)',
        dosage: '90 mg',
        frequency: 'Twice Daily (BD)',
        route: 'Oral',
        prescribedBy: 'Dr. Alok Verma, DM',
        dateStarted: '14-Mar-2025',
        status: 'ACTIVE'
      }
    ],
    upcomingAppointments: [],
    labReports: [
      {
        id: 'lab-rk-1',
        testName: 'High-Sensitivity Troponin-I',
        category: 'CARDIAC_MARKERS',
        value: '1.84 ng/mL',
        numericValue: 1.84,
        unit: 'ng/mL',
        referenceRange: '< 0.04',
        status: 'ELEVATED_CRITICAL',
        clinicalInterpretation: 'Acute plaque rupture and myocardial necrosis.',
        collectedAt: 'Today, 14:15'
      }
    ],
    previousVisits: [],
    referralHospital: {
      name: 'AIIMS New Delhi — Apex Tertiary Cardiology',
      icuCapacity: '2 Cardiac Resuscitation Beds Locked',
      distanceKm: 18.4,
      transitTimeMins: 24,
      status: 'READY',
      receivingPhysician: 'Dr. Meenakshi Sunderam',
      corridorStatus: 'Delhi Traffic Police Automated Green Corridor Cleared'
    },
    emergencyContact: {
      name: 'Sunil Kumar',
      relationship: 'Son (Primary Family Contact)',
      phone: '+91 98765 43210'
    }
  }
];

// --- MOCK RECENT ALERTS (Matching Screen 1 Bottom Right) ---
export const MOCK_RECENT_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'Rahul Menon - HR 115, SpO2 91%',
    subtitle: 'Ward 2 - Bed 04 • Example escalation alert',
    severity: 'RED',
    timeAgo: '2m ago'
  },
  {
    id: 'alt-02',
    title: 'Jane Doe - Temperature 38.1 °C',
    subtitle: 'Ward 3 - Bed 12 • Example observation alert',
    severity: 'AMBER',
    timeAgo: '12m ago'
  },
  {
    id: 'alt-03',
    title: 'System - Specialist access granted',
    subtitle: 'Dr. Rajesh granted JIT access for Jane Doe (45m)',
    severity: 'BLUE',
    timeAgo: '25m ago'
  },
  {
    id: 'alt-04',
    title: 'Meera Nair - SpO2 93% on Room Air',
    subtitle: 'Ward 4 - Bed 01 • Example observation alert',
    severity: 'AMBER',
    timeAgo: '42m ago'
  }
];

// --- MOCK ACCESS CONTROL ENTRIES (Matching Screen 3) ---
export const MOCK_ACCESS_ENTRIES: AccessEntry[] = [
  {
    id: 'acc-01',
    practitionerName: 'Dr. Smith',
    role: 'Attending Physician',
    patientName: 'Jane Doe',
    patientId: 'HD-1024',
    scope: 'Scope: Full clinical data',
    status: 'ACTIVE',
    grantedAt: 'Permanent'
  },
  {
    id: 'acc-02',
    practitionerName: 'Nurse Priya',
    role: 'Assigned Nurse',
    patientName: 'Jane Doe',
    patientId: 'HD-1024',
    scope: 'Scope: Vitals & administration',
    status: 'ACTIVE',
    grantedAt: 'Permanent'
  },
  {
    id: 'acc-03',
    practitionerName: 'Dr. Rajesh',
    role: 'On-call Specialist',
    patientName: 'Jane Doe',
    patientId: 'HD-1024',
    scope: 'Scope: Clinical telemetry',
    status: 'TEMPORARY',
    expiresText: 'Expires in 45 min',
    grantedAt: '13:45'
  },
  {
    id: 'acc-04',
    practitionerName: 'City Hospital',
    role: 'Referral Hospital',
    patientName: 'Jane Doe',
    patientId: 'HD-1024',
    scope: 'Scope: Limited (Discharge summary)',
    status: 'RESTRICTED',
    grantedAt: 'Standing'
  }
];

// --- MOCK ESCALATION ITEMS (Matching Screen 5) ---
export const MOCK_ESCALATION_ITEMS: EscalationItem[] = [
  {
    id: 'esc-01',
    patientName: 'Rahul Menon',
    patientId: 'HD-1028',
    wardBed: 'Ward 2 - Bed 04',
    riskTier: 'HIGH',
    news2Score: 8,
    suggestedTeam: ['1. On-call Specialist', '2. Rapid Response Team'],
    actionLabel: 'Notify Team',
    actionType: 'NOTIFY'
  },
  {
    id: 'esc-02',
    patientName: 'Jane Doe',
    patientId: 'HD-1024',
    wardBed: 'Ward 3 - Bed 12',
    riskTier: 'MEDIUM',
    news2Score: 6,
    suggestedTeam: ['1. Attending Physician', '2. Additional Monitoring'],
    actionLabel: 'Escalate Access',
    actionType: 'ESCALATE'
  },
  {
    id: 'esc-03',
    patientName: 'Suresh Kumar',
    patientId: 'HD-1027',
    wardBed: 'Ward 1 - Bed 07',
    riskTier: 'LOW',
    news2Score: 2,
    suggestedTeam: ['1. Attending Physician (De-escalate to routine monitoring)'],
    actionLabel: 'Update Status',
    actionType: 'UPDATE'
  }
];

// --- MOCK SECURITY GUARDRAILS (Confidentiality & Compliance) ---
export const MOCK_SECURITY_GUARDRAILS: SecurityGuardrail[] = [
  {
    id: 'gr-01',
    title: 'Zero-Standing Privilege (ABAC Lattice)',
    category: 'Access Control',
    description: 'Specialists cannot view patient EHR until physiological NEWS2 threshold elevates to Tier 3 Critical.',
    status: 'ENFORCED',
    statutoryBasis: 'DISHA Section 4 & ISO 27799 Healthcare Confidentiality'
  },
  {
    id: 'gr-02',
    title: '45-Minute Ephemeral Hard Timeout',
    category: 'Session Security',
    description: 'All emergency Just-In-Time cryptographic tokens automatically self-destruct with zero residual access after 45 minutes.',
    status: 'ENFORCED',
    statutoryBasis: 'RFC 7519 JWT Specification & ABDM Policy 9.2(c)'
  },
  {
    id: 'gr-03',
    title: 'Zero-Touch Patient Burden Protection',
    category: 'Patient Inclusivity',
    description: 'Elderly or unconscious patients are protected from mandatory smartphone OTP prompts during acute resuscitation.',
    status: 'ACTIVE',
    statutoryBasis: 'DPDP Act 2023 Section 7(a) Medical Emergency Exception'
  },
  {
    id: 'gr-04',
    title: 'Cryptographic PII Redaction & Aadhaar Vault',
    category: 'Data Privacy',
    description: 'Aadhaar and personal contact identifiers are masked at rest using AES-256 and only decrypted on authorized JIT presentation.',
    status: 'ENFORCED',
    statutoryBasis: 'Unique Identification Authority of India (UIDAI) Compliance'
  },
  {
    id: 'gr-05',
    title: 'Immutable Chronological Audit Ledger',
    category: 'Audit & Accountability',
    description: 'Every record read, write, token mint, and referral handshake is permanently signed into an explainable DISHA audit trail.',
    status: 'ENFORCED',
    statutoryBasis: 'National Digital Health Mission (NDHM) Governance Rules'
  }
];
