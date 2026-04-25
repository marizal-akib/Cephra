import type { DiagnosticInput, InvestigationResult } from "./types";
import { QUANTITATIVE_TESTS } from "@/lib/schemas/previous-investigations";

/** Returns the numeric value if it is a number, otherwise NaN. */
export function num(v: unknown): number {
  return typeof v === "number" ? v : NaN;
}

/** Returns true only if the value is strictly boolean true. */
export function bool(v: unknown): boolean {
  return v === true;
}

/** Case-insensitive name match against previous investigations. Returns the
 *  last entry matching the given test name (most recently added wins). */
export function pickInvestigation(
  input: DiagnosticInput,
  name: string
): InvestigationResult | undefined {
  const results = input.previousInvestigations?.results;
  if (!results || results.length === 0) return undefined;
  const target = name.toLowerCase();
  for (let i = results.length - 1; i >= 0; i--) {
    const entry = results[i];
    if (!entry) continue;
    const entryName = (entry.nameSpecify || entry.name || "").toLowerCase();
    if (entryName === target) return entry;
  }
  return undefined;
}

/** Whether a quantitative test is high. Prefers numericValue against the
 *  threshold from QUANTITATIVE_TESTS (or the explicit override), falls back to
 *  the clinician-set flag === "high", then to result === "Abnormal". */
export function isAbnormalHigh(
  input: DiagnosticInput,
  testName: string,
  threshold?: number
): boolean {
  const entry = pickInvestigation(input, testName);
  if (!entry) return false;
  const cutoff =
    threshold ?? QUANTITATIVE_TESTS[testName]?.highThreshold;
  if (typeof entry.numericValue === "number" && typeof cutoff === "number") {
    return entry.numericValue > cutoff;
  }
  if (entry.flag === "high") return true;
  // Last-resort fallback: clinician marked Abnormal but didn't enter a number.
  // Don't fire on this alone for high-stakes thresholds — return false here so
  // the engine prefers explicit numeric data; callers can opt in by passing a
  // very low threshold.
  return false;
}

/** Whether a quantitative test is low. */
export function isAbnormalLow(
  input: DiagnosticInput,
  testName: string,
  threshold?: number
): boolean {
  const entry = pickInvestigation(input, testName);
  if (!entry) return false;
  const cutoff = threshold ?? QUANTITATIVE_TESTS[testName]?.lowThreshold;
  if (typeof entry.numericValue === "number" && typeof cutoff === "number") {
    return entry.numericValue < cutoff;
  }
  if (entry.flag === "low") return true;
  return false;
}

/** Whether a structured imaging/CSF finding is recorded for the given
 *  investigation (e.g. hasFinding(input, "CT head", "blood_on_ct")). */
export function hasFinding(
  input: DiagnosticInput,
  investigationName: string,
  finding: string
): boolean {
  const entry = pickInvestigation(input, investigationName);
  return entry?.finding === finding;
}

/** Demographics-driven age check, with fallback to redFlags.age_over_50_new_onset
 *  when age is unknown but the clinician explicitly flagged the over-50 rule. */
export function ageAtLeast(input: DiagnosticInput, age: number): boolean {
  const known = input.demographics?.age;
  if (typeof known === "number") return known >= age;
  if (age === 50 && input.redFlags.age_over_50_new_onset) return true;
  return false;
}

/** True only when demographics.age is provided and below `age`. Distinguishes
 *  "we know the patient is younger" from "age is unknown". */
export function ageBelow(input: DiagnosticInput, age: number): boolean {
  const known = input.demographics?.age;
  return typeof known === "number" && known < age;
}

export function isFemale(input: DiagnosticInput): boolean {
  return input.demographics?.sex === "female";
}
