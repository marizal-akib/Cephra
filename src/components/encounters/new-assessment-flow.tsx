"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Check,
  ClipboardCopy,
  ExternalLink,
  Loader2,
  Search,
  Send,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateQuestionnaireUrl, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";

type SelectedPatient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  sex: "male" | "female" | "other" | null;
  mrn: string | null;
  contact: string | null;
};

type PastEncounter = {
  id: string;
  created_at: string;
  status: string;
  encounter_type: string;
  diagnosis_template: string | null;
};

type CreatedAssessment = {
  encounterId: string;
  assessmentRef: string;
  patientName: string;
  createdAt: string;
  questionnaireUrl: string | null;
  patientEmail: string | null;
  encounterType: "initial" | "follow_up";
};

type Step = "patient" | "encounter-type" | "record" | "questionnaire" | "complete";

// ---------------------------------------------------------------------------
// Main flow
// ---------------------------------------------------------------------------

export function NewAssessmentFlow() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("patient");
  const [selectedPatient, setSelectedPatient] = useState<SelectedPatient | null>(null);
  const [encounterType, setEncounterType] = useState<"initial" | "follow_up">("initial");
  const [parentEncounterId, setParentEncounterId] = useState<string | null>(null);
  const [diagnosisTemplate, setDiagnosisTemplate] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<CreatedAssessment | null>(null);
  const [preloadAttempted, setPreloadAttempted] = useState(false);

  // Pre-select patient from query params (e.g. from "New Follow-up" button)
  useEffect(() => {
    if (preloadAttempted) return;
    const patientId = searchParams.get("patient_id");
    const typeParam = searchParams.get("type");
    if (!patientId) {
      setPreloadAttempted(true);
      return;
    }
    const supabase = createClient();
    supabase
      .from("patients")
      .select("id, first_name, last_name, date_of_birth, sex, mrn, contact")
      .eq("id", patientId)
      .maybeSingle()
      .then(({ data }) => {
        setPreloadAttempted(true);
        if (data) {
          setSelectedPatient(data as SelectedPatient);
          if (typeParam === "follow_up") {
            setEncounterType("follow_up");
          }
          setStep("encounter-type");
        }
      });
  }, [searchParams, preloadAttempted]);

  function handlePatientSelected(patient: SelectedPatient) {
    setSelectedPatient(patient);
    setStep("encounter-type");
  }

  function handleEncounterTypeSelected(
    type: "initial" | "follow_up",
    parentId: string | null,
    template: string | null
  ) {
    setEncounterType(type);
    setParentEncounterId(parentId);
    setDiagnosisTemplate(template);
    setStep("record");
  }

  function handleAssessmentCreated(data: CreatedAssessment) {
    setAssessment(data);
    if (data.encounterType === "follow_up") {
      setStep("complete");
    } else {
      setStep("questionnaire");
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          {step !== "complete" && (
            <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
              <Link href="/dashboard" aria-label="Cancel and go back">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <div>
            <h1 className="font-semibold tracking-tight">Create New Assessment</h1>
            <p className="text-sm text-muted-foreground">
              {encounterType === "follow_up"
                ? "Create a follow-up review for an existing patient"
                : "Link a patient and generate a questionnaire"}
            </p>
          </div>
        </div>
      </header>

      <StepIndicator current={step} encounterType={encounterType} />

      {step === "patient" && <PatientStep onSelect={handlePatientSelected} />}
      {step === "encounter-type" && selectedPatient && (
        <EncounterTypeStep
          patient={selectedPatient}
          onSelect={handleEncounterTypeSelected}
        />
      )}
      {step === "record" && selectedPatient && (
        <RecordStep
          patient={selectedPatient}
          encounterType={encounterType}
          parentEncounterId={parentEncounterId}
          diagnosisTemplate={diagnosisTemplate}
          onCreate={handleAssessmentCreated}
        />
      )}
      {step === "questionnaire" && assessment && (
        <QuestionnaireStep
          assessment={assessment}
          onContinue={() => setStep("complete")}
        />
      )}
      {step === "complete" && assessment && (
        <CompleteStep assessment={assessment} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

const INITIAL_STEPS: { key: Step; label: string }[] = [
  { key: "patient", label: "Patient" },
  { key: "encounter-type", label: "Type" },
  { key: "record", label: "Assessment" },
  { key: "questionnaire", label: "Questionnaire" },
  { key: "complete", label: "Done" },
];

const FOLLOWUP_FLOW_STEPS: { key: Step; label: string }[] = [
  { key: "patient", label: "Patient" },
  { key: "encounter-type", label: "Type" },
  { key: "record", label: "Review" },
  { key: "complete", label: "Done" },
];

function StepIndicator({ current, encounterType }: { current: Step; encounterType?: string }) {
  const STEPS = encounterType === "follow_up" ? FOLLOWUP_FLOW_STEPS : INITIAL_STEPS;
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Progress" className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;

        return (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`h-px w-6 ${done ? "bg-primary" : "bg-border"}`}
              />
            )}
            <div className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "border-2 border-primary text-primary"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span
                className={`hidden text-xs sm:inline ${
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Patient selection
// ---------------------------------------------------------------------------

function PatientStep({ onSelect }: { onSelect: (p: SelectedPatient) => void }) {
  return (
    <Tabs defaultValue="find" className="space-y-4">
      <TabsList>
        <TabsTrigger value="find">
          <Search className="h-3.5 w-3.5" />
          Find Existing Patient
        </TabsTrigger>
        <TabsTrigger value="create">
          <UserPlus className="h-3.5 w-3.5" />
          Create New Patient
        </TabsTrigger>
      </TabsList>

      <TabsContent value="find">
        <FindPatientPanel onSelect={onSelect} />
      </TabsContent>
      <TabsContent value="create">
        <CreatePatientPanel onCreated={onSelect} />
      </TabsContent>
    </Tabs>
  );
}

// ---- Find existing patient ----

function FindPatientPanel({ onSelect }: { onSelect: (p: SelectedPatient) => void }) {
  const supabase = useMemo(() => createClient(), []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SelectedPatient[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    const term = query.trim();
    if (!term) return;

    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from("patients")
      .select("id, first_name, last_name, date_of_birth, sex, mrn, contact")
      .or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,mrn.ilike.%${term}%`
      )
      .order("last_name")
      .limit(10);

    setResults((data as SelectedPatient[]) ?? []);
    setLoading(false);
  }, [supabase, query]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      void handleSearch();
    }, 250);

    return () => clearTimeout(timer);
  }, [handleSearch, query]);

  const searchSuggestions = useMemo(
    () =>
      results.flatMap((patient) => [
        `${patient.first_name} ${patient.last_name}`,
        patient.mrn ?? patient.id.slice(0, 8).toUpperCase(),
      ]),
    [results]
  );

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle className="text-base">Find Existing Patient</CardTitle>
        <CardDescription>
          Search your patient records by name or patient ID. Suggestions appear as you type.
        </CardDescription>
        <div className="flex gap-2">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            suggestions={searchSuggestions}
            className="flex-1"
            placeholder="Who do you want to assess? Search by patient name or ID"
            ariaLabel="Search existing patient by name or patient ID"
          />
          <Button
            variant="outline"
            onClick={handleSearch}
            disabled={loading || !query.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!searched ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Enter a name or patient ID to search.
          </p>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
            <p className="text-sm font-medium">No patients found</p>
            <p className="text-xs text-muted-foreground">
              Try a different search or create a new patient.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {patient.mrn || patient.id.slice(0, 8).toUpperCase()}
                    {patient.date_of_birth && (
                      <>
                        {" · "}
                        DOB: {formatDate(patient.date_of_birth)}
                      </>
                    )}
                  </p>
                </div>
                <Button size="sm" onClick={() => onSelect(patient)}>
                  Select
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Create new patient ----

function CreatePatientPanel({ onCreated }: { onCreated: (p: SelectedPatient) => void }) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sex: "" as string,
    contact: "",
    mrn: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: patient, error: err } = await supabase
        .from("patients")
        .insert({
          clinician_id: user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          date_of_birth: form.dateOfBirth || null,
          sex: form.sex || null,
          mrn: form.mrn || null,
          contact: form.contact || null,
        })
        .select("id, first_name, last_name, date_of_birth, sex, mrn, contact")
        .single();

      if (err) throw err;

      onCreated(patient as SelectedPatient);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create patient");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create New Patient</CardTitle>
        <CardDescription>
          Add a new patient record to your clinic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="np-first">First Name</Label>
              <Input
                id="np-first"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="np-last">Last Name</Label>
              <Input
                id="np-last"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="np-dob">Date of Birth</Label>
              <Input
                id="np-dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="np-sex">Sex</Label>
              <Select
                value={form.sex}
                onValueChange={(v) => update("sex", v)}
              >
                <SelectTrigger id="np-sex" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="np-contact">Contact (optional)</Label>
              <Input
                id="np-contact"
                value={form.contact}
                onChange={(e) => update("contact", e.target.value)}
                placeholder="Email or phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="np-mrn">Patient ID (optional)</Label>
              <Input
                id="np-mrn"
                value={form.mrn}
                onChange={(e) => update("mrn", e.target.value)}
                placeholder="Auto-generated if blank"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save and Continue"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Assessment record
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Step 2b — Encounter type selection (initial vs follow-up)
// ---------------------------------------------------------------------------

