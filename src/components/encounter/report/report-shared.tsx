/**
 * Shared read-only display primitives for the Assessment Report.
 *
 * Kept intentionally small: a section wrapper, a label/value row, and a
 * humanize helper for rendering snake_case JSONB fields without writing a
 * label map for every section.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ReportSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">{children}</CardContent>
    </Card>
  );
}

/**
 * Renders a single label/value row. Returns null if the value is empty so
 * callers can list every possible field without littering the UI with blanks.
 */
export function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: unknown;
  mono?: boolean;
}) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  if (typeof value === "boolean" && value === false) return null;
  if (Array.isArray(value) && value.length === 0) return null;

  let rendered: React.ReactNode;
  if (typeof value === "boolean") {
    rendered = <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">Yes</Badge>;
  } else if (Array.isArray(value)) {
    rendered = value.join(", ");
  } else {
    rendered = String(value);
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/40 py-1.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("text-right font-medium", mono && "font-mono text-xs")}>
        {rendered}
      </dd>
    </div>
  );
}

/**
 * Render every non-empty field in a section JSONB blob.
 *
 * For each key in `entries`:
 *   - skip if value is empty (Field handles this)
 *   - use the label from `labels` map if provided, else humanize the key
 *   - skip keys in `skip` (e.g. notes/detail fields rendered separately)
 */
export function FieldGrid({
  data,
  labels = {},
  skip = [],
}: {
  data: Record<string, unknown> | null | undefined;
  labels?: Record<string, string>;
  skip?: string[];
}) {
  if (!data) return <EmptyState />;
  const keys = Object.keys(data).filter((k) => !skip.includes(k));
  const rendered = keys.map((key) => (
    <Field key={key} label={labels[key] ?? humanize(key)} value={data[key]} />
  ));
  // Count how many actually rendered (Field returns null for empty)
  const hasAny = keys.some((k) => {
    const v = data[k];
    if (v === null || v === undefined) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    if (typeof v === "boolean" && v === false) return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  });
  if (!hasAny) return <EmptyState />;
  return <dl className="space-y-0">{rendered}</dl>;
}

export function EmptyState({ text = "No data recorded." }: { text?: string }) {
  return <p className="text-xs italic text-muted-foreground">{text}</p>;
}

export function NotesBlock({ notes }: { notes: unknown }) {
  if (typeof notes !== "string" || !notes.trim()) return null;
  return (
    <div className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <p className="mb-1 font-medium text-foreground">Notes</p>
      <p className="whitespace-pre-wrap">{notes}</p>
    </div>
  );
}

/**
 * snake_case → "Title case"
 *   `first_headache_age` → "First headache age"
 *   `bp_systolic` → "Bp systolic"
 */
export function humanize(key: string): string {
  if (!key) return "";
  const spaced = key.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatDate(value: unknown, fallback = "—"): string {
  if (typeof value !== "string" || !value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: unknown, fallback = "—"): string {
  if (typeof value !== "string" || !value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateAge(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
