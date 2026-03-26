"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  CheckCircle2,
  FileText,
  Inbox,
  ClipboardList,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  ASSESSMENT_STATUS_BADGE_STYLES,
  assessmentStatusLabel,
  deriveAssessmentStatus,
  patientDisplayName,
  type DerivedAssessmentStatus,
  type EncounterStatus,
} from "@/lib/assessment";

type DashboardEncounter = {
  id: string;
  status: EncounterStatus;
  current_step: string | null;
  updated_at: string;
  created_at: string;
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

type FilterKey = "all" | DerivedAssessmentStatus;

const FILTER_TABS: { key: FilterKey; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: ClipboardList },
  { key: "red_flagged", label: "Red Flagged", icon: AlertTriangle },
  { key: "in_assessment", label: "In Assessment", icon: ClipboardList },
  { key: "waiting_for_response", label: "Waiting", icon: Clock3 },
  { key: "response_received", label: "Received Response", icon: Inbox },
  { key: "note_drafted", label: "Note Drafted", icon: FileText },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
];

function primaryAction(encounter: DashboardEncounter): { label: string; href: string } {
  const status = deriveAssessmentStatus(encounter);
  const step = encounter.current_step || "intake";

  const byStatus: Record<DerivedAssessmentStatus, { label: string; href: string }> = {
    waiting_for_response: { label: "Review", href: `/encounters/${encounter.id}/intake` },
    response_received: { label: "Review Intake", href: `/encounters/${encounter.id}/intake` },
    in_assessment: { label: "Continue", href: `/encounters/${encounter.id}/${step}` },
    note_drafted: { label: "Open Note", href: `/encounters/${encounter.id}/note` },
    completed: { label: "View", href: `/encounters/${encounter.id}/output` },
    red_flagged: { label: "Review", href: `/encounters/${encounter.id}/red-flags` },
    expired: { label: "Review", href: `/encounters/${encounter.id}/intake` },
  };

  return byStatus[status];
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function EncounterList({ encounters }: { encounters: DashboardEncounter[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: encounters.length };
    for (const e of encounters) {
      const s = deriveAssessmentStatus(e);
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }, [encounters]);

  const filtered = useMemo(() => {
    let list = encounters;

    // Filter by status
    if (filter !== "all") {
      list = list.filter((e) => deriveAssessmentStatus(e) === filter);
    }

    // Filter by search
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((e) => {
        const name = patientDisplayName(e).toLowerCase();
        const mrn = (e.patient?.mrn || "").toLowerCase();
        const id = e.id.toLowerCase();
        return name.includes(q) || mrn.includes(q) || id.includes(q);
      });
    }

    return list;
  }, [encounters, filter, search]);

  const searchSuggestions = useMemo(() => {
    const pool = new Set<string>();
    for (const encounter of encounters) {
      pool.add(patientDisplayName(encounter));
      if (encounter.patient?.mrn) pool.add(encounter.patient.mrn);
      pool.add(encounter.id);
    }
    return Array.from(pool);
  }, [encounters]);

  return (
    <div className="space-y-4">
      {/* Search + Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          suggestions={searchSuggestions}
          className="flex-1"
          inputClassName="h-10"
          placeholder="Who are you trying to find? Search patient name or ID"
          ariaLabel="Search patients by name or patient ID"
        />
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FILTER_TABS.map((tab) => {
          const count = statusCounts[tab.key] || 0;
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Encounter cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search ? "No matching assessments found." : "No assessments yet."}
          </p>
          {search ? (
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setSearch("")}>
              Clear search
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((encounter) => {
            const status = deriveAssessmentStatus(encounter);
            const action = primaryAction(encounter);
            const isRedFlagged = status === "red_flagged";

            return (
              <Link
                key={encounter.id}
                href={action.href}
                className={`group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                  isRedFlagged ? "border-rose-200 bg-rose-50/30" : ""
                }`}
              >
                {/* Patient initials avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    isRedFlagged
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {encounter.patient
                    ? `${encounter.patient.first_name[0]}${encounter.patient.last_name[0]}`.toUpperCase()
                    : "??"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {patientDisplayName(encounter)}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 text-[10px] px-2 py-0 ${ASSESSMENT_STATUS_BADGE_STYLES[status]}`}
                    >
                      {assessmentStatusLabel(status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {encounter.patient?.mrn && (
                      <span>ID: {encounter.patient.mrn} &middot; </span>
                    )}
                    <span>Updated {timeAgo(encounter.updated_at)}</span>
                    {encounter.current_step && encounter.current_step !== "intake" && (
                      <span> &middot; Step: {encounter.current_step}</span>
                    )}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden text-xs text-muted-foreground group-hover:inline">
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
