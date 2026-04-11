"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ACTION_LABELS,
  ACTION_OPTIONS,
  BENEFIT_LABELS,
  BENEFIT_OPTIONS,
  FREQUENCY_OPTIONS,
  TOLERABILITY_LABELS,
  TOLERABILITY_OPTIONS,
  type Prescription,
  type PrescriptionReview,
} from "@/lib/schemas/prescription";

interface PrescriptionReviewListProps {
  previousPrescriptions: Prescription[];
  reviews: PrescriptionReview[];
  onReviewsChange: (next: PrescriptionReview[]) => void;
  disabled?: boolean;
}

function summariseFrequency(rx: Prescription): string {
  if (!rx.frequency) return "";
  if (rx.frequency === "custom") return rx.frequency_custom || "custom schedule";
  return rx.frequency;
}

function describePrevious(rx: Prescription): string {
  const parts = [rx.medication_name || "Unnamed medication"];
  if (rx.dosage) parts.push(rx.dosage);
  const freq = summariseFrequency(rx);
  if (freq) parts.push(freq);
  if (rx.route) parts.push(rx.route);
  return parts.filter(Boolean).join(" · ");
}

export function PrescriptionReviewList({
  previousPrescriptions,
  reviews,
  onReviewsChange,
  disabled = false,
}: PrescriptionReviewListProps) {
  if (previousPrescriptions.length === 0) return null;

  const reviewFor = (rx: Prescription): PrescriptionReview | undefined =>
    reviews.find((r) => r.prescription_id === rx.id);

  const upsert = (
    rx: Prescription,
    patch: Partial<PrescriptionReview>
  ) => {
    const existing = reviewFor(rx);
    if (existing) {
      onReviewsChange(
        reviews.map((r) =>
          r.prescription_id === rx.id ? { ...r, ...patch } : r
        )
      );
    } else {
      // First interaction — snapshot previous details so the letter generator
      // can print them without cross-visit queries.
      const newReview: PrescriptionReview = {
        prescription_id: rx.id,
        source_encounter_id: rx.prescribed_at_encounter_id,
        previous_medication_name: rx.medication_name,
        previous_dosage: rx.dosage,
        previous_frequency: summariseFrequency(rx),
        ...patch,
      };
      onReviewsChange([...reviews, newReview]);
    }
  };

  return (
    <div
      className={cn(
        "space-y-3",
        disabled && "pointer-events-none opacity-70"
      )}
    >
      <p className="text-xs text-muted-foreground">
        Medications from the most recent previous visit. Record benefit,
        tolerability, and action for each.
      </p>

      {previousPrescriptions.map((rx) => {
        const review = reviewFor(rx);
        const action = review?.action || "";
        const showStopReason = action === "stop";
        const showNewDose =
          action === "increase" || action === "decrease" || action === "switch";

        return (
          <div key={rx.id} className="rounded-lg border p-3 space-y-3">
            <div>
              <p className="text-sm font-medium">{describePrevious(rx)}</p>
              {rx.indication && (
                <p className="text-xs text-muted-foreground">
                  Indication: {rx.indication}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Benefit</Label>
                <Select
                  value={review?.benefit || ""}
                  onValueChange={(val) => upsert(rx, { benefit: val })}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BENEFIT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {BENEFIT_LABELS[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tolerability</Label>
                <Select
                  value={review?.tolerability || ""}
                  onValueChange={(val) => upsert(rx, { tolerability: val })}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOLERABILITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {TOLERABILITY_LABELS[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Action</Label>
                <Select
                  value={review?.action || ""}
                  onValueChange={(val) => upsert(rx, { action: val })}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {ACTION_LABELS[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showStopReason && (
              <div className="space-y-1">
                <Label className="text-xs">Reason for stopping</Label>
                <Textarea
                  value={review?.stop_reason || ""}
                  onChange={(e) => upsert(rx, { stop_reason: e.target.value })}
                  placeholder="e.g. Intolerable dizziness; no benefit after 8 weeks"
                  className="min-h-[60px]"
                />
              </div>
            )}

            {showNewDose && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">New Dose</Label>
                  <Input
                    value={review?.new_dose || ""}
                    onChange={(e) => upsert(rx, { new_dose: e.target.value })}
                    placeholder="e.g. 100mg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">New Frequency</Label>
                  <Select
                    value={review?.new_frequency || ""}
                    onValueChange={(val) => upsert(rx, { new_frequency: val })}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
