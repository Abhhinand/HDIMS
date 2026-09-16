from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class VitalsBase(BaseModel):
    respiration_rate: int
    spo2: int
    oxygen_supplement: bool
    systolic_bp: int
    pulse_rate: int
    consciousness: str = "ALERT"
    temperature: float

class VitalsCreate(VitalsBase):
    pass

class VitalsResponse(VitalsBase):
    id: int
    patient_id: str
    news2_total: int
    risk_tier: str
    timestamp: datetime

    class Config:
        from_attributes = True

class PrescriptionResponse(BaseModel):
    id: str
    drug_name: str
    dosage: str
    frequency: str
    route: str
    prescribed_date: str
    prescribed_by: str
    indication: str
    abdm_verified: bool
    is_active: bool

    class Config:
        from_attributes = True

class LabReportResponse(BaseModel):
    id: str
    test_name: str
    category: str
    value: str
    numeric_value: float
    unit: str
    reference_range: str
    status: str
    clinical_interpretation: str
    collected_at: str

    class Config:
        from_attributes = True

class DoctorEncounterResponse(BaseModel):
    id: str
    date: str
    facility: str
    doctor_name: str
    specialty: str
    chief_complaint: str
    clinical_findings: str
    plan_and_discharge: str

    class Config:
        from_attributes = True

class AppointmentResponse(BaseModel):
    id: str
    date: str
    time: str
    department: str
    doctor_name: str
    location: str
    purpose: str
    status: str

    class Config:
        from_attributes = True

class ReferralResponse(BaseModel):
    hospital_name: str
    department: str
    receiving_physician: str
    distance_km: float
    transit_time_mins: int
    icu_capacity: str
    corridor_status: str
    status: str
    telemetry_token: str

    class Config:
        from_attributes = True

class EmergencyContact(BaseModel):
    name: str
    relationship: str
    phone: str

class PatientBriefResponse(BaseModel):
    id: str
    bed_number: str
    name: str
    age: int
    gender: str
    abha_id: str
    admission_diagnosis: str
    is_zero_touch: bool
    abdm_status: str
    current_vitals: Optional[Dict[str, Any]] = None
    news2_score: Optional[int] = 0
    risk_tier: Optional[str] = "LOW"

class PatientDetailResponse(BaseModel):
    id: str
    bed_number: str
    name: str
    age: int
    gender: str
    abha_id: str
    admission_diagnosis: str
    is_zero_touch: bool
    abdm_status: str
    emergency_contact: EmergencyContact
    vitals: List[VitalsResponse] = []
    prescriptions: List[PrescriptionResponse] = []
    lab_reports: List[LabReportResponse] = []
    encounters: List[DoctorEncounterResponse] = []
    appointments: List[AppointmentResponse] = []
    referral: Optional[ReferralResponse] = None

class JITTokenGrantRequest(BaseModel):
    patient_id: str
    recipient_role: str
    recipient_name: str
    reason: str
    duration_seconds: int = 2700

class JITTokenResponse(BaseModel):
    id: str
    patient_id: str
    recipient_role: str
    recipient_name: str
    reason: str
    granted_at: str
    duration_seconds: int
    expires_at_timestamp: float
    is_active: bool
    plain_language_grant: str
    jwt_token: Optional[str] = None

class AuditLogCreate(BaseModel):
    actor: str
    actor_role: str
    patient_bed: str
    event_type: str
    risk_score: int = 0
    risk_tier: str = "LOW"
    plain_language: str

class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    actor: str
    actor_role: str
    patient_bed: str
    event_type: str
    risk_score: int
    risk_tier: str
    plain_language: str

    class Config:
        from_attributes = True

class SendSmsRequest(BaseModel):
    patient_id: str
    message: str

class DispatchReferralRequest(BaseModel):
    patient_id: str
    target_hospital: Optional[str] = "AIIMS New Delhi"
