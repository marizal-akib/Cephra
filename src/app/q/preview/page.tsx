"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  QUESTIONS,
  QUESTION_GROUPS,
} from "@/lib/schemas/questionnaire";
import { QuestionCard } from "@/components/questionnaire/question-inputs";

export default function QuestionnairePreviewPage() {
  const router = useRouter();
  const [groupIdx, setGroupIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});

  function closePreview() {
    if (window.opener || window.history.length <= 1) {
      window.close();
    } else {
      router.back();
    }
  }

  const groups = QUESTION_GROUPS;
  const currentGroup = groups[groupIdx];
  const groupQuestions = QUESTIONS.filter((q) => q.group === currentGroup.key);
  const totalGroups = groups.length;
  const progress = Math.round(((groupIdx + 1) / totalGroups) * 100);
  const isLastGroup = groupIdx === totalGroups - 1;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Preview banner */}
      <div className="sticky top-0 z-30 border-b border-amber-300 bg-amber-50 px-4 py-2">
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
            <Eye className="h-4 w-4" />
            Preview Mode — responses are not saved
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-amber-800 hover:text-amber-900"
            onClick={closePreview}
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <header className="sticky top-[41px] z-20 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Cephra Questionnaire
              </p>
              <p className="text-xs text-muted-foreground">
                Secure pre-visit intake
              </p>
            </div>
            <Badge variant="secondary" className="bg-slate-200 text-slate-800">
              Step {groupIdx + 1} of {totalGroups}
            </Badge>
          </div>
          <div className="mt-3">
            <Progress value={progress} />
          </div>
        </header>

        <section className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {currentGroup.label}
          </h2>

          {groupQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              value={responses[q.id]}
              onChange={(v) =>
                setResponses((prev) => ({ ...prev, [q.id]: v }))
              }
            />
          ))}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4" />
              Your answers are encrypted and only visible to your clinician.
            </p>
          </div>
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center gap-3">
          <Button
            variant="outline"
            className="h-11 flex-1"
            onClick={() => setGroupIdx((i) => Math.max(0, i - 1))}
            disabled={groupIdx === 0}
          >
            Back
          </Button>
          {isLastGroup ? (
            <Button className="h-11 flex-1" onClick={closePreview}>
              Close Preview
            </Button>
          ) : (
            <Button
              className="h-11 flex-1"
              onClick={() => setGroupIdx((i) => i + 1)}
            >
              Next
            </Button>
          )}
        </div>
        <div className="mx-auto mt-2 flex w-full max-w-md items-center justify-center gap-1 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {isLastGroup
            ? "End of preview"
            : `${totalGroups - groupIdx - 1} section${totalGroups - groupIdx - 1 > 1 ? "s" : ""} remaining`}
        </div>
      </footer>
    </main>
  );
}
