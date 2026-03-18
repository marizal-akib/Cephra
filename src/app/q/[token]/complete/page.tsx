"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function QuestionnaireCompletePage() {
  const searchParams = useSearchParams();
  const referenceNumber = searchParams.get("ref");
  const [copied, setCopied] = useState(false);

  async function copyRef() {
    if (!referenceNumber) return;
    await navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Thank You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your questionnaire has been submitted successfully. Your clinician
            will review your responses before your consultation.
          </p>

          {referenceNumber && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-medium text-muted-foreground">
                Your Reference Number
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-slate-900">
                {referenceNumber}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 gap-1.5 text-xs text-muted-foreground"
                onClick={copyRef}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy reference
                  </>
                )}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Please save this number for your records. You may need it when
                contacting your clinician.
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            You can now close this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
