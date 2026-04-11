"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useEncounterContext } from "../layout";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Printer, SquarePen, FileText } from "lucide-react";
import { ReportSummary } from "@/components/encounter/report/report-summary";
import { ReportDetail } from "@/components/encounter/report/report-detail";
import { EditAmendmentDialog } from "@/components/encounter/report/edit-amendment-dialog";
import { assessmentReference } from "@/lib/assessment";

export default function ReportPage() {
  const { encounter, assessment, encounterId, loading } = useEncounterContext();
  const supabase = useMemo(() => createClient(), []);

  const [note, setNote] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("generated_notes")
        .select("content")
        .eq("encounter_id", encounterId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) setNote((data?.content as string) || "");
    })();
    return () => {
      cancelled = true;
    };
  }, [encounterId, supabase]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  if (!encounter || !assessment) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Assessment not available</p>
            <p className="text-xs text-muted-foreground">
              This encounter has no assessment data to display.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const patient = encounter.patient;
  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : "Patient";

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Assessment Report</h1>
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Completed
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {patientName}
            <span className="text-muted-foreground/60">
              {" · "}Ref{" "}
              <span className="font-mono">{assessmentReference(encounterId)}</span>
            </span>
          </p>
        </div>
        <div className="no-print flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
          >
            <SquarePen className="h-4 w-4" />
            Edit Assessment
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workflow">
              <LogOut className="h-4 w-4" />
              Exit
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs.
          On print, always output the Full Report tab regardless of which
          tab is active: hide TabsList, hide summary content, force detail
          content visible. */}
      <Tabs defaultValue="summary">
        <TabsList className="no-print">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detail">Full Report</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="print:hidden">
          <ReportSummary encounter={encounter} assessment={assessment} />
        </TabsContent>
        <TabsContent value="detail" className="print:!block">
          <ReportDetail assessment={assessment} note={note} />
        </TabsContent>
      </Tabs>

      <EditAmendmentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        encounterId={encounterId}
        currentAmendments={assessment.amendments || []}
      />
    </div>
  );
}
