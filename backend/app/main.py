import os
import json
import time
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import jwt

from .database import get_db, engine, Base
from .models import (
    PatientModel, VitalsModel, PrescriptionModel, LabReportModel,
    DoctorEncounterModel, AppointmentModel, JITTokenModel, ReferralModel,
    AuditLogModel, DocumentAnalysisModel
)
from .schemas import (
    VitalsCreate, VitalsResponse, PatientBriefResponse, PatientDetailResponse,
    JITTokenGrantRequest, JITTokenResponse, AuditLogCreate, AuditLogResponse,
    SendSmsRequest, DispatchReferralRequest
)
from .news2_engine import calculate_news2
from .seed_data import seed_database

# Create tables and auto-seed if needed
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="HDIMS — Clinician Intelligence & Monitoring Engine",
    description="Python FastAPI backend for Healthcare Dynamic Intelligence & Monitoring System. Powered by SQLite and continuous NEWS2 physiological scoring.",
    version="2.4.0"
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = "HDIMS_DISHA_STATUTORY_SECRET_KEY_2026"

@app.get("/")
def root():
    return {
        "system": "HDIMS Backend Intelligence Gateway",
        "version": "2.4.0",
        "status": "OPERATIONAL",
        "abdm_gateway": "ONLINE",
        "database": "SQLite (hdims.db)",
        "zero_touch_patient_mode": "ACTIVE",
        "timestamp": datetime.utcnow().isoformat()
    }

# --- PATIENTS ENDPOINTS ---

@app.get("/api/patients", response_model=List[PatientBriefResponse])
def get_all_patients(db: Session = Depends(get_db)):
    patients = db.query(PatientModel).all()
    results = []
    for p in patients:
        latest_vitals = db.query(VitalsModel).filter(VitalsModel.patient_id == p.id).order_by(VitalsModel.timestamp.desc()).first()
        v_dict = None
        score = 0
        tier = "LOW"
        if latest_vitals:
            v_dict = {
                "respiration_rate": latest_vitals.respiration_rate,
                "spo2": latest_vitals.spo2,
                "oxygen_supplement": latest_vitals.oxygen_supplement,
                "systolic_bp": latest_vitals.systolic_bp,
                "pulse_rate": latest_vitals.pulse_rate,
                "consciousness": latest_vitals.consciousness,
                "temperature": latest_vitals.temperature,
            }
            score = latest_vitals.news2_total
            tier = latest_vitals.risk_tier

        results.append(PatientBriefResponse(
            id=p.id,
            bed_number=p.bed_number,
            name=p.name,
            age=p.age,
            gender=p.gender,
            abha_id=p.abha_id,
            admission_diagnosis=p.admission_diagnosis,
            is_zero_touch=p.is_zero_touch,
            abdm_status=p.abdm_status,
            current_vitals=v_dict,
            news2_score=score,
            risk_tier=tier
        ))
    return results

