"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  QUESTIONS,
  QUESTION_GROUPS,
} from "@/lib/schemas/questionnaire";
import {
  QuestionCard,
} from "@/components/questionnaire/question-inputs";

type Responses = Record<string, unknown>;
type PageState = "loading" | "verify" | "questions" | "error";

export default function QuestionnairePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [hasDob, setHasDob] = useState(false);

  // Verification form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Questionnaire state
  const [groupIdx, setGroupIdx] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch(`/api/questionnaire/${token}`);
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setTokenError(body.error || "This questionnaire link is invalid.");
          setPageState("error");
        } else {
          setHasDob(body.verification?.hasDob ?? false);
          setPageState("verify");
        }
      } catch {
        setTokenError("Unable to verify questionnaire link.");
        setPageState("error");
      }
    }
    validate();
  }, [token]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifyError(null);
    setVerifying(true);
    try {
      const res = await fetch(`/api/questionnaire/${token}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, dateOfBirth: dateOfBirth || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setVerifyError(data.error || "Verification failed. Please try again.");
        return;
      }
      setPageState("questions");
    } catch {
      setVerifyError("Network error. Please check your connection and try again.");
    } finally {
      setVerifying(false);
    }
  }

  const groups = QUESTION_GROUPS;
  const currentGroup = groups[groupIdx];
  const groupQuestions = QUESTIONS.filter((q) => q.group === currentGroup.key);
  const totalGroups = groups.length;
  const progress = Math.round(((groupIdx + 1) / totalGroups) * 100);
  const isLastGroup = groupIdx === totalGroups - 1;

  const setAnswer = useCallback((id: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  }, []);

  function getRequiredUnanswered(): string[] {
    const groupQuestions = QUESTIONS.filter((q) => q.group === currentGroup.key);
    return groupQuestions
      .filter((q) => q.required && (responses[q.id] === undefined || responses[q.id] === null || responses[q.id] === ""))
      .map((q) => q.label);
  }

  async function handleSubmit() {
    const unanswered = getRequiredUnanswered();
    if (unanswered.length > 0) {
      setSubmitError(`Please answer all required questions before submitting.`);
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/questionnaire/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Submission failed. Please try again.");
        return;
      }
      router.push(
        `/q/${token}/complete?ref=${encodeURIComponent(data.referenceNumber)}`
      );
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (pageState === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (pageState === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="text-base">Link Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tokenError}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (pageState === "verify") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Verify Your Identity</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Please confirm your details to access your questionnaire.
            </p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5 text-xs text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Your information is kept secure and confidential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="kyc-first">First Name</Label>
                    <Input
                      id="kyc-first"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Sarah"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="kyc-last">Last Name</Label>
                    <Input
                      id="kyc-last"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Jones"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                {hasDob && (
                  <div className="space-y-1.5">
                    <Label htmlFor="kyc-dob">Date of Birth</Label>
                    <Input
                      id="kyc-dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                      autoComplete="bday"
                    />
                  </div>
                )}

                {verifyError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
                    {verifyError}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={verifying}>
                  {verifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Continue to Questionnaire"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            Having trouble? Contact your clinic for assistance.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <header className="sticky top-0 z-20 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
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
              onChange={(v) => setAnswer(q.id, v)}
            />
          ))}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4" />
              Your answers are encrypted and only visible to your clinician.
            </p>
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {submitError}
            </div>
          )}
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center gap-3">
          <Button
            variant="outline"
            className="h-11 flex-1"
            onClick={() => setGroupIdx((i) => Math.max(0, i - 1))}
            disabled={groupIdx === 0 || submitting}
          >
            Back
          </Button>
          {isLastGroup ? (
            <Button
              className="h-11 flex-1"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Questionnaire"
              )}
            </Button>
          ) : (
            <Button
              className="h-11 flex-1"
              onClick={() => {
                const unanswered = getRequiredUnanswered();
                if (unanswered.length > 0) {
                  setSubmitError("Please answer all required questions before continuing.");
                  return;
                }
                setSubmitError(null);
                setGroupIdx((i) => i + 1);
              }}
            >
              Next
            </Button>
          )}
        </div>
        <div className="mx-auto mt-2 flex w-full max-w-md items-center justify-center gap-1 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {isLastGroup
            ? "Last section — review and submit"
            : `${totalGroups - groupIdx - 1} section${totalGroups - groupIdx - 1 > 1 ? "s" : ""} remaining`}
        </div>
      </footer>
    </main>
  );
}

