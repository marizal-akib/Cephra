/**
 * Fetches the most recent previous encounter for a patient and returns
 * its still-active prescriptions, applying any review actions (stop /
 * increase / decrease / switch) recorded at that visit.
 *
 * v1 scope: walks ONE step back. If the prior visit stopped a medication
 * that had been prescribed at an even earlier visit, the stopped entry is
 * dropped from this result. Full chain-reducer is a future enhancement.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Prescription, PrescriptionReview } from "@/lib/schemas/prescription";

function isPrescriptionArray(val: unknown): val is Prescription[] {
  return Array.isArray(val);
}

function isReviewArray(val: unknown): val is PrescriptionReview[] {
  return Array.isArray(val);
}

export async function fetchPreviousActivePrescriptions(
  supabase: SupabaseClient,
  patientId: string,
  currentEncounterId: string,
  currentCreatedAt: string
): Promise<Prescription[]> {
  // Step 1: find most recent prior encounter for this patient
  const { data: priorEnc, error: encErr } = await supabase
    .from("encounters")
    .select("id, encounter_type, created_at")
    .eq("patient_id", patientId)
    .neq("id", currentEncounterId)
    .lt("created_at", currentCreatedAt)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (encErr || !priorEnc) return [];

  // Step 2: read that encounter's prescriptions (+ reviews for follow-ups)
  let prescriptions: Prescription[] = [];
  let reviews: PrescriptionReview[] = [];

  if (priorEnc.encounter_type === "follow_up") {
    const { data } = await supabase
      .from("follow_up_assessments")
      .select("assessment_plan")
      .eq("encounter_id", priorEnc.id)
      .maybeSingle();
    const plan = (data?.assessment_plan || {}) as Record<string, unknown>;
    if (isPrescriptionArray(plan.prescriptions)) prescriptions = plan.prescriptions;
    if (isReviewArray(plan.prescription_reviews))
      reviews = plan.prescription_reviews;
  } else {
    const { data } = await supabase
      .from("clinician_assessments")
      .select("workup_data")
      .eq("encounter_id", priorEnc.id)
      .maybeSingle();
    const workup = (data?.workup_data || {}) as Record<string, unknown>;
    if (isPrescriptionArray(workup.prescriptions)) prescriptions = workup.prescriptions;
  }

  // Step 3: apply review actions from that visit to build the active set.
  // For follow-ups, the "active meds leaving this visit" = prescriptions
  // prescribed at this visit PLUS any reviews that continue/amend meds
  // from earlier visits (but we have snapshotted details for those in the
  // review record itself — so we surface them as synthetic entries).
  const stoppedIds = new Set(
    reviews.filter((r) => r.action === "stop").map((r) => r.prescription_id)
  );

  // Active prescriptions that originated at the prior visit
  const activeOriginals = prescriptions
    .filter((rx) => rx.status !== "stopped")
    .filter((rx) => !stoppedIds.has(rx.id))
    .map((rx) => {
      const review = reviews.find((r) => r.prescription_id === rx.id);
      if (!review) return rx;
      if (
        review.action === "increase" ||
        review.action === "decrease" ||
        review.action === "switch"
      ) {
        return {
          ...rx,
          dosage: review.new_dose || rx.dosage,
          frequency: review.new_frequency || rx.frequency,
        };
      }
      return rx;
    });

  // Meds carried forward from earlier visits via reviews (continue or amend)
  // — surfaced as synthetic Prescription objects so the current visit can
  // review them again. They keep the ORIGINAL prescription_id so reviews at
  // the current visit still point to the same underlying prescription.
  const carriedForward: Prescription[] = reviews
    .filter(
      (r) =>
        r.action &&
        r.action !== "stop" &&
        // Not one of the originals from this same visit (those are handled above)
        !prescriptions.some((p) => p.id === r.prescription_id)
    )
    .map((r) => ({
      id: r.prescription_id,
      prescribed_at_encounter_id: r.source_encounter_id,
      medication_name: r.previous_medication_name || "",
      dosage:
        r.action === "increase" || r.action === "decrease" || r.action === "switch"
          ? r.new_dose || r.previous_dosage || ""
          : r.previous_dosage || "",
      frequency:
        r.action === "increase" || r.action === "decrease" || r.action === "switch"
          ? r.new_frequency || r.previous_frequency || ""
          : r.previous_frequency || "",
      status: "active" as const,
    }));

  return [...activeOriginals, ...carriedForward];
}
