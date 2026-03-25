"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { FollowUpFormWrapper } from "@/components/encounter/followup-form-wrapper";
import { reviewSchema } from "@/lib/schemas/followup/review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReviewPage() {
  const {
    encounterId,
    encounter,
    followUpAssessment,
    baseline,
    diagnosticOutput,
    updateFollowUpLocal,
    updateEncounterLocal,
  } = useEncounterContext();

  const patient = encounter?.patient;
  const topDiagnosis = diagnosticOutput?.phenotypes[0];

  const defaultValues = (followUpAssessment?.review || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateFollowUpLocal("review", data);
    },
    [updateFollowUpLocal]
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Review Details & Diagnosis</h2>
        <p className="text-sm text-muted-foreground">
          Patient identifiers, current diagnosis, and key clinical question for this review.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">
                {patient ? `${patient.first_name} ${patient.last_name}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Patient ID</p>
              <p className="font-medium">
                {patient?.mrn || patient?.id?.slice(0, 8).toUpperCase() || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">DOB</p>
              <p className="font-medium">
                {patient?.date_of_birth
                  ? new Date(patient.date_of_birth).toLocaleDateString("en-GB")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Sex</p>
              <p className="font-medium capitalize">{patient?.sex || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Encounter Type</p>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Follow-up Review
              </Badge>
            </div>
            {baseline?.encounter_date && (
              <div>
                <p className="text-muted-foreground">Last Review</p>
                <p className="font-medium">
                  {new Date(baseline.encounter_date).toLocaleDateString("en-GB")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Working Diagnosis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topDiagnosis ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{topDiagnosis.label}</span>
              <Badge variant="secondary" className="text-xs capitalize">
                {topDiagnosis.confidence}
              </Badge>
            </div>
          ) : baseline?.working_diagnosis ? (
            <p className="text-sm">{baseline.working_diagnosis}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Diagnosis will populate as data is entered.
            </p>
          )}

          {encounter?.diagnosis_template && (
            <p className="text-xs text-muted-foreground">
              Template: {encounter.diagnosis_template.replace(/_/g, " ")}
            </p>
          )}
        </CardContent>
      </Card>

      {baseline && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Baseline Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {baseline.headache_days_per_month !== null && (
                <div>
                  <p className="text-muted-foreground">Headache days/month</p>
                  <p className="font-medium">{baseline.headache_days_per_month}</p>
                </div>
              )}
              {baseline.avg_severity !== null && (
                <div>
                  <p className="text-muted-foreground">Avg severity</p>
                  <p className="font-medium">{baseline.avg_severity}/10</p>
                </div>
              )}
              {baseline.worst_severity !== null && (
                <div>
                  <p className="text-muted-foreground">Worst severity</p>
                  <p className="font-medium">{baseline.worst_severity}/10</p>
                </div>
              )}
              {baseline.current_preventive && (
                <div>
                  <p className="text-muted-foreground">Preventive</p>
                  <p className="font-medium">{baseline.current_preventive}</p>
                </div>
              )}
              {baseline.triptan_days_per_month !== null && (
                <div>
                  <p className="text-muted-foreground">Triptan days/month</p>
                  <p className="font-medium">{baseline.triptan_days_per_month}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <FollowUpFormWrapper
        encounterId={encounterId}
        section="review"
        schema={reviewSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Clinic Type</Label>
                  <Select
                    value={(v.clinic_type as string) || ""}
                    onValueChange={(val) => set("clinic_type", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select clinic type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="face_to_face">Face-to-face</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="telephone">Telephone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Key Diagnostic Question</Label>
                  <Input
                    value={(v.key_question as string) || ""}
                    onChange={(e) => set("key_question", e.target.value)}
                    placeholder='e.g. "Is the preventive working?", "Is MOH developing?"'
                  />
                  <p className="text-xs text-muted-foreground">
                    The single most important clinical question this review needs to answer.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Diagnosis Notes</Label>
                  <Textarea
                    value={(v.diagnosis_notes as string) || ""}
                    onChange={(e) => set("diagnosis_notes", e.target.value)}
                    placeholder="If diagnosis has changed or been refined, note what changed and why..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          );
        }}
      </FollowUpFormWrapper>
    </div>
  );
}
