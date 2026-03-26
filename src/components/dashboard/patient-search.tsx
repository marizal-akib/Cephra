"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import {
  ASSESSMENT_STATUS_BADGE_STYLES,
  assessmentReference,
  assessmentStatusLabel,
  deriveAssessmentStatus,
  patientDisplayId,
  patientDisplayName,
  type EncounterStatus,
} from "@/lib/assessment";

type DashboardEncounter = {
  id: string;
  status: EncounterStatus;
  current_step: string | null;
  updated_at: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string | null;
  } | null;
  questionnaire_tokens: {
    used_at: string | null;
  }[] | null;
};

export function PatientSearch({ encounters }: { encounters: DashboardEncounter[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return encounters.filter((encounter) => {
      const patientName = patientDisplayName(encounter).toLowerCase();
      const patientId = patientDisplayId(encounter).toLowerCase();
      const fullPatientId = encounter.patient?.id.toLowerCase() ?? "";
      const assessmentRef = assessmentReference(encounter.id).toLowerCase();
      const fullAssessmentRef = encounter.id.toLowerCase();

      return (
        patientName.includes(normalizedQuery) ||
        patientId.includes(normalizedQuery) ||
        fullPatientId.includes(normalizedQuery) ||
        assessmentRef.includes(normalizedQuery) ||
        fullAssessmentRef.includes(normalizedQuery)
      );
    });
  }, [encounters, normalizedQuery]);

  const searchSuggestions = useMemo(() => {
    const pool = new Set<string>();
    for (const encounter of encounters) {
      pool.add(patientDisplayName(encounter));
      pool.add(patientDisplayId(encounter));
      pool.add(assessmentReference(encounter.id));
    }
    return Array.from(pool);
  }, [encounters]);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="text-base">Patient/Profile Search</CardTitle>
        <div className="space-y-2">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            suggestions={searchSuggestions}
            placeholder="Who do you want to find? Name, patient ID, or assessment reference"
            ariaLabel="Search by patient name, patient ID, or assessment reference"
          />
          <div className="flex flex-wrap gap-2 text-label text-muted-foreground">
            <span className="rounded-full border border-border px-2 py-1">Name</span>
            <span className="rounded-full border border-border px-2 py-1">Patient ID</span>
            <span className="rounded-full border border-border px-2 py-1">Assessment Ref</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!normalizedQuery ? (
          <p className="text-sm text-muted-foreground">
            Start typing to search patient name, patient ID, or assessment reference.
          </p>
        ) : matches.length === 0 ? (
          <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
            <SearchX className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">No matching patients or assessments found</p>
            <p className="text-xs text-muted-foreground">
              Try searching with a full name, patient ID, or assessment reference number.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {matches.slice(0, 6).map((encounter) => {
              const status = deriveAssessmentStatus(encounter);

              return (
                <div
                  key={encounter.id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{patientDisplayName(encounter)}</p>
                    <p className="text-xs text-muted-foreground">
                      Patient ID {patientDisplayId(encounter)} · Assessment Ref{" "}
                      {assessmentReference(encounter.id)}
                    </p>
                  </div>
                  <Badge variant="secondary" className={ASSESSMENT_STATUS_BADGE_STYLES[status]}>
                    {assessmentStatusLabel(status)}
                  </Badge>
                </div>
              );
            })}
            {matches.length > 6 ? (
              <p className="text-xs text-muted-foreground">
                Showing 6 of {matches.length} matching records.
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
