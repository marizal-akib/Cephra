"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { redFlagsSchema, RED_FLAG_FIELDS } from "@/lib/schemas/red-flags";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RedFlagsPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.red_flags || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("red_flags", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Red Flag Screening</h2>
        <p className="text-sm text-muted-foreground">
          SNOOP4 red-flag assessment. Safety-critical — complete this before
          routine evaluation.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="red_flags"
        schema={redFlagsSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const values = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });
          const hasFlags = Object.entries(values).some(([k, v]) => k !== "notes" && v === true);

          return (
            <div className="space-y-4">
              {hasFlags && (
                <Alert variant="destructive" className="border-2">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    Red Flags Identified
                  </AlertTitle>
                  <AlertDescription>
                    One or more warning signs are present. Consider urgent review
                    and appropriate workup before proceeding with routine
                    headache classification.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-3">
                {RED_FLAG_FIELDS.map((field) => (
                  <label
                    key={field.name}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      values[field.name]
                        ? field.severity === "urgent"
                          ? "border-red-500 bg-red-50"
                          : "border-amber-500 bg-amber-50"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={!!values[field.name]}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          field.name as never,
                          (checked === true) as never,
                          { shouldDirty: true }
                        )
                      }
                      className="mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {field.label}
                        </span>
                        <span
                          className={cn(
                            "text-xs uppercase font-semibold",
                            field.severity === "urgent"
                              ? "text-red-600"
                              : "text-amber-600"
                          )}
                        >
                          {field.severity}
                        </span>
                      </div>
                      {"description" in field && field.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {field.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Red Flag Notes</Label>
                <Textarea
                  value={(values.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Add context about red flag findings, e.g. details of onset, prior imaging..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
