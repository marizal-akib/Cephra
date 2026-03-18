"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import {
  ASSESSMENT_STATUS_BADGE_STYLES,
  assessmentReference,
  assessmentStatusLabel,
  deriveAssessmentStatus,
  patientDisplayId,
  patientDisplayName,
  type DerivedAssessmentStatus,
  type EncounterStatus,
} from "@/lib/assessment";

type DashboardEncounter = {
  id: string;
  status: EncounterStatus;
  current_step: string | null;
  updated_at: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string | null;
  } | null;
  questionnaire_tokens: {
    used_at: string | null;
  }[] | null;
};
function primaryAction(encounter: DashboardEncounter): { label: string; href: string } {
  const status = deriveAssessmentStatus(encounter);
  const step = encounter.current_step || "intake";

  const byStatus: Record<DerivedAssessmentStatus, { label: string; href: string }> = {
    waiting_for_response: { label: "Review Intake", href: `/encounters/${encounter.id}/intake` },
    response_received: { label: "Review Intake", href: `/encounters/${encounter.id}/intake` },
    in_assessment: { label: "Continue Assessment", href: `/encounters/${encounter.id}/${step}` },
    note_drafted: { label: "Open Note", href: `/encounters/${encounter.id}/note` },
    completed: { label: "View Record", href: `/encounters/${encounter.id}/output` },
    red_flagged: { label: "Review Red Flags", href: `/encounters/${encounter.id}/red-flags` },
    expired: { label: "Review Intake", href: `/encounters/${encounter.id}/intake` },
  };

  return byStatus[status];
}

export function ActiveAssessments({ encounters }: { encounters: DashboardEncounter[] }) {
  const drafts = encounters.filter(
    (encounter) => deriveAssessmentStatus(encounter) === "note_drafted"
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Active Assessments</h2>
        <Badge variant="secondary">{drafts.length} records</Badge>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent and active patient assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {drafts.length === 0 ? (
            <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No draft assessments at the moment.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Assessment Ref</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drafts.map((encounter) => {
                  const status = deriveAssessmentStatus(encounter);
                  const action = primaryAction(encounter);

                  return (
                    <TableRow key={encounter.id}>
                      <TableCell className="font-medium">{patientDisplayName(encounter)}</TableCell>
                      <TableCell>{patientDisplayId(encounter)}</TableCell>
                      <TableCell>{assessmentReference(encounter.id)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={ASSESSMENT_STATUS_BADGE_STYLES[status]}>
                          {assessmentStatusLabel(status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(encounter.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={action.href}>{action.label}</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
