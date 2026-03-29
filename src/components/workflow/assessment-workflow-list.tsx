"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Filter,
  Forward,
  Loader2,
  MoreHorizontal,
  Plus,
  Play,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { generateQuestionnaireUrl, formatDate, cn } from "@/lib/utils";
import {
  ASSESSMENT_FILTERS,
  ASSESSMENT_STATUS_BADGE_STYLES,
  ASSESSMENT_STATUS_SORT_ORDER,
  assessmentReference,
  assessmentStatusLabel,
  deriveAssessmentStatus,
  patientDisplayId,
  patientDisplayName,
  type DerivedAssessmentStatus,
} from "@/lib/assessment";
import { type WorkflowEncounter } from "@/components/workflow/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/search-input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DoctorOption = {
  id: string;
  full_name: string;
};

type OwnershipFilter = "all" | "mine" | "referred";

function latestToken(encounter: WorkflowEncounter) {
  if (!encounter.questionnaire_tokens || encounter.questionnaire_tokens.length === 0) {
    return null;
  }

  const sorted = [...encounter.questionnaire_tokens].sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1
  );

  return sorted[0] ?? null;
}

export function AssessmentWorkflowList({
  encounters: initialEncounters,
}: {
  encounters: WorkflowEncounter[];
}) {
  const [encounters, setEncounters] = useState(initialEncounters);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<DerivedAssessmentStatus | null>(null);
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>("all");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [draftFilter, setDraftFilter] = useState<DerivedAssessmentStatus | "all">("all");
  const [draftOwnershipFilter, setDraftOwnershipFilter] = useState<OwnershipFilter>("all");
  const [copiedEncounterId, setCopiedEncounterId] = useState<string | null>(null);
  const [resendingEncounterId, setResendingEncounterId] = useState<string | null>(null);
  const [refreshedTokens, setRefreshedTokens] = useState<
    Record<string, { token: string; created_at: string; used_at: string | null }>
  >({});
  const [deleteTarget, setDeleteTarget] = useState<WorkflowEncounter | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [referTarget, setReferTarget] = useState<WorkflowEncounter | null>(null);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [referring, setReferring] = useState(false);
  const hasActiveFilters = Boolean(activeFilter) || ownershipFilter !== "all";

  useEffect(() => {
    if (!isFilterSheetOpen) {
      return;
    }

    setDraftFilter(activeFilter ?? "all");
    setDraftOwnershipFilter(ownershipFilter);
  }, [activeFilter, isFilterSheetOpen, ownershipFilter]);

  const counts = useMemo(() => {
    return encounters.reduce<Record<DerivedAssessmentStatus, number>>(
      (acc, encounter) => {
        const key = deriveAssessmentStatus(encounter);
        acc[key] += 1;
        return acc;
      },
      {
        waiting_for_response: 0,
        response_received: 0,
        in_assessment: 0,
        note_drafted: 0,
        completed: 0,
        expired: 0,
        red_flagged: 0,
      }
    );
  }, [encounters]);

  const filteredEncounters = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = encounters.filter((encounter) => {
      const byFilter = activeFilter ? deriveAssessmentStatus(encounter) === activeFilter : true;
      if (!byFilter) {
        return false;
      }

      const byOwnership =
        ownershipFilter === "all"
          ? true
          : ownershipFilter === "mine"
            ? !encounter.referred_by_clinician_id
            : Boolean(encounter.referred_by_clinician_id);
      if (!byOwnership) {
        return false;
      }

      if (!query) {
        return true;
      }

      const name = patientDisplayName(encounter).toLowerCase();
      const pid = patientDisplayId(encounter).toLowerCase();
      const fullPid = encounter.patient?.id.toLowerCase() ?? "";
      const refShort = assessmentReference(encounter.id).toLowerCase();
      const refFull = encounter.id.toLowerCase();

      return (
        name.includes(query) ||
        pid.includes(query) ||
        fullPid.includes(query) ||
        refShort.includes(query) ||
        refFull.includes(query)
      );
    });

    return filtered.sort((a, b) => {
      const orderA = ASSESSMENT_STATUS_SORT_ORDER[deriveAssessmentStatus(a)];
      const orderB = ASSESSMENT_STATUS_SORT_ORDER[deriveAssessmentStatus(b)];
      return orderA - orderB;
    });
  }, [activeFilter, encounters, ownershipFilter, search]);

  const searchSuggestions = useMemo(() => {
    const pool = new Set<string>();
    for (const encounter of encounters) {
      pool.add(patientDisplayName(encounter));
      pool.add(patientDisplayId(encounter));
      pool.add(assessmentReference(encounter.id));
    }
    return Array.from(pool);
  }, [encounters]);

  function effectiveLatestToken(encounter: WorkflowEncounter) {
    const refreshed = refreshedTokens[encounter.id];
    if (refreshed) {
      return refreshed;
    }
    return latestToken(encounter);
  }

  function clearAllFilters() {
    setActiveFilter(null);
    setOwnershipFilter("all");
  }

  function applySheetFilters() {
    setActiveFilter(draftFilter === "all" ? null : draftFilter);
    setOwnershipFilter(draftOwnershipFilter);
    setIsFilterSheetOpen(false);
  }

  async function copyQuestionnaireLink(encounter: WorkflowEncounter) {
    const tokenRow = effectiveLatestToken(encounter);
    if (!tokenRow) {
      return;
    }

    await navigator.clipboard.writeText(generateQuestionnaireUrl(tokenRow.token));
    setCopiedEncounterId(encounter.id);
    setTimeout(() => setCopiedEncounterId(null), 2000);
  }

  async function resendQuestionnaireLink(encounter: WorkflowEncounter) {
    setResendingEncounterId(encounter.id);
    try {
      const response = await fetch(`/api/encounters/${encounter.id}/resend-link`, {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.token || !data.createdAt) {
        toast.error(data.error || "Unable to refresh questionnaire link.");
        return;
      }

      setRefreshedTokens((prev) => ({
        ...prev,
        [encounter.id]: {
          token: data.token as string,
          created_at: data.createdAt as string,
          used_at: null,
        },
      }));
      toast.success("New questionnaire link generated.");
    } catch {
      toast.error("Unable to refresh questionnaire link.");
    } finally {
      setResendingEncounterId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/encounters/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || "Unable to delete assessment.");
        return;
      }
      setEncounters((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      toast.success("Assessment deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Unable to delete assessment.");
    } finally {
      setDeleting(false);
    }
  }

  async function fetchDoctors() {
    setLoadingDoctors(true);
    try {
      const response = await fetch("/api/doctors");
      const data = (await response.json().catch(() => ({}))) as {
        doctors?: DoctorOption[];
        error?: string;
      };

      if (!response.ok || !data.doctors) {
        toast.error(data.error || "Unable to load doctors.");
        return;
      }

      setDoctors(data.doctors);
    } catch {
      toast.error("Unable to load doctors.");
    } finally {
      setLoadingDoctors(false);
    }
  }

  async function openReferDialog(encounter: WorkflowEncounter) {
    setReferTarget(encounter);
    setSelectedDoctorId("");
    await fetchDoctors();
  }

  async function confirmRefer() {
    if (!referTarget || !selectedDoctorId) {
      return;
    }

    setReferring(true);
    try {
      const response = await fetch(`/api/encounters/${referTarget.id}/refer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetDoctorId: selectedDoctorId }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        toast.error(data.error || "Unable to refer assessment.");
        return;
      }

      setEncounters((prev) => prev.filter((encounter) => encounter.id !== referTarget.id));
      toast.success("Assessment referred successfully.");
      setReferTarget(null);
      setSelectedDoctorId("");
    } catch {
      toast.error("Unable to refer assessment.");
    } finally {
      setReferring(false);
    }
  }

  function renderPreResponseMenu(encounter: WorkflowEncounter) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => resendQuestionnaireLink(encounter)}
            disabled={resendingEncounterId === encounter.id}
          >
            {resendingEncounterId === encounter.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Generate New Link
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(encounter)}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function renderPostResponseMenu(encounter: WorkflowEncounter) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => void openReferDialog(encounter)}>
            <Forward className="h-3.5 w-3.5" />
            Refer to Colleague
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(encounter)}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function renderExpiredMenu(encounter: WorkflowEncounter) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(encounter)}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function renderRedFlaggedMenu(encounter: WorkflowEncounter) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/encounters/${encounter.id}/past-medical-history`}>
              <Play className="h-3.5 w-3.5" />
              Start Assessment
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void openReferDialog(encounter)}>
            <Forward className="h-3.5 w-3.5" />
            Refer to Colleague
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(encounter)}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function renderActionMenu(encounter: WorkflowEncounter) {
    const status = deriveAssessmentStatus(encounter);
    if (status === "waiting_for_response") return renderPreResponseMenu(encounter);
    if (
      status === "response_received" ||
      status === "in_assessment" ||
      status === "note_drafted" ||
      status === "completed"
    ) {
      return renderPostResponseMenu(encounter);
    }
    if (status === "expired") return renderExpiredMenu(encounter);
    if (status === "red_flagged") return renderRedFlaggedMenu(encounter);
    return null;
  }

  function renderActions(encounter: WorkflowEncounter) {
    const status = deriveAssessmentStatus(encounter);
    const step = encounter.current_step || "intake";

    if (status === "waiting_for_response") {
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            onClick={() => copyQuestionnaireLink(encounter)}
            disabled={!effectiveLatestToken(encounter)}
          >
            {copiedEncounterId === encounter.id ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Link
              </>
            )}
          </Button>
          {renderPreResponseMenu(encounter)}
        </div>
      );
    }

    if (status === "response_received") {
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" asChild>
            <Link href={`/encounters/${encounter.id}/intake`}>Review Intake</Link>
          </Button>
          {renderPostResponseMenu(encounter)}
        </div>
      );
    }

    if (status === "in_assessment") {
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" asChild>
            <Link href={`/encounters/${encounter.id}/${step}`}>Continue Assessment</Link>
          </Button>
          {renderPostResponseMenu(encounter)}
        </div>
      );
    }

    if (status === "note_drafted") {
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" asChild>
            <Link href={`/encounters/${encounter.id}/note`}>Open Note</Link>
          </Button>
          {renderPostResponseMenu(encounter)}
        </div>
      );
    }

    if (status === "completed") {
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" asChild>
            <Link href={`/encounters/${encounter.id}/output`}>View Record</Link>
          </Button>
          {renderPostResponseMenu(encounter)}
        </div>
      );
    }

    if (status === "expired") {
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            onClick={() => resendQuestionnaireLink(encounter)}
            disabled={resendingEncounterId === encounter.id}
            title="Creates a new secure link. Previous link expires."
          >
            {resendingEncounterId === encounter.id ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Generate New Link
              </>
            )}
          </Button>
          {renderExpiredMenu(encounter)}
        </div>
      );
    }

    if (status === "red_flagged") {
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" asChild>
            <Link href={`/encounters/${encounter.id}/red-flags`}>Review Red Flags</Link>
          </Button>
          {renderRedFlaggedMenu(encounter)}
        </div>
      );
    }

    return null;
  }

  function renderPrimaryAction(encounter: WorkflowEncounter) {
    const status = deriveAssessmentStatus(encounter);
    const step = encounter.current_step || "intake";

    if (status === "waiting_for_response") {
      return (
        <Button
          className="h-11 min-h-11 flex-1"
          onClick={() => copyQuestionnaireLink(encounter)}
          disabled={!effectiveLatestToken(encounter)}
        >
          {copiedEncounterId === encounter.id ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </>
          )}
        </Button>
      );
    }

    if (status === "response_received") {
      return (
        <Button className="h-11 min-h-11 flex-1" asChild>
          <Link href={`/encounters/${encounter.id}/intake`}>Review Intake</Link>
        </Button>
      );
    }

    if (status === "in_assessment") {
      return (
        <Button className="h-11 min-h-11 flex-1" asChild>
          <Link href={`/encounters/${encounter.id}/${step}`}>Continue</Link>
        </Button>
      );
    }

    if (status === "note_drafted") {
      return (
        <Button className="h-11 min-h-11 flex-1" asChild>
          <Link href={`/encounters/${encounter.id}/note`}>Open Note</Link>
        </Button>
      );
    }

    if (status === "completed") {
      return (
        <Button className="h-11 min-h-11 flex-1" asChild>
          <Link href={`/encounters/${encounter.id}/output`}>View Record</Link>
        </Button>
      );
    }

    if (status === "expired") {
      return (
        <Button
          className="h-11 min-h-11 flex-1"
          onClick={() => resendQuestionnaireLink(encounter)}
          disabled={resendingEncounterId === encounter.id}
          title="Creates a new secure link. Previous link expires."
        >
          {resendingEncounterId === encounter.id ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              Generate New Link
            </>
          )}
        </Button>
      );
    }

    if (status === "red_flagged") {
      return (
        <Button className="h-11 min-h-11 flex-1" asChild>
          <Link href={`/encounters/${encounter.id}/red-flags`}>Review Red Flags</Link>
        </Button>
      );
    }

    return null;
  }

  function renderCaseCard(encounter: WorkflowEncounter) {
    const status = deriveAssessmentStatus(encounter);

    return (
      <Card key={encounter.id} className="border-border/80">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-base font-semibold leading-tight">{patientDisplayName(encounter)}</p>
              <p className="text-sm text-muted-foreground">{patientDisplayId(encounter)}</p>
            </div>
            <Badge variant="outline">
              {encounter.encounter_type === "follow_up" ? "Follow Up" : "Initial Assessment"}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{assessmentReference(encounter.id)}</Badge>
            <Badge variant="secondary" className={ASSESSMENT_STATUS_BADGE_STYLES[status]}>
              {assessmentStatusLabel(status)}
            </Badge>
            {status === "red_flagged" ? (
              <Badge variant="outline" className="text-rose-700">
                <AlertTriangle className="h-3 w-3" />
                Priority
              </Badge>
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">
            Last updated <span className="font-medium text-foreground">{formatDate(encounter.updated_at)}</span>
          </p>

          <div className="flex items-center gap-2">
            {renderPrimaryAction(encounter)}
            <div className="[&_button]:h-11 [&_button]:w-11">{renderActionMenu(encounter)}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function emptyStateMessage() {
    if (activeFilter === "waiting_for_response") {
      return "No assessments waiting for response.";
    }
    if (activeFilter === "response_received") {
      return "No submitted questionnaires waiting for review.";
    }
    if (activeFilter === "in_assessment") {
      return "No assessments currently in progress.";
    }
    if (activeFilter === "note_drafted") {
      return "No draft notes pending review.";
    }
    if (activeFilter === "completed") {
      return "No completed assessments.";
    }
    if (activeFilter === "expired") {
      return "No expired assessments.";
    }
    if (activeFilter === "red_flagged") {
      return "No red-flagged assessments.";
    }
    if (ownershipFilter === "mine") {
      return "No assessments currently owned by you.";
    }
    if (ownershipFilter === "referred") {
      return "No referred assessments right now.";
    }
    return "No assessments match your current search.";
  }

  function renderFilterSheetContent() {
    return (
      <SheetContent side="bottom" className="max-h-[88vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Filter Cases</SheetTitle>
          <SheetDescription>Refine active assessments by status and ownership.</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 overflow-y-auto px-4 pb-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Status</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDraftFilter("all")}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                  draftFilter === "all"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-accent"
                )}
              >
                All Statuses
              </button>
              {ASSESSMENT_FILTERS.map((filter) => {
                const isSelected = draftFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setDraftFilter(filter.key)}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-accent"
                    )}
                  >
                    <span>{filter.label}</span>
                    <span className="text-xs text-muted-foreground">{counts[filter.key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Ownership</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: "all", label: "All" },
                { key: "mine", label: "Mine" },
                { key: "referred", label: "Referred" },
              ] as const).map((option) => {
                const isSelected = draftOwnershipFilter === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setDraftOwnershipFilter(option.key)}
                    className={cn(
                      "rounded-md border px-3 py-2.5 text-center text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-accent"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border p-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 sm:w-auto"
            onClick={() => {
              setDraftFilter("all");
              setDraftOwnershipFilter("all");
              clearAllFilters();
              setIsFilterSheetOpen(false);
            }}
          >
            Clear Filters
          </Button>
          <Button type="button" className="h-11 sm:w-auto" onClick={applySheetFilters}>
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    );
  }

  return (
    <div className="space-y-5 pb-24 lg:pb-0">
      <header className="space-y-4">
        <div className="hidden items-end justify-between gap-4 lg:flex">
          <div className="space-y-1">
            <h1 className="font-semibold tracking-tight">Assessment Workflow</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track patient headache assessments
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end lg:w-auto">
            <Button asChild className="sm:w-auto">
              <Link href="/encounters/new">
                <Plus className="h-4 w-4" />
                New Assessment
              </Link>
            </Button>
            <SearchInput
              value={search}
              onValueChange={setSearch}
              suggestions={searchSuggestions}
              className="sm:w-[420px]"
              placeholder="Who are you looking for? Search patient, ID, or assessment ref"
              ariaLabel="Search patient, ID, or assessment ref"
            />
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">Assessment Workflow</h1>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Toggle search"
                onClick={() => setShowMobileSearch((prev) => !prev)}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button type="button" variant="outline" size="icon" aria-label="Open filters">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                {renderFilterSheetContent()}
              </Sheet>
            </div>
          </div>

          <div className={cn("md:block", showMobileSearch ? "block" : "hidden")}>
            <SearchInput
              value={search}
              onValueChange={setSearch}
              suggestions={searchSuggestions}
              placeholder="Find a case by patient name, ID, or assessment ref"
              ariaLabel="Search patient, ID, or assessment ref"
            />
          </div>

          <Button asChild className="h-11 w-full md:w-auto">
            <Link href="/encounters/new">
              <Plus className="h-4 w-4" />
              New Assessment
            </Link>
          </Button>
        </div>
      </header>

      <Card className="sticky top-4 z-10 hidden border bg-card lg:block">
        <CardContent className="flex flex-wrap items-center gap-2 py-4">
          {ASSESSMENT_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:bg-accent"
                )}
              >
                <span>{filter.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px]",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[filter.key]}
                </span>
              </button>
            );
          })}
          {hasActiveFilters ? (
            <button
              type="button"
              className="ml-1 text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
              onClick={clearAllFilters}
            >
              Clear Filter
            </button>
          ) : null}
          <div className="ml-auto inline-flex items-center rounded-full border bg-background p-1">
            {([
              { key: "all", label: "All" },
              { key: "mine", label: "Mine" },
              { key: "referred", label: "Referred" },
            ] as const).map((option) => {
              const isActive = ownershipFilter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setOwnershipFilter(option.key)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          suggestions={searchSuggestions}
          placeholder="Quick search from bottom"
          ariaLabel="Mobile quick search by patient name, ID, or assessment reference"
        />
      </div>

      <div className="space-y-3 lg:hidden">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {[
            { key: "red_flagged", label: "Red Flagged" },
            { key: "response_received", label: "Response Received" },
            { key: "in_assessment", label: "In Assessment" },
            { key: "note_drafted", label: "Draft Notes" },
          ].map((item) => {
            const key = item.key as DerivedAssessmentStatus;
            const isActive = activeFilter === key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground"
                )}
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-7">
              {activeFilter ? assessmentStatusLabel(activeFilter) : "All Statuses"} /{" "}
              {ownershipFilter === "all"
                ? "All Ownership"
                : ownershipFilter === "mine"
                  ? "Mine"
                  : "Referred"}
            </Badge>
            <Button type="button" variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          </div>
        ) : null}
      </div>

      <Card>
        <CardContent className="pt-6">
          {encounters.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No assessment records available yet.
              </p>
            </div>
          ) : filteredEncounters.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">{emptyStateMessage()}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 lg:hidden md:grid-cols-2">
                {filteredEncounters.map((encounter) => renderCaseCard(encounter))}
              </div>
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Assessment Ref</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEncounters.map((encounter) => {
                      const status = deriveAssessmentStatus(encounter);

                      return (
                        <TableRow key={encounter.id}>
                          <TableCell className="font-medium">{patientDisplayName(encounter)}</TableCell>
                          <TableCell>{patientDisplayId(encounter)}</TableCell>
                          <TableCell>{assessmentReference(encounter.id)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={ASSESSMENT_STATUS_BADGE_STYLES[status]}>
                                {assessmentStatusLabel(status)}
                              </Badge>
                              {status === "red_flagged" ? (
                                <Badge variant="outline" className="text-rose-700">
                                  <AlertTriangle className="h-3 w-3" />
                                  Priority
                                </Badge>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {encounter.encounter_type === "follow_up" ? "Follow Up" : "Initial Assessment"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(encounter.updated_at)}</TableCell>
                          <TableCell className="text-right">{renderActions(encounter)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assessment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the assessment for{" "}
              <span className="font-medium text-foreground">
                {deleteTarget ? patientDisplayName(deleteTarget) : ""}
              </span>
              ? This action cannot be undone and all associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Assessment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!referTarget}
        onOpenChange={(open) => {
          if (!open) {
            setReferTarget(null);
            setSelectedDoctorId("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refer to Colleague</DialogTitle>
            <DialogDescription>
              Select a doctor to receive the assessment for{" "}
              <span className="font-medium text-foreground">
                {referTarget ? patientDisplayName(referTarget) : ""}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm font-medium">Doctor</p>
            <Select
              value={selectedDoctorId}
              onValueChange={setSelectedDoctorId}
              disabled={loadingDoctors || doctors.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingDoctors
                      ? "Loading doctors..."
                      : doctors.length === 0
                        ? "No doctors available"
                        : "Select a colleague"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReferTarget(null);
                setSelectedDoctorId("");
              }}
              disabled={referring}
            >
              Cancel
            </Button>
            <Button onClick={confirmRefer} disabled={!selectedDoctorId || referring}>
              {referring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Referring...
                </>
              ) : (
                "Refer Assessment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
