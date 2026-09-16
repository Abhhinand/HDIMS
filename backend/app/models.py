from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class PatientModel(Base):
    __tablename__ = "patients"

    id = Column(String(50), primary_key=True, index=True)
    bed_number = Column(String(20), nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    abha_id = Column(String(50), unique=True, nullable=False, index=True)
    admission_diagnosis = Column(String(255), nullable=False)
    is_zero_touch = Column(Boolean, default=True)
    abdm_status = Column(String(50), default="SYNCED")

    # Emergency Contact
    contact_name = Column(String(100), nullable=False)
    contact_relationship = Column(String(50), nullable=False)
    contact_phone = Column(String(30), nullable=False)

    # Relationships
    vitals = relationship("VitalsModel", back_populates="patient", cascade="all, delete-orphan", order_by="desc(VitalsModel.timestamp)")
    prescriptions = relationship("PrescriptionModel", back_populates="patient", cascade="all, delete-orphan")
    lab_reports = relationship("LabReportModel", back_populates="patient", cascade="all, delete-orphan")
    encounters = relationship("DoctorEncounterModel", back_populates="patient", cascade="all, delete-orphan")
    appointments = relationship("AppointmentModel", back_populates="patient", cascade="all, delete-orphan")
    jit_tokens = relationship("JITTokenModel", back_populates="patient", cascade="all, delete-orphan")
    referral = relationship("ReferralModel", back_populates="patient", uselist=False, cascade="all, delete-orphan")


class VitalsModel(Base):
    __tablename__ = "vitals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False, index=True)
    respiration_rate = Column(Integer, nullable=False)
    spo2 = Column(Integer, nullable=False)
    oxygen_supplement = Column(Boolean, default=False)
    systolic_bp = Column(Integer, nullable=False)
    pulse_rate = Column(Integer, nullable=False)
    consciousness = Column(String(20), default="ALERT")
    temperature = Column(Float, nullable=False)
    news2_total = Column(Integer, default=0)
    risk_tier = Column(String(20), default="LOW")
    timestamp = Column(DateTime, default=datetime.utcnow)

    patient = relationship("PatientModel", back_populates="vitals")


class PrescriptionModel(Base):
    __tablename__ = "prescriptions"

    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    drug_name = Column(String(150), nullable=False)
    dosage = Column(String(50), nullable=False)
    frequency = Column(String(50), nullable=False)
    route = Column(String(30), nullable=False)
    prescribed_date = Column(String(50), nullable=False)
    prescribed_by = Column(String(100), nullable=False)
    indication = Column(String(150), nullable=False)
    abdm_verified = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)

    patient = relationship("PatientModel", back_populates="prescriptions")


class LabReportModel(Base):
    __tablename__ = "lab_reports"

    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    test_name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    value = Column(String(100), nullable=False)
    numeric_value = Column(Float, nullable=False)
    unit = Column(String(30), nullable=False)
    reference_range = Column(String(50), nullable=False)
    status = Column(String(30), nullable=False) # NORMAL, ELEVATED_CRITICAL, LOW_ALERT
    clinical_interpretation = Column(Text, nullable=False)
    collected_at = Column(String(50), nullable=False)

    patient = relationship("PatientModel", back_populates="lab_reports")


class DoctorEncounterModel(Base):
    __tablename__ = "doctor_encounters"

    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    date = Column(String(50), nullable=False)
    facility = Column(String(150), nullable=False)
    doctor_name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    chief_complaint = Column(String(255), nullable=False)
    clinical_findings = Column(Text, nullable=False)
    plan_and_discharge = Column(Text, nullable=False)

    patient = relationship("PatientModel", back_populates="encounters")


class AppointmentModel(Base):
    __tablename__ = "appointments"

    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    date = Column(String(50), nullable=False)
    time = Column(String(30), nullable=False)
    department = Column(String(100), nullable=False)
    doctor_name = Column(String(100), nullable=False)
    location = Column(String(150), nullable=False)
    purpose = Column(String(200), nullable=False)
    status = Column(String(50), default="SCHEDULED")

    patient = relationship("PatientModel", back_populates="appointments")


class JITTokenModel(Base):
    __tablename__ = "jit_tokens"

    id = Column(String(100), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    recipient_role = Column(String(50), nullable=False)
    recipient_name = Column(String(100), nullable=False)
    reason = Column(String(255), nullable=False)
    granted_at = Column(String(50), nullable=False)
    duration_seconds = Column(Integer, default=2700)
    expires_at_timestamp = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    plain_language_grant = Column(Text, nullable=False)
    jwt_token = Column(Text, nullable=True)

    patient = relationship("PatientModel", back_populates="jit_tokens")


class ReferralModel(Base):
    __tablename__ = "referrals"

    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    hospital_name = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    receiving_physician = Column(String(100), nullable=False)
    distance_km = Column(Float, nullable=False)
    transit_time_mins = Column(Integer, nullable=False)
    icu_capacity = Column(String(100), nullable=False)
    corridor_status = Column(String(200), nullable=False)
    status = Column(String(50), default="READY")
    telemetry_token = Column(String(255), nullable=False)
    dispatched_at = Column(DateTime, nullable=True)

    patient = relationship("PatientModel", back_populates="referral")


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(100), primary_key=True)
    timestamp = Column(String(50), nullable=False)
    actor = Column(String(100), nullable=False)
    actor_role = Column(String(100), nullable=False)
    patient_bed = Column(String(50), nullable=False)
    event_type = Column(String(50), nullable=False)
    risk_score = Column(Integer, default=0)
    risk_tier = Column(String(20), default="LOW")
    plain_language = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DocumentAnalysisModel(Base):
    __tablename__ = "document_analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(String(50), nullable=False)
    file_name = Column(String(200), nullable=False)
    document_type = Column(String(50), nullable=False)
    upload_date = Column(String(50), nullable=False)
    risk_level = Column(String(50), nullable=False)
    extracted_biomarkers_json = Column(Text, nullable=False)
    contraindications_json = Column(Text, nullable=False)
    clinical_recommendation = Column(Text, nullable=False)
