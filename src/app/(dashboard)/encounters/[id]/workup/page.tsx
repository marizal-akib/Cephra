"use client";

import { useEncounterContext } from "../layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkupPage() {
  const { encounterId, diagnosticOutput } = useEncounterContext();
  const router = useRouter();
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const workup = diagnosticOutput?.suggestedWorkup || [];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Suggested Work-up</h2>
        <p className="text-sm text-muted-foreground">
          Investigations and referrals suggested by the assessment and red-flag
          findings. Accept or decline each item.
        </p>
      </div>

      {workup.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No specific work-up suggested based on current assessment.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workup.map((item) => (
              <label
                key={item}
                className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
              >
                <Checkbox
                  checked={!!accepted[item]}
                  onCheckedChange={(checked) =>
                    setAccepted((prev) => ({
                      ...prev,
                      [item]: checked === true,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={() => router.push(`/encounters/${encounterId}/note`)}>
          Proceed to Clinic Note
        </Button>
      </div>
    </div>
  );
}
