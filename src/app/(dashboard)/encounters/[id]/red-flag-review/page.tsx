"use client";

import { useCallback, useMemo } from "react";
import { useEncounterContext } from "../layout";
import { FollowUpFormWrapper } from "@/components/encounter/followup-form-wrapper";
import { redFlagReviewSchema } from "@/lib/schemas/followup/red-flag-review";
import { DIAGNOSIS_RED_FLAGS } from "@/lib/schemas/followup/red-flag-review";
import type { RedFlagItem } from "@/lib/schemas/followup/red-flag-review";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function RedFlagReviewPage() {
  const { encounterId, encounter, followUpAssessment, updateFollowUpLocal, updateEncounterLocal } =
    useEncounterContext();

  const template = encounter?.diagnosis_template || "migraine";
  const flagList = DIAGNOSIS_RED_FLAGS[template] || DIAGNOSIS_RED_FLAGS.migraine;

  // Pre-compute default values: if no flags exist yet, seed from the diagnosis template
  const defaultValues = useMemo(() => {
    const saved = (followUpAssessment?.red_flags || {}) as Record<string, unknown>;
    const existingFlags = Array.isArray(saved.flags) ? saved.flags : [];
    if (existingFlags.length > 0) return saved;
    // Seed flags from template so the form starts populated
    return {
      ...saved,
      flags: flagList.map((flag: string) => ({ flag, present: false, details: "" })),
    };
  }, [followUpAssessment?.red_flags, flagList]);

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateFollowUpLocal("red_flags", data);
    },
    [updateFollowUpLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Red Flag Review</h2>
        <p className="text-sm text-muted-foreground">
          Screen each diagnosis-specific red flag. Documenting absence is as important as documenting presence.
        </p>
      </div>

      <FollowUpFormWrapper
        encounterId={encounterId}
        section="red_flags"
        schema={redFlagReviewSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          const flags = (Array.isArray(v.flags) ? v.flags : []) as RedFlagItem[];
          const anyPresent = flags.some((f) => f.present);

          return (
            <div className="space-y-6">
              {flags.length > 0 && (
                anyPresent ? (
                  <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>
                      One or more red flags are present. Document details and consider urgent action.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 [&>svg]:text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription>
                      All diagnosis-specific red flags screened and absent.
                    </AlertDescription>
                  </Alert>
                )
              )}

              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {template.replace(/_/g, " ")} red flags
                </p>
                {flags.map((item, idx) => (
                  <div key={idx} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium flex-1">{item.flag}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${item.present ? "text-red-600" : "text-emerald-600"}`}>
                          {item.present ? "PRESENT" : "Absent"}
                        </span>
                        <Switch
                          checked={item.present}
                          onCheckedChange={(checked) => {
                            const next = [...flags];
                            next[idx] = { ...next[idx], present: checked };
                            set("flags", next);
                          }}
                        />
                      </div>
                    </div>
                    {item.present && (
                      <Input
                        value={item.details || ""}
                        onChange={(e) => {
                          const next = [...flags];
                          next[idx] = { ...next[idx], details: e.target.value };
                          set("flags", next);
                        }}
                        placeholder="Details..."
                        className="text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Red Flag Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Additional red flag observations or actions taken..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          );
        }}
      </FollowUpFormWrapper>
    </div>
  );
}
