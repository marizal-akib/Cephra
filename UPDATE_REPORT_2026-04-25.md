# Cephra — Client Update Report

**Date:** 2026-04-25
**Branch:** main

This report summarises what has shipped (and what is in-flight on `main`) since the start of April, mapped against the pain points clients raised in earlier reviews.

---

## 1. Headlines

- Diagnostic engine now flags **secondary / dangerous causes** of headache (GCA, IIH, SAH, meningitis, CVST) in a dedicated alert track — they no longer get drowned out by primary phenotype scoring.
- **Prescribing** is no longer a free-text box: structured medicine search, indication defaults, draft → ready-to-sign → signed status flow, duplicate-therapy and medication-overuse soft warnings.
- **Previous Investigations** step added to the workup, with structured findings, quantitative results, and red-flag interpretation feeding back into the engine.
- AI **Guideline Library chatbot** restricted to vetted guideline sources only — answers cannot drift to general web content.
- **Assessment report view** with amendments, plus a **completed-assessments dashboard** for follow-up triage.
- **Real-time dictation** wired into the long-form clinical fields (history, exam, plan, investigations).

---

## 2. Client Pain Points → What We Solved

| # | Pain point raised by client | Status | What changed |
|---|---|---|---|
| 1 | "Engine only suggests primary headaches — I'm scared it will miss a bleed or GCA." | Resolved | New secondary-cause rule sets for GCA, IIH, SAH, meningitis, CVST in [src/lib/engine/rules/](src/lib/engine/rules/). Surfaced on a separate alert track in [src/lib/engine/index.ts](src/lib/engine/index.ts) so they don't compete with phenotype scoring. |
| 2 | "Visual loss and neck stiffness weren't being treated as red flags." | Resolved | Added `visual_loss` and `neck_stiffness` urgent red-flag rules in [src/lib/engine/red-flags.ts:71-83](src/lib/engine/red-flags.ts#L71-L83) and exposed in [src/lib/schemas/red-flags.ts](src/lib/schemas/red-flags.ts). |
| 3 | "Tension-type headache kept appearing as the default diagnosis on empty follow-up data." | Resolved | Fix in commit `3c64bb8`; mapper updated in [src/lib/follow-up/diagnostic-input-mapper.ts](src/lib/follow-up/diagnostic-input-mapper.ts). |
| 4 | "Prescribing is just a text field — I can prescribe two of the same drug, or trigger MOH without a warning." | Resolved | Structured medicine search via [src/components/encounter/medication-search-select.tsx](src/components/encounter/medication-search-select.tsx) backed by [src/lib/prescribing/medicines-catalogue.ts](src/lib/prescribing/medicines-catalogue.ts). Duplicate-row + medication-overuse soft warnings in [src/lib/prescribing/safety-rules.ts](src/lib/prescribing/safety-rules.ts), surfaced in [src/components/encounter/prescription-list.tsx](src/components/encounter/prescription-list.tsx). |
| 5 | "Prescriptions auto-flip to active — I want to draft, review, then sign." | Resolved | New scripts default to `draft`, with `ready_to_sign → signed → transmitted` flow and colour-coded status badges in [src/components/encounter/prescription-list.tsx](src/components/encounter/prescription-list.tsx). Schema in [src/lib/schemas/prescription.ts](src/lib/schemas/prescription.ts). |
| 6 | "I lose track of investigations the patient has already had." | Resolved | New **Previous Investigations** step at [src/app/(dashboard)/encounters/[id]/previous-investigations/page.tsx](src/app/(dashboard)/encounters/[id]/previous-investigations/page.tsx). Schema with structured findings, quantitative tests, and flags in [src/lib/schemas/previous-investigations.ts](src/lib/schemas/previous-investigations.ts). Findings now feed engine rules (e.g. CVST imaging evidence). |
| 7 | "The AI assistant in the guideline library answered things that weren't in the guidelines." | Resolved | Commit `e708d72` — chatbot restricted to vetted guideline data sources only. |
| 8 | "I want to see a clean assessment report and amend it after the visit." | Resolved | Commit `eef71e6` — assessment report view with amendments + completed-assessments dashboard. |
| 9 | "Typing the long-form fields during the consult is too slow." | Resolved | Real-time dictation textarea wired through history, exam, investigations, plan. |
| 10 | "Patients fail the verification step on the share link for trivial reasons." | Resolved | Commit `c50454c` — forgiving patient verification + structured share flow. Service-role admin client fix in `05bd843`. |
| 11 | "Guidelines and evidence sources were mixed together." | Resolved | Commit `d44609d` — split into two tabs, reclassified guidelines, filled missing content. |

---

## 3. Detail by Workstream

### 3.1 Diagnostic Engine
- Added 5 secondary-cause rule sets: [cvst.ts](src/lib/engine/rules/cvst.ts), [giant-cell-arteritis.ts](src/lib/engine/rules/giant-cell-arteritis.ts), [iih.ts](src/lib/engine/rules/iih.ts), [meningitis.ts](src/lib/engine/rules/meningitis.ts), [sah.ts](src/lib/engine/rules/sah.ts).
- Engine now separates **primary** phenotypes from **secondary** alerts in the output ([src/lib/engine/index.ts](src/lib/engine/index.ts)), so dangerous causes are not ranked against tension-type headache.
- New helper utilities (`hasFinding`, `isAbnormalHigh`, `isFemale`, etc.) in [src/lib/engine/helpers.ts](src/lib/engine/helpers.ts) for cross-rule consistency.
- All existing rules updated to declare `category` ("primary" / "secondary") in [src/lib/engine/types.ts](src/lib/engine/types.ts).

### 3.2 Prescribing
- New module [src/lib/prescribing/](src/lib/prescribing/) with:
  - `medicines-catalogue.ts` — searchable medicine catalogue with indication defaults.
  - `safety-rules.ts` — non-blocking soft warnings (duplicate-within-list, MOH risk, MOH phenotype).
- UI: medicine search-select component, status badges, lifecycle controls, warning banners on the prescription list.
- Schema extended with full lifecycle states (`draft`, `ready_to_sign`, `signed`, `transmitted`, `active`, `amended`, `stopped`, `cancelled`, `superseded`).

> **Caveat (carried over from safety-rules header comment):** production prescribing still requires licensed dm+d, allergy/pregnancy reconciliation, and a DCB0129/0160 safety case. Current rules are intentionally non-blocking.

### 3.3 Workup & Investigations
- New **Previous Investigations** workup step with structured name/result enums, quantitative test capture, and free-text interpretation.
- Investigation flags feed back into the diagnostic engine (e.g. MRV thrombosis evidence elevates CVST).
- Workup page wiring in [src/app/(dashboard)/encounters/[id]/workup/page.tsx](src/app/(dashboard)/encounters/[id]/workup/page.tsx).

### 3.4 Diagnosis Rail & Note Generation
- Diagnosis rail ([src/components/layout/diagnosis-rail.tsx](src/components/layout/diagnosis-rail.tsx)) and `useDiagnosis` hook ([src/hooks/use-diagnosis.ts](src/hooks/use-diagnosis.ts)) updated to render the new primary/secondary split.
- Initial note generation ([src/lib/note-gen/generate-initial.ts](src/lib/note-gen/generate-initial.ts)) updated to include the new fields.

### 3.5 Recently Merged (April commits)
- `e708d72` — Guideline-library AI chatbot with strict data-source boundaries.
- `eef71e6` — Assessment report view with amendments + completed-assessments dashboard.
- `bf44078` — Prescriptions, medication review, and lab summariser.
- `f4a8bbd`, `05bd843` — Questionnaire access fixes (admin service role, unauthenticated routes).
- `89420eb` — Previous investigations step + intake summary.
- `c50454c`, `40a3c3a` — Patient share flow + verification fixes.
- `9cf9d8d` — Dictation, meds dropdown improvements, workup investigation enhancements.
- `d44609d` — Guideline / evidence library split.
- `3c64bb8` — Tension-type default-diagnosis fix on empty follow-up data.

---

## 4. In Flight (uncommitted on `main`)

The changes listed in §3.1, §3.2, and §3.3 are currently **uncommitted** on the working tree (28 files changed, ~746 insertions). They will be committed alongside this report.

---

## 5. Next Up (suggested)

- Wire the secondary-cause alert track into the clinician shell as a distinct banner.
- Add unit tests for the new safety-rule warnings (duplicate, MOH).
- Decide on dm+d licensing path before the prescribing module can be enabled in production.
