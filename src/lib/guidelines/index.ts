import type {
  Guideline,
  GuidelineMeta,
  GuidelineSection,
  CategoryDefinition,
} from "./types";

import { migraine } from "./data/migraine";
import { tensionTypeHeadache } from "./data/tension-type-headache";
import { clusterHeadache } from "./data/cluster-headache";
import { chronicMigraine } from "./data/chronic-migraine";
import { migraineVariants } from "./data/migraine-variants";
import { medicationOveruseHeadache } from "./data/medication-overuse-headache";
import { cervicogenicHeadache } from "./data/cervicogenic-headache";
import { giantCellArteritis } from "./data/giant-cell-arteritis";
import { chronicDailyHeadache } from "./data/chronic-daily-headache";
import { imagingInHeadache } from "./data/imaging-in-headache";
import { idiopathicIntracranialHypertension } from "./data/idiopathic-intracranial-hypertension";
import { spontaneousIntracranialHypotension } from "./data/spontaneous-intracranial-hypotension";
import { trigeminalAutonomicCephalalgia } from "./data/trigeminal-autonomic-cephalalgia";
import { migraineLatestEvidence } from "./data/migraine-latest-evidence";
import { headachePaperSummaries } from "./data/headache-paper-summaries";
import { clusterHeadacheLatestEvidence } from "./data/cluster-headache-latest-evidence";

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "primary-headaches",
    label: "Primary Headaches",
    description:
      "Migraine, tension-type, cluster, and other primary headache disorders",
  },
  {
    id: "secondary-headaches-red-flags",
    label: "Secondary Headaches / Red Flags",
    description:
      "Medication overuse, cervicogenic, GCA, and red flag recognition",
  },
  {
    id: "imaging-investigations",
    label: "Imaging & Investigations",
    description: "When and how to investigate headache presentations",
  },
  {
    id: "treatment-follow-up",
    label: "Treatment & Follow-up",
    description: "Management pathways and follow-up guidance",
  },
  {
    id: "evidence-summaries",
    label: "Evidence Summaries",
    description:
      "Recent research papers with clinical application summaries",
  },
];

export const ALL_GUIDELINES: Guideline[] = [
  migraine,
  tensionTypeHeadache,
  clusterHeadache,
  chronicMigraine,
  migraineVariants,
  medicationOveruseHeadache,
  cervicogenicHeadache,
  giantCellArteritis,
  chronicDailyHeadache,
  imagingInHeadache,
  idiopathicIntracranialHypertension,
  spontaneousIntracranialHypotension,
  trigeminalAutonomicCephalalgia,
  migraineLatestEvidence,
  headachePaperSummaries,
  clusterHeadacheLatestEvidence,
];

export const GUIDELINE_BY_SLUG: Record<string, Guideline> = Object.fromEntries(
  ALL_GUIDELINES.map((g) => [g.slug, g]),
);

function flattenSectionTitles(sections: GuidelineSection[]): string[] {
  return sections.flatMap((s) => [
    s.title,
    ...(s.subsections ? flattenSectionTitles(s.subsections) : []),
  ]);
}

export const GUIDELINE_METAS: GuidelineMeta[] = ALL_GUIDELINES.map((g) => ({
  slug: g.slug,
  title: g.title,
  subtitle: g.subtitle,
  category: g.category,
  tags: g.tags,
  sectionTitles: flattenSectionTitles(g.sections),
}));
