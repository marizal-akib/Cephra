"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AssessmentAmendment, ClinicianAssessment } from "@/types";
import { useEncounterContext } from "@/app/(dashboard)/encounters/[id]/layout";

/**
 * Edit confirmation dialog for a completed assessment.
 *
 * Flow:
 *   1. Clinician provides a reason (required).
 *   2. On confirm:
 *      a. Append { reason, clinician_id, clinician_name, created_at } to
 *         clinician_assessments.amendments.
 *      b. PATCH encounter status back to "in_progress" via /api/encounters/[id].
 *      c. Redirect to /encounters/[id]/workup so the step flow is unlocked.
 */
interface EditAmendmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  encounterId: string;
  currentAmendments: AssessmentAmendment[];
}

export function EditAmendmentDialog({
  open,
  onOpenChange,
  encounterId,
  currentAmendments,
}: EditAmendmentDialogProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { updateEncounterLocal } = useEncounterContext();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    const trimmed = reason.trim();
    if (!trimmed) {
      toast.error("Please provide a reason for editing this completed assessment.");
      return;
    }

    setSubmitting(true);

    try {
      // Resolve current user + profile for audit fields.
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) {
        toast.error("You must be signed in to edit this assessment.");
        setSubmitting(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();

      const amendment: AssessmentAmendment = {
        reason: trimmed,
        clinician_id: userId,
        clinician_name: (profile?.full_name as string) || "Unknown clinician",
        created_at: new Date().toISOString(),
      };

      const nextAmendments = [...currentAmendments, amendment];

      // Append amendment on clinician_assessments.
      const { error: amendErr } = await supabase
        .from("clinician_assessments")
        .update({ amendments: nextAmendments } as Partial<ClinicianAssessment>)
        .eq("encounter_id", encounterId);
      if (amendErr) throw amendErr;

      // Flip encounter status back to in_progress so the step flow unlocks.
      const res = await fetch(`/api/encounters/${encounterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_progress", current_step: "workup" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Unable to reopen encounter for editing.");
      }

      // Update local context so the layout's completed→/report redirect does
      // not fire on the next render while the client re-fetches.
      updateEncounterLocal({ status: "in_progress", current_step: "workup" });

      toast.success("Assessment reopened for editing.");
      onOpenChange(false);
      router.push(`/encounters/${encounterId}/workup`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to edit assessment.";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (submitting) return;
        if (!next) setReason("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit completed assessment</DialogTitle>
          <DialogDescription>
            This assessment is marked as completed. Provide a reason for the edit.
            Your name, timestamp, and reason will be recorded in the amendment history.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-amber-900/90">
            Confirming will reopen the assessment and return you to the Plan &
            Follow-up step. You will need to re-mark the assessment as completed
            after your edits.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label htmlFor="amendment-reason" className="text-sm font-medium">
            Reason for edit <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="amendment-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Corrected medication dose after pharmacist review, added new MRI result..."
            rows={4}
            disabled={submitting}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={submitting || !reason.trim()}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Reopening...
              </>
            ) : (
              "Confirm & Edit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
