import { Vitals, NEWS2Score, RiskTier } from '../types/hdims';

/**
 * Official NHS / Royal College of Physicians NEWS2 (National Early Warning Score) engine.
 * Computes clinical risk and deterioration state from real-time patient physiological signals.
 */
export function calculateNEWS2(vitals: Vitals): NEWS2Score {
  let rrScore = 0;
  if (vitals.respirationRate <= 8) rrScore = 3;
  else if (vitals.respirationRate >= 9 && vitals.respirationRate <= 11) rrScore = 1;
  else if (vitals.respirationRate >= 12 && vitals.respirationRate <= 20) rrScore = 0;
  else if (vitals.respirationRate >= 21 && vitals.respirationRate <= 24) rrScore = 2;
  else if (vitals.respirationRate >= 25) rrScore = 3;

  let spo2Score = 0;
  if (vitals.spo2 <= 91) spo2Score = 3;
  else if (vitals.spo2 >= 92 && vitals.spo2 <= 93) spo2Score = 2;
  else if (vitals.spo2 >= 94 && vitals.spo2 <= 95) spo2Score = 1;
  else spo2Score = 0;

  const o2Score = vitals.oxygenSupplement ? 2 : 0;

  let bpScore = 0;
  if (vitals.systolicBp <= 90) bpScore = 3;
  else if (vitals.systolicBp >= 91 && vitals.systolicBp <= 100) bpScore = 2;
  else if (vitals.systolicBp >= 101 && vitals.systolicBp <= 110) bpScore = 1;
  else if (vitals.systolicBp >= 111 && vitals.systolicBp <= 219) bpScore = 0;
  else bpScore = 3;

  let hrScore = 0;
  if (vitals.pulseRate <= 40) hrScore = 3;
  else if (vitals.pulseRate >= 41 && vitals.pulseRate <= 50) hrScore = 1;
  else if (vitals.pulseRate >= 51 && vitals.pulseRate <= 90) hrScore = 0;
  else if (vitals.pulseRate >= 91 && vitals.pulseRate <= 110) hrScore = 1;
  else if (vitals.pulseRate >= 111 && vitals.pulseRate <= 130) hrScore = 2;
  else hrScore = 3;

  let consciousnessScore = 0;
  if (vitals.consciousness !== 'ALERT') consciousnessScore = 3;

  let tempScore = 0;
  if (vitals.temperature <= 35.0) tempScore = 3;
  else if (vitals.temperature >= 35.1 && vitals.temperature <= 36.0) tempScore = 1;
  else if (vitals.temperature >= 36.1 && vitals.temperature <= 38.0) tempScore = 0;
  else if (vitals.temperature >= 38.1 && vitals.temperature <= 39.0) tempScore = 1;
  else tempScore = 2;

  const subscores = {
    respirationRate: rrScore,
    spo2: spo2Score,
    oxygenSupplement: o2Score,
    systolicBp: bpScore,
    pulseRate: hrScore,
    consciousness: consciousnessScore,
    temperature: tempScore,
  };

  const total = rrScore + spo2Score + o2Score + bpScore + hrScore + consciousnessScore + tempScore;

  const hasExtremeSingleScore = Object.values(subscores).some((val) => val === 3);

  let tier: RiskTier = 'LOW';
  let tierLabel = 'Tier 1 — Stable';
  let triggersEscalation = false;
  let clinicalAction = 'Routine 4-6 hourly nursing monitoring. Standard ward care.';

  if (total >= 7) {
    tier = 'CRITICAL';
    tierLabel = 'Tier 3 — Critical Deterioration';
    triggersEscalation = true;
    clinicalAction = 'IMMEDIATE EMERGENCY: Pre-provision Rapid Response & On-Call Specialist. Code Blue Standby.';
  } else if (total >= 5 || hasExtremeSingleScore) {
    tier = 'MEDIUM';
    tierLabel = 'Tier 2 — Acute Physiological Decline';
    triggersEscalation = true;
    clinicalAction = 'Urgent Clinical Review: Alert Attending Physician. Hourly monitoring. Oxygen titration.';
  }

  return {
    total,
    tier,
    tierLabel,
    subscores,
    triggersEscalation,
    clinicalAction,
  };
}
