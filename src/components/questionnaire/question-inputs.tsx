"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuestionDef } from "@/lib/schemas/questionnaire";

const optionBase =
  "w-full rounded-xl border px-4 py-4 text-left text-sm font-medium shadow-sm transition";
export const optionDefault =
  `${optionBase} border-slate-200 bg-white text-slate-900 hover:border-slate-300`;
export const optionSelected =
  `${optionBase} border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500`;

export function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: QuestionDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <Card className="gap-4 py-4">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-base">
          {question.label}
          {question.required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </CardTitle>
        {question.helpText && (
          <p className="mt-1 text-xs text-muted-foreground">
            {question.helpText}
          </p>
        )}
      </CardHeader>
      <CardContent className="px-4">
        {question.type === "boolean" && (
          <BooleanInput value={value as boolean | undefined} onChange={onChange} />
        )}
        {question.type === "select" && (
          <SelectInput
            options={question.options || []}
            value={value as string | undefined}
            onChange={onChange}
          />
        )}
        {question.type === "multiselect" && (
          <MultiselectInput
            options={question.options || []}
            value={(value as string[] | undefined) || []}
            onChange={onChange}
          />
        )}
        {question.type === "number" && (
          <NumberInput value={value as number | undefined} onChange={onChange} />
        )}
        {question.type === "text" && (
          <TextInput value={(value as string) || ""} onChange={onChange} />
        )}
        {question.type === "scale" && (
          <ScaleInput value={value as number | undefined} onChange={onChange} />
        )}
      </CardContent>
    </Card>
  );
}

export function BooleanInput({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { val: true, label: "Yes" },
        { val: false, label: "No" },
      ].map(({ val, label }) => (
        <button
          key={label}
          type="button"
          className={value === val ? optionSelected : optionDefault}
          onClick={() => onChange(val)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function SelectInput({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={value === o.value ? optionSelected : optionDefault}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function MultiselectInput({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }

  return (
    <div className="space-y-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={value.includes(o.value) ? optionSelected : optionDefault}
          onClick={() => toggle(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function NumberInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-12 text-base"
    />
  );
}

export function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="text-base"
    />
  );
}

export function ScaleInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium shadow-sm transition ${
              value === i
                ? "border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
            onClick={() => onChange(i)}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>No pain</span>
        <span>Worst pain</span>
      </div>
    </div>
  );
}
