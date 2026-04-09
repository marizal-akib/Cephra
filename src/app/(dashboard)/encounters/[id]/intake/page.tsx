"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEncounterContext } from "../layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { QUESTIONS } from "@/lib/schemas/questionnaire";

type SummarySection = {
  heading: string;
  items: string[];
  tone?: "warning";
};

const OPTION_LABELS: Record<string, Record<string, string>> = (() => {
  const map: Record<string, Record<string, string>> = {};
  for (const q of QUESTIONS) {
    if (q.options) {
      map[q.id] = Object.fromEntries(q.options.map((o) => [o.value, o.label]));
    }
  }
  return map;
})();

function labelFor(qid: string, value: unknown): string {
  if (typeof value !== "string") return String(value);
  return OPTION_LABELS[qid]?.[value] ?? value;
}

function asString(v: unknown): string | null {
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number") return String(v);
  return null;
}

function isTrue(v: unknown): boolean {
  return v === true || v === "true";
}

function buildQuestionnaireSummary(
  responses: Record<string, unknown>
): SummarySection[] {
  const sections: SummarySection[] = [];

  // Demographics
  const demo: string[] = [];
  const age = asString(responses.age);
  if (age) demo.push(`${age} y/o`);
  const sex = asString(responses.sex);
  if (sex) demo.push(labelFor("sex", sex));
  const preg = asString(responses.pregnancy_status);
  if (preg && preg !== "not_applicable" && preg !== "no") {
    demo.push(labelFor("pregnancy_status", preg));
  }
  if (demo.length) sections.push({ heading: "Demographics", items: [demo.join(" · ")] });

  // Headache burden
  const burden: string[] = [];
  const days = asString(responses.headache_days_per_month);
  if (days) {
    const severe = asString(responses.severe_days_per_month);
    burden.push(
      severe
        ? `${days} headache days/month (${severe} severe)`
        : `${days} headache days/month`
    );
  }
  const dur = asString(responses.headache_duration);
  if (dur) burden.push(`Typical duration: ${labelFor("headache_duration", dur)}`);
  const sev = asString(responses.pain_severity);
  if (sev) burden.push(`Worst severity: ${sev}/10`);
  if (burden.length) sections.push({ heading: "Headache burden", items: burden });

  // Migraine features
  const migraineMap: Array<[string, string]> = [
    ["nausea", "nausea"],
    ["vomiting", "vomiting"],
    ["light_sensitivity", "photophobia"],
    ["sound_sensitivity", "phonophobia"],
    ["visual_disturbances", "visual aura"],
    ["numbness_tingling", "sensory aura"],
    ["worse_with_activity", "worse with activity"],
  ];
  const migraine = migraineMap
    .filter(([k]) => isTrue(responses[k]))
    .map(([, label]) => label);
  if (migraine.length)
    sections.push({ heading: "Migrainous features", items: [migraine.join(", ")] });

  // Trigeminal autonomic features
  const tac: string[] = [];
  if (isTrue(responses.eye_tearing)) tac.push("ipsilateral lacrimation/redness");
  if (isTrue(responses.nasal_congestion)) tac.push("ipsilateral nasal congestion/rhinorrhea");
  if (tac.length)
    sections.push({ heading: "Autonomic features", items: [tac.join(", ")] });

  // Red flags
  const redFlagMap: Array<[string, string]> = [
    ["sudden_worst_headache", "Thunderclap onset"],
    ["new_weakness", "New weakness/numbness/speech difficulty"],
    ["fever_with_headache", "Fever or unexplained weight loss"],
    ["recent_head_injury", "Recent head injury"],
    ["headache_pattern_change", "Significant pattern change"],
  ];
  const redFlags = redFlagMap
    .filter(([k]) => isTrue(responses[k]))
    .map(([, label]) => label);
  if (redFlags.length)
    sections.push({ heading: "Red flags", items: redFlags, tone: "warning" });

  // Medication overuse risk
  const freq = asString(responses.pain_relief_frequency);
  if (freq === "3-4_per_week" || freq === "daily") {
    sections.push({
      heading: "Medication overuse risk",
      items: [`Analgesic use: ${labelFor("pain_relief_frequency", freq)}`],
      tone: "warning",
    });
  } else if (freq) {
    sections.push({
      heading: "Analgesic use",
      items: [labelFor("pain_relief_frequency", freq)],
    });
  }

  // PMH
  const pmh: string[] = [];
  const pmhCommon = responses.past_medical_history_common;
  if (Array.isArray(pmhCommon) && pmhCommon.length) {
    pmh.push(
      pmhCommon
        .map((v) => labelFor("past_medical_history_common", v))
        .join(", ")
    );
  }
  const pmhNotes = asString(responses.past_medical_history_notes);
  if (pmhNotes) pmh.push(pmhNotes);
  if (pmh.length) sections.push({ heading: "Past medical history", items: pmh });

  // Current medications
  const meds = asString(responses.current_medications);
  if (meds) sections.push({ heading: "Current medications", items: [meds] });

  return sections;
}

