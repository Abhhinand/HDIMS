import os
from datetime import datetime
from .database import engine, SessionLocal, Base
from .models import (
    PatientModel, VitalsModel, PrescriptionModel, LabReportModel,
    DoctorEncounterModel, AppointmentModel, ReferralModel, AuditLogModel
)
from .news2_engine import calculate_news2

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(PatientModel).count() > 0:
        print("[HDIMS Database] Already populated with clinical records.")
        db.close()
        return

    print("[HDIMS Database] Seeding initial Ward 4B inpatients, vitals & EHR records...")

    # --- Patient 1: Ramesh Kumar (High Risk / ACS) ---
    p1 = PatientModel(
        id="pat-007",
        bed_number="Bed 4B-04",
        name="Ramesh Kumar",
        age=71,
        gender="M",
        abha_id="91-4829-1049-2810",
        admission_diagnosis="Acute Coronary Syndrome, Post-PCI Unstable Angina",
        is_zero_touch=True,
        abdm_status="SYNCED",
        contact_name="Sunil Kumar",
        contact_relationship="Son (Primary Advocate)",
        contact_phone="+91 98765 43210"
    )
    db.add(p1)

    # Vitals for Patient 1 (Critical desaturation)
    v1_score, v1_tier, _, _ = calculate_news2(26, 83, True, 92, 132, "ALERT", 37.4)
    v1 = VitalsModel(
        patient_id="pat-007",
        respiration_rate=26,
        spo2=83,
        oxygen_supplement=True,
        systolic_bp=92,
        pulse_rate=132,
        consciousness="ALERT",
        temperature=37.4,
        news2_total=v1_score,
        risk_tier=v1_tier
    )
    db.add(v1)

    # Prescriptions for Patient 1
    prescriptions_p1 = [
        PrescriptionModel(
            id="rx-101", patient_id="pat-007", drug_name="Ticagrelor",
            dosage="90 mg", frequency="Twice daily (BD)", route="Oral",
            prescribed_date="12-Sep-2026", prescribed_by="Dr. S. Nair (Cardiology)",
            indication="Dual Antiplatelet Therapy (DAPT) Post-DES Stent", abdm_verified=True, is_active=True
        ),
        PrescriptionModel(
            id="rx-102", patient_id="pat-007", drug_name="Atorvastatin",
            dosage="80 mg", frequency="Once daily at bedtime (HS)", route="Oral",
            prescribed_date="12-Sep-2026", prescribed_by="Dr. S. Nair (Cardiology)",
            indication="Secondary Prevention / Plaque Stabilization", abdm_verified=True, is_active=True
        ),
        PrescriptionModel(
            id="rx-103", patient_id="pat-007", drug_name="Metoprolol Succinate XL",
            dosage="25 mg", frequency="Once daily (OD)", route="Oral",
            prescribed_date="13-Sep-2026", prescribed_by="Dr. Alok Verma",
            indication="Myocardial Rate & Oxygen Demand Reduction", abdm_verified=True, is_active=True
        ),
        PrescriptionModel(
            id="rx-104", patient_id="pat-007", drug_name="Pantoprazole",
            dosage="40 mg", frequency="Once daily before breakfast", route="Oral",
            prescribed_date="12-Sep-2026", prescribed_by="Dr. S. Nair",
            indication="Gastric Ulcer Prophylaxis during DAPT", abdm_verified=True, is_active=True
        )
    ]
    db.add_all(prescriptions_p1)

    # Lab Reports for Patient 1
    labs_p1 = [
        LabReportModel(
            id="lab-001", patient_id="pat-007", test_name="High-Sensitivity Troponin-I",
            category="CARDIAC_MARKERS", value="1.84 ng/mL", numeric_value=1.84, unit="ng/mL",
            reference_range="< 0.04", status="ELEVATED_CRITICAL",
            clinical_interpretation="Acute myocardial injury confirmed. Suggestive of plaque rupture or in-stent thrombosis.",
            collected_at="Today, 14:15"
        ),
        LabReportModel(
            id="lab-002", patient_id="pat-007", test_name="NT-proBNP (B-Type Natriuretic)",
            category="CARDIAC_MARKERS", value="1,420 pg/mL", numeric_value=1420.0, unit="pg/mL",
            reference_range="< 300", status="ELEVATED_CRITICAL",
            clinical_interpretation="Marked hemodynamic cardiac wall tension and impending left ventricular failure.",
            collected_at="Today, 14:15"
        ),
        LabReportModel(
            id="lab-003", patient_id="pat-007", test_name="Arterial Blood Gas: pO2",
            category="BLOOD_GAS", value="58 mmHg", numeric_value=58.0, unit="mmHg",
            reference_range="80 - 100", status="LOW_ALERT",
            clinical_interpretation="Hypoxemic respiratory failure. Titration of FiO2 indicated immediately.",
            collected_at="Today, 14:20"
        ),
        LabReportModel(
            id="lab-004", patient_id="pat-007", test_name="Serum Potassium (K+)",
            category="RENAL_ELECTROLYTES", value="4.7 mEq/L", numeric_value=4.7, unit="mEq/L",
            reference_range="3.5 - 5.0", status="NORMAL",
            clinical_interpretation="Normokalemic baseline. Low acute ventricular arrhythmogenic risk.",
            collected_at="Today, 13:45"
        ),
        LabReportModel(
            id="lab-005", patient_id="pat-007", test_name="Serum Creatinine",
            category="RENAL_ELECTROLYTES", value="1.08 mg/dL", numeric_value=1.08, unit="mg/dL",
            reference_range="0.7 - 1.3", status="NORMAL",
            clinical_interpretation="Preserved GFR (>60 mL/min). Safe for emergency contrast catheterization.",
            collected_at="Today, 13:45"
        )
    ]
    db.add_all(labs_p1)

    # Previous Encounters for Patient 1
    encounters_p1 = [
        DoctorEncounterModel(
            id="enc-01", patient_id="pat-007", date="18-Aug-2026",
            facility="AIIMS New Delhi — Department of Cardiology",
            doctor_name="Prof. Dr. Meenakshi Sunderam", specialty="Interventional Cardiology",
            chief_complaint="Exertional retrosternal angina (CCS Class III)",
            clinical_findings="Coronary angiography revealed 90% stenosis in Mid-LAD. Drug-Eluting Stent (Xience 3.0x18mm) deployed successfully.",
            plan_and_discharge="Dual antiplatelets (Ticagrelor + Aspirin) for 12 months. Strict follow-up in 4 weeks."
        ),
        DoctorEncounterModel(
            id="enc-02", patient_id="pat-007", date="10-Sep-2026",
            facility="Varanasi District Hospital — Emergency OPD",
            doctor_name="Dr. Alok Verma", specialty="Internal Medicine",
            chief_complaint="Episodic mild dyspnea on lying flat (Orthopnea)",
            clinical_findings="BP 138/86 mmHg, Chest clear bilaterally, ECG showed sinus tachycardia without fresh ST elevations.",
            plan_and_discharge="Advised salt restriction, adjusted diuretic, referred to GMC HDU for stabilization."
        )
    ]
    db.add_all(encounters_p1)

    # Appointments for Patient 1
    appts_p1 = [
        AppointmentModel(
            id="apt-01", patient_id="pat-007", date="20-Sep-2026", time="10:30 AM",
            department="Interventional Cardiology", doctor_name="Dr. Alok Verma",
            location="Cath Lab Screening Block, 2nd Floor", purpose="Repeat 2D-Echocardiogram & Stent Patency Doppler",
            status="SCHEDULED"
        ),
        AppointmentModel(
            id="apt-02", patient_id="pat-007", date="05-Oct-2026", time="02:00 PM",
            department="Cardiopulmonary Rehab", doctor_name="Dr. Sneha Roy",
            location="Outpatient Rehab Center", purpose="Phase II Supervised Exercise Tolerance Assessment",
            status="PENDING_DISCHARGE"
        )
    ]
    db.add_all(appts_p1)

    # Referral Configuration for Patient 1
    ref1 = ReferralModel(
        id="ref-001",
        patient_id="pat-007",
        hospital_name="AIIMS New Delhi — Apex Tertiary Cardiology",
        department="Cath Lab & Coronary ICU (Ward 5)",
        receiving_physician="Dr. Meenakshi Sunderam (Head of Interventional Cath)",
        distance_km=18.4,
        transit_time_mins=24,
        icu_capacity="2 Resuscitation Beds Locked",
        corridor_status="Delhi Traffic Police Automated Green Corridor Cleared",
        status="READY",
        telemetry_token="jwt-telemetry-91482910492810-aiims-green-corridor"
    )
    db.add(ref1)

    # --- Patient 2: Priya Sharma (Low Risk / Stable) ---
    p2 = PatientModel(
        id="pat-008", bed_number="Bed 4B-05", name="Priya Sharma", age=34, gender="F",
        abha_id="22-8391-4920-5511", admission_diagnosis="Post-Operative Day 2, Laparoscopic Cholecystectomy",
        is_zero_touch=True, abdm_status="SYNCED",
        contact_name="Rahul Sharma", contact_relationship="Spouse", contact_phone="+91 94152 77889"
    )
    db.add(p2)

    v2_score, v2_tier, _, _ = calculate_news2(16, 98, False, 118, 72, "ALERT", 36.8)
    v2 = VitalsModel(
        patient_id="pat-008", respiration_rate=16, spo2=98, oxygen_supplement=False,
        systolic_bp=118, pulse_rate=72, consciousness="ALERT", temperature=36.8,
        news2_total=v2_score, risk_tier=v2_tier
    )
    db.add(v2)

    # --- Patient 3: Rajesh Patel (Medium Alert / COPD) ---
    p3 = PatientModel(
        id="pat-009", bed_number="Bed 4B-06", name="Rajesh Patel", age=62, gender="M",
        abha_id="14-5567-8821-3340", admission_diagnosis="COPD Exacerbation with Hypercapnic Respiratory Acidosis",
        is_zero_touch=True, abdm_status="SYNCED",
        contact_name="Dharmesh Patel", contact_relationship="Brother", contact_phone="+91 97241 33456"
    )
    db.add(p3)

    v3_score, v3_tier, _, _ = calculate_news2(24, 91, True, 134, 102, "ALERT", 37.6)
    v3 = VitalsModel(
        patient_id="pat-009", respiration_rate=24, spo2=91, oxygen_supplement=True,
        systolic_bp=134, pulse_rate=102, consciousness="ALERT", temperature=37.6,
        news2_total=v3_score, risk_tier=v3_tier
    )
    db.add(v3)

    # Initial Audit Trail
    init_audit = [
        AuditLogModel(
            id="aud-init-01", timestamp="14:00:00", actor="SYSTEM GATEWAY",
            actor_role="HOSPITAL_AUDITOR", patient_bed="Ward 4B",
            event_type="DATA_ACCESS", risk_score=0, risk_tier="LOW",
            plain_language="ABDM FHIR pipeline initialized. 3 inpatients linked with zero operating burden on patients."
        ),
        AuditLogModel(
            id="aud-init-02", timestamp="14:15:22", actor="SYSTEM_INTELLIGENCE",
            actor_role="HOSPITAL_AUDITOR", patient_bed="Bed 4B-04",
            event_type="RISK_ELEVATION", risk_score=14, risk_tier="CRITICAL",
            plain_language="Presumed acute cardiac decompensation (SpO2 83%, HR 132). Escalated to Tier 3 Critical."
        ),
        AuditLogModel(
            id="aud-init-03", timestamp="14:15:23", actor="Dr. Alok Verma",
            actor_role="ON_CALL_CARDIOLOGIST", patient_bed="Bed 4B-04",
            event_type="JIT_GRANT", risk_score=14, risk_tier="CRITICAL",
            plain_language="Attribute-Based JIT token granted for 45 mins. Pre-provisioned emergency interventional catheterization scopes."
        ),
        AuditLogModel(
            id="aud-init-04", timestamp="14:15:25", actor="AUTOMATED_ADVOCATE",
            actor_role="HOSPITAL_AUDITOR", patient_bed="Bed 4B-04",
            event_type="FAMILY_SMS", risk_score=14, risk_tier="CRITICAL",
            plain_language='Update sent to Sunil Kumar: "Dr. Verma (Cardiology) is managing your father\'s oxygen adjustment. No action or OTP required from patient."'
        )
    ]
    db.add_all(init_audit)

    db.commit()
    print("[HDIMS Database] Seed complete! SQLite database created at database/hdims.db")
    db.close()

if __name__ == "__main__":
    seed_database()
