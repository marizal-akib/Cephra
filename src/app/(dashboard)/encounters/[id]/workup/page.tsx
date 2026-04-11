"use client";

import { useEncounterContext } from "../layout";
import { createClient } from "@/lib/supabase/client";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { followUpSchema } from "@/lib/schemas/follow-up";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrescriptionList } from "@/components/encounter/prescription-list";
import type { Prescription } from "@/lib/schemas/prescription";

interface InvestigationResult {
  name: string;
  result: string;
  interpretation: string;
  nameSpecify?: string;
  abnormalDetails?: string;
}
import {
  INVESTIGATION_NAME_OPTIONS,
  INVESTIGATION_RESULT_OPTIONS,
} from "@/lib/schemas/followup/investigations";
import { cn } from "@/lib/utils";
import type { PhenotypeResult } from "@/lib/engine/types";

const CONFIDENCE_STYLES: Record<
  PhenotypeResult["confidence"],
  { badge: string; ring: string }
> = {
  high: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ring: "ring-emerald-200",
  },
  moderate: {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    ring: "ring-amber-200",
  },
  possible: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    ring: "ring-slate-200",
  },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 100);
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-slate-400"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function WorkupPage() {
  const supabase = useMemo(() => createClient(), []);
  const {
    encounterId,
    encounter,
    diagnosticOutput,
    assessment,
    updateAssessmentLocal,
    updateEncounterLocal,
  } = useEncounterContext();
  const router = useRouter();
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [includeWorkupSuggestions, setIncludeWorkupSuggestions] = useState(true);
  const [workupNotes, setWorkupNotes] = useState("");
  const [keyDiagnosticQuestion, setKeyDiagnosticQuestion] = useState("");
  const [investigationResults, setInvestigationResults] = useState<InvestigationResult[]>([]);
  const [pendingInvestigations, setPendingInvestigations] = useState("");
  const [assessmentSummary, setAssessmentSummary] = useState("");
  const [treatmentChanges, setTreatmentChanges] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [clinicianName, setClinicianName] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hydratedRef = useRef(false);

  const workup = diagnosticOutput?.suggestedWorkup || [];
  const redFlagResult = diagnosticOutput?.redFlagResult;
  const phenotypes = diagnosticOutput?.phenotypes || [];

  // Hydrate only when assessment.workup_data changes (e.g. initial load, server refetch).
  // Guard: never overwrite non-empty local state with empty assessment - that indicates
  // a race where our sync hasn't been reflected in the layout yet.
  // Use functional setState and skip when unchanged to avoid sync/hydrate re-render loop.
  // `hydratedRef` sentinel: once the page has hydrated from a non-empty payload, array
  // fields (investigation_results, prescriptions) stop re-hydrating from the layout sync
  // to avoid clobbering rapid in-progress edits.
  useEffect(() => {
    const data = (assessment?.workup_data || {}) as Record<string, unknown>;
    const hasAnyData =
      Object.keys(data).length > 0 &&
      Object.values(data).some((v) => {
        if (v === null || v === undefined || v === "") return false;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object") return Object.keys(v).length > 0;
        return true;
      });
    const acceptedItems =
      typeof data.accepted_workup_items === "object" && data.accepted_workup_items
        ? (data.accepted_workup_items as Record<string, unknown>)
        : {};
    const acceptedMap = Object.fromEntries(
      Object.entries(acceptedItems).map(([key, value]) => [key, value === true])
    );
    const workupNotesStr = (data.workup_notes as string) || "";
    const includeSuggestions = data.include_workup_suggestions !== false;
    setIncludeWorkupSuggestions(includeSuggestions);
    const incomingHasItems = Object.values(acceptedMap).some(Boolean);
    setAccepted((prev) => {
      const currentHasItems = Object.values(prev).some(Boolean);
      if (!incomingHasItems && currentHasItems) return prev;
      const prevStr = JSON.stringify(Object.fromEntries(Object.entries(prev).sort(([a],[b]) => a.localeCompare(b))));
      const nextStr = JSON.stringify(Object.fromEntries(Object.entries(acceptedMap).sort(([a],[b]) => a.localeCompare(b))));
      if (prevStr === nextStr) return prev;
      return acceptedMap;
    });
    setWorkupNotes(workupNotesStr);
    setKeyDiagnosticQuestion((data.key_diagnostic_question as string) || "");
    const incomingInvestigations = Array.isArray(data.investigation_results)
      ? (data.investigation_results as InvestigationResult[])
      : [];
    const incomingPrescriptions = Array.isArray(data.prescriptions)
      ? (data.prescriptions as Prescription[])
      : [];
    // Array hydration guard: skip if we've already hydrated AND incoming is empty while
    // local has items (race between debounced save and layout sync).
    setInvestigationResults((prev) => {
      if (hydratedRef.current && incomingInvestigations.length === 0 && prev.length > 0) return prev;
      if (JSON.stringify(prev) === JSON.stringify(incomingInvestigations)) return prev;
      return incomingInvestigations;
    });
    setPrescriptions((prev) => {
      if (hydratedRef.current && incomingPrescriptions.length === 0 && prev.length > 0) return prev;
      if (JSON.stringify(prev) === JSON.stringify(incomingPrescriptions)) return prev;
      return incomingPrescriptions;
    });
    setPendingInvestigations((data.pending_investigations as string) || "");
    setAssessmentSummary((data.assessment_summary as string) || "");
    setTreatmentChanges((data.treatment_changes as string) || "");
    if (hasAnyData) hydratedRef.current = true;
  }, [assessment?.workup_data]);

  // Fetch logged-in clinician profile for prescriber auto-fill.
  useEffect(() => {
    let cancelled = false;
    const clinicianId = encounter?.clinician_id;
    if (!clinicianId) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", clinicianId)
        .maybeSingle();
      if (cancelled) return;
      setClinicianName((data?.full_name as string) || "");
    })();
    return () => {
      cancelled = true;
    };
  }, [encounter?.clinician_id, supabase]);

  const persistWorkupData = useCallback(
    async (data: {
      workup_notes: string;
      accepted_workup_items: Record<string, boolean>;
      include_workup_suggestions: boolean;
      key_diagnostic_question: string;
      investigation_results: InvestigationResult[];
      pending_investigations: string;
      assessment_summary: string;
      treatment_changes: string;
      prescriptions: Prescription[];
    }) => {
      setSaving(true);
      try {
        const { error } = await supabase
          .from("clinician_assessments")
          .update({ workup_data: data })
          .eq("encounter_id", encounterId);
        if (error) throw error;
        setLastSaved(new Date());
        updateAssessmentLocal("workup_data", data);
      } finally {
        setSaving(false);
      }
    },
    [encounterId, supabase, updateAssessmentLocal]
  );

  useEffect(() => {
    const payload = {
      workup_notes: workupNotes,
      accepted_workup_items: accepted,
      include_workup_suggestions: includeWorkupSuggestions,
      key_diagnostic_question: keyDiagnosticQuestion,
      investigation_results: investigationResults,
      pending_investigations: pendingInvestigations,
      assessment_summary: assessmentSummary,
      treatment_changes: treatmentChanges,
      prescriptions,
    };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void persistWorkupData(payload);
    }, 800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [accepted, workupNotes, includeWorkupSuggestions, keyDiagnosticQuestion, investigationResults, pendingInvestigations, assessmentSummary, treatmentChanges, prescriptions, persistWorkupData]);

  // Sync accepted/workupNotes to context so note page has latest data on nav.
  // Debounce to avoid layout re-renders on every checkbox/keystroke.
  const buildWorkupPayload = useCallback(() => ({
    workup_notes: workupNotes,
    accepted_workup_items: accepted,
    include_workup_suggestions: includeWorkupSuggestions,
    key_diagnostic_question: keyDiagnosticQuestion,
    investigation_results: investigationResults,
    pending_investigations: pendingInvestigations,
    assessment_summary: assessmentSummary,
    treatment_changes: treatmentChanges,
    prescriptions,
  }), [workupNotes, accepted, includeWorkupSuggestions, keyDiagnosticQuestion, investigationResults, pendingInvestigations, assessmentSummary, treatmentChanges, prescriptions]);

  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      updateAssessmentLocal("workup_data", buildWorkupPayload());
      syncTimerRef.current = null;
    }, 100);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [buildWorkupPayload, updateAssessmentLocal]);

  const followUpDefaultValues = (assessment?.follow_up || {}) as Record<string, unknown>;

  const handleFollowUpChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("follow_up", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Plan & Follow-up</h2>
        <p className="text-sm text-muted-foreground">
          Review suggested work-up, control what appears in the clinic note, and
          capture follow-up scheduling.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {saving
            ? "Saving..."
            : lastSaved
              ? `Saved ${lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
        </p>
      </div>

      {redFlagResult &&
        (redFlagResult.flagged ? (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle className="font-bold">Red Flags Identified</AlertTitle>
            <AlertDescription className="mt-2 space-y-1">
              {redFlagResult.flags.map((flag) => (
                <div key={flag.code} className="flex items-start gap-2 text-sm">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "mt-0.5 shrink-0 text-[10px] uppercase",
                      flag.severity === "urgent"
                        ? "bg-red-200 text-red-900"
                        : "bg-orange-200 text-orange-900"
                    )}
                  >
                    {flag.severity}
                  </Badge>
                  <span>{flag.description}</span>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 [&>svg]:text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle className="font-semibold">No Red Flags</AlertTitle>
            <AlertDescription className="text-sm">
              No SNOOP4 red-flag warning signs were identified in this
              assessment.
            </AlertDescription>
          </Alert>
        ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Diagnostic Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={keyDiagnosticQuestion}
            onChange={(e) => setKeyDiagnosticQuestion(e.target.value)}
            placeholder='e.g. "Is the preventive working?", "Is MOH developing?"'
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            The single most important clinical question this review needs to answer.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phenotype Ranking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phenotypes.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Insufficient data to rank phenotypes.
            </p>
          ) : (
            phenotypes.map((phenotype, idx) => (
              <div
                key={phenotype.diagnosis}
                className={cn(
                  "rounded-lg border p-4 ring-1",
                  CONFIDENCE_STYLES[phenotype.confidence].ring
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold">{phenotype.label}</h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0 border capitalize",
                      CONFIDENCE_STYLES[phenotype.confidence].badge
                    )}
                  >
                    {phenotype.confidence}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <ScoreBar score={phenotype.score} />
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {phenotype.score}%
                  </span>
                </div>
                {phenotype.rationale.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      Supporting Criteria
                    </p>
                    <ul className="space-y-0.5 text-sm text-muted-foreground">
                      {phenotype.rationale.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {phenotype.contradictions.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <XCircle className="h-3 w-3 text-rose-500" />
                      Contradictions
                    </p>
                    <ul className="space-y-0.5 text-sm text-muted-foreground">
                      {phenotype.contradictions.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {phenotype.missingData.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CircleHelp className="h-3 w-3 text-amber-500" />
                      Missing Data
                    </p>
                    <ul className="space-y-0.5 text-sm text-muted-foreground">
                      {phenotype.missingData.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {workup.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No specific work-up suggested based on current assessment.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
              <Checkbox
                checked={includeWorkupSuggestions}
                onCheckedChange={(checked) =>
                  setIncludeWorkupSuggestions(checked === true)
                }
                className="mt-0.5"
              />
              <span className="text-sm">
                Include automated work-up suggestions in clinic note
              </span>
            </label>
            {workup.map((item) => (
              <label
                key={item}
                className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
              >
                <Checkbox
                  checked={!!accepted[item]}
                  onCheckedChange={(checked) =>
                    setAccepted((prev) => ({
                      ...prev,
                      [item]: checked === true,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Work-up Notes</Label>
            <Textarea
              value={workupNotes}
              onChange={(e) => setWorkupNotes(e.target.value)}
              placeholder="Add custom work-up details, rationale, or instructions..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Investigation Results</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() =>
                setInvestigationResults((prev) => [
                  ...prev,
                  { name: "", result: "", interpretation: "", nameSpecify: "", abnormalDetails: "" },
                ])
              }
            >
              <Plus className="h-3 w-3" />Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Record investigation results with clinical interpretation. Never list a result without stating what it means for this patient.
          </p>
          {investigationResults.map((inv, idx) => (
            <div key={idx} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Investigation {idx + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setInvestigationResults((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Investigation Name</Label>
                <Select
                  value={inv.name || ""}
                  onValueChange={(val) =>
                    setInvestigationResults((prev) => {
                      const next = [...prev];
                      next[idx] = { ...next[idx], name: val, nameSpecify: val === "Others" ? next[idx].nameSpecify : "" };
                      return next;
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select investigation..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTIGATION_NAME_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {inv.name === "Others" && (
                  <div className="space-y-1 mt-1.5">
                    <Label className="text-xs">Specify Investigation</Label>
                    <Input
                      value={inv.nameSpecify || ""}
                      onChange={(e) =>
                        setInvestigationResults((prev) => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], nameSpecify: e.target.value };
                          return next;
                        })
                      }
                      placeholder="Specify investigation name..."
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Result</Label>
                <Select
                  value={inv.result || ""}
                  onValueChange={(val) =>
                    setInvestigationResults((prev) => {
                      const next = [...prev];
                      next[idx] = { ...next[idx], result: val, abnormalDetails: val === "Abnormal" ? next[idx].abnormalDetails : "" };
                      return next;
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select result..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTIGATION_RESULT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {inv.result === "Abnormal" && (
                  <div className="space-y-1 mt-1.5">
                    <Label className="text-xs">Abnormal Result Details</Label>
                    <Input
                      value={inv.abnormalDetails || ""}
                      onChange={(e) =>
                        setInvestigationResults((prev) => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], abnormalDetails: e.target.value };
                          return next;
                        })
                      }
                      placeholder="Describe the abnormality..."
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Clinical Interpretation</Label>
                <Textarea
                  value={inv.interpretation}
                  onChange={(e) =>
                    setInvestigationResults((prev) => {
                      const next = [...prev];
                      next[idx] = { ...next[idx], interpretation: e.target.value };
                      return next;
                    })
                  }
                  placeholder="e.g. Supports primary headache diagnosis, no structural lesion to explain symptoms"
                  className="min-h-[60px]"
                />
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <Label>Pending Investigations</Label>
            <Textarea
              value={pendingInvestigations}
              onChange={(e) => setPendingInvestigations(e.target.value)}
              placeholder="List any pending tests with expected timelines..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clinical Assessment & Treatment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Assessment Summary</Label>
            <Textarea
              value={assessmentSummary}
              onChange={(e) => setAssessmentSummary(e.target.value)}
              placeholder="Clinical summary tying together burden data, medication response, exam findings, and investigation results. State whether improving, stable, or worsening..."
              className="min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Treatment Changes This Visit</Label>
            <Textarea
              value={treatmentChanges}
              onChange={(e) => setTreatmentChanges(e.target.value)}
              placeholder="Specific changes made today: dose adjustments, new prescriptions, stopped medications, referrals. Include dose, route, frequency, titration instructions..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <PrescriptionList
            value={prescriptions}
            onChange={setPrescriptions}
            encounterId={encounterId}
            defaultPrescriberName={clinicianName}
            defaultIndication={phenotypes[0]?.label}
            disabled={encounter?.status === "completed"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Follow-up</CardTitle>
        </CardHeader>
        <CardContent>
          <EncounterFormWrapper
            encounterId={encounterId}
            section="follow_up"
            schema={followUpSchema}
            defaultValues={followUpDefaultValues}
            onDataChange={handleFollowUpChange}
            onEncounterStatusChange={updateEncounterLocal}
          >
            {(form) => {
              const v = form.watch();
              const set = (name: string, value: unknown) =>
                form.setValue(name as never, value as never, { shouldDirty: true });

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Follow-up Date</Label>
                      <Input
                        type="date"
                        value={(v.follow_up_date as string) || ""}
                        onChange={(e) => set("follow_up_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Follow-up Time</Label>
                      <Input
                        type="time"
                        value={(v.follow_up_time as string) || ""}
                        onChange={(e) => set("follow_up_time", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Follow-up Type</Label>
                      <Select
                        value={(v.follow_up_type as string) || ""}
                        onValueChange={(val) => set("follow_up_type", val)}
                      >
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinic">Clinic (face-to-face)</SelectItem>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="gp_review">GP Review</SelectItem>
                          <SelectItem value="telephone">Telephone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Responsible Clinician</Label>
                      <Input
                        value={(v.follow_up_clinician as string) || ""}
                        onChange={(e) => set("follow_up_clinician", e.target.value)}
                        placeholder="Clinician or service name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose of Follow-up</Label>
                    <Input
                      value={(v.follow_up_purpose as string) || ""}
                      onChange={(e) => set("follow_up_purpose", e.target.value)}
                      placeholder="e.g. Review preventive response at 3 months"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Safety Counselling</Label>
                    <Textarea
                      value={(v.safety_counselling as string) || ""}
                      onChange={(e) => set("safety_counselling", e.target.value)}
                      placeholder="Document emergency escalation advice given (e.g. attend ED if thunderclap headache, new focal neurology), medication safety, driving/work implications..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              );
            }}
          </EncounterFormWrapper>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (syncTimerRef.current) {
              clearTimeout(syncTimerRef.current);
              syncTimerRef.current = null;
            }
            updateAssessmentLocal("workup_data", buildWorkupPayload());
            router.push(`/encounters/${encounterId}/note`);
          }}
        >
          Proceed to Clinic Note
        </Button>
      </div>
    </div>
  );
}
