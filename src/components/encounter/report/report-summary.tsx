"use client";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShieldCheck, CalendarClock, Pill } from "lucide-react";
import type { Encounter, ClinicianAssessment } from "@/types";
import {
  ReportSection,
  Field,
  formatDate,
  formatDateTime,
  calculateAge,
  EmptyState,
} from "./report-shared";
import { assessmentReference } from "@/lib/assessment";

interface ReportSummaryProps {
  encounter: Encounter;
  assessment: ClinicianAssessment;
}

export function ReportSummary({ encounter, assessment }: ReportSummaryProps) {
  const patient = encounter.patient;
  const age = calculateAge(patient?.date_of_birth);

  // Derive red-flag status
  const redFlags = (assessment.red_flags || {}) as Record<string, unknown>;
  const redFlagKeys = Object.entries(redFlags).filter(
    ([k, v]) => k !== "notes" && v === true
  );
  const anyRedFlag = redFlagKeys.length > 0;

  // Key pattern facts
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const headacheDays = pattern.headache_days_per_month as number | undefined;
  const severeDays = pattern.severe_days_per_month as number | undefined;
  const migraineLikeDays = pattern.migraine_like_days_per_month as number | undefined;

  // Aura summary
  const aura = (assessment.aura || {}) as Record<string, unknown>;
  const hasAura = Object.entries(aura).some(
    ([k, v]) =>
      k !== "notes" &&
      k !== "aura_duration_minutes" &&
      typeof v === "boolean" &&
      v === true
  );

  // Triggers summary
  const triggers = (assessment.triggers || {}) as Record<string, unknown>;
  const activeTriggers = Object.entries(triggers)
    .filter(([k, v]) => k !== "triggers_notes" && v === true)
    .map(([k]) => k.replace(/_/g, " "));

  // Workup / plan
  const workup = (assessment.workup_data || {}) as Record<string, unknown>;
  const assessmentSummary = workup.assessment_summary as string | undefined;
  const treatmentChanges = workup.treatment_changes as string | undefined;
  const prescriptions = (workup.prescriptions as Array<Record<string, unknown>>) || [];

  // Follow up
  const followUp = (assessment.follow_up || {}) as Record<string, unknown>;
  const fuDate = followUp.follow_up_date as string | undefined;
  const fuTime = followUp.follow_up_time as string | undefined;
  const fuType = followUp.follow_up_type as string | undefined;
  const fuPurpose = followUp.follow_up_purpose as string | undefined;
  const safetyCounselling = followUp.safety_counselling as string | undefined;

  // Amendments
  const amendments = assessment.amendments || [];

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      {/* Patient */}
      <ReportSection title="Patient">
        <Field label="Name" value={patient ? `${patient.first_name} ${patient.last_name}` : "—"} />
        <Field label="Date of birth" value={formatDate(patient?.date_of_birth)} />
        <Field label="Age" value={age !== null ? `${age} years` : undefined} />
        <Field label="Sex" value={patient?.sex} />
        <Field label="MRN" value={patient?.mrn || undefined} />
        <Field
          label="Assessment ref"
          value={assessmentReference(encounter.id)}
          mono
        />
        <Field label="Consultation date" value={formatDate(encounter.created_at)} />
      </ReportSection>

      {/* Red flag status */}
      <ReportSection
        title="Red Flag Status"
        action={
          anyRedFlag ? (
            <Badge className="bg-rose-100 text-rose-800">Present</Badge>
          ) : (
            <Badge className="bg-emerald-100 text-emerald-800">None</Badge>
          )
        }
      >
        {anyRedFlag ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{redFlagKeys.length} red flag(s) identified</AlertTitle>
            <AlertDescription>
              {redFlagKeys
                .map(([k]) => k.replace(/_/g, " "))
                .join(", ")}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            <span>All 16 red flag items screened negative.</span>
          </div>
        )}
        {typeof redFlags.notes === "string" && redFlags.notes ? (
          <p className="text-xs text-muted-foreground italic">{redFlags.notes}</p>
        ) : null}
      </ReportSection>

      {/* Key headache facts */}
      <ReportSection title="Headache Burden">
        <Field label="Headache days / month" value={headacheDays} />
        <Field label="Severe days / month" value={severeDays} />
        <Field label="Migraine-like days / month" value={migraineLikeDays} />
        <Field label="Has aura features" value={hasAura} />
        <Field
          label="Aura duration"
          value={
            typeof aura.aura_duration_minutes === "number"
              ? `${aura.aura_duration_minutes} min`
              : undefined
          }
        />
        {activeTriggers.length > 0 && (
          <Field label="Triggers" value={activeTriggers} />
        )}
      </ReportSection>

      {/* Working diagnosis / summary */}
      <ReportSection title="Clinical Impression">
        {assessmentSummary ? (
          <p className="whitespace-pre-wrap text-sm">{assessmentSummary}</p>
        ) : (
          <EmptyState text="No assessment summary recorded." />
        )}
        {typeof workup.key_diagnostic_question === "string" &&
        workup.key_diagnostic_question ? (
          <p className="mt-3 text-xs italic text-muted-foreground">
            Key question: {workup.key_diagnostic_question}
          </p>
        ) : null}
      </ReportSection>

      {/* Treatment changes + prescriptions */}
      <ReportSection title="Treatment Plan" className="lg:col-span-2">
        {treatmentChanges ? (
          <p className="whitespace-pre-wrap text-sm">{treatmentChanges}</p>
        ) : (
          <EmptyState text="No treatment changes recorded." />
        )}
        {prescriptions.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Pill className="h-3 w-3" />
              Prescriptions ({prescriptions.length})
            </p>
            <ul className="space-y-2">
              {prescriptions.map((p, idx) => (
                <li
                  key={(p.id as string) || idx}
                  className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                >
                  <p className="font-medium">
                    {(p.medication_name as string) || "—"}{" "}
                    {p.dosage ? (
                      <span className="text-muted-foreground">· {p.dosage as string}</span>
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
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {typeof p.indication === "string" && p.indication && (
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      {p.indication}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </ReportSection>

      {/* Follow up */}
      <ReportSection
        title="Follow-up"
        action={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
      >
        <Field label="Date" value={formatDate(fuDate)} />
        <Field label="Time" value={fuTime} />
        <Field label="Type" value={fuType} />
        <Field label="Clinician" value={followUp.follow_up_clinician} />
        {fuPurpose && (
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Purpose: </span>
            {fuPurpose}
          </p>
        )}
        {safetyCounselling && (
          <Alert className="mt-3 border-amber-200 bg-amber-50 text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Safety netting</AlertTitle>
            <AlertDescription className="text-amber-900/90">
              {safetyCounselling}
            </AlertDescription>
          </Alert>
        )}
      </ReportSection>

      {/* Amendments history */}
      <ReportSection title={`Amendments (${amendments.length})`}>
        {amendments.length === 0 ? (
          <EmptyState text="No amendments recorded." />
        ) : (
          <ul className="space-y-2">
            {amendments.map((a, idx) => (
              <li
                key={idx}
                className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs"
              >
                <p className="font-medium">
                  {a.clinician_name || "Clinician"}{" "}
                  <span className="text-muted-foreground">
                    · {formatDateTime(a.created_at)}
                  </span>
                </p>
                <p className="mt-1 text-muted-foreground">{a.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </ReportSection>

    </div>
  );
}
