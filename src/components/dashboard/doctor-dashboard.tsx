"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Plus,
  Search,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  encounter_type: "initial" | "follow_up";
  current_step: string | null;
  updated_at: string;
  created_at: string;
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

type PriorityStatus = "red_flagged" | "response_received" | "in_assessment" | "note_drafted";

const PRIORITY_ORDER: PriorityStatus[] = [
  "red_flagged",
  "response_received",
  "in_assessment",
  "note_drafted",
];

const STATUS_ACTIONS: Record<PriorityStatus, { label: string; href: (id: string, step: string, isFollowUp: boolean) => string }> = {
  red_flagged: {
    label: "Review Now",
    href: (id, _step, isFollowUp) => `/encounters/${id}/${isFollowUp ? "red-flag-review" : "red-flags"}`,
  },
  response_received: {
    label: "Review Intake",
    href: (id, _step, isFollowUp) => `/encounters/${id}/${isFollowUp ? "review" : "intake"}`,
  },
  in_assessment: {
    label: "Continue",
    href: (id, step, isFollowUp) => `/encounters/${id}/${step || (isFollowUp ? "review" : "intake")}`,
  },
  note_drafted: {
    label: "Open Note",
    href: (id, _step, isFollowUp) => `/encounters/${id}/${isFollowUp ? "fu-letter" : "note"}`,
  },
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DoctorDashboard({ encounters }: { encounters: DashboardEncounter[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const priorityEncounters = useMemo(
    () =>
      encounters.filter((encounter) => {
        const status = deriveAssessmentStatus(encounter);
        return PRIORITY_ORDER.includes(status as PriorityStatus);
      }),
    [encounters]
  );

  const searchFilteredEncounters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return priorityEncounters;

    return priorityEncounters.filter((encounter) => {
      const name = patientDisplayName(encounter).toLowerCase();
      const patientId = patientDisplayId(encounter).toLowerCase();
      const fullPatientId = encounter.patient?.id.toLowerCase() ?? "";
      const ref = assessmentReference(encounter.id).toLowerCase();
      const fullRef = encounter.id.toLowerCase();

      return (
        name.includes(query) ||
        patientId.includes(query) ||
        fullPatientId.includes(query) ||
        ref.includes(query) ||
        fullRef.includes(query)
      );
    });
  }, [priorityEncounters, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<PriorityStatus, number> = {
      red_flagged: 0,
      response_received: 0,
      in_assessment: 0,
      note_drafted: 0,
    };

    for (const encounter of priorityEncounters) {
      const status = deriveAssessmentStatus(encounter) as PriorityStatus;
      counts[status] += 1;
    }

    return counts;
  }, [priorityEncounters]);

  const latestOpenedPatient = useMemo(
    () => searchFilteredEncounters.find((encounter) => encounter.patient)?.patient,
    [searchFilteredEncounters]
  );

  return (
    <div className="space-y-5 p-4 md:p-6 lg:space-y-6 lg:p-8">
      <section className="rounded-lg border border-border bg-card px-4 py-4 md:px-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">Dashboard</h1>
            <Button asChild className="h-10 md:h-11">
              <Link href="/encounters/new">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create New Assessment</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight md:text-lg">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Start from urgent cases and continue active assessments.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card px-4 py-3 md:px-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-11 pl-9"
            placeholder="Search patient, ID, or assessment ref"
            aria-label="Search patient, ID, or assessment ref"
          />
        </div>
      </section>

      <section className="-mx-1 overflow-x-auto px-1 md:mx-0 md:overflow-visible md:px-0">
        <div className="flex gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
          <Card className="w-[180px] shrink-0 border-rose-200/70 md:w-auto">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-sm font-medium">Red Flagged</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold md:text-2xl">{statusCounts.red_flagged}</p>
              <p className="text-xs text-muted-foreground">Needs urgent review</p>
            </CardContent>
          </Card>

          <Card className="w-[180px] shrink-0 md:w-auto">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-sm font-medium">Response Received</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold md:text-2xl">{statusCounts.response_received}</p>
              <p className="text-xs text-muted-foreground">Ready for intake review</p>
            </CardContent>
          </Card>

          <Card className="w-[180px] shrink-0 md:w-auto">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-sm font-medium">In Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold md:text-2xl">{statusCounts.in_assessment}</p>
              <p className="text-xs text-muted-foreground">Assessment in progress</p>
            </CardContent>
          </Card>

          <Card className="w-[180px] shrink-0 md:w-auto">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-sm font-medium">Draft Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold md:text-2xl">{statusCounts.note_drafted}</p>
              <p className="text-xs text-muted-foreground">Notes awaiting final review</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="order-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Assessments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchFilteredEncounters.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                No active assessments match your search.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                {searchFilteredEncounters.map((encounter) => {
                  const status = deriveAssessmentStatus(encounter) as PriorityStatus;
                  const isFollowUp = encounter.encounter_type === "follow_up";
                  const action = STATUS_ACTIONS[status];
                  const actionHref = action.href(encounter.id, encounter.current_step || "intake", isFollowUp);

                  return (
                    <div
                      key={encounter.id}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold">{patientDisplayName(encounter)}</p>
                              {isFollowUp && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs shrink-0">
                                  Follow-up
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Patient ID: {patientDisplayId(encounter)}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={ASSESSMENT_STATUS_BADGE_STYLES[status]}
                          >
                            {assessmentStatusLabel(status)}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Assessment Ref: {assessmentReference(encounter.id)}</p>
                          <p>Last updated: {formatUpdatedAt(encounter.updated_at)}</p>
                        </div>

                        <Button asChild className="h-11 w-full md:w-auto">
                          <Link href={actionHref}>{action.label}</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="order-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="h-11 w-full justify-start" asChild>
              <Link href="/workflow">
                <Workflow className="h-4 w-4" />
                Assessment Workflow
              </Link>
            </Button>
            <Button variant="outline" className="h-11 w-full justify-start" asChild>
              <Link href="/records">
                <FolderOpen className="h-4 w-4" />
                Patient Records
              </Link>
            </Button>

            {latestOpenedPatient ? (
              <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
                <p className="text-xs text-muted-foreground">Latest opened patient</p>
                <p className="text-sm font-medium">
                  {latestOpenedPatient.first_name} {latestOpenedPatient.last_name}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
