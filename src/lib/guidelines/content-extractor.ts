import type {
  ContentBlock,
  Guideline,
  GuidelineCategory,
  GuidelineSection,
} from "./types";

/** Searchable representation of a single guideline section */
export interface SearchableSection {
  guidelineSlug: string;
  guidelineTitle: string;
  category: GuidelineCategory;
  sectionId: string;
  sectionTitle: string;
  /** Breadcrumb path, e.g. ["Acute Treatment", "Triptans"] */
  sectionPath: string[];
  /** Plain text of this section only (no subsections) */
  text: string;
  /** Plain text including subsections */
  fullText: string;
  /** Tags from the parent guideline */
  tags: string[];
}

/** Extract plain text from a single ContentBlock */
export function extractBlockText(block: ContentBlock): string {
  switch (block.type) {
    case "paragraph":
    case "subheading":
      return block.text;
    case "callout":
      return block.title ? `${block.title}: ${block.text}` : block.text;
    case "bullets":
    case "numbered":
      return block.items.join(". ");
    case "table": {
      const headerLine = block.headers.join(" | ");
      const rowLines = block.rows.map((row) => row.join(" | "));
      return [headerLine, ...rowLines].join("\n");
    }
    default:
      return "";
  }
}

/** Extract plain text from a section's own content (no subsections) */
function extractOwnContent(section: GuidelineSection): string {
  return section.content.map(extractBlockText).join("\n");
}

/** Recursively extract plain text from a section including all subsections */
export function extractSectionText(section: GuidelineSection): string {
  const own = `${section.title}\n${extractOwnContent(section)}`;
  if (!section.subsections?.length) return own;
  const sub = section.subsections.map(extractSectionText).join("\n\n");
  return `${own}\n\n${sub}`;
}

/** Recursively flatten a section tree into SearchableSection entries */
function flattenSections(
  guideline: Guideline,
  sections: GuidelineSection[],
  parentPath: string[],
): SearchableSection[] {
  const results: SearchableSection[] = [];

  for (const section of sections) {
    const path = [...parentPath, section.title];
    const ownText = `${section.title}\n${extractOwnContent(section)}`;
    const fullText = extractSectionText(section);

    results.push({
      guidelineSlug: guideline.slug,
      guidelineTitle: guideline.title,
      category: guideline.category,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionPath: path,
      text: ownText,
      fullText,
      tags: guideline.tags,
    });

    if (section.subsections?.length) {
      results.push(
        ...flattenSections(guideline, section.subsections, path),
      );
    }
  }

  return results;
}

/** Build a flat, searchable index from all guidelines */
export function buildSearchableIndex(
  guidelines: Guideline[],
): SearchableSection[] {
  return guidelines.flatMap((g) => flattenSections(g, g.sections, []));
}
