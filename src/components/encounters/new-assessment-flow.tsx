"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type SelectedPatient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  sex: "male" | "female" | "other" | null;
  mrn: string | null;
};

type CreatedAssessment = {
  encounterId: string;
  assessmentRef: string;
  patientName: string;
  createdAt: string;
  questionnaireUrl: string | null;
};

type Step = "patient" | "record" | "questionnaire" | "complete";

// ---------------------------------------------------------------------------
// Main flow
// ---------------------------------------------------------------------------

export function NewAssessmentFlow() {
  const [step, setStep] = useState<Step>("patient");
  const [selectedPatient, setSelectedPatient] = useState<SelectedPatient | null>(null);
  const [assessment, setAssessment] = useState<CreatedAssessment | null>(null);

  function handlePatientSelected(patient: SelectedPatient) {
    setSelectedPatient(patient);
    setStep("record");
  }

  function handleAssessmentCreated(data: CreatedAssessment) {
    setAssessment(data);
    setStep("questionnaire");
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
              Link a patient and generate a questionnaire
            </p>
          </div>
        </div>
      </header>

      <StepIndicator current={step} />

      {step === "patient" && <PatientStep onSelect={handlePatientSelected} />}
      {step === "record" && selectedPatient && (
        <RecordStep patient={selectedPatient} onCreate={handleAssessmentCreated} />
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

const STEPS: { key: Step; label: string }[] = [
  { key: "patient", label: "Patient" },
  { key: "record", label: "Assessment" },
  { key: "questionnaire", label: "Questionnaire" },
  { key: "complete", label: "Done" },
];

function StepIndicator({ current }: { current: Step }) {
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
      .select("id, first_name, last_name, date_of_birth, sex, mrn")
      .or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,mrn.ilike.%${term}%`
      )
      .order("last_name")
      .limit(10);

    setResults((data as SelectedPatient[]) ?? []);
    setLoading(false);
  }, [supabase, query]);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle className="text-base">Find Existing Patient</CardTitle>
        <CardDescription>
          Search your patient records by name or patient ID.
        </CardDescription>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
              placeholder="Search patient by name or patient ID"
            />
          </div>
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
        })
        .select("id, first_name, last_name, date_of_birth, sex, mrn")
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

function RecordStep({
  patient,
  onCreate,
}: {
  patient: SelectedPatient;
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

      const { data: encounter, error: encErr } = await supabase
        .from("encounters")
        .insert({
          clinician_id: user.id,
          patient_id: patient.id,
        })
        .select()
        .single();
      if (encErr) throw encErr;

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

      onCreate({
        encounterId: encounter.id,
        assessmentRef: encounter.id.slice(0, 8).toUpperCase(),
        patientName: `${patient.first_name} ${patient.last_name}`,
        createdAt: encounter.created_at,
        questionnaireUrl: url,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create assessment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Assessment Details</CardTitle>
        <CardDescription>
          Review the details below and create the assessment record.
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
            <p className="text-muted-foreground">Assessment Date</p>
            <p className="font-medium">{formatDate(new Date())}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Waiting for Response
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
            placeholder="Any initial notes for this assessment..."
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full" onClick={handleCreate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Assessment...
            </>
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
          <Button variant="outline" className="gap-2" disabled>
            <Send className="h-4 w-4" />
            Send Questionnaire
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

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-flag-soft">
          <Check className="h-6 w-6 text-green-flag" />
        </div>
        <CardTitle className="text-lg">Assessment Created Successfully</CardTitle>
        <CardDescription>
          Assessment <span className="font-medium">{assessment.assessmentRef}</span> for{" "}
          <span className="font-medium">{assessment.patientName}</span> is now active
          and awaiting patient response.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href={`/encounters/${assessment.encounterId}/intake`}>
            Open Assessment
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
