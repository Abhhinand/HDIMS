import { AuditEntry, CaregiverRole, RiskTier } from '../types/hdims';

export function createAuditLog(
  actor: string,
  actorRole: CaregiverRole,
  patientBed: string,
  eventType: AuditEntry['eventType'],
  riskScore: number,
  riskTier: RiskTier,
  customDetail?: string
): AuditEntry {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  let plainLanguage = '';

  switch (eventType) {
    case 'RISK_ELEVATION':
      plainLanguage = `PHYSIOLOGICAL DEVIATION: Patient in ${patientBed} transitioned to ${riskTier} risk (NEWS2 Score: ${riskScore}). ${customDetail || 'Dynamic access lattice reconfigured automatically.'}`;
      break;

    case 'JIT_GRANT':
      plainLanguage = customDetail || `${actor} created a time-limited specialist access grant in the demo.`;
      break;

    case 'AUTO_REVOCATION':
      plainLanguage = customDetail || `Time-limited access was revoked for ${patientBed}.`;
      break;

    case 'DATA_ACCESS':
      plainLanguage = `RECORD VIEW AUDIT: ${actor} (${actorRole}) accessed ${customDetail || 'patient telemetry stream'}.`;
      break;

    case 'FAMILY_SMS':
      plainLanguage = `FAMILY TRUST DISPATCH: Plain-language status SMS dispatched to designated family contact: "${customDetail || 'Patient is under close observation by specialist team.'}" (Zero burden on patient).`;
      break;
    default:
      plainLanguage = customDetail || `${eventType} recorded for ${patientBed}.`;
  }

  return {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp,
    actor,
    actorRole,
    patientBed,
    eventType,
    riskScore,
    riskTier,
    plainLanguage,
  };
}
