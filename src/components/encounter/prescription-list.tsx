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
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  DURATION_UNIT_OPTIONS,
  FREQUENCY_OPTIONS,
  ROUTE_OPTIONS,
  type Prescription,
} from "@/lib/schemas/prescription";
import { MedicationSearchSelect } from "@/components/encounter/medication-search-select";
import type {
  IndicationDefaults,
  MedicineEntry,
} from "@/lib/prescribing/medicines-catalogue";
import type { MedsFormData } from "@/lib/schemas/meds";
import {
  detectDuplicateRows,
  detectMedicationOveruseFromPhenotypes,
  detectMedicationOveruseRisk,
} from "@/lib/prescribing/safety-rules";

interface PrescriptionListProps {
  value: Prescription[];
  onChange: (next: Prescription[]) => void;
  encounterId: string;
  defaultPrescriberName?: string;
  defaultIndication?: string;
  topPhenotype?: string;
  medsData?: MedsFormData | null;
  phenotypeLabels?: string[];
  disabled?: boolean;
}

const SIGNED_STATUSES: ReadonlySet<NonNullable<Prescription["status"]>> =
  new Set(["signed", "transmitted"]);
const TERMINAL_STATUSES: ReadonlySet<NonNullable<Prescription["status"]>> =
  new Set(["stopped", "cancelled", "superseded"]);

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
    status: "draft",
    created_at: nowISO(),
    updated_at: nowISO(),
  };
}

function statusLabel(status?: Prescription["status"]): string {
  if (!status) return "Draft";
  switch (status) {
    case "draft":
      return "Draft";
    case "ready_to_sign":
      return "Ready to sign";
    case "signed":
      return "Signed";
    case "transmitted":
      return "Transmitted";
    case "active":
      return "Active";
    case "amended":
      return "Amended";
    case "stopped":
      return "Stopped";
    case "cancelled":
      return "Cancelled";
    case "superseded":
      return "Superseded";
    default:
      return status;
  }
}

function statusBadgeClass(status?: Prescription["status"]): string {
  if (!status || status === "draft" || status === "ready_to_sign")
    return "border-amber-200 bg-amber-50 text-amber-900";
  if (SIGNED_STATUSES.has(status))
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (TERMINAL_STATUSES.has(status))
    return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-border bg-muted text-foreground";
}

export function PrescriptionList({
  value,
  onChange,
  encounterId,
  defaultPrescriberName,
  defaultIndication,
  topPhenotype,
  medsData,
  phenotypeLabels,
  disabled = false,
}: PrescriptionListProps) {
  const update = (idx: number, patch: Partial<Prescription>) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patch, updated_at: nowISO() };
    onChange(next);
  };

  const sign = (idx: number) => {
    update(idx, {
      status: "signed",
      signed_by: value[idx]?.prescriber_name || defaultPrescriberName || "",
      signed_at: nowISO(),
    });
  };

  const unsign = (idx: number) => {
    update(idx, {
      status: "draft",
      signed_by: "",
      signed_at: "",
    });
  };

  const duplicates = useMemo(() => detectDuplicateRows(value), [value]);
  const mohWarning = useMemo(
    () => detectMedicationOveruseRisk(medsData ?? null),
    [medsData]
  );
  const mohPhenotypeWarning = useMemo(
    () => detectMedicationOveruseFromPhenotypes(phenotypeLabels ?? []),
    [phenotypeLabels]
  );

  const applyCatalogueDefaults = (
    idx: number,
    entry: MedicineEntry,
    ind: IndicationDefaults
  ) => {
    const current = value[idx];
    if (!current) return;
    const isEmpty = (v: unknown) =>
      v === undefined || v === null || (typeof v === "string" && v.trim() === "");

    const patch: Partial<Prescription> = {
      medication_name: entry.name,
    };

    if (isEmpty(current.category)) patch.category = ind.category;
    if (isEmpty(current.dosage)) patch.dosage = ind.default_strength;
    // Treat the seeded "oral" default on a fresh row as still-empty so
    // selecting e.g. sumatriptan SC actually overrides it.
    if (isEmpty(current.route) || current.route === "oral")
      patch.route = ind.default_route;
    if (isEmpty(current.frequency)) patch.frequency = ind.default_frequency;
    if (
      ind.default_frequency === "custom" &&
      ind.default_frequency_custom &&
      isEmpty(current.frequency_custom)
    ) {
      patch.frequency_custom = ind.default_frequency_custom;
    }
    if (current.duration_value === undefined && ind.default_duration_value !== undefined)
      patch.duration_value = ind.default_duration_value;
    if (isEmpty(current.duration_unit) && ind.default_duration_unit)
      patch.duration_unit = ind.default_duration_unit;
    if (isEmpty(current.quantity) && ind.default_quantity)
      patch.quantity = ind.default_quantity;
    if (isEmpty(current.indication)) patch.indication = ind.indication_label;

    if (isEmpty(current.special_instructions)) {
      const directions = ind.default_special_instructions?.trim();
      const max = ind.max_daily_dose?.trim();
      const composed = [directions, max ? `Max daily dose: ${max}.` : null]
        .filter(Boolean)
        .join("\n");
      if (composed) patch.special_instructions = composed;
    }

    update(idx, patch);
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
        const isSigned = rx.status ? SIGNED_STATUSES.has(rx.status) : false;
        const dupWarning = duplicates.get(idx);
        const showMOH =
          rx.category === "acute" && (mohWarning || mohPhenotypeWarning);
        return (
          <div
            key={rx.id || idx}
            className={cn(
              "rounded-lg border p-3 space-y-3",
              isSigned && "border-emerald-200 bg-emerald-50/30"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Prescription {idx + 1}
                {rx.medication_name ? ` — ${rx.medication_name}` : ""}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    statusBadgeClass(rx.status)
                  )}
                >
                  {statusLabel(rx.status)}
                </span>
                {isSigned ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => unsign(idx)}
                    disabled={disabled}
                  >
                    Unsign
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => sign(idx)}
                    disabled={disabled || !rx.medication_name}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Sign
                  </Button>
                )}
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
            </div>

            {isSigned && rx.signed_by ? (
              <p className="text-[11px] text-emerald-800">
                Signed by {rx.signed_by}
                {rx.signed_at
                  ? ` on ${new Date(rx.signed_at).toLocaleString()}`
                  : ""}
                .
              </p>
            ) : null}

            {dupWarning ? (
              <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong>Soft warning</strong> — {dupWarning.message}
                </span>
              </div>
            ) : null}

            {showMOH ? (
              <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong>Soft warning</strong> —{" "}
                  {(mohPhenotypeWarning ?? mohWarning)?.message}
                </span>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Medication Name</Label>
                <MedicationSearchSelect
                  value={rx.medication_name || ""}
                  onFreeTextChange={(raw) => update(idx, { medication_name: raw })}
                  onSelectMedicine={(entry, ind) =>
                    applyCatalogueDefaults(idx, entry, ind)
                  }
                  topPhenotype={topPhenotype}
                  disabled={disabled}
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
