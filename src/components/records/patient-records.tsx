"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  ExternalLink,
  FileText,
  Hash,
  Plus,
  Search,
  SearchX,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDate } from "@/lib/utils";
import {
  ASSESSMENT_STATUS_BADGE_STYLES,
  assessmentReference as formatAssessmentReference,
  assessmentStatusLabel,
  deriveAssessmentStatus,
  patientDisplayId as formatEncounterPatientId,
} from "@/lib/assessment";
import type { RecordPatient } from "@/app/(dashboard)/records/page";

// --- helpers ----------------------------------------------------------------

type PatientEncounter = RecordPatient["encounters"][number];

function patientName(p: RecordPatient) {
  return `${p.first_name} ${p.last_name}`;
}

function patientId(p: RecordPatient) {
  return formatEncounterPatientId({ patient: p });
}

function assessmentRef(id: string) {
  return formatAssessmentReference(id);
}

function age(dob: string | null): string {
  if (!dob) return "—";
  const diff = Date.now() - new Date(dob).getTime();
  return `${Math.floor(diff / 31_557_600_000)}`;
}

function questionnaireStatus(enc: PatientEncounter): string {
  if (!enc.questionnaire_tokens || enc.questionnaire_tokens.length === 0)
    return "Not sent";
  const completed = enc.questionnaire_tokens.some((t) => t.used_at !== null);
  return completed ? "Completed" : "Pending";
}

function latestEncounterDate(p: RecordPatient): string | null {
  if (p.encounters.length === 0) return null;
  const sorted = [...p.encounters].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  return sorted[0].updated_at;
}

function firstEncounterDate(p: RecordPatient): string | null {
  if (p.encounters.length === 0) return null;
  const sorted = [...p.encounters].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return sorted[0].created_at;
}

