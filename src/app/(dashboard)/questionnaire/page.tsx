"use client";

import { useState, useCallback } from "react";
import {
  QUESTIONS,
  QUESTION_GROUPS,
  type QuestionDef,
} from "@/lib/schemas/questionnaire";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Pencil,
  Plus,
  Trash2,
  GripVertical,
  LayoutList,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

type QuestionType = QuestionDef["type"];

const TYPE_LABELS: Record<QuestionType, string> = {
  boolean: "Yes / No",
  select: "Single Choice",
  multiselect: "Multi Choice",
  number: "Number",
  text: "Text",
  scale: "Scale (0–10)",
};

const TYPE_COLORS: Record<QuestionType, string> = {
  boolean: "bg-emerald-100 text-emerald-800",
  select: "bg-blue-100 text-blue-800",
  multiselect: "bg-purple-100 text-purple-800",
  number: "bg-amber-100 text-amber-800",
  text: "bg-slate-100 text-slate-700",
  scale: "bg-rose-100 text-rose-800",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function QuestionnairePage() {
  const [view, setView] = useState<"overview" | "preview">("overview");
  const [questions, setQuestions] = useState<QuestionDef[]>(QUESTIONS);

  const groupedQuestions = QUESTION_GROUPS.map((g) => ({
    ...g,
    questions: questions.filter((q) => q.group === g.key),
  }));

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Patient Questionnaire</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage the pre-visit intake form sent to patients
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "overview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("overview")}
              className="gap-2"
            >
              <LayoutList className="h-4 w-4" />
              All Forms
            </Button>
            <Button
              variant={view === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("preview")}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {view === "overview" ? (
          <OverviewView
            groupedQuestions={groupedQuestions}
            questions={questions}
            setQuestions={setQuestions}
          />
        ) : (
          <PreviewView groupedQuestions={groupedQuestions} />
        )}
      </div>
    </div>
  );
}

