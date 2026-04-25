"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  findMedicines,
  type IndicationDefaults,
  type MedicineEntry,
} from "@/lib/prescribing/medicines-catalogue";

type MedicationSearchSelectProps = {
  value: string;
  onSelectMedicine: (
    entry: MedicineEntry,
    indication: IndicationDefaults
  ) => void;
  onFreeTextChange: (raw: string) => void;
  topPhenotype?: string;
  disabled?: boolean;
  placeholder?: string;
};

function rankIndications(
  entry: MedicineEntry,
  topPhenotype?: string
): IndicationDefaults[] {
  if (!topPhenotype) return entry.indications;
  const needle = topPhenotype.toLowerCase();
  const matches = (ind: IndicationDefaults) => {
    const key = ind.indication_key.toLowerCase().replace(/_/g, " ");
    const label = ind.indication_label.toLowerCase();
    return key.includes(needle) || label.includes(needle);
  };
  const top = entry.indications.filter(matches);
  const rest = entry.indications.filter((ind) => !matches(ind));
  return [...top, ...rest];
}

function isPhenotypeMatch(
  ind: IndicationDefaults,
  topPhenotype?: string
): boolean {
  if (!topPhenotype) return false;
  const needle = topPhenotype.toLowerCase();
  const key = ind.indication_key.toLowerCase().replace(/_/g, " ");
  const label = ind.indication_label.toLowerCase();
  return key.includes(needle) || label.includes(needle);
}

export function MedicationSearchSelect({
  value,
  onSelectMedicine,
  onFreeTextChange,
  topPhenotype,
  disabled,
  placeholder = "Type a medicine, e.g. sumatriptan",
}: MedicationSearchSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const matches = useMemo(() => findMedicines(value, 8), [value]);
  const showDropdown = isFocused && matches.length > 0;

  return (
    <div className="relative">
      <Input
        value={value || ""}
        onChange={(e) => onFreeTextChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        placeholder={placeholder}
        aria-label="Medication name"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        autoComplete="off"
        disabled={disabled}
      />
      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 max-h-80 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
          {matches.map((entry) => {
            const ranked = rankIndications(entry, topPhenotype);
            return (
              <div
                key={entry.name}
                className="rounded-sm px-2 py-1.5 hover:bg-accent/40"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-popover-foreground">
                    {entry.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    — {entry.therapeutic_class}
                  </span>
                  {entry.high_risk_flag ? (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-amber-900">
                      High-risk
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {ranked.map((ind) => {
                    const highlight = isPhenotypeMatch(ind, topPhenotype);
                    return (
                      <button
                        key={`${entry.name}-${ind.indication_key}`}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          onSelectMedicine(entry, ind);
                          setIsFocused(false);
                        }}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs transition-colors",
                          highlight
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-popover-foreground hover:bg-accent"
                        )}
                      >
                        {ind.indication_label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
