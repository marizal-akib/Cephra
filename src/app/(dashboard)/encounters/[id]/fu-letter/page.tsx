"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEncounterContext } from "../layout";
import { generateFollowUpLetter } from "@/lib/note-gen/generate-followup";
import { createClient } from "@/lib/supabase/client";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Cloud,
  CloudOff,
  Copy,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Pencil,
  Printer,
  RefreshCw,
  SquarePen,
} from "lucide-react";
import type { FollowUpAssessment } from "@/types";
import { assessmentReference } from "@/lib/assessment";

export default function FuLetterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const {
    encounterId,
    encounter,
    followUpAssessment,
    baseline,
    diagnosticOutput,
    updateEncounterLocal,
  } = useEncounterContext();

  const isCompleted = encounter?.status === "completed";
  const patientName = encounter?.patient
    ? `${encounter.patient.first_name} ${encounter.patient.last_name}`
    : "Patient";

  const [copied, setCopied] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasManualEdits, setHasManualEdits] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [currentVersion, setCurrentVersion] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [clinicianName, setClinicianName] = useState("");
  const [clinicianCredentials, setClinicianCredentials] = useState("");
  const [clinicianDesignation, setClinicianDesignation] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const noteIdRef = useRef<string | null>(null);
  const noteContentRef = useRef("");
  const lastPersistedRef = useRef("");
  const generatedContentRef = useRef("");

  noteContentRef.current = noteContent;

  // Sync step
  const stepSyncedRef = useRef(false);
  useEffect(() => {
    if (stepSyncedRef.current || isCompleted) return;
    stepSyncedRef.current = true;
    updateEncounterLocal({ current_step: "fu-letter" });
    supabase
      .from("encounters")
      .update({ current_step: "fu-letter" })
      .eq("id", encounterId)
      .then(() => {});
  }, [encounterId, isCompleted, supabase, updateEncounterLocal]);

  const generatedContent = useMemo(() => {
    if (!followUpAssessment || !diagnosticOutput) return "";
    const reviewData = (followUpAssessment.review || {}) as Record<string, unknown>;
    return generateFollowUpLetter({
      patientName,
      patientId: encounter?.patient?.mrn || encounter?.patient?.id?.slice(0, 8).toUpperCase(),
      age: encounter?.patient?.date_of_birth
        ? Math.floor(
            (Date.now() - new Date(encounter.patient.date_of_birth).getTime()) /
              (365.25 * 24 * 60 * 60 * 1000)
          )
        : undefined,
      sex: encounter?.patient?.sex ?? undefined,
      dateOfBirth: encounter?.patient?.date_of_birth ?? undefined,
      followUpAssessment: followUpAssessment as FollowUpAssessment,
      diagnosticOutput,
      baseline,
      clinicianName,
      clinicianCredentials,
      clinicianDesignation,
      consultationDate: encounter?.created_at,
      diagnosisTemplate: encounter?.diagnosis_template ?? undefined,
      clinicType: (reviewData.clinic_type as string) || undefined,
      keyQuestion: (reviewData.key_question as string) || undefined,
      diagnosisNotes: (reviewData.diagnosis_notes as string) || undefined,
    });
  }, [
    followUpAssessment,
    diagnosticOutput,
    baseline,
    patientName,
    encounter?.patient?.date_of_birth,
    encounter?.patient?.sex,
    encounter?.patient?.mrn,
    encounter?.patient?.id,
    encounter?.created_at,
    encounter?.diagnosis_template,
    clinicianName,
    clinicianCredentials,
    clinicianDesignation,
  ]);

  generatedContentRef.current = generatedContent;

  const persistNote = useCallback(
    async (content: string) => {
      if (!diagnosticOutput) return false;
      setSaving(true);
      try {
        if (noteIdRef.current) {
          const { error } = await supabase
            .from("generated_notes")
            .update({ content })
            .eq("id", noteIdRef.current);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("generated_notes")
            .insert({ encounter_id: encounterId, content, version: 1 })
            .select("id")
            .single();
          if (error) throw error;
          noteIdRef.current = data.id;
        }
        lastPersistedRef.current = content;
        setLastSaved(new Date());
        return true;
      } catch {
        return false;
      } finally {
        setSaving(false);
      }
    },
    [diagnosticOutput, encounterId, supabase]
  );

  const flushPendingSave = useCallback(async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (noteContentRef.current === lastPersistedRef.current) return true;
    return persistNote(noteContentRef.current);
  }, [persistNote]);

  // Load existing draft
  useEffect(() => {
    if (!diagnosticOutput) { setLoadingDraft(false); return; }
    let cancelled = false;
    const loadDraft = async () => {
      setLoadingDraft(true);
      const { data } = await supabase
        .from("generated_notes")
        .select("id, content, version, created_at")
        .eq("encounter_id", encounterId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        noteIdRef.current = data.id;
        setNoteContent(data.content);
        setCurrentVersion(data.version);
        lastPersistedRef.current = data.content;
        setLastSaved(new Date(data.created_at));
      } else {
        const content = generatedContentRef.current;
        setNoteContent(content);
        lastPersistedRef.current = content;
      }
      setLoadingDraft(false);
    };
    void loadDraft();
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [diagnosticOutput, encounterId, supabase]);

  // Load clinician profile
  useEffect(() => {
    let cancelled = false;
    const clinicianId = encounter?.clinician_id;
    if (!clinicianId) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, credentials, specialty")
        .eq("id", clinicianId)
        .maybeSingle();
      if (cancelled) return;
      setClinicianName((data?.full_name as string) || "");
      setClinicianCredentials((data?.credentials as string) || "");
      setClinicianDesignation((data?.specialty as string) || "");
    };
    void load();
    return () => { cancelled = true; };
  }, [encounter?.clinician_id, supabase]);

  // Auto-save on content change
  useEffect(() => {
    if (loadingDraft || !diagnosticOutput) return;
    if (noteContent === lastPersistedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { void persistNote(noteContentRef.current); }, 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [diagnosticOutput, loadingDraft, noteContent, persistNote]);

  // Auto-sync to generated content when assessment changes
  useEffect(() => {
    if (loadingDraft || hasManualEdits) return;
    if (noteContent.trim() === generatedContent.trim()) return;
    setNoteContent(generatedContent);
  }, [generatedContent, hasManualEdits, loadingDraft]);

  function handleRegenerate() {
    if (hasManualEdits && noteContent.trim() !== generatedContent.trim() &&
      !window.confirm("This will replace your current edits with a new auto-generated letter. Continue?")
    ) return;
    setNoteContent(generatedContent);
    setHasManualEdits(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(noteContent);
    setCopied(true);
    toast.success("Letter copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  async function markCompleteAndExit() {
    setShowExitDialog(false);
    setIsCompleting(true);
    const saved = await flushPendingSave();
    if (!saved) { toast.error("Unable to save letter."); setIsCompleting(false); return; }
    try {
      const response = await fetch(`/api/encounters/${encounterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", current_step: "fu-letter" }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) { toast.error(data.error || "Unable to complete."); setIsCompleting(false); return; }
      updateEncounterLocal({ status: "completed", current_step: "fu-letter" });
      toast.success("Follow-up marked as completed.");
      router.push("/workflow");
    } catch { toast.error("Unable to complete."); setIsCompleting(false); }
  }

  async function saveAndExit() {
    setIsExiting(true);
    const saved = await flushPendingSave();
    if (!saved) { toast.error("Unable to save."); setIsExiting(false); return; }
    toast.success("Letter saved.");
    router.push("/workflow");
  }

  // Parse sections for preview
  const noteSections = useMemo(() => {
    const sections: { heading: string; body: string }[] = [];
    const lines = noteContent.split("\n");
    let currentHeading = "";
    let currentBody: string[] = [];
    for (const line of lines) {
      if (/^[A-Z][A-Z\s]+$/.test(line.trim()) && line.trim().length > 3) {
        if (currentHeading || currentBody.length > 0) {
          sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
        }
        currentHeading = line.trim();
        currentBody = [];
        continue;
      }
      if (/^[=-]+$/.test(line.trim())) continue;
      currentBody.push(line);
    }
    if (currentHeading || currentBody.length > 0) {
      sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
    }
    return sections;
  }, [noteContent]);

  if (!diagnosticOutput) {
    return (
      <div className="max-w-3xl space-y-4">
        <div>
          <h2 className="text-xl font-bold">Follow-up Letter</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete the follow-up sections to generate a letter.</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-3 mb-3"><FileText className="h-6 w-6 text-muted-foreground" /></div>
            <p className="text-sm font-medium text-muted-foreground">No diagnostic output available</p>
            <p className="text-xs text-muted-foreground mt-1">Fill in the follow-up forms to generate the letter automatically.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const busy = isExiting || isCompleting || loadingDraft;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Follow-up Letter</h2>
            <Badge variant="outline" className="text-xs font-normal">v{currentVersion}</Badge>
            {isCompleted && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Completed</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{patientName}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 pt-1">
          {saving ? (
            <><Loader2 className="h-3 w-3 animate-spin" /><span>Saving...</span></>
          ) : lastSaved ? (
            <><Cloud className="h-3 w-3 text-emerald-500" /><span>Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></>
          ) : (
            <><CloudOff className="h-3 w-3" /><span>Not saved</span></>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-1.5">
        <div className="flex items-center rounded-md bg-background shadow-sm">
          <Button variant={editMode ? "ghost" : "secondary"} size="sm" className="h-7 rounded-r-none gap-1.5 text-xs" onClick={() => setEditMode(false)}>
            <Eye className="h-3 w-3" />Preview
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button variant={editMode ? "secondary" : "ghost"} size="sm" className="h-7 rounded-l-none gap-1.5 text-xs" onClick={() => setEditMode(true)}>
            <SquarePen className="h-3 w-3" />Edit
          </Button>
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleRegenerate}>
          <RefreshCw className="h-3 w-3" />Regenerate
        </Button>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleCopy}>
          {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => window.print()}>
          <Printer className="h-3 w-3" />Print
        </Button>
      </div>

      {hasManualEdits && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          <Pencil className="h-3 w-3 shrink-0" />
          <span>Manual edits detected. Regenerating will overwrite them.</span>
        </div>
      )}

      {editMode ? (
        <Card>
          <CardContent className="p-0">
            <Textarea
              disabled={loadingDraft}
              value={noteContent}
              onChange={(e) => { setHasManualEdits(true); setNoteContent(e.target.value); }}
              className="min-h-[520px] resize-y rounded-lg border-0 font-mono text-sm leading-relaxed p-6 focus-visible:ring-0"
              placeholder="Letter content..."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 space-y-6">
            {loadingDraft ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : noteSections.length > 0 ? (
              noteSections.map((section, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-6" />}
                  {section.heading && (
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{section.heading}</h3>
                  )}
                  <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {section.body.split("\n").map((line, j) => {
                      if (line.includes(": PRESENT")) {
                        return (
                          <div key={j} className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-1.5 mb-1.5 text-red-800 text-sm">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span className="font-medium">{line.replace(/^- /, "")}</span>
                          </div>
                        );
                      }
                      if (line.includes(": Absent")) {
                        return (
                          <div key={j} className="flex items-start gap-2 px-3 py-1 mb-0.5 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                            <span>{line.replace(/^- /, "")}</span>
                          </div>
                        );
                      }
                      if (/^(Assessment|Treatment changes|Safety counselling|Follow-up plan|Discharge from clinic):/.test(line.trim())) {
                        return <p key={j} className="font-semibold text-slate-700 mt-3 mb-1 first:mt-0">{line}</p>;
                      }
                      if (line.startsWith("- ")) {
                        return (
                          <div key={j} className="flex items-start gap-2 ml-1 mb-1">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" /><span>{line.substring(2)}</span>
                          </div>
                        );
                      }
                      if (line.trim() === "") return <div key={j} className="h-2" />;
                      return <p key={j} className="mb-1">{line}</p>;
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No content. Click &ldquo;Regenerate&rdquo; to create.</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={() => setShowExitDialog(true)} disabled={busy}>
          {isExiting ? (<><Loader2 className="h-4 w-4 animate-spin" />Saving...</>) : (<><LogOut className="h-4 w-4" />Save &amp; Exit</>)}
        </Button>
        <Button onClick={markCompleteAndExit} disabled={busy}>
          {isCompleting ? (<><Loader2 className="h-4 w-4 animate-spin" />Completing...</>) : (<><CheckCircle2 className="h-4 w-4" />Mark as Completed</>)}
        </Button>
      </div>

      <Dialog open={showExitDialog} onOpenChange={(open) => { if (!open) setShowExitDialog(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Follow-up Letter</DialogTitle>
            <DialogDescription>Save as draft or mark the follow-up as completed?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setShowExitDialog(false); void saveAndExit(); }}>
              <FileText className="h-4 w-4" />Save as Draft
            </Button>
            <Button className="w-full sm:w-auto" onClick={markCompleteAndExit}>
              <CheckCircle2 className="h-4 w-4" />Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
