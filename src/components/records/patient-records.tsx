"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  ClipboardList,
  ExternalLink,
  FileText,
  GitCompareArrows,
  Hash,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  SearchX,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const searchSuggestions = useMemo(() => {
    const pool = new Set<string>();
    for (const patient of patients) {
      pool.add(patientName(patient));
      pool.add(patientId(patient));
      for (const encounter of patient.encounters) {
        pool.add(assessmentRef(encounter.id));
      }
    }
    return Array.from(pool);
  }, [patients]);

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
            <SearchInput
              value={query}
              onValueChange={setQuery}
              suggestions={searchSuggestions}
              placeholder="Who do you want to open? Try name, patient ID, or assessment ref"
              ariaLabel="Search patients by name, patient ID, or assessment reference"
            />
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
                    <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                      Clear search
                    </Button>
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

          <div className="sticky bottom-0 border-t border-border bg-card/95 p-3 backdrop-blur lg:hidden">
            <SearchInput
              value={query}
              onValueChange={setQuery}
              suggestions={searchSuggestions}
              placeholder="Search patients from here"
              ariaLabel="Mobile patient search"
            />
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
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const first = firstEncounterDate(patient);
  const latest = latestEncounterDate(patient);
  const notes = allNotes(patient);
  const sortedEncounters = [...patient.encounters].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const latestEncounter = sortedEncounters[0] ?? null;

  async function confirmDelete() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || "Unable to delete patient record.");
        return;
      }
      toast.success("Patient record deleted.");
      setShowDeleteDialog(false);
      onBack();
      router.refresh();
    } catch {
      toast.error("Unable to delete patient record.");
    } finally {
      setDeleting(false);
    }
  }

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
        {patient.encounters.length > 0 && (
          <Link href={`/encounters/new?patient_id=${patient.id}&type=follow_up`}>
            <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <RefreshCw className="h-4 w-4" />
              New Follow-up
            </Button>
          </Link>
        )}
        {latestEncounter && (
          <Link href={`/encounters/${latestEncounter.id}/${(latestEncounter as PatientEncounter & { encounter_type?: string }).encounter_type === "follow_up" ? "review" : "intake"}`}>
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
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Patient
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Patient Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the record for{" "}
              <span className="font-medium text-foreground">
                {patientName(patient)}
              </span>
              ? This action cannot be undone. All assessments, notes, and
              associated data for this patient will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void confirmDelete()}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Patient"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            Notes ({notes.length})
          </TabsTrigger>
          <TabsTrigger value="diary">
            <Activity className="mr-1 h-3.5 w-3.5" />
            Diary
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <GitCompareArrows className="mr-1 h-3.5 w-3.5" />
            Compare
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
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Clinician</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Questionnaire</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedEncounters.map((enc) => {
                        const isFollowUp = enc.encounter_type === "follow_up";
                        const openPath = isFollowUp ? "review" : "intake";
                        const notePath = isFollowUp ? "fu-letter" : "note";

                        return (
                          <TableRow key={enc.id}>
                            <TableCell className="font-mono text-xs">
                              {assessmentRef(enc.id)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={isFollowUp ? "bg-purple-100 text-purple-800 text-xs" : "bg-blue-100 text-blue-800 text-xs"}
                              >
                                {isFollowUp ? "Follow-up" : "Initial"}
                              </Badge>
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
                              {isFollowUp ? "—" : questionnaireStatus(enc)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link href={`/encounters/${enc.id}/${openPath}`}>
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
                                  <Link href={`/encounters/${enc.id}/${notePath}`}>
                                    <Button size="xs" variant="ghost">
                                      Note
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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

        {/* Section F — Headache Diary */}
        <TabsContent value="diary">
          <HeadacheDiary encounters={sortedEncounters} />
        </TabsContent>

        {/* Section G — Visit Comparison */}
        <TabsContent value="comparison">
          <VisitComparison encounters={sortedEncounters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Headache Diary ---------------------------------------------------------

type DiaryEncounter = RecordPatient["encounters"][number];

function getAssessment(enc: DiaryEncounter) {
  return enc.clinician_assessments?.[0] ?? null;
}

function getDiagRun(enc: DiaryEncounter) {
  return enc.diagnostic_runs?.[0] ?? null;
}

function numVal(obj: Record<string, unknown> | null, key: string): number | null {
  if (!obj) return null;
  const v = obj[key];
  return typeof v === "number" ? v : null;
}

function boolList(obj: Record<string, unknown> | null, keys: { key: string; label: string }[]): string[] {
  if (!obj) return [];
  return keys.filter(({ key }) => obj[key] === true).map(({ label }) => label);
}

const SYMPTOM_KEYS = [
  { key: "nausea", label: "Nausea" },
  { key: "vomiting", label: "Vomiting" },
  { key: "photophobia", label: "Photophobia" },
  { key: "phonophobia", label: "Phonophobia" },
  { key: "osmophobia", label: "Osmophobia" },
  { key: "dizziness", label: "Dizziness" },
  { key: "neck_pain", label: "Neck pain" },
];

function TrendArrow({ current, previous, lowerIsBetter = true }: { current: number | null; previous: number | null; lowerIsBetter?: boolean }) {
  if (current === null || previous === null) return null;
  if (current === previous) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  const improved = lowerIsBetter ? current < previous : current > previous;
  return improved
    ? <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
    : <TrendingUp className="h-3.5 w-3.5 text-red-500" />;
}

function HeadacheDiary({ encounters }: { encounters: DiaryEncounter[] }) {
  // Sort chronologically (oldest first) for timeline
  const chrono = useMemo(
    () => [...encounters].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [encounters]
  );

  if (chrono.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">
            No assessment data to display. Start an assessment to begin tracking.
          </p>
        </CardContent>
      </Card>
    );
  }

  const latest = chrono[chrono.length - 1];
  const latestAssessment = getAssessment(latest);
  const latestDays = numVal(latestAssessment?.pattern ?? null, "headache_days_per_month");
  const latestSeverity = numVal(latestAssessment?.pain ?? null, "peak_intensity");

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBlock label="Total Visits" value={String(chrono.length)} />
        <StatBlock
          label="Date Range"
          value={chrono.length >= 2
            ? `${formatDate(chrono[0].created_at)} – ${formatDate(chrono[chrono.length - 1].created_at)}`
            : formatDate(chrono[0].created_at)}
        />
        <StatBlock label="Latest HA Days/Mo" value={latestDays !== null ? String(latestDays) : "—"} />
        <StatBlock label="Latest Severity" value={latestSeverity !== null ? `${latestSeverity}/10` : "—"} />
      </div>

      {/* Timeline cards (newest first for display) */}
      <div className="relative space-y-3">
        {[...chrono].reverse().map((enc, idx) => {
          const reverseIdx = chrono.length - 1 - idx;
          const prev = reverseIdx > 0 ? chrono[reverseIdx - 1] : null;
          const assessment = getAssessment(enc);
          const prevAssessment = prev ? getAssessment(prev) : null;
          const diagRun = getDiagRun(enc);

          const days = numVal(assessment?.pattern ?? null, "headache_days_per_month");
          const prevDays = numVal(prevAssessment?.pattern ?? null, "headache_days_per_month");
          const severity = numVal(assessment?.pain ?? null, "peak_intensity");
          const prevSeverity = numVal(prevAssessment?.pain ?? null, "peak_intensity");
          const duration = numVal(assessment?.pattern ?? null, "duration_hours") ?? numVal(assessment?.pattern ?? null, "duration_minutes");
          const symptoms = boolList(assessment?.symptoms ?? null, SYMPTOM_KEYS);
          const medDays = (() => {
            const meds = assessment?.medications ?? null;
            if (!meds) return null;
            const t = numVal(meds, "triptan_days_per_month") ?? 0;
            const n = numVal(meds, "nsaid_days_per_month") ?? 0;
            const p = numVal(meds, "paracetamol_days_per_month") ?? 0;
            const o = numVal(meds, "opioid_days_per_month") ?? 0;
            const total = t + n + p + o;
            return total > 0 ? total : null;
          })();
          const redFlagged = diagRun?.red_flag_result?.flagged === true;
          const topDiagnosis = (() => {
            const ranking = diagRun?.phenotype_ranking;
            if (!Array.isArray(ranking) || ranking.length === 0) return null;
            const top = ranking[0] as { label?: string; confidence?: string } | null;
            return top?.label ? `${top.label}${top.confidence ? ` (${top.confidence})` : ""}` : null;
          })();

          return (
            <Card key={enc.id} className={cn(redFlagged && "border-red-200")}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatDate(enc.created_at)}</span>
                    <Badge variant="outline" className="text-xs font-mono">{assessmentRef(enc.id)}</Badge>
                    {redFlagged && (
                      <Badge className="border-red-200 bg-red-50 text-red-700 text-xs">Red Flagged</Badge>
                    )}
                  </div>
                  <Link href={`/encounters/${enc.id}/intake`}>
                    <Button size="xs" variant="ghost">Open</Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">HA days/mo:</span>
                    <span className="font-medium">{days ?? "—"}</span>
                    <TrendArrow current={days} previous={prevDays} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Severity:</span>
                    <span className="font-medium">{severity !== null ? `${severity}/10` : "—"}</span>
                    <TrendArrow current={severity} previous={prevSeverity} />
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration: </span>
                    <span className="font-medium">{duration !== null ? `${duration}h` : "—"}</span>
                  </div>
                  {medDays !== null && (
                    <div>
                      <span className="text-muted-foreground">Med days/mo: </span>
                      <span className="font-medium">{medDays}</span>
                    </div>
                  )}
                </div>

                {symptoms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {symptoms.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                )}

                {topDiagnosis && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Impression: <span className="font-medium text-foreground">{topDiagnosis}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// --- Visit Comparison -------------------------------------------------------

function VisitComparison({ encounters }: { encounters: DiaryEncounter[] }) {
  const chrono = useMemo(
    () => [...encounters].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [encounters]
  );

  const [leftId, setLeftId] = useState<string>(chrono.length >= 2 ? chrono[chrono.length - 2].id : "");
  const [rightId, setRightId] = useState<string>(chrono.length >= 1 ? chrono[chrono.length - 1].id : "");

  if (chrono.length < 2) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">
            At least two visits are needed for comparison. This patient has {chrono.length} assessment{chrono.length !== 1 ? "s" : ""}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const left = chrono.find((e) => e.id === leftId);
  const right = chrono.find((e) => e.id === rightId);
  const leftA = left ? getAssessment(left) : null;
  const rightA = right ? getAssessment(right) : null;
  const leftDiag = left ? getDiagRun(left) : null;
  const rightDiag = right ? getDiagRun(right) : null;

  function CompareRow({ label, leftVal, rightVal, lowerIsBetter }: {
    label: string;
    leftVal: string | null;
    rightVal: string | null;
    lowerIsBetter?: boolean;
  }) {
    const lNum = leftVal !== null && leftVal !== "—" ? parseFloat(leftVal) : null;
    const rNum = rightVal !== null && rightVal !== "—" ? parseFloat(rightVal) : null;

    let changeIcon = null;
    if (lNum !== null && rNum !== null && !isNaN(lNum) && !isNaN(rNum)) {
      if (rNum < lNum) changeIcon = <ArrowDown className={cn("h-3.5 w-3.5", lowerIsBetter !== false ? "text-emerald-600" : "text-red-500")} />;
      else if (rNum > lNum) changeIcon = <ArrowUp className={cn("h-3.5 w-3.5", lowerIsBetter !== false ? "text-red-500" : "text-emerald-600")} />;
      else changeIcon = <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
    }

    return (
      <TableRow>
        <TableCell className="text-sm font-medium">{label}</TableCell>
        <TableCell className="text-sm">{leftVal ?? "—"}</TableCell>
        <TableCell className="text-sm">{rightVal ?? "—"}</TableCell>
        <TableCell className="w-10">{changeIcon}</TableCell>
      </TableRow>
    );
  }

  const leftSymptoms = boolList(leftA?.symptoms ?? null, SYMPTOM_KEYS);
  const rightSymptoms = boolList(rightA?.symptoms ?? null, SYMPTOM_KEYS);
  const allSymptoms = [...new Set([...leftSymptoms, ...rightSymptoms])];

  const leftTopDiag = (() => {
    const r = leftDiag?.phenotype_ranking;
    if (!Array.isArray(r) || r.length === 0) return null;
    const top = r[0] as { label?: string; confidence?: string } | null;
    return top?.label ?? null;
  })();
  const rightTopDiag = (() => {
    const r = rightDiag?.phenotype_ranking;
    if (!Array.isArray(r) || r.length === 0) return null;
    const top = r[0] as { label?: string; confidence?: string } | null;
    return top?.label ?? null;
  })();

  return (
    <div className="space-y-4">
      {/* Visit selectors */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Earlier Visit</label>
              <select
                value={leftId}
                onChange={(e) => setLeftId(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {chrono.map((enc) => (
                  <option key={enc.id} value={enc.id}>
                    {formatDate(enc.created_at)} — {assessmentRef(enc.id)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <GitCompareArrows className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Later Visit</label>
              <select
                value={rightId}
                onChange={(e) => setRightId(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {chrono.map((enc) => (
                  <option key={enc.id} value={enc.id}>
                    {formatDate(enc.created_at)} — {assessmentRef(enc.id)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {left && right && (
        <Card>
          <CardContent className="pt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Metric</TableHead>
                  <TableHead>{formatDate(left.created_at)}</TableHead>
                  <TableHead>{formatDate(right.created_at)}</TableHead>
                  <TableHead className="w-10">Δ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Pattern */}
                <CompareRow
                  label="Headache days/mo"
                  leftVal={String(numVal(leftA?.pattern ?? null, "headache_days_per_month") ?? "—")}
                  rightVal={String(numVal(rightA?.pattern ?? null, "headache_days_per_month") ?? "—")}
                />
                <CompareRow
                  label="Severe days/mo"
                  leftVal={String(numVal(leftA?.pattern ?? null, "severe_days_per_month") ?? "—")}
                  rightVal={String(numVal(rightA?.pattern ?? null, "severe_days_per_month") ?? "—")}
                />
                <CompareRow
                  label="Duration (hours)"
                  leftVal={String(numVal(leftA?.pattern ?? null, "duration_hours") ?? "—")}
                  rightVal={String(numVal(rightA?.pattern ?? null, "duration_hours") ?? "—")}
                />

                {/* Pain */}
                <CompareRow
                  label="Peak severity (0-10)"
                  leftVal={String(numVal(leftA?.pain ?? null, "peak_intensity") ?? "—")}
                  rightVal={String(numVal(rightA?.pain ?? null, "peak_intensity") ?? "—")}
                />

                {/* Medications */}
                <CompareRow
                  label="Triptan days/mo"
                  leftVal={String(numVal(leftA?.medications ?? null, "triptan_days_per_month") ?? "—")}
                  rightVal={String(numVal(rightA?.medications ?? null, "triptan_days_per_month") ?? "—")}
                />
                <CompareRow
                  label="NSAID days/mo"
                  leftVal={String(numVal(leftA?.medications ?? null, "nsaid_days_per_month") ?? "—")}
                  rightVal={String(numVal(rightA?.medications ?? null, "nsaid_days_per_month") ?? "—")}
                />

                {/* Symptoms comparison */}
                {allSymptoms.length > 0 && allSymptoms.map((s) => (
                  <TableRow key={s}>
                    <TableCell className="text-sm font-medium">{s}</TableCell>
                    <TableCell className="text-sm">
                      {leftSymptoms.includes(s) ? (
                        <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700">Present</Badge>
                      ) : (
                        <span className="text-muted-foreground">Absent</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {rightSymptoms.includes(s) ? (
                        <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700">Present</Badge>
                      ) : (
                        <span className="text-muted-foreground">Absent</span>
                      )}
                    </TableCell>
                    <TableCell className="w-10">
                      {leftSymptoms.includes(s) && !rightSymptoms.includes(s) && (
                        <ArrowDown className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      {!leftSymptoms.includes(s) && rightSymptoms.includes(s) && (
                        <ArrowUp className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Red flags */}
                <TableRow>
                  <TableCell className="text-sm font-medium">Red Flags</TableCell>
                  <TableCell className="text-sm">
                    {leftDiag?.red_flag_result?.flagged ? (
                      <Badge className="border-red-200 bg-red-50 text-red-700 text-xs">Flagged</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {rightDiag?.red_flag_result?.flagged ? (
                      <Badge className="border-red-200 bg-red-50 text-red-700 text-xs">Flagged</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell />
                </TableRow>

                {/* Top diagnosis */}
                <TableRow>
                  <TableCell className="text-sm font-medium">Top Diagnosis</TableCell>
                  <TableCell className="text-sm">{leftTopDiag ?? "—"}</TableCell>
                  <TableCell className="text-sm">{rightTopDiag ?? "—"}</TableCell>
                  <TableCell />
                </TableRow>

                {/* GCS from clinical exam */}
                <CompareRow
                  label="GCS Total"
                  leftVal={String(numVal(leftA?.clinical_examination ?? null, "gcs_total") ?? "—")}
                  rightVal={String(numVal(rightA?.clinical_examination ?? null, "gcs_total") ?? "—")}
                  lowerIsBetter={false}
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
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