function allNotes(p: RecordPatient) {
  return p.encounters
    .flatMap((enc) =>
      enc.generated_notes.map((note) => ({
        ...note,
        encounter_id: enc.id,
        encounter_status: enc.status,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

function notePreview(content: string, maxLen = 100) {
  const plain = content.replace(/[#*_>\-`]/g, "").trim();
  return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain;
}

// --- main component ---------------------------------------------------------

export function PatientRecords({
  patients,
  clinicianName,
}: {
  patients: RecordPatient[];
  clinicianName: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return patients;
    return patients.filter((p) => {
      const name = patientName(p).toLowerCase();
      const pid = patientId(p).toLowerCase();
      const fullPid = p.id.toLowerCase();
      const encRefs = p.encounters.map((e) => e.id.toLowerCase());
      const encRefShorts = p.encounters.map((e) =>
        assessmentRef(e.id).toLowerCase()
      );
      return (
        name.includes(normalizedQuery) ||
        pid.includes(normalizedQuery) ||
        fullPid.includes(normalizedQuery) ||
        encRefs.some((r) => r.includes(normalizedQuery)) ||
        encRefShorts.some((r) => r.includes(normalizedQuery))
      );
    });
  }, [patients, normalizedQuery]);

  const selected = useMemo(
    () => patients.find((p) => p.id === selectedId) ?? null,
    [patients, selectedId]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <div className="flex flex-col gap-4 border-b border-border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-semibold tracking-tight">
            Patient Records
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review patient history, assessments, and previous notes
          </p>
        </div>
        <Link href="/encounters/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Split layout */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left panel — patient list */}
        <div
          className={cn(
            "flex w-full flex-col border-b border-border bg-card lg:w-[380px] lg:border-b-0 lg:border-r",
            selected && "hidden lg:flex"
          )}
        >
          {/* Search */}
          <div className="border-b border-border px-4 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                placeholder="Search by patient name, ID, or assessment ref"
                aria-label="Search patients"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                <SearchX className="h-5 w-5 text-muted-foreground" />
                {patients.length === 0 && !normalizedQuery ? (
                  <>
                    <p className="text-sm font-medium">No patients yet</p>
                    <p className="text-xs text-muted-foreground">
                      New patient records will appear here after assessments are created.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">No patients found</p>
                    <p className="text-xs text-muted-foreground">
                      Try a different search term.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((p) => {
                  const latest = latestEncounterDate(p);
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => setSelectedId(p.id)}
                        className={cn(
                          "flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-accent/60",
                          selectedId === p.id && "bg-accent"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {patientName(p)}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {p.encounters.length}{" "}
                            {p.encounters.length === 1
                              ? "assessment"
                              : "assessments"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>ID: {patientId(p)}</span>
                          {p.date_of_birth && (
                            <span>Age {age(p.date_of_birth)}</span>
                          )}
                        </div>
                        {latest && (
                          <span className="text-xs text-muted-foreground">
                            Latest: {formatDate(latest)}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right panel — patient file */}
        <div className="flex-1 overflow-y-auto bg-background">
          {selected ? (
            <PatientFile
              patient={selected}
              clinicianName={clinicianName}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Select a patient</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Choose a patient from the list to view their record, linked
                assessments, and previous notes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- patient file panel -----------------------------------------------------

function PatientFile({
  patient,
  clinicianName,
  onBack,
}: {
  patient: RecordPatient;
  clinicianName: string;
  onBack: () => void;
}) {
  const first = firstEncounterDate(patient);
  const latest = latestEncounterDate(patient);
  const notes = allNotes(patient);
  const sortedEncounters = [...patient.encounters].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const latestEncounter = sortedEncounters[0] ?? null;

  return (
    <div className="space-y-6 p-6">
      {/* Mobile back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </button>

      {/* Section A — Patient Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Patient Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow icon={User} label="Name" value={patientName(patient)} />
            <InfoRow icon={Hash} label="Patient ID" value={patientId(patient)} />
            <InfoRow
              icon={Calendar}
              label="Date of Birth"
              value={
                patient.date_of_birth
                  ? `${formatDate(patient.date_of_birth)} (Age ${age(patient.date_of_birth)})`
                  : "—"
              }
            />
            <InfoRow
              label="Sex at Birth"
              value={
                patient.sex
                  ? patient.sex.charAt(0).toUpperCase() + patient.sex.slice(1)
                  : "—"
              }
            />
            <InfoRow
              label="First Visit"
              value={first ? formatDate(first) : "—"}
            />
            <InfoRow
              label="Latest Visit"
              value={latest ? formatDate(latest) : "—"}
            />
            <InfoRow
              icon={ClipboardList}
              label="Total Assessments"
              value={String(patient.encounters.length)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section B — Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/encounters/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </Link>
        {latestEncounter && (
          <Link href={`/encounters/${latestEncounter.id}/intake`}>
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4" />
              Open Latest Assessment
            </Button>
          </Link>
        )}
        {notes.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              document
                .getElementById("patient-notes-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <FileText className="h-4 w-4" />
            View Previous Notes
          </Button>
        )}
      </div>

      {/* Section C — Patient History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Patient History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatBlock
              label="First Recorded Visit"
              value={first ? formatDate(first) : "—"}
            />
            <StatBlock
              label="Most Recent Assessment"
              value={latest ? formatDate(latest) : "—"}
            />
            <StatBlock
              label="Total Assessments"
              value={String(patient.encounters.length)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Assessments / Notes */}
      <Tabs defaultValue="assessments">
        <TabsList>
          <TabsTrigger value="assessments">
            Assessments ({patient.encounters.length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            Previous Notes ({notes.length})
          </TabsTrigger>
        </TabsList>

        {/* Section D — Assessments */}
        <TabsContent value="assessments">
          <Card>
            <CardContent className="pt-6">
              {sortedEncounters.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No assessments on record.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Clinician</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Questionnaire</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedEncounters.map((enc) => (
                        <TableRow key={enc.id}>
                          <TableCell className="font-mono text-xs">
                            {assessmentRef(enc.id)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(enc.created_at)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {clinicianName}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const status = deriveAssessmentStatus({
                                id: enc.id,
                                status: enc.status,
                                current_step: enc.current_step,
                                questionnaire_tokens: enc.questionnaire_tokens,
                              });

                              return (
                                <Badge
                                  variant="secondary"
                                  className={cn(ASSESSMENT_STATUS_BADGE_STYLES[status])}
                                >
                                  {assessmentStatusLabel(status)}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {questionnaireStatus(enc)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/encounters/${enc.id}/intake`}>
                                <Button size="xs" variant="outline">
                                  Open
                                </Button>
                              </Link>
                              {enc.status === "completed" && (
                                <Link href={`/encounters/${enc.id}/output`}>
                                  <Button size="xs" variant="ghost">
                                    Output
                                  </Button>
                                </Link>
                              )}
                              {enc.generated_notes.length > 0 && (
                                <Link href={`/encounters/${enc.id}/note`}>
                                  <Button size="xs" variant="ghost">
                                    Note
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section E — Previous Notes */}
        <TabsContent value="notes">
          <div id="patient-notes-section" className="space-y-3">
            {notes.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-sm text-muted-foreground">
                    No notes on record for this patient.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">
                            {formatDate(note.created_at)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            v{note.version}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Assessment {assessmentRef(note.encounter_id)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notePreview(note.content, 160)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Link href={`/encounters/${note.encounter_id}/note`}>
                          <Button size="xs" variant="outline">
                            Open Note
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- small UI pieces --------------------------------------------------------

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
