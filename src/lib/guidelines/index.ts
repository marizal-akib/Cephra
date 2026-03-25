import type {
  Guideline,
  GuidelineMeta,
  GuidelineSection,
  CategoryDefinition,
} from "./types";

import { migraine } from "./data/migraine";
import { tensionTypeHeadache } from "./data/tension-type-headache";
import { clusterHeadache } from "./data/cluster-headache";
import { medicationOveruseHeadache } from "./data/medication-overuse-headache";
import { imagingInHeadache } from "./data/imaging-in-headache";
import { redFlagsEscalation } from "./data/red-flags-escalation";

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
];

export const ALL_GUIDELINES: Guideline[] = [
  migraine,
  tensionTypeHeadache,
  clusterHeadache,
  medicationOveruseHeadache,
  imagingInHeadache,
  redFlagsEscalation,
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
