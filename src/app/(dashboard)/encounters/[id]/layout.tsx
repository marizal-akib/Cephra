"use client";

import { use } from "react";
import { useEncounter } from "@/hooks/use-encounter";
import { useDiagnosis } from "@/hooks/use-diagnosis";
import { StepNav, StepNavLinks } from "@/components/layout/step-nav";
import { DiagnosisRail, DiagnosisRailContent } from "@/components/layout/diagnosis-rail";
import { createContext, useContext, useCallback, useState } from "react";
import { ENCOUNTER_STEPS, SECTION_TO_STEP } from "@/types";
import type { Encounter, ClinicianAssessment, QuestionnaireResponse } from "@/types";
import type { DiagnosticOutput } from "@/lib/engine/types";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ListTree, Stethoscope } from "lucide-react";

interface EncounterContextValue {
  encounterId: string;
  encounter: Encounter | null;
  assessment: ClinicianAssessment | null;
  questionnaireResponse: QuestionnaireResponse | null;
  diagnosticOutput: DiagnosticOutput | null;
  loading: boolean;
  updateAssessmentLocal: (
    section: string,
    data: Record<string, unknown>
  ) => void;
  updateEncounterLocal: (
    updates: Partial<Pick<Encounter, "status" | "current_step">>
  ) => void;
  refetch: () => Promise<void>;
}

const EncounterContext = createContext<EncounterContextValue | null>(null);

export function useEncounterContext() {
  const ctx = useContext(EncounterContext);
  if (!ctx)
    throw new Error("useEncounterContext must be used within encounter layout");
  return ctx;
}

export default function EncounterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const { id } = use(params);
  const { encounter, assessment, questionnaireResponse, loading, refetch } = useEncounter(id);
  const [localAssessment, setLocalAssessment] =
    useState<ClinicianAssessment | null>(null);
  const [localEncounterUpdates, setLocalEncounterUpdates] =
    useState<Partial<Pick<Encounter, "status" | "current_step">>>({});

  const mergedEncounter = encounter
    ? { ...encounter, ...localEncounterUpdates }
    : encounter;

  // Merge remote + local assessment for real-time engine updates
  const mergedAssessment = localAssessment
    ? { ...assessment, ...localAssessment }
    : assessment;

  const diagnosticOutput = useDiagnosis(
    mergedAssessment as ClinicianAssessment | null
  );

  const updateAssessmentLocal = useCallback(
    (section: string, data: Record<string, unknown>) => {
      setLocalAssessment((prev) => ({
        ...(prev || (assessment as ClinicianAssessment)),
        [section]: data,
      }));
    },
    [assessment]
  );

  const updateEncounterLocal = useCallback(
    (updates: Partial<Pick<Encounter, "status" | "current_step">>) => {
      setLocalEncounterUpdates((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const completedSteps = assessment
    ? Object.entries(assessment)
        .filter(
          ([key, val]) =>
            key in SECTION_TO_STEP &&
            val &&
            typeof val === "object" &&
            Object.keys(val as object).length > 0
        )
        .map(([key]) => SECTION_TO_STEP[key as keyof typeof SECTION_TO_STEP])
    : [];

  const currentStep =
    ENCOUNTER_STEPS.find((step) => pathname.endsWith(`/${step.path}`)) ??
    ENCOUNTER_STEPS.find((step) => step.key === "intake");

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <p className="text-muted-foreground">Loading encounter...</p>
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <p className="text-destructive">Encounter not found.</p>
      </div>
    );
  }

  return (
    <EncounterContext.Provider
      value={{
        encounterId: id,
        encounter: mergedEncounter,
        assessment: mergedAssessment as ClinicianAssessment | null,
        questionnaireResponse,
        diagnosticOutput,
        loading,
        updateAssessmentLocal,
        updateEncounterLocal,
        refetch,
      }}
    >
      <div className="flex h-full flex-col xl:flex-row">
        <div className="flex items-center justify-between gap-2 border-b border-border bg-background px-4 py-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <ListTree className="h-4 w-4" />
                Steps
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="border-b border-border px-4 py-3">
                <SheetTitle>Assessment Steps</SheetTitle>
              </SheetHeader>
              <StepNavLinks
                encounterId={id}
                completedSteps={completedSteps}
                redFlagged={diagnosticOutput?.redFlagResult.flagged}
              />
            </SheetContent>
          </Sheet>
          <p className="truncate text-sm font-medium text-muted-foreground">
            {currentStep?.label ?? "Assessment"}
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" disabled={!diagnosticOutput}>
                <Stethoscope className="h-4 w-4" />
                Diagnosis
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] overflow-y-auto p-4">
              <SheetHeader className="pb-3">
                <SheetTitle>Diagnosis Summary</SheetTitle>
              </SheetHeader>
              <DiagnosisRailContent output={diagnosticOutput} />
            </SheetContent>
          </Sheet>
        </div>
        <StepNav
          encounterId={id}
          completedSteps={completedSteps}
          redFlagged={diagnosticOutput?.redFlagResult.flagged}
        />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
        <DiagnosisRail output={diagnosticOutput} />
      </div>
    </EncounterContext.Provider>
  );
}