@app.get("/api/patients/{patient_id}")
def get_patient_details(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    vitals = db.query(VitalsModel).filter(VitalsModel.patient_id == patient_id).order_by(VitalsModel.timestamp.desc()).limit(10).all()
    prescriptions = db.query(PrescriptionModel).filter(PrescriptionModel.patient_id == patient_id).all()
    labs = db.query(LabReportModel).filter(LabReportModel.patient_id == patient_id).all()
    encounters = db.query(DoctorEncounterModel).filter(DoctorEncounterModel.patient_id == patient_id).all()
    appointments = db.query(AppointmentModel).filter(AppointmentModel.patient_id == patient_id).all()
    referral = db.query(ReferralModel).filter(ReferralModel.patient_id == patient_id).first()

    return {
        "id": patient.id,
        "bed_number": patient.bed_number,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "abha_id": patient.abha_id,
        "admission_diagnosis": patient.admission_diagnosis,
        "is_zero_touch": patient.is_zero_touch,
        "abdm_status": patient.abdm_status,
        "emergency_contact": {
            "name": patient.contact_name,
            "relationship": patient.contact_relationship,
            "phone": patient.contact_phone,
        },
        "vitals": [
            {
                "id": v.id,
                "respiration_rate": v.respiration_rate,
                "spo2": v.spo2,
                "oxygen_supplement": v.oxygen_supplement,
                "systolic_bp": v.systolic_bp,
                "pulse_rate": v.pulse_rate,
                "consciousness": v.consciousness,
                "temperature": v.temperature,
                "news2_total": v.news2_total,
                "risk_tier": v.risk_tier,
                "timestamp": v.timestamp.isoformat()
            }
            for v in vitals
        ],
        "prescriptions": [
            {
                "id": rx.id,
                "drug_name": rx.drug_name,
                "dosage": rx.dosage,
                "frequency": rx.frequency,
                "route": rx.route,
                "prescribed_date": rx.prescribed_date,
                "prescribed_by": rx.prescribed_by,
                "indication": rx.indication,
                "abdm_verified": rx.abdm_verified,
                "is_active": rx.is_active
            }
            for rx in prescriptions
        ],
        "lab_reports": [
            {
                "id": l.id,
                "test_name": l.test_name,
                "category": l.category,
                "value": l.value,
                "numeric_value": l.numeric_value,
                "unit": l.unit,
                "reference_range": l.reference_range,
                "status": l.status,
                "clinical_interpretation": l.clinical_interpretation,
                "collected_at": l.collected_at
            }
            for l in labs
        ],
        "encounters": [
            {
                "id": e.id,
                "date": e.date,
                "facility": e.facility,
                "doctor_name": e.doctor_name,
                "specialty": e.specialty,
                "chief_complaint": e.chief_complaint,
                "clinical_findings": e.clinical_findings,
                "plan_and_discharge": e.plan_and_discharge
            }
            for e in encounters
        ],
        "appointments": [
            {
                "id": a.id,
                "date": a.date,
                "time": a.time,
                "department": a.department,
                "doctor_name": a.doctor_name,
                "location": a.location,
                "purpose": a.purpose,
                "status": a.status
            }
            for a in appointments
        ],
        "referral": {
            "hospital_name": referral.hospital_name,
            "department": referral.department,
            "receiving_physician": referral.receiving_physician,
            "distance_km": referral.distance_km,
            "transit_time_mins": referral.transit_time_mins,
            "icu_capacity": referral.icu_capacity,
            "corridor_status": referral.corridor_status,
            "status": referral.status,
            "telemetry_token": referral.telemetry_token
        } if referral else None
    }

# --- VITALS TELEMETRY & AUTO-JIT ESCALATION ---

@app.post("/api/patients/{patient_id}/vitals")
def submit_patient_vitals(patient_id: str, payload: VitalsCreate, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    score, tier, action, subscores = calculate_news2(
        payload.respiration_rate,
        payload.spo2,
        payload.oxygen_supplement,
        payload.systolic_bp,
        payload.pulse_rate,
        payload.consciousness,
        payload.temperature
    )

    vital_record = VitalsModel(
        patient_id=patient_id,
        respiration_rate=payload.respiration_rate,
        spo2=payload.spo2,
        oxygen_supplement=payload.oxygen_supplement,
        systolic_bp=payload.systolic_bp,
        pulse_rate=payload.pulse_rate,
        consciousness=payload.consciousness,
        temperature=payload.temperature,
        news2_total=score,
        risk_tier=tier
    )
    db.add(vital_record)

    jit_granted = False
    new_jit = None

    # Auto-JIT Grant if Critical
    if tier == "CRITICAL":
        duration = 2700 # 45 mins
        now_ts = time.time()
        token_id = f"jit-tok-{int(now_ts * 1000)}"

        # Generate signed JWT
        jwt_payload = {
            "iss": "HDIMS-ABAC-ORCHESTRATOR",
            "sub": patient.abha_id,
            "aud": "GMCH-CARDIOLOGY-ONCALL",
            "role": "ON_CALL_CARDIOLOGIST",
            "scope": ["read:ecg_telemetry", "read:stent_records", "write:emergency_orders"],
            "statutory_basis": "DISHA_2026_SECTION_4_EMERGENCY",
            "patient_bed": patient.bed_number,
            "news2_score": score,
            "exp": now_ts + duration,
            "iat": now_ts
        }
        signed_token = jwt.encode(jwt_payload, JWT_SECRET, algorithm="HS256")

        new_jit = JITTokenModel(
            id=token_id,
            patient_id=patient.id,
            recipient_role="ON_CALL_CARDIOLOGIST",
            recipient_name="Dr. Alok Verma",
            reason=f"Acute physiological desaturation (SpO2 {payload.spo2}%, HR {payload.pulse_rate})",
            granted_at=datetime.now().strftime("%H:%M:%S"),
            duration_seconds=duration,
            expires_at_timestamp=now_ts + duration,
            is_active=True,
            plain_language_grant="Pre-provisioned emergency interventional catheterization scopes.",
            jwt_token=signed_token
        )
        db.add(new_jit)
        jit_granted = True

        # Log to Audit Ledger
        audit_entry_1 = AuditLogModel(
            id=f"aud-crit-{int(now_ts)}",
            timestamp=datetime.now().strftime("%H:%M:%S"),
            actor="SYSTEM_INTELLIGENCE",
            actor_role="HOSPITAL_AUDITOR",
            patient_bed=patient.bed_number,
            event_type="RISK_ELEVATION",
            risk_score=score,
            risk_tier=tier,
            plain_language=f"Critical deterioration detected. NEWS2 {score}. Escalated to Tier 3 Critical."
        )
        audit_entry_2 = AuditLogModel(
            id=f"aud-jit-{int(now_ts)}",
            timestamp=datetime.now().strftime("%H:%M:%S"),
            actor="Dr. Alok Verma",
            actor_role="ON_CALL_CARDIOLOGIST",
            patient_bed=patient.bed_number,
            event_type="JIT_GRANT",
            risk_score=score,
            risk_tier=tier,
            plain_language="JIT emergency access token provisioned for 45 minutes without patient friction."
        )
        db.add_all([audit_entry_1, audit_entry_2])

    db.commit()

    return {
        "status": "VITALS_RECORDED",
        "patient_id": patient_id,
        "news2_total": score,
        "risk_tier": tier,
        "clinical_action": action,
        "subscores": subscores,
        "jit_token_granted": jit_granted,
        "jit_token_id": new_jit.id if new_jit else None
    }

# --- JIT ACCESS TOKENS ---

@app.get("/api/jit/active")
def get_active_jit_tokens(db: Session = Depends(get_db)):
    now_ts = time.time()
    tokens = db.query(JITTokenModel).filter(
        JITTokenModel.is_active == True,
        JITTokenModel.expires_at_timestamp > now_ts
    ).all()

    return [
        {
            "id": t.id,
            "patient_id": t.patient_id,
            "recipient_role": t.recipient_role,
            "recipient_name": t.recipient_name,
            "reason": t.reason,
            "granted_at": t.granted_at,
            "seconds_remaining": max(0, int(t.expires_at_timestamp - now_ts)),
            "is_active": t.is_active,
            "plain_language_grant": t.plain_language_grant,
            "jwt_token": t.jwt_token
        }
        for t in tokens
    ]

# --- DOCUMENT & OCR ANALYZER ---

@app.post("/api/ocr/analyze")
def analyze_medical_document(doc_type: str = "LAB_REPORT"):
    """
    Simulated OCR + clinical NLP parser extracting biomarkers and flagging contraindications.
    """
    if doc_type == "PRESCRIPTION_SLIP":
        return {
            "fileName": "Varanasi_OPD_Prescription_Slip_Scan.jpg",
            "documentType": "PRESCRIPTION_SLIP",
            "extractedBiomarkers": [
                {"name": "Blood Pressure on Slip", "value": "130/84 mmHg", "flag": "NORMAL"},
                {"name": "Recorded Resting Pulse", "value": "76 bpm", "flag": "NORMAL"},
                {"name": "Maintenance Antiplatelet", "value": "Ticagrelor 90mg BD", "flag": "NORMAL"}
            ],
            "contraindications": [
                "Avoid sudden interruption of Ticagrelor (Risk of acute stent thrombosis)."
            ],
            "urgentClinicalRecommendation": "ROUTINE CHRONIC CARE: Patient compliant with dual antiplatelet regimen.",
            "riskLevel": "STABLE"
        }
    else:
        return {
            "fileName": "AIIMS_Emergency_Cardiac_Biomarker_Panel.pdf",
            "documentType": "LAB_REPORT",
            "extractedBiomarkers": [
                {"name": "High-Sensitivity Troponin-I", "value": "1.84 ng/mL (Ref: <0.04)", "flag": "CRITICAL"},
                {"name": "NT-proBNP Cardiac Strain", "value": "1,420 pg/mL (Ref: <300)", "flag": "CRITICAL"},
                {"name": "Arterial Blood Gas: pO2", "value": "58 mmHg (Ref: 80-100)", "flag": "CRITICAL"},
                {"name": "Serum Potassium (K+)", "value": "4.7 mEq/L (Ref: 3.5-5.0)", "flag": "NORMAL"},
                {"name": "Serum Creatinine", "value": "1.08 mg/dL (Ref: 0.7-1.3)", "flag": "NORMAL"}
            ],
            "contraindications": [
                "SEVERE DRUG ALLERGY: Grade IV Penicillin Anaphylaxis — Beta-lactams prohibited.",
                "ASPIRIN CONTRAINDICATION: Documented aspirin-induced bronchospasm (AERD)."
            ],
            "urgentClinicalRecommendation": "ACUTE MYOCARDIAL INJURY CONFIRMED: Immediate catheterization standby recommended.",
            "riskLevel": "HIGH_PRIORITY"
        }

# --- REFERRAL HANDSHAKE ---

@app.post("/api/referral/dispatch")
def dispatch_referral(payload: DispatchReferralRequest, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(PatientModel.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    referral = db.query(ReferralModel).filter(ReferralModel.patient_id == payload.patient_id).first()
    if referral:
        referral.status = "DISPATCHED"
        referral.dispatched_at = datetime.utcnow()

    log_entry = AuditLogModel(
        id=f"aud-ref-{int(time.time())}",
        timestamp=datetime.now().strftime("%H:%M:%S"),
        actor="Dr. Alok Verma",
        actor_role="ON_CALL_CARDIOLOGIST",
        patient_bed=patient.bed_number,
        event_type="DATA_ACCESS",
        risk_score=14,
        risk_tier="CRITICAL",
        plain_language=f"Green Corridor Referral Handshake Dispatched to {payload.target_hospital}. Telemetry stream active. 2 ICU beds locked."
    )
    db.add(log_entry)
    db.commit()

    return {
        "status": "DISPATCHED",
        "target_hospital": payload.target_hospital,
        "patient_id": patient.id,
        "telemetry_tunnel": f"wss://aiims-delhi.gov.in/telemetry/{patient.abha_id}",
        "beds_locked": 2,
        "timestamp": datetime.utcnow().isoformat()
    }

# --- FAMILY SMS ADVOCATE ---

@app.post("/api/family-sms/send")
def send_family_sms(payload: SendSmsRequest, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(PatientModel.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    log_entry = AuditLogModel(
        id=f"aud-sms-{int(time.time())}",
        timestamp=datetime.now().strftime("%H:%M:%S"),
        actor="Dr. Alok Verma",
        actor_role="ON_CALL_CARDIOLOGIST",
        patient_bed=patient.bed_number,
        event_type="FAMILY_SMS",
        risk_score=14,
        risk_tier="CRITICAL",
        plain_language=f'SMS to {patient.contact_name} ({patient.contact_phone}): "{payload.message}"'
    )
    db.add(log_entry)
    db.commit()

    return {
        "status": "SMS_SENT",
        "recipient": patient.contact_name,
        "phone": patient.contact_phone,
        "message": payload.message,
        "gateway": "NIC Telecom Healthcare SMS Gateway"
    }

# --- STATUTORY AUDIT LEDGER ---

@app.get("/api/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLogModel).order_by(AuditLogModel.created_at.desc()).limit(50).all()
    return logs

@app.get("/api/audit-logs/export")
def export_audit_logs_json(db: Session = Depends(get_db)):
    logs = db.query(AuditLogModel).order_by(AuditLogModel.created_at.desc()).all()
    data = [
        {
            "id": l.id,
            "timestamp": l.timestamp,
            "actor": l.actor,
            "actor_role": l.actor_role,
            "patient_bed": l.patient_bed,
            "event_type": l.event_type,
            "risk_score": l.risk_score,
            "risk_tier": l.risk_tier,
            "plain_language": l.plain_language
        }
        for l in logs
    ]
    return JSONResponse(
        content=data,
        headers={"Content-Disposition": f"attachment; filename=HDIMS_Statutory_Audit_{datetime.utcnow().strftime('%Y%m%d')}.json"}
    )