function EncounterTypeStep({
  patient,
  onSelect,
}: {
  patient: SelectedPatient;
  onSelect: (type: "initial" | "follow_up", parentId: string | null, template: string | null) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [pastEncounters, setPastEncounters] = useState<PastEncounter[]>([]);
  const [loadingPast, setLoadingPast] = useState(true);
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("encounters")
        .select("id, created_at, status, encounter_type, diagnosis_template")
        .eq("patient_id", patient.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setPastEncounters((data as PastEncounter[]) ?? []);
      if (data && data.length > 0) {
        setSelectedParent(data[0].id);
      }
      setLoadingPast(false);
    })();
  }, [supabase, patient.id]);

  const TEMPLATE_OPTIONS = [
    { value: "migraine", label: "Migraine" },
    { value: "tension_type", label: "Tension-Type Headache" },
    { value: "cluster", label: "Cluster Headache" },
    { value: "tac", label: "TAC Spectrum" },
    { value: "medication_overuse", label: "Medication Overuse" },
    { value: "cervicogenic", label: "Cervicogenic Headache" },
    { value: "occipital_neuralgia", label: "Occipital Neuralgia" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Encounter Type</CardTitle>
          <CardDescription>
            Is this a new initial consultation or a follow-up review?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-lg border-2 border-border p-4 text-left transition-colors hover:border-primary hover:bg-accent/50"
              onClick={() => onSelect("initial", null, null)}
            >
              <p className="font-medium">Initial Consultation</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Full history, examination, and baseline letter
              </p>
            </button>

            <button
              type="button"
              className="rounded-lg border-2 border-border p-4 text-left transition-colors hover:border-primary hover:bg-accent/50 disabled:opacity-50"
              disabled={pastEncounters.length === 0 && !loadingPast}
              onClick={() => {
                if (pastEncounters.length === 0) return;
                // Show the follow-up config below instead of navigating
                document.getElementById("followup-config")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <p className="font-medium">Follow-up Review</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {pastEncounters.length === 0 && !loadingPast
                  ? "No prior encounters — initial consultation required first"
                  : "Track progress, adjust treatment, safety screening"}
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {pastEncounters.length > 0 && (
        <Card id="followup-config">
          <CardHeader>
            <CardTitle className="text-base">Follow-up Configuration</CardTitle>
            <CardDescription>
              Select the baseline encounter and diagnosis template for this follow-up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Baseline Encounter</Label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger><SelectValue placeholder="Select baseline encounter" /></SelectTrigger>
                <SelectContent>
                  {pastEncounters.map((enc) => (
                    <SelectItem key={enc.id} value={enc.id}>
                      {new Date(enc.created_at).toLocaleDateString("en-GB")} — {enc.status}
                      {enc.encounter_type === "follow_up" ? " (follow-up)" : " (initial)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The encounter whose data will be used for trend comparison.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Diagnosis Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger><SelectValue placeholder="Select template (optional)" /></SelectTrigger>
                <SelectContent>
                  {TEMPLATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tailors the follow-up forms and red flag checklist to the diagnosis. Can be changed later.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() =>
                onSelect(
                  "follow_up",
                  selectedParent || null,
                  selectedTemplate || null
                )
              }
              disabled={!selectedParent}
            >
              Continue as Follow-up
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Assessment record
// ---------------------------------------------------------------------------

function RecordStep({
  patient,
  encounterType = "initial",
  parentEncounterId = null,
  diagnosisTemplate = null,
  onCreate,
}: {
  patient: SelectedPatient;
  encounterType?: "initial" | "follow_up";
  parentEncounterId?: string | null;
  diagnosisTemplate?: string | null;
  onCreate: (data: CreatedAssessment) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  async function handleCreate() {
    setError(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const insertPayload: Record<string, unknown> = {
        clinician_id: user.id,
        patient_id: patient.id,
        encounter_type: encounterType,
      };
      if (encounterType === "follow_up" && parentEncounterId) {
        insertPayload.parent_encounter_id = parentEncounterId;
      }
      if (diagnosisTemplate) {
        insertPayload.diagnosis_template = diagnosisTemplate;
      }

      const { data: encounter, error: encErr } = await supabase
        .from("encounters")
        .insert(insertPayload)
        .select()
        .single();
      if (encErr) throw encErr;

      if (encounterType === "follow_up") {
        // Create follow-up assessment record
        await supabase.from("follow_up_assessments").insert({
          encounter_id: encounter.id,
        });

        onCreate({
          encounterId: encounter.id,
          assessmentRef: encounter.id.slice(0, 8).toUpperCase(),
          patientName: `${patient.first_name} ${patient.last_name}`,
          createdAt: encounter.created_at,
          questionnaireUrl: null,
          patientEmail: null,
          encounterType: "follow_up",
        });
      } else {
        // Create initial assessment + questionnaire token
        await supabase.from("clinician_assessments").insert({
          encounter_id: encounter.id,
          clinician_notes: notes || null,
        });

        const { data: token, error: tokenErr } = await supabase
          .from("questionnaire_tokens")
          .insert({ encounter_id: encounter.id })
          .select()
          .single();

        if (tokenErr) throw tokenErr;

        const url = generateQuestionnaireUrl(token.token);
        const email = patient.contact?.includes("@") ? patient.contact : null;

        onCreate({
          encounterId: encounter.id,
          assessmentRef: encounter.id.slice(0, 8).toUpperCase(),
          patientName: `${patient.first_name} ${patient.last_name}`,
          createdAt: encounter.created_at,
          questionnaireUrl: url,
          patientEmail: email,
          encounterType: "initial",
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create assessment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {encounterType === "follow_up" ? "Follow-up Review Details" : "Assessment Details"}
        </CardTitle>
        <CardDescription>
          Review the details below and create the {encounterType === "follow_up" ? "follow-up" : "assessment"} record.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Patient Name</p>
            <p className="font-medium">
              {patient.first_name} {patient.last_name}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Patient ID</p>
            <p className="font-medium">
              {patient.mrn || patient.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{formatDate(new Date())}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <Badge variant="secondary" className={encounterType === "follow_up" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
              {encounterType === "follow_up" ? "Follow-up Review" : "Initial Consultation"}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="rec-notes">Notes (optional)</Label>
          <Textarea
            id="rec-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={encounterType === "follow_up" ? "Any notes for this follow-up review..." : "Any initial notes for this assessment..."}
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full" onClick={handleCreate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : encounterType === "follow_up" ? (
            "Create Follow-up"
          ) : (
            "Create Assessment"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Questionnaire actions
// ---------------------------------------------------------------------------

function buildMailtoUrl(email: string | null, questionnaireUrl: string) {
  const subject = encodeURIComponent("Cephra Questionnaire Link");
  const body = encodeURIComponent(
    `Hello,\n\nPlease use the secure link below to complete your questionnaire before your appointment:\n\n${questionnaireUrl}\n\nIf you have any issues opening the link, please contact the clinic.`
  );
  const to = email || "";
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function QuestionnaireStep({
  assessment,
  onContinue,
}: {
  assessment: CreatedAssessment;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!assessment.questionnaireUrl) return;
    await navigator.clipboard.writeText(assessment.questionnaireUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const mailtoUrl = assessment.questionnaireUrl
    ? buildMailtoUrl(assessment.patientEmail, assessment.questionnaireUrl)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Patient Questionnaire</CardTitle>
        <CardDescription>
          Share the intake questionnaire with your patient before the
          consultation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Assessment Ref</p>
            <p className="font-medium">{assessment.assessmentRef}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Patient</p>
            <p className="font-medium">{assessment.patientName}</p>
          </div>
        </div>

        <Separator />

        {assessment.questionnaireUrl && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Questionnaire Link
            </p>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
              <p className="break-all font-mono text-xs">
                {assessment.questionnaireUrl}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-3">
          <Button
            variant="outline"
            className="gap-2"
            disabled={!mailtoUrl}
            asChild={!!mailtoUrl}
          >
            {mailtoUrl ? (
              <a href={mailtoUrl}>
                <Send className="h-4 w-4" />
                Send Questionnaire
              </a>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Questionnaire
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={copyLink}
            disabled={!assessment.questionnaireUrl}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <ClipboardCopy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link
              href={assessment.questionnaireUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </Link>
          </Button>
        </div>

        {!assessment.patientEmail && (
          <p className="text-xs text-muted-foreground">
            No patient email saved — recipient will need to be added manually.
          </p>
        )}

        <Button className="w-full" onClick={onContinue}>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Completion
// ---------------------------------------------------------------------------

function CompleteStep({ assessment }: { assessment: CreatedAssessment }) {
  const router = useRouter();
  const isFollowUp = assessment.encounterType === "follow_up";
  const firstPath = isFollowUp ? "review" : "intake";

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-flag-soft">
          <Check className="h-6 w-6 text-green-flag" />
        </div>
        <CardTitle className="text-lg">
          {isFollowUp ? "Follow-up Created Successfully" : "Assessment Created Successfully"}
        </CardTitle>
        <CardDescription>
          {isFollowUp ? "Follow-up review" : "Assessment"}{" "}
          <span className="font-medium">{assessment.assessmentRef}</span> for{" "}
          <span className="font-medium">{assessment.patientName}</span>{" "}
          {isFollowUp ? "is ready for review." : "is now active and awaiting patient response."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href={`/encounters/${assessment.encounterId}/${firstPath}`}>
            {isFollowUp ? "Start Follow-up" : "Open Assessment"}
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
        >
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
