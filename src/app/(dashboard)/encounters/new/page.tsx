"use client";

import { Suspense } from "react";
import { NewAssessmentFlow } from "@/components/encounters/new-assessment-flow";

export default function NewEncounterPage() {
  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <Suspense>
        <NewAssessmentFlow />
      </Suspense>
    </div>
  );
}
