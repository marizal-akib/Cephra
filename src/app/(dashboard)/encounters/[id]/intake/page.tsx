"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEncounterContext } from "../layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

export default function IntakePage() {
  const { encounterId, encounter, questionnaireResponse } = useEncounterContext();
  const isInProgress = encounter?.status === "in_progress";
  const hasResponse = !!questionnaireResponse;

  const patient = encounter?.patient;
  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : "Patient";
  const patientId = patient?.mrn || patient?.id.slice(0, 8).toUpperCase() || "—";
  const assessmentRef = encounterId.slice(0, 8).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="-ml-2 shrink-0">
            <Link href="/workflow" aria-label="Back to workflow">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold leading-tight">{patientName}</h2>
            <p className="text-sm text-muted-foreground">
              Ref: {assessmentRef}
              {patient?.date_of_birth && (
                <> · DOB: {formatDate(patient.date_of_birth)}</>
              )}
              {patientId !== "—" && <> · ID: {patientId}</>}
            </p>
          </div>
        </div>
        {isInProgress ? (
          <Button asChild className="shrink-0">
            <Link href={`/encounters/${encounterId}/${encounter.current_step || "pattern"}`}>
              Continue Assessment
            </Link>
          </Button>
        ) : (
          <Button asChild className="shrink-0">
            <Link href={`/encounters/${encounterId}/red-flags`}>
              Start Assessment
            </Link>
          </Button>
        )}
      </div>

      <Separator />

      {/* Questionnaire status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pre-Consult Questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          {hasResponse ? (
            <div className="flex items-center gap-3">
              <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-800">
                Submitted
              </Badge>
              <span className="text-sm text-muted-foreground">
                Patient has completed and submitted their questionnaire.
                {questionnaireResponse.submitted_at && (
                  <> Submitted {formatDate(questionnaireResponse.submitted_at)}.</>
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Pending</Badge>
              <span className="text-sm text-muted-foreground">
                Patient questionnaire has not been submitted yet, or no
                questionnaire was sent.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {hasResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              The patient has submitted their pre-visit responses. You can
              review them and proceed to the structured clinical assessment.
            </p>
          </CardContent>
        </Card>
      )}

      {!hasResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Once the patient submits their questionnaire, a summary of their
              responses will appear here. You can review, edit, and then proceed
              to the structured clinical assessment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
