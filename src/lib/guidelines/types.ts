/** A leaf content block within a guideline section */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant: "info" | "warning"; title?: string; text: string }
  | { type: "subheading"; text: string };

/** A section within a guideline (may have nested subsections) */
export interface GuidelineSection {
  id: string;
  title: string;
  content: ContentBlock[];
  subsections?: GuidelineSection[];
}

export type GuidelineCategory =
  | "primary-headaches"
  | "secondary-headaches-red-flags"
  | "imaging-investigations"
  | "treatment-follow-up"
  | "evidence-summaries";

export interface CategoryDefinition {
  id: GuidelineCategory;
  label: string;
  description: string;
}

/** Full guideline document */
export interface Guideline {
  slug: string;
  title: string;
  subtitle?: string;
  category: GuidelineCategory;
  tags: string[];
  sourceDocument: string;
  sections: GuidelineSection[];
}

/** Metadata-only view for listing / search */
export interface GuidelineMeta {
  slug: string;
  title: string;
  subtitle?: string;
  category: GuidelineCategory;
  tags: string[];
  sectionTitles: string[];
}
