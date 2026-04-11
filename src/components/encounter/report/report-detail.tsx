"use client";

import type { ClinicianAssessment } from "@/types";
import {
  ReportSection,
  Field,
  FieldGrid,
  NotesBlock,
  EmptyState,
  formatDate,
  formatDateTime,
} from "./report-shared";
import { NoteDisplay } from "@/components/encounter/note-display";

/**
 * Full section-by-section read-only view of the initial assessment.
 * Each section is a card; empty sections render an "No data" empty state.
 */
interface ReportDetailProps {
  assessment: ClinicianAssessment;
  note: string;
}

export function ReportDetail({ assessment, note }: ReportDetailProps) {
  const redFlags = (assessment.red_flags || {}) as Record<string, unknown>;
  const pmh = (assessment.past_medical_history || {}) as Record<string, unknown>;
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const pain = (assessment.pain || {}) as Record<string, unknown>;
  const symptoms = (assessment.symptoms || {}) as Record<string, unknown>;
  const aura = (assessment.aura || {}) as Record<string, unknown>;
  const autonomic = (assessment.autonomic || {}) as Record<string, unknown>;
  const triggers = (assessment.triggers || {}) as Record<string, unknown>;
  const meds = (assessment.medications || {}) as Record<string, unknown>;
  const prevInv = (assessment.previous_investigations || {}) as Record<string, unknown>;
  const exam = (assessment.clinical_examination || {}) as Record<string, unknown>;
  const workup = (assessment.workup_data || {}) as Record<string, unknown>;
  const followUp = (assessment.follow_up || {}) as Record<string, unknown>;

  return (
    <div className="mt-4 space-y-4">
      {/* Red Flags */}
      <ReportSection title="Red Flags">
        <FieldGrid data={redFlags} skip={["notes"]} />
        <NotesBlock notes={redFlags.notes} />
      </ReportSection>

      {/* Past Medical History */}
      <ReportSection title="Past Medical History">
        {Array.isArray(pmh.common_conditions) && pmh.common_conditions.length > 0 ? (
          <Field
            label="Conditions"
            value={(pmh.common_conditions as string[]).map((c) => c.replace(/_/g, " "))}
          />
        ) : (
          <EmptyState text="No conditions recorded." />
        )}
        <NotesBlock notes={pmh.notes} />
      </ReportSection>

      {/* Pattern */}
      <ReportSection title="Headache Pattern">
        <FieldGrid
          data={pattern}
          skip={["notes", "functional_impact_notes"]}
          labels={{
            first_headache_age: "First headache age",
            headache_days_per_month: "Headache days / month",
            severe_days_per_month: "Severe days / month",
            migraine_like_days_per_month: "Migraine-like days / month",
            duration_hours: "Duration (hours)",
            duration_minutes: "Duration (minutes)",
            attacks_per_day: "Attacks / day",
            attacks_per_month: "Attacks / month",
            pattern_duration_months: "Current pattern duration (months)",
            time_to_peak_minutes: "Time to peak (min)",
          }}
        />
        <NotesBlock notes={pattern.notes} />
        {typeof pattern.functional_impact_notes === "string" &&
          pattern.functional_impact_notes && (
            <div className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Functional impact</p>
              <p className="whitespace-pre-wrap">
                {pattern.functional_impact_notes as string}
              </p>
            </div>
          )}
      </ReportSection>

      {/* Pain */}
      <ReportSection title="Pain Characteristics">
        <FieldGrid
          data={pain}
          skip={["notes"]}
          labels={{
            avg_intensity: "Average intensity (0-10)",
            peak_intensity: "Peak intensity (0-10)",
          }}
        />
        <NotesBlock notes={pain.notes} />
      </ReportSection>

      {/* Symptoms */}
      <ReportSection title="Associated Symptoms">
        <FieldGrid data={symptoms} skip={["associated_symptoms_notes"]} />
        <NotesBlock notes={symptoms.associated_symptoms_notes} />
      </ReportSection>

      {/* Aura */}
      <ReportSection title="Aura">
        <FieldGrid
          data={aura}
          skip={["notes"]}
          labels={{ aura_duration_minutes: "Aura duration (min)" }}
        />
        <NotesBlock notes={aura.notes} />
      </ReportSection>

      {/* Autonomic */}
      <ReportSection title="Cranial Autonomic Features">
        {autonomic.autonomic_features_na === true ? (
          <p className="text-xs italic text-muted-foreground">
            No cranial autonomic features (marked N/A).
          </p>
        ) : (
          <FieldGrid data={autonomic} skip={["notes", "autonomic_features_na"]} />
        )}
        <NotesBlock notes={autonomic.notes} />
      </ReportSection>

      {/* Triggers */}
      <ReportSection title="Triggers">
        <FieldGrid data={triggers} skip={["triggers_notes"]} />
        <NotesBlock notes={triggers.triggers_notes} />
      </ReportSection>

      {/* Medications */}
      <ReportSection title="Medications">
        <FieldGrid
          data={meds}
          skip={["medication_actions", "current_medications_text"]}
          labels={{
            triptan_days_per_month: "Triptan days / month",
            nsaid_days_per_month: "NSAID days / month",
            paracetamol_days_per_month: "Paracetamol days / month",
            opioid_days_per_month: "Opioid days / month",
            simple_analgesic_days_per_month: "Simple analgesic days / month",
            combination_analgesic_days_per_month: "Combination analgesic days / month",
          }}
        />
        {typeof meds.current_medications_text === "string" &&
          meds.current_medications_text && (
            <div className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Current medications</p>
              <p className="whitespace-pre-wrap">
                {meds.current_medications_text as string}
              </p>
            </div>
          )}
        {Array.isArray(meds.medication_actions) && meds.medication_actions.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Medication actions
            </p>
            <ul className="space-y-2">
              {(meds.medication_actions as Array<Record<string, unknown>>).map((m, idx) => (
                <li
                  key={idx}
                  className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                >
                  <p className="font-medium">
                    {(m.drug as string) || "—"}{" "}
                    {m.type ? (
                      <span className="text-xs text-muted-foreground">
                        [{m.type as string}]
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.dose as string}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Benefit: {(m.benefit as string) || "—"} · Tolerability:{" "}
                    {(m.tolerability as string) || "—"} · Action:{" "}
                    <span className="font-medium">{(m.action as string) || "—"}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ReportSection>

      {/* Previous Investigations */}
      <ReportSection title="Previous Investigations">
        {Array.isArray(prevInv.results) && prevInv.results.length > 0 ? (
          <ul className="space-y-2">
            {(prevInv.results as Array<Record<string, unknown>>).map((r, idx) => (
              <li
                key={idx}
                className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm"
              >
                <p className="font-medium">
                  {(r.name as string) || "Investigation"}{" "}
                  <span className="text-xs text-muted-foreground">
                    · {(r.result as string) || "—"}
                  </span>
                </p>
                {typeof r.interpretation === "string" && r.interpretation && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.interpretation}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text="No previous investigations recorded." />
        )}
        <NotesBlock notes={prevInv.notes} />
      </ReportSection>

      {/* Clinical Examination */}
      <ReportSection title="Clinical Examination">
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Vitals
          </p>
          <FieldGrid
            data={{
              heart_rate_bpm: exam.heart_rate_bpm,
              blood_pressure:
                exam.bp_systolic && exam.bp_diastolic
                  ? `${exam.bp_systolic} / ${exam.bp_diastolic} mmHg`
                  : undefined,
              oxygen_saturation:
                typeof exam.oxygen_saturation === "number"
                  ? `${exam.oxygen_saturation}%`
                  : undefined,
              temperature:
                typeof exam.temperature === "number"
                  ? `${exam.temperature} °C`
                  : undefined,
              weight_kg:
                typeof exam.weight_kg === "number" ? `${exam.weight_kg} kg` : undefined,
              height_cm:
                typeof exam.height_cm === "number" ? `${exam.height_cm} cm` : undefined,
              bmi: exam.bmi,
            }}
            labels={{
              heart_rate_bpm: "Heart rate (bpm)",
              blood_pressure: "Blood pressure",
              oxygen_saturation: "SpO₂",
              temperature: "Temperature",
              weight_kg: "Weight",
              height_cm: "Height",
              bmi: "BMI",
            }}
          />
        </div>
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            GCS
          </p>
          <FieldGrid
            data={{
              gcs_eye: exam.gcs_eye,
              gcs_verbal: exam.gcs_verbal,
              gcs_motor: exam.gcs_motor,
              gcs_total: exam.gcs_total,
            }}
            labels={{
              gcs_eye: "Eye (E)",
              gcs_verbal: "Verbal (V)",
              gcs_motor: "Motor (M)",
              gcs_total: "Total",
            }}
          />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Neurological examination
          </p>
          {(
            [
              ["Gait", "gait_status", "gait_details"],
              ["Cranial nerves", "cranial_nerves_status", "cranial_nerves_details"],
              ["Fundoscopy", "fundoscopy_status", "fundoscopy_details"],
              ["Motor", "motor_status", "motor_details"],
              ["Sensory", "sensory_status", "sensory_details"],
              ["Cerebellar", "cerebellar_status", "cerebellar_details"],
              ["Reflexes", "reflexes_status", "reflexes_details"],
            ] as const
          ).map(([label, statusKey, detailsKey]) => {
            const status = exam[statusKey] as string | undefined;
            const details = exam[detailsKey] as string | undefined;
            if (!status && !details) return null;
            return (
              <div
                key={statusKey}
                className="flex items-start justify-between gap-4 border-b border-border/40 py-1.5 last:border-0"
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-right text-sm">
                  <span className="font-medium">{status || "—"}</span>
                  {details && (
                    <p className="text-xs text-muted-foreground">{details}</p>
                  )}
                </dd>
              </div>
            );
          })}
        </div>
        <NotesBlock notes={exam.notes} />
      </ReportSection>

      {/* Workup / Plan */}
      <ReportSection title="Workup & Plan">
        {typeof workup.key_diagnostic_question === "string" &&
          workup.key_diagnostic_question && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Key diagnostic question
              </p>
              <p className="mt-1 text-sm">{workup.key_diagnostic_question as string}</p>
            </div>
          )}
        {typeof workup.assessment_summary === "string" && workup.assessment_summary && (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Assessment summary
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm">
              {workup.assessment_summary as string}
            </p>
          </div>
        )}
        {typeof workup.treatment_changes === "string" && workup.treatment_changes && (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Treatment changes
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm">
              {workup.treatment_changes as string}
            </p>
          </div>
        )}
        {typeof workup.workup_notes === "string" && workup.workup_notes && (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Workup notes
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm">
              {workup.workup_notes as string}
            </p>
          </div>
        )}
        {typeof workup.pending_investigations === "string" &&
          workup.pending_investigations && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pending investigations
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm">
                {workup.pending_investigations as string}
              </p>
            </div>
          )}
        {Array.isArray(workup.investigation_results) &&
          workup.investigation_results.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Investigation results
              </p>
              <ul className="space-y-2">
                {(workup.investigation_results as Array<Record<string, unknown>>).map(
                  (r, idx) => (
                    <li
                      key={idx}
                      className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                    >
                      <p className="font-medium">
                        {(r.name as string) || "Investigation"}{" "}
                        <span className="text-xs text-muted-foreground">
                          · {(r.result as string) || "—"}
                        </span>
                      </p>
                      {typeof r.interpretation === "string" && r.interpretation && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {r.interpretation}
                        </p>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        {Array.isArray(workup.prescriptions) && workup.prescriptions.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Prescriptions
            </p>
            <ul className="space-y-2">
              {(workup.prescriptions as Array<Record<string, unknown>>).map((p, idx) => (
                <li
                  key={(p.id as string) || idx}
                  className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                >
                  <p className="font-medium">
                    {(p.medication_name as string) || "—"}{" "}
                    {p.dosage ? (
                      <span className="text-muted-foreground">
                        · {p.dosage as string}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[
                      p.frequency as string,
                      p.route as string,
                      p.duration_value
                        ? `${p.duration_value} ${p.duration_unit || ""}`
                        : undefined,
                      p.category ? `[${p.category as string}]` : undefined,
                      p.status ? `(${p.status as string})` : undefined,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {typeof p.indication === "string" && p.indication && (
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      {p.indication}
                    </p>
                  )}
                  {typeof p.special_instructions === "string" &&
                    p.special_instructions && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.special_instructions}
                      </p>
                    )}
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Prescribed by {(p.prescriber_name as string) || "—"} ·{" "}
                    {formatDate(p.prescribed_date)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ReportSection>

      {/* Follow-up */}
      <ReportSection title="Follow-up Plan">
        <Field label="Date" value={formatDate(followUp.follow_up_date)} />
        <Field label="Time" value={followUp.follow_up_time} />
        <Field label="Type" value={followUp.follow_up_type} />
        <Field label="Clinician" value={followUp.follow_up_clinician} />
        {typeof followUp.follow_up_purpose === "string" && followUp.follow_up_purpose && (
          <div className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Purpose</p>
            <p className="whitespace-pre-wrap">{followUp.follow_up_purpose as string}</p>
          </div>
        )}
        {typeof followUp.safety_counselling === "string" && followUp.safety_counselling && (
          <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <p className="mb-1 font-medium">Safety counselling</p>
            <p className="whitespace-pre-wrap">{followUp.safety_counselling as string}</p>
          </div>
        )}
      </ReportSection>

      {/* Clinician free-text notes */}
      {typeof assessment.clinician_notes === "string" && assessment.clinician_notes && (
        <ReportSection title="Clinician Notes">
          <p className="whitespace-pre-wrap text-sm">{assessment.clinician_notes}</p>
        </ReportSection>
      )}

      {/* Full generated note */}
      {note ? (
        <div>
          <h2 className="mb-2 text-base font-semibold">Generated Clinic Note</h2>
          <NoteDisplay content={note} />
        </div>
      ) : (
        <ReportSection title="Generated Clinic Note">
          <EmptyState text="No clinic note has been generated for this encounter." />
        </ReportSection>
      )}

      {/* Amendment history */}
      <ReportSection
        title={`Amendment History (${assessment.amendments?.length || 0})`}
      >
        {!assessment.amendments || assessment.amendments.length === 0 ? (
          <EmptyState text="No amendments recorded since this assessment was completed." />
        ) : (
          <ul className="space-y-2">
            {assessment.amendments.map((a, idx) => (
              <li
                key={idx}
                className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm"
              >
                <p className="font-medium">
                  {a.clinician_name || "Clinician"}{" "}
                  <span className="text-xs text-muted-foreground">
                    · {formatDateTime(a.created_at)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </ReportSection>
    </div>
  );
}
