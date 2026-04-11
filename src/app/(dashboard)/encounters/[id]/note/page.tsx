"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEncounterContext } from "../layout";
import { generateInitialClinicLetter } from "@/lib/note-gen/generate-initial";
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
import type { ClinicianAssessment } from "@/types";
import { assessmentReference } from "@/lib/assessment";

export default function NotePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { encounterId, encounter, assessment, diagnosticOutput, updateEncounterLocal } =
    useEncounterContext();

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
  const [showUpdateReasonDialog, setShowUpdateReasonDialog] = useState(false);
  const [updateReason, setUpdateReason] = useState("");
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);
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

  // Sync current_step to "note" when visiting this page
  const stepSyncedRef = useRef(false);
  useEffect(() => {
    if (stepSyncedRef.current || isCompleted) return;
    stepSyncedRef.current = true;
    updateEncounterLocal({ current_step: "note" });
    supabase
      .from("encounters")
      .update({ current_step: "note" })
      .eq("id", encounterId)
      .then(() => {});
  }, [encounterId, isCompleted, supabase, updateEncounterLocal]);

  const generatedContent = useMemo(() => {
    if (!assessment || !diagnosticOutput) return "";
    const ctx = {
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
      assessment: assessment as ClinicianAssessment,
      diagnosticOutput,
      clinicianName,
      clinicianCredentials,
      clinicianDesignation,
      consultationDate: encounter?.created_at,
      assessmentReference: assessmentReference(encounterId),
    };
    return generateInitialClinicLetter(ctx);
  }, [
    assessment,
    diagnosticOutput,
    patientName,
    encounterId,
    encounter?.patient?.date_of_birth,
    encounter?.patient?.sex,
    encounter?.patient?.mrn,
    encounter?.patient?.id,
    encounter?.created_at,
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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (noteContentRef.current === lastPersistedRef.current) return true;
    return persistNote(noteContentRef.current);
  }, [persistNote]);

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

  useEffect(() => {
    let cancelled = false;
    const clinicianId = encounter?.clinician_id;
    if (!clinicianId) return;

    const loadClinicianProfile = async () => {
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

    void loadClinicianProfile();
    return () => {
      cancelled = true;
    };
  }, [encounter?.clinician_id, supabase]);

  useEffect(() => {
    if (loadingDraft || !diagnosticOutput) return;
    if (noteContent === lastPersistedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { void persistNote(noteContentRef.current); }, 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [diagnosticOutput, loadingDraft, noteContent, persistNote]);

  // Auto-sync to new generated content when assessment changes (if no manual edits)
  // Do NOT set lastPersistedRef here — let the auto-save effect detect the change and persist it
  useEffect(() => {
    if (loadingDraft) return;
    if (hasManualEdits) return;
    if (noteContent.trim() === generatedContent.trim()) return;
    setNoteContent(generatedContent);
  }, [generatedContent, hasManualEdits, loadingDraft]);

  function handleRegenerate() {
    if (
      hasManualEdits &&
      noteContent.trim() !== generatedContent.trim() &&
      !window.confirm("This will replace your current edits with a new auto-generated note. Continue?")
    ) return;
    setNoteContent(generatedContent);
    setHasManualEdits(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(noteContent);
    setCopied(true);
    toast.success("Note copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  async function saveAndExit() {
    setIsExiting(true);
    const saved = await flushPendingSave();
    if (!saved) { toast.error("Unable to save note before exit."); setIsExiting(false); return; }
    toast.success("Note saved.");
    router.push("/workflow");
  }

  async function saveAsDraftAndExit() {
    setShowExitDialog(false);
    await saveAndExit();
  }

  async function markCompleteAndExit() {
    setShowExitDialog(false);
    setIsCompleting(true);
    const saved = await flushPendingSave();
    if (!saved) { toast.error("Unable to save note."); setIsCompleting(false); return; }
    try {
      const response = await fetch(`/api/encounters/${encounterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", current_step: "note" }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) { toast.error(data.error || "Unable to mark assessment as completed."); setIsCompleting(false); return; }
      updateEncounterLocal({ status: "completed", current_step: "note" });
      toast.success("Assessment marked as completed.");
      router.push("/workflow");
    } catch { toast.error("Unable to mark assessment as completed."); setIsCompleting(false); }
  }

  async function submitNoteUpdate() {
    const reason = updateReason.trim();
    if (!reason) { toast.error("Please provide a reason for this update."); return; }
    setIsUpdatingNote(true);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    try {
      const newVersion = currentVersion + 1;
      const { data, error } = await supabase
        .from("generated_notes")
        .insert({ encounter_id: encounterId, content: noteContentRef.current, version: newVersion, update_reason: reason })
        .select("id")
        .single();
      if (error) throw error;
      noteIdRef.current = data.id;
      lastPersistedRef.current = noteContentRef.current;
      setCurrentVersion(newVersion);
      setLastSaved(new Date());
      setShowUpdateReasonDialog(false);
      setUpdateReason("");
      toast.success("Note updated (v" + newVersion + ").");
      router.push(`/encounters/${encounterId}/report`);
    } catch { toast.error("Unable to save note update."); }
    finally { setIsUpdatingNote(false); }
  }

  // Parse note into structured sections for formatted view
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
          <h2 className="text-xl font-bold">Clinic Note</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete the assessment sections to generate a clinic note.</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-3 mb-3"><FileText className="h-6 w-6 text-muted-foreground" /></div>
            <p className="text-sm font-medium text-muted-foreground">No diagnostic output available</p>
            <p className="text-xs text-muted-foreground mt-1">Fill in the assessment forms to generate the clinic note automatically.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const busy = isExiting || isCompleting || isUpdatingNote || loadingDraft;

  return (
    <div className="max-w-3xl space-y-4">
      {/* Header */}
      <div className="no-print flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Clinic Note</h2>
            <Badge variant="outline" className="text-xs font-normal">v{currentVersion}</Badge>
            {isCompleted && (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Completed</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {patientName}
            {encounter?.patient?.date_of_birth && (
              <span className="text-muted-foreground/60">
                {" "}&middot; DOB{" "}
                {new Date(encounter.patient.date_of_birth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            )}
          </p>
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

      {/* Toolbar */}
      <div className="no-print flex items-center gap-2 rounded-lg border bg-muted/40 p-1.5">
        {!isCompleted && (
          <>
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
          </>
        )}
        {isCompleted && (
          <>
            <Button variant={editMode ? "secondary" : "ghost"} size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setEditMode(!editMode)}>
              <SquarePen className="h-3 w-3" />{editMode ? "Editing" : "Edit"}
            </Button>
            <div className="flex-1" />
          </>
        )}
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleCopy}>
          {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={handlePrint}>
          <Printer className="h-3 w-3" />
          Print
        </Button>
      </div>

      {!isCompleted && hasManualEdits && (
        <div className="no-print flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          <Pencil className="h-3 w-3 shrink-0" />
          <span>You have made manual edits. Regenerating will overwrite them.</span>
        </div>
      )}

      {/* Note content */}
      {editMode ? (
        <Card className="print:block">
          <CardContent className="p-0">
            <Textarea
              disabled={loadingDraft}
              value={noteContent}
              onChange={(e) => { setHasManualEdits(true); setNoteContent(e.target.value); }}
              className="min-h-[520px] resize-y rounded-lg border-0 font-mono text-sm leading-relaxed p-6 focus-visible:ring-0"
              placeholder="Note content..."
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="print:block">
          <CardContent className="p-6 space-y-6 print-note-content">
            {loadingDraft ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : noteSections.length > 0 ? (
              noteSections.map((section, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-6" />}
                  {section.heading && (
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{section.heading}</h3>
                  )}
                  <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap print-note-section">
                    {section.heading === "RED FLAG SYMPTOMS AND SIGNS" ? (
                      section.body.split("\n").map((line, j) => {
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
                        if (line.trim() === "") return <div key={j} className="h-2" />;
                        return <p key={j} className="mb-1 text-sm">{line}</p>;
                      })
                    ) : section.heading === "ASSESSMENT MANAGEMENT AND FOLLOW UP PLAN" ? (
                      section.body.split("\n").map((line, j) => {
                        if (/^(Assessment|Treatment changes|Safety counselling|Follow-up plan):$/.test(line.trim())) {
                          return <p key={j} className="font-semibold text-slate-700 mt-3 mb-1 first:mt-0">{line}</p>;
                        }
                        if (line.trim() === "") return <div key={j} className="h-1" />;
                        return <p key={j} className="mb-1">{line}</p>;
                      })
                    ) : (
                    section.body.split("\n").map((line, j) => {
                      if (line.startsWith("RED FLAGS:")) {
                        return (
                          <div key={j} className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 mb-3 text-red-800">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span className="font-medium">{line}</span>
                          </div>
                        );
                      }
                      if (line.startsWith("No red flags")) {
                        return (
                          <div key={j} className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 mb-3 text-emerald-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0" /><span>{line}</span>
                          </div>
                        );
                      }
                      if (/^\d+\.\s/.test(line)) {
                        const match = line.match(/^(\d+)\.\s(.+?)\s\((\w+)\s+confidence\)\s*-\s*(.*)$/);
                        if (match) {
                          const [, num, name, confidence, rationale] = match;
                          return (
                            <div key={j} className="ml-1 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">{num}</span>
                                <span className="font-medium">{name}</span>
                                <Badge variant="outline" className={
                                  confidence === "high" ? "border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px]"
                                    : confidence === "moderate" ? "border-amber-300 bg-amber-50 text-amber-700 text-[10px]"
                                    : "border-slate-300 bg-slate-50 text-slate-600 text-[10px]"
                                }>{confidence}</Badge>
                              </div>
                              {rationale && <p className="ml-7 mt-0.5 text-xs text-muted-foreground">{rationale}</p>}
                            </div>
                          );
                        }
                      }
                      if (line.trim().startsWith("Against:")) return <p key={j} className="ml-7 text-xs text-red-600/80 mb-2">{line.trim()}</p>;
                      if (line.startsWith("- ")) return (
                        <div key={j} className="flex items-start gap-2 ml-1 mb-1">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" /><span>{line.substring(2)}</span>
                        </div>
                      );
                      if (line.endsWith(":") && !line.includes(".")) return <p key={j} className="font-medium text-slate-700 mt-2 mb-1">{line}</p>;
                      if (line.trim() === "") return <div key={j} className="h-2" />;
                      return <p key={j} className="mb-1">{line}</p>;
                    })
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No content to display. Click &ldquo;Regenerate&rdquo; to create a note.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer actions */}
      <div className="no-print flex items-center justify-between border-t pt-4">
        {isCompleted ? (
          <>
            <Button variant="outline" onClick={saveAndExit} disabled={busy}>
              {isExiting ? (<><Loader2 className="h-4 w-4 animate-spin" />Saving...</>) : (<><LogOut className="h-4 w-4" />Exit</>)}
            </Button>
            <Button onClick={() => setShowUpdateReasonDialog(true)} disabled={busy}>
              <Pencil className="h-4 w-4" />Update Note
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setShowExitDialog(true)} disabled={busy}>
              {isExiting ? (<><Loader2 className="h-4 w-4 animate-spin" />Saving draft...</>) : (<><LogOut className="h-4 w-4" />Save &amp; Exit</>)}
            </Button>
            <Button onClick={markCompleteAndExit} disabled={busy}>
              {isCompleting ? (<><Loader2 className="h-4 w-4 animate-spin" />Completing...</>) : (<><CheckCircle2 className="h-4 w-4" />Mark as Completed</>)}
            </Button>
          </>
        )}
      </div>

      {/* Exit dialog */}
      <Dialog open={showExitDialog} onOpenChange={(open) => { if (!open) setShowExitDialog(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Clinic Note</DialogTitle>
            <DialogDescription>Would you like to save this note as a draft and come back later, or mark the assessment as completed?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={saveAsDraftAndExit}><FileText className="h-4 w-4" />Save as Draft</Button>
            <Button className="w-full sm:w-auto" onClick={markCompleteAndExit}><CheckCircle2 className="h-4 w-4" />Mark as Completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update reason dialog */}
      <Dialog open={showUpdateReasonDialog} onOpenChange={(open) => { if (!open) { setShowUpdateReasonDialog(false); setUpdateReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reason for Update</DialogTitle>
            <DialogDescription>Please provide a reason for updating this completed note. This will be saved as part of the revision history.</DialogDescription>
          </DialogHeader>
          <Textarea value={updateReason} onChange={(e) => setUpdateReason(e.target.value)} placeholder="e.g. Corrected medication dosage, added follow-up instructions..." className="min-h-[100px]" />
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setShowUpdateReasonDialog(false); setUpdateReason(""); }} disabled={isUpdatingNote}>Cancel</Button>
            <Button className="w-full sm:w-auto" onClick={submitNoteUpdate} disabled={isUpdatingNote || !updateReason.trim()}>
              {isUpdatingNote ? (<><Loader2 className="h-4 w-4 animate-spin" />Saving...</>) : (<><CheckCircle2 className="h-4 w-4" />Save Update</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