export default function IntakePage() {
  const { encounterId, encounter, questionnaireResponse } = useEncounterContext();
  const isInProgress = encounter?.status === "in_progress";
  const hasResponse = !!questionnaireResponse;
  const summarySections = hasResponse
    ? buildQuestionnaireSummary(
        (questionnaireResponse.responses ?? {}) as Record<string, unknown>
      )
    : [];

  const patient = encounter?.patient;
  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : "Patient";
  const patientId = patient?.mrn || patient?.id.slice(0, 8).toUpperCase() || "—";
  const assessmentRef = encounterId.slice(0, 8).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="-ml-2 shrink-0">
            <Link href="/workflow" aria-label="Back to workflow">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold leading-tight">{patientName}</h2>
            <p className="text-sm text-muted-foreground">
              Ref: {assessmentRef}
              {patient?.date_of_birth && (
                <> · DOB: {formatDate(patient.date_of_birth)}</>
              )}
              {patientId !== "—" && <> · ID: {patientId}</>}
            </p>
          </div>
        </div>
        {isInProgress ? (
          <Button asChild className="shrink-0">
            <Link href={`/encounters/${encounterId}/${encounter.current_step || "past-medical-history"}`}>
              Continue Assessment
            </Link>
          </Button>
        ) : (
          <Button asChild className="shrink-0">
            <Link href={`/encounters/${encounterId}/past-medical-history`}>
              Start Assessment
            </Link>
          </Button>
        )}
      </div>

      <Separator />

      {/* Questionnaire status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pre-Consult Questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          {hasResponse ? (
            <div className="flex items-center gap-3">
              <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-800">
                Submitted
              </Badge>
              <span className="text-sm text-muted-foreground">
                Patient has completed and submitted their questionnaire.
                {questionnaireResponse.submitted_at && (
                  <> Submitted {formatDate(questionnaireResponse.submitted_at)}.</>
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Pending</Badge>
              <span className="text-sm text-muted-foreground">
                Patient questionnaire has not been submitted yet, or no
                questionnaire was sent.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {hasResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {summarySections.length === 0 ? (
              <p className="text-muted-foreground">
                The patient has submitted their pre-visit responses. You can
                review them and proceed to the structured clinical assessment.
              </p>
            ) : (
              <div className="space-y-3">
                {summarySections.map((section) => (
                  <div
                    key={section.heading}
                    className={
                      section.tone === "warning"
                        ? "rounded-md border border-amber-200 bg-amber-50 px-3 py-2"
                        : ""
                    }
                  >
                    <div
                      className={
                        section.tone === "warning"
                          ? "text-xs font-semibold uppercase tracking-wide text-amber-900"
                          : "text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      }
                    >
                      {section.heading}
                    </div>
                    <div
                      className={
                        section.tone === "warning"
                          ? "mt-1 text-amber-900"
                          : "mt-1 text-foreground"
                      }
                    >
                      {section.items.length === 1 ? (
                        <p>{section.items[0]}</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-0.5">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!hasResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Once the patient submits their questionnaire, a summary of their
              responses will appear here. You can review, edit, and then proceed
              to the structured clinical assessment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
