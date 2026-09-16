# HDIMS: risk monitoring for community clinics

## Primary product goal

Help a small clinic recognize deterioration early, explain the contributing signals, and get the right caregiver involved before an emergency peaks. Older adults and patients without smartphones must be able to use the service through clinic staff. Previous tests and medicines support the risk assessment and a safe handoff; they are not the main product.

The current frontend is an interactive sample-data demonstration. It recalculates NEWS2 when staff enter vitals, shows score direction across entries, and simulates time-limited specialist access and plain-language audit events. NEWS2 is a present-state early warning score. This prototype has no validated model for predicting future deterioration, live device feed, real hospital ingestion, persistent records, or enforced identity and access controls.

## Intended monitoring architecture

1. **Signal intake:** retrieve consented digital records, clinic or hospital systems, staff-entered observations, report uploads, and device readings. Mark each field with its source, timestamp, verification status, and missingness. Accept partial records without silently treating missing values as normal.
2. **Risk-state engine:** continuously recalculate a clinically validated risk state when new evidence arrives. Show contributing observations, change from the previous state, freshness, uncertainty, and a clear action threshold. A future prediction model needs retrospective validation, calibration, and monitoring in the intended clinic population.
3. **Access orchestration:** map the current risk and care assignment to minimum-necessary access for nurse, attending doctor, on-call specialist, rapid-response team, referral hospital, and designated family contact. Specialist and referral grants require a purpose, patient scope, expiry, and revocation. Family access is a consented plain-language summary rather than the full chart.
4. **Early escalation:** at elevated risk, prepare the on-call pathway and prompt a clinician to review. At critical risk, surface the rapid-response workflow and a short-lived specialist grant. Never represent a demo notification as a message actually sent.
5. **Consent and audit:** record every grant, denial, use, expiry, and risk-triggered scope change in language a patient and clinic can understand. Store the decision inputs and actor identity in an append-only backend audit log.

The small-clinic screen should always answer: **Who needs attention? Why? What information is available? Who can act now? What changed?**

## Quiet AI assistance

AI should be a small, optional aid within the clinical workflow. The first useful capability is a **draft evidence summary**: point to the exact vital readings, recent comparable reports, medicine changes, missing fields, and source timestamps that a clinician should review. Keep the standard risk state and next action visible without opening AI. A clinician must be able to inspect the underlying evidence, correct the draft, and dismiss it.

Do not send identifiable records to an external model by default. Before enabling model-generated summaries, implement consent and data minimization, an approved deployment destination, prompt and output audit, and evaluation for omissions and hallucinations. The current interface uses deterministic NEWS2 explanations; it does not represent them as AI output.

## The problem to solve

At a new hospital, a clinician may not have the last test result, specimen date, medication list, or documented follow-up plan. HDIMS should put those facts in one reviewable handoff so the clinician can decide whether a repeat test or medication change is needed. NHS England's blood-testing guidance specifically advises checking accessible recent results and existing samples before repeating collection: [Check twice](https://www.england.nhs.uk/statistics/wp-content/uploads/2021/09/B0960-optimising-blood-testing-secondary-care.pdf).

## What other products already do

| Capability | Existing examples | Implication for HDIMS |
| --- | --- | --- |
| Store and share personal health records | India's [ABHA/ABDM personal health record app](https://abdm.gov.in/strapicms/uploads/ABDM_STANDEE_24aabea939.pdf) supports viewing lab reports and prescriptions and sharing with practitioners. | Record storage and sharing alone are not unique. |
| Exchange records between hospitals | [Epic Care Everywhere](https://www.epic.com/careeverywhere/) exchanges records across healthcare organizations. | Cross-hospital exchange alone is not unique. |
| View test results and medicines | The [NHS App](https://www.nhs.uk/nhs-app/help/test-results/) provides test results, and its [prescription service](https://digital.nhs.uk/services/nhs-app/nhs-app-features/prescriptions-in-the-nhs-app) shows medicines and review status. | Test and medicine lists alone are not unique. |

## Plausible HDIMS differentiation

The strongest product position is a **clinician-facing continuity and response workflow** for a patient who may not be able to use a phone or app. In one screen, it would combine:

1. The latest verified result, collection date, source facility, and attached report.
2. A clinician-entered next review date and reason, surfaced before a repeat order. A new symptom, changed treatment, assay difference, or poor specimen quality can still justify repeating the test.
3. A reconciled medicine list with dose, frequency, planned duration, source, and reported side effects.
4. The existing NEWS2 deterioration view and time-limited caregiver access, with a readable audit trail.
5. A printable or securely shareable handoff for a receiving hospital.

This combination is a **proposed workflow distinction**, not a claim that no product offers any of these individual features. It needs user research and a pilot to establish whether it is meaningfully better.

## Features to add next

### Priority 1: make records trustworthy

- **Provenance and verification:** show who entered each record, source facility, report identifier, collection time, units, reference range, and whether a clinician verified it.
- **Structured report import:** extract fields from PDFs/images for confirmation by a person. Preserve the original report. FHIR R4 [DiagnosticReport](https://hl7.org/fhir/R4/diagnosticreport.html) includes report timing, specimen and attached report concepts.
- **Medicine reconciliation:** distinguish prescribed, patient-reported, administered, stopped and unknown medicines; track dose changes and side effects. FHIR [MedicationStatement](https://hl7.org/fhir/medicationstatement.html) supports effective periods and dosage.
- **Clinical review workflow:** allow the clinician to mark a previous result as reviewed, order a repeat with a reason, or set a follow-up date. Never use the calendar alone to decide that testing is unnecessary.

### Priority 2: make handoffs work across hospitals

- **Authenticated, consented sharing:** integrate with ABDM sandbox and FHIR APIs, with role-based access, expiry, revocation and audit. Do not expose sample or real records through an open public link.
- **Emergency handoff:** concise allergies, current medicines, recent results, pending tests and care plan, with a timestamp and verification status.
- **Low-connectivity mode:** queue new entries at the bedside and sync when the hospital network returns, with conflict review.

### Priority 3: measure value and improve decisions

- **Repeat-test opportunity review:** identify the same recent test across facilities and display relevant context to the ordering clinician. Track accepted and overridden suggestions, time saved and patient cost avoided; do not assume every repeat is wasteful.
- **Longitudinal trends:** show comparable results over time with units and assay differences visible.
- **Medicine safety review:** flag duplicate therapy, allergy conflicts and reported adverse effects using a validated clinical knowledge base, with clinician acknowledgement.
- **Patient and caregiver handoff:** a clear language summary with appropriate consent and accessibility for people with low digital literacy.

## Current prototype boundary

The new **Care timeline** page supports manual test and medicine entry, a report attachment in browser memory, clinician review dates, side effects, and a printable handoff summary. It does not parse reports, infer a safe retest interval, persist data after refresh, or share with another hospital automatically. Those require authenticated storage, interoperability work, clinical validation and privacy review before use with real patients.
