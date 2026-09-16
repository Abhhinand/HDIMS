import { CaregiverRole, RiskTier, AccessScope, RoleDefinition, JITToken } from '../types/hdims';

export const ROLE_DEFINITIONS: Record<CaregiverRole, RoleDefinition> = {
  STAFF_NURSE: {
    id: 'STAFF_NURSE',
    title: 'Ward Staff Nurse',
    name: 'Nurse Priya Nair, RN',
    department: 'Cardiology Ward 4B',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  },
  ATTENDING_PHYSICIAN: {
    id: 'ATTENDING_PHYSICIAN',
    title: 'Attending Physician',
    name: 'Dr. Anand Raman, MD',
    department: 'Internal Medicine / Ward 4B Lead',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40'
  },
  ON_CALL_CARDIOLOGIST: {
    id: 'ON_CALL_CARDIOLOGIST',
    title: 'On-Call Interventional Specialist',
    name: 'Dr. Alok Verma, DM (Cardiology)',
    department: 'Cardiac Catheterization Lab',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
  },
  RAPID_RESPONSE_LEAD: {
    id: 'RAPID_RESPONSE_LEAD',
    title: 'Rapid Response Team Lead',
    name: 'Dr. Simran Kaur, Intensivist',
    department: 'ICU & Emergency Resuscitation',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40'
  },
  HOSPITAL_AUDITOR: {
    id: 'HOSPITAL_AUDITOR',
    title: 'Compliance & Ethics Officer',
    name: 'S. Namboodiri, DISHA/ABDM Auditor',
    department: 'Hospital Data Governance',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
  }
};

/**
 * Dynamic Attribute-Based Access Control (ABAC) evaluation.
 * Computes allowed scopes based on caregiver role, patient physiological deterioration tier,
 * and ephemeral JIT token validity.
 */
export function evaluateAccessScope(
  role: CaregiverRole,
  tier: RiskTier,
  activeJITToken: JITToken | null,
  patientId?: string
): AccessScope {
  // Baseline Scope
  const scope: AccessScope = {
    liveVitals: false,
    routineMeds: false,
    historicalEHR: false,
    cardiacCatheterization: false,
    stentProcedure: false,
    allergyAdverseReactions: false,
    interventionOverride: false,
  };

  const hasSpecialistJIT = activeJITToken !== null && activeJITToken.isActive &&
    activeJITToken.expiresAt > Date.now() && activeJITToken.recipientRole === role &&
    (!patientId || activeJITToken.patientId === patientId);

  switch (role) {
    case 'STAFF_NURSE':
      // Nurses always see live vitals, routine meds, and allergies, but do not need deep catheterization archives
      scope.liveVitals = true;
      scope.routineMeds = true;
      scope.allergyAdverseReactions = true;
      scope.historicalEHR = tier !== 'LOW'; // Unlocks basic history if deteriorating
      break;

    case 'ATTENDING_PHYSICIAN':
      // Attending physician has comprehensive baseline, unlocks deep cardiac logs if patient reaches Tier 2 or 3
      scope.liveVitals = true;
      scope.routineMeds = true;
      scope.allergyAdverseReactions = true;
      scope.historicalEHR = true;
      scope.interventionOverride = true;
      scope.cardiacCatheterization = tier !== 'LOW';
      scope.stentProcedure = tier !== 'LOW';
      break;

    case 'ON_CALL_CARDIOLOGIST':
      // Minimum Necessary Exposure: In Tier 1 (Green), cardiologist has NO active grant to patient's private records.
      // In Tier 2 (Yellow), gets telemetry summary.
      // In Tier 3 (Red) OR active JIT token, emergency vault unlocks!
      scope.liveVitals = tier !== 'LOW' || hasSpecialistJIT;
      scope.routineMeds = tier !== 'LOW' || hasSpecialistJIT;
      scope.allergyAdverseReactions = tier !== 'LOW' || hasSpecialistJIT;
      scope.historicalEHR = hasSpecialistJIT;
      scope.cardiacCatheterization = hasSpecialistJIT;
      scope.stentProcedure = hasSpecialistJIT;
      scope.interventionOverride = hasSpecialistJIT;
      break;

    case 'RAPID_RESPONSE_LEAD':
      // Rapid response gets full code-red access upon critical escalation
      if (tier === 'CRITICAL') {
        scope.liveVitals = true;
        scope.routineMeds = true;
        scope.historicalEHR = true;
        scope.cardiacCatheterization = true;
        scope.stentProcedure = true;
        scope.allergyAdverseReactions = true;
        scope.interventionOverride = true;
      }
      break;

    case 'HOSPITAL_AUDITOR':
      // Auditor inspects compliance, no direct live vital treatment overrides
      scope.historicalEHR = true;
      break;
  }

  return scope;
}
