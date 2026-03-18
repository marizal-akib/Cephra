"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function ToggleField({
  label,
  description,
  checked,
  onCheckedChange,
  className,
  disabled = false,
}: ToggleFieldProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 transition-colors",
        checked ? "border-primary bg-primary/5" : "hover:bg-muted/50",
        disabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
        !disabled && "cursor-pointer",
        className
      )}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <div>
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}