// ─── Overview View ────────────────────────────────────────────────────────────
function OverviewView({
  groupedQuestions,
  questions,
  setQuestions,
}: {
  groupedQuestions: (typeof QUESTION_GROUPS[number] & { questions: QuestionDef[] })[];
  questions: QuestionDef[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionDef[]>>;
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(groupedQuestions.map((g) => g.key))
  );
  const [editingGroup, setEditingGroup] = useState<string | null>(null);

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const totalQuestions = questions.length;
  const requiredCount = questions.filter((q) => q.required).length;

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Form Sections" value={groupedQuestions.length} />
        <StatCard label="Total Questions" value={totalQuestions} />
        <StatCard label="Required Fields" value={requiredCount} />
      </div>

      {/* Group cards */}
      <div className="space-y-3">
        {groupedQuestions.map((group) => {
          const isExpanded = expandedGroups.has(group.key);
          return (
            <Card key={group.key} className="overflow-hidden">
              <div
                className="flex cursor-pointer items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                onClick={() => toggleGroup(group.key)}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-sm">{group.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {group.questions.length} question{group.questions.length !== 1 ? "s" : ""}
                      {" · "}
                      {group.questions.filter((q) => q.required).length} required
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGroup(group.key);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <>
                  <Separator />
                  <div className="divide-y divide-border">
                    {group.questions.map((q, idx) => (
                      <div key={q.id} className="flex items-start gap-3 px-5 py-3">
                        <span className="mt-0.5 min-w-[1.5rem] text-xs font-medium text-muted-foreground">
                          {idx + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug">
                            {q.label}
                            {q.required && (
                              <span className="ml-1 text-red-500 text-xs">*</span>
                            )}
                          </p>
                          {q.helpText && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {q.helpText}
                            </p>
                          )}
                          {q.options && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {q.options.map((o) => (
                                <span
                                  key={o.value}
                                  className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                >
                                  {o.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`shrink-0 text-xs font-normal ${TYPE_COLORS[q.type]}`}
                        >
                          {TYPE_LABELS[q.type]}
                        </Badge>
                      </div>
                    ))}

                    {group.questions.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-1 px-5 py-8 text-center">
                        <AlertCircle className="h-5 w-5 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No questions in this section</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => setEditingGroup(group.key)}
                        >
                          Add a question
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      {editingGroup && (
        <EditGroupDialog
          groupKey={editingGroup}
          groupLabel={groupedQuestions.find((g) => g.key === editingGroup)?.label ?? ""}
          questions={questions.filter((q) => q.group === editingGroup)}
          onClose={() => setEditingGroup(null)}
          onSave={(updated) => {
            setQuestions((prev) => {
              const withoutGroup = prev.filter((q) => q.group !== editingGroup);
              return [...withoutGroup, ...updated];
            });
            setEditingGroup(null);
            toast.success("Section updated");
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="py-4">
      <CardContent className="flex flex-col gap-0.5">
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

// ─── Edit Group Dialog ────────────────────────────────────────────────────────
function EditGroupDialog({
  groupKey,
  groupLabel,
  questions,
  onClose,
  onSave,
}: {
  groupKey: string;
  groupLabel: string;
  questions: QuestionDef[];
  onClose: () => void;
  onSave: (updated: QuestionDef[]) => void;
}) {
  const [draft, setDraft] = useState<QuestionDef[]>(
    questions.map((q) => ({ ...q, options: q.options ? [...q.options] : undefined }))
  );
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  function updateQuestion(id: string, patch: Partial<QuestionDef>) {
    setDraft((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  }

  function removeQuestion(id: string) {
    setDraft((prev) => prev.filter((q) => q.id !== id));
  }

  function addQuestion() {
    const newQ: QuestionDef = {
      id: `q_${Date.now()}`,
      group: groupKey,
      type: "boolean",
      label: "New question",
      required: false,
    };
    setDraft((prev) => [...prev, newQ]);
    setExpandedQ(newQ.id);
  }

  function moveQuestion(idx: number, dir: -1 | 1) {
    const next = [...draft];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setDraft(next);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Section — {groupLabel}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {draft.map((q, idx) => {
            const isOpen = expandedQ === q.id;
            return (
              <div
                key={q.id}
                className="rounded-lg border border-border bg-background overflow-hidden"
              >
                {/* Question row header */}
                <div
                  className="flex cursor-pointer items-center gap-2 px-4 py-3 hover:bg-muted/30"
                  onClick={() => setExpandedQ(isOpen ? null : q.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {q.label}
                      {q.required && <span className="ml-1 text-red-500 text-xs">*</span>}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`shrink-0 text-xs font-normal ${TYPE_COLORS[q.type]}`}
                  >
                    {TYPE_LABELS[q.type]}
                  </Badge>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={idx === 0}
                      onClick={() => moveQuestion(idx, -1)}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={idx === draft.length - 1}
                      onClick={() => moveQuestion(idx, 1)}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeQuestion(q.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>

                {/* Expanded edit fields */}
                {isOpen && (
                  <div className="border-t border-border bg-muted/20 px-4 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs">Question Label</Label>
                        <Input
                          value={q.label}
                          onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Question Type</Label>
                        <Select
                          value={q.type}
                          onValueChange={(v) =>
                            updateQuestion(q.id, { type: v as QuestionType })
                          }
                        >
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => (
                              <SelectItem key={t} value={t}>
                                {TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-3 pt-5">
                        <Switch
                          id={`required-${q.id}`}
                          checked={q.required}
                          onCheckedChange={(v) => updateQuestion(q.id, { required: v })}
                        />
                        <Label htmlFor={`required-${q.id}`} className="text-xs cursor-pointer">
                          Required
                        </Label>
                      </div>

                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs">Help Text (optional)</Label>
                        <Textarea
                          value={q.helpText ?? ""}
                          rows={2}
                          onChange={(e) =>
                            updateQuestion(q.id, { helpText: e.target.value || undefined })
                          }
                          placeholder="Shown below the question label…"
                          className="text-sm resize-none"
                        />
                      </div>

                      {(q.type === "select" || q.type === "multiselect") && (
                        <div className="col-span-2 space-y-2">
                          <Label className="text-xs">Options</Label>
                          {(q.options ?? []).map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <Input
                                value={opt.label}
                                onChange={(e) => {
                                  const opts = [...(q.options ?? [])];
                                  opts[oi] = { value: opts[oi].value, label: e.target.value };
                                  updateQuestion(q.id, { options: opts });
                                }}
                                className="text-sm h-8"
                                placeholder="Option label"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                                onClick={() => {
                                  const opts = (q.options ?? []).filter((_, i) => i !== oi);
                                  updateQuestion(q.id, { options: opts });
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => {
                              const opts = [
                                ...(q.options ?? []),
                                {
                                  value: `option_${Date.now()}`,
                                  label: "New option",
                                },
                              ];
                              updateQuestion(q.id, { options: opts });
                            }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add option
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-sm border-dashed"
            onClick={addQuestion}
          >
            <Plus className="h-4 w-4" />
            Add question
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Preview View ─────────────────────────────────────────────────────────────
function PreviewView({
  groupedQuestions,
}: {
  groupedQuestions: (typeof QUESTION_GROUPS[number] & { questions: QuestionDef[] })[];
}) {
  const [groupIdx, setGroupIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});

  const currentGroup = groupedQuestions[groupIdx];
  const totalGroups = groupedQuestions.length;
  const progress = Math.round(((groupIdx + 1) / totalGroups) * 100);
  const isLastGroup = groupIdx === totalGroups - 1;

  const setAnswer = useCallback((id: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <div className="flex gap-6">
      {/* Left: controls */}
      <div className="w-56 shrink-0 space-y-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Sections
          </p>
          <div className="space-y-1">
            {groupedQuestions.map((g, i) => (
              <button
                key={g.key}
                onClick={() => setGroupIdx(i)}
                className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                  i === groupIdx
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="mr-2 text-xs opacity-60">{i + 1}.</span>
                {g.label}
              </button>
            ))}
          </div>
        </Card>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800 font-medium">Preview mode</p>
          <p className="text-xs text-amber-700 mt-1">
            This is how patients see the questionnaire on their device.
          </p>
        </div>
      </div>

      {/* Right: phone-style preview */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-sm">
          {/* Simulated phone frame */}
          <div className="rounded-2xl border-2 border-slate-300 bg-slate-50 shadow-xl overflow-hidden">
            {/* Status bar */}
            <div className="flex items-center justify-between bg-white px-4 py-2 text-xs text-slate-500 border-b border-slate-200">
              <span className="font-medium">Cephra Questionnaire</span>
              <span>
                Step {groupIdx + 1} of {totalGroups}
              </span>
            </div>
            <Progress value={progress} className="h-1 rounded-none" />

            {/* Content */}
            <div className="px-4 py-4 space-y-4 min-h-[420px] max-h-[560px] overflow-y-auto">
              <h2 className="text-base font-semibold text-slate-900">
                {currentGroup.label}
              </h2>

              {currentGroup.questions.map((q) => (
                <PreviewQuestionCard
                  key={q.id}
                  question={q}
                  value={responses[q.id]}
                  onChange={(v) => setAnswer(q.id, v)}
                />
              ))}

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <p className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Answers are encrypted and only visible to your clinician.
                </p>
              </div>
            </div>

            {/* Footer nav */}
            <div className="border-t border-slate-200 bg-white px-4 py-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                  onClick={() => setGroupIdx((i) => Math.max(0, i - 1))}
                  disabled={groupIdx === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  className="flex-1 h-10 text-sm"
                  onClick={() => {
                    if (!isLastGroup) setGroupIdx((i) => i + 1);
                  }}
                >
                  {isLastGroup ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Submit
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {isLastGroup
                  ? "Last section — review and submit"
                  : `${totalGroups - groupIdx - 1} section${
                      totalGroups - groupIdx - 1 > 1 ? "s" : ""
                    } remaining`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Preview Question Card ─────────────────────────────────────────────────────
function PreviewQuestionCard({
  question,
  value,
  onChange,
}: {
  question: QuestionDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <p className="text-sm font-medium leading-snug text-slate-900">
          {question.label}
          {question.required && <span className="ml-1 text-red-500">*</span>}
        </p>
        {question.helpText && (
          <p className="mt-0.5 text-xs text-muted-foreground">{question.helpText}</p>
        )}
      </div>
      <div className="px-4 pb-3">
        {question.type === "boolean" && (
          <PreviewBoolean value={value as boolean | undefined} onChange={onChange} />
        )}
        {question.type === "select" && (
          <PreviewSelect
            options={question.options || []}
            value={value as string | undefined}
            onChange={onChange}
          />
        )}
        {question.type === "multiselect" && (
          <PreviewMultiselect
            options={question.options || []}
            value={(value as string[] | undefined) || []}
            onChange={onChange}
          />
        )}
        {question.type === "number" && (
          <Input
            type="number"
            inputMode="numeric"
            value={(value as number | undefined) ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-10 text-sm"
          />
        )}
        {question.type === "text" && (
          <Textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        )}
        {question.type === "scale" && (
          <PreviewScale value={value as number | undefined} onChange={onChange} />
        )}
      </div>
    </div>
  );
}

const optBase = "w-full rounded-lg border px-3 py-2.5 text-left text-xs font-medium shadow-sm transition";
const optDefault = `${optBase} border-slate-200 bg-white text-slate-900 hover:border-slate-300`;
const optSelected = `${optBase} border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500`;

function PreviewBoolean({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[{ val: true, label: "Yes" }, { val: false, label: "No" }].map(({ val, label }) => (
        <button
          key={label}
          type="button"
          className={value === val ? optSelected : optDefault}
          onClick={() => onChange(val)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function PreviewSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={value === o.value ? optSelected : optDefault}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PreviewMultiselect({
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
    <div className="space-y-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={value.includes(o.value) ? optSelected : optDefault}
          onClick={() => toggle(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PreviewScale({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition ${
              value === i
                ? "border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
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
