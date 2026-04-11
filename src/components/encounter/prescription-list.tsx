"use client";

import { Button } from "@/components/ui/button";
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
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  DURATION_UNIT_OPTIONS,
  FREQUENCY_OPTIONS,
  ROUTE_OPTIONS,
  type Prescription,
} from "@/lib/schemas/prescription";

interface PrescriptionListProps {
  value: Prescription[];
  onChange: (next: Prescription[]) => void;
  encounterId: string;
  defaultPrescriberName?: string;
  defaultIndication?: string;
  disabled?: boolean;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowISO(): string {
  return new Date().toISOString();
}

function newPrescription(
  encounterId: string,
  defaults: { prescriberName?: string; indication?: string }
): Prescription {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `rx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    prescribed_at_encounter_id: encounterId,
    medication_name: "",
    dosage: "",
    frequency: "",
    frequency_custom: "",
    route: "oral",
    duration_value: undefined,
    duration_unit: "",
    quantity: "",
    category: "",
    indication: defaults.indication || "",
    special_instructions: "",
    prescriber_name: defaults.prescriberName || "",
    prescribed_date: todayISO(),
    status: "active",
    created_at: nowISO(),
    updated_at: nowISO(),
  };
}

export function PrescriptionList({
  value,
  onChange,
  encounterId,
  defaultPrescriberName,
  defaultIndication,
  disabled = false,
}: PrescriptionListProps) {
  const update = (idx: number, patch: Partial<Prescription>) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patch, updated_at: nowISO() };
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const add = () => {
    onChange([
      ...value,
      newPrescription(encounterId, {
        prescriberName: defaultPrescriberName,
        indication: defaultIndication,
      }),
    ]);
  };

  return (
    <div
      className={cn(
        "space-y-3",
        disabled && "pointer-events-none opacity-70"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Record each medication prescribed or amended at this visit. Prescriber
          and date auto-fill and remain editable.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={add}
          disabled={disabled}
        >
          <Plus className="h-3 w-3" />
          Add Medication
        </Button>
      </div>

      {value.length === 0 && (
        <p className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
          No prescriptions added yet.
        </p>
      )}

      {value.map((rx, idx) => {
        const isCustomFreq = rx.frequency === "custom";
        return (
          <div
            key={rx.id || idx}
            className="rounded-lg border p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Prescription {idx + 1}
                {rx.medication_name ? ` — ${rx.medication_name}` : ""}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => remove(idx)}
                disabled={disabled}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Medication Name</Label>
                <Input
                  value={rx.medication_name || ""}
                  onChange={(e) => update(idx, { medication_name: e.target.value })}
                  placeholder="e.g. Propranolol"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select
                  value={rx.category || ""}
                  onValueChange={(val) => update(idx, { category: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {CATEGORY_LABELS[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Dosage</Label>
                <Input
                  value={rx.dosage || ""}
                  onChange={(e) => update(idx, { dosage: e.target.value })}
                  placeholder="e.g. 50mg"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Route</Label>
                <Select
                  value={rx.route || "oral"}
                  onValueChange={(val) => update(idx, { route: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROUTE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Frequency</Label>
              <Select
                value={rx.frequency || ""}
                onValueChange={(val) =>
                  update(idx, {
                    frequency: val,
                    frequency_custom: val === "custom" ? rx.frequency_custom : "",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isCustomFreq && (
                <div className="space-y-1 mt-1.5">
                  <Label className="text-xs">Custom Frequency</Label>
                  <Input
                    value={rx.frequency_custom || ""}
                    onChange={(e) =>
                      update(idx, { frequency_custom: e.target.value })
                    }
                    placeholder="e.g. every 6 hours when required"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Duration</Label>
                <Input
                  type="number"
                  min={0}
                  value={
                    typeof rx.duration_value === "number"
                      ? String(rx.duration_value)
                      : ""
                  }
                  onChange={(e) =>
                    update(idx, {
                      duration_value:
                        e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="e.g. 28"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unit</Label>
                <Select
                  value={rx.duration_unit || ""}
                  onValueChange={(val) => update(idx, { duration_unit: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_UNIT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Quantity</Label>
                <Input
                  value={rx.quantity || ""}
                  onChange={(e) => update(idx, { quantity: e.target.value })}
                  placeholder="e.g. 28 tablets"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Indication</Label>
              <Input
                value={rx.indication || ""}
                onChange={(e) => update(idx, { indication: e.target.value })}
                placeholder="e.g. Migraine prevention"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Special Instructions / Notes</Label>
              <Textarea
                value={rx.special_instructions || ""}
                onChange={(e) =>
                  update(idx, { special_instructions: e.target.value })
                }
                placeholder="e.g. Titrate up over 2 weeks. Avoid in asthma."
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Prescriber</Label>
                <Input
                  value={rx.prescriber_name || ""}
                  onChange={(e) =>
                    update(idx, { prescriber_name: e.target.value })
                  }
                  placeholder="Clinician name"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={rx.prescribed_date || ""}
                  onChange={(e) =>
                    update(idx, { prescribed_date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
