import { ALL_GUIDELINES } from "./index";
import {
  buildSearchableIndex,
  type SearchableSection,
} from "./content-extractor";

// ── Module-level singleton — built once, cached across requests ──
const SEARCHABLE_INDEX = buildSearchableIndex(ALL_GUIDELINES);

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been",
  "what", "how", "does", "do", "did", "which", "who", "whom",
  "in", "for", "of", "to", "and", "or", "but", "with", "from",
  "can", "should", "would", "could", "will", "may", "might",
  "this", "that", "these", "those", "it", "its",
  "on", "at", "by", "about", "into", "through", "during",
  "has", "have", "had", "not", "no", "if", "then",
  "my", "your", "me", "i",
]);

/** Approximate token count (1 token ≈ 4 chars) */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export interface RetrievalResult {
  guidelineSections: SearchableSection[];
  evidenceSections: SearchableSection[];
}

interface ScoredSection {
  section: SearchableSection;
  score: number;
}

/**
 * Retrieve the most relevant guideline and evidence sections for a query.
 * Returns two separate lists so the caller can treat them differently.
 */
export function retrieveContext(query: string): RetrievalResult {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  if (terms.length === 0) {
    return { guidelineSections: [], evidenceSections: [] };
  }

  // Score every section in the index
  const scored: ScoredSection[] = SEARCHABLE_INDEX.map((section) => {
    const textLower = section.text.toLowerCase();
    const titleLower = section.sectionTitle.toLowerCase();
    const guidelineTitleLower = section.guidelineTitle.toLowerCase();
    const tagsLower = section.tags.join(" ").toLowerCase();

    let score = 0;

    for (const term of terms) {
      // Content match (base)
      if (textLower.includes(term)) score += 1;

      // Section title match (2x boost)
      if (titleLower.includes(term)) score += 2;

      // Guideline title match (1.5x boost)
      if (guidelineTitleLower.includes(term)) score += 1.5;

      // Tag match (1.5x boost)
      if (tagsLower.includes(term)) score += 1.5;
    }

    // Normalise by number of query terms so longer queries don't inflate scores
    score = score / terms.length;

    return { section, score };
  }).filter((s) => s.score > 0);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Separate guidelines from evidence
  const guidelineScored = scored.filter(
    (s) => s.section.category !== "evidence-summaries",
  );
  const evidenceScored = scored.filter(
    (s) => s.section.category === "evidence-summaries",
  );

  // Take top sections within token budgets
  const GUIDELINE_TOKEN_BUDGET = 15_000;
  const EVIDENCE_TOKEN_BUDGET = 5_000;

  const guidelineSections = selectWithinBudget(
    guidelineScored,
    GUIDELINE_TOKEN_BUDGET,
  );
  const evidenceSections = selectWithinBudget(
    evidenceScored,
    EVIDENCE_TOKEN_BUDGET,
  );

  return { guidelineSections, evidenceSections };
}

/** Select top-scored sections until the token budget is exhausted */
function selectWithinBudget(
  scored: ScoredSection[],
  budget: number,
): SearchableSection[] {
  const selected: SearchableSection[] = [];
  let tokensUsed = 0;

  for (const { section } of scored) {
    const tokens = estimateTokens(section.fullText);
    if (tokensUsed + tokens > budget && selected.length > 0) break;
    selected.push(section);
    tokensUsed += tokens;
  }

  return selected;
}

/**
 * Format retrieved sections into labelled context blocks for the system prompt.
 * Returns { guidelineBlock, evidenceBlock, guidelineSources, evidenceSources }.
 */
export function formatContextForPrompt(result: RetrievalResult) {
  const guidelineSources = deduplicateSources(result.guidelineSections);
  const evidenceSources = deduplicateSources(result.evidenceSections);

  const guidelineBlock =
    result.guidelineSections.length > 0
      ? result.guidelineSections
          .map(
            (s) =>
              `--- ${s.guidelineTitle} > ${s.sectionPath.join(" > ")} ---\n${s.fullText}`,
          )
          .join("\n\n")
      : "No guideline content was found matching this query.";

  const evidenceBlock =
    result.evidenceSections.length > 0
      ? result.evidenceSections
          .map(
            (s) =>
              `--- ${s.guidelineTitle} > ${s.sectionPath.join(" > ")} ---\n${s.fullText}`,
          )
          .join("\n\n")
      : "No evidence content was found matching this query.";

  return { guidelineBlock, evidenceBlock, guidelineSources, evidenceSources };
}

interface SourceRef {
  slug: string;
  title: string;
  sectionTitle: string;
}

function deduplicateSources(sections: SearchableSection[]): SourceRef[] {
  const seen = new Set<string>();
  const sources: SourceRef[] = [];

  for (const s of sections) {
    const key = `${s.guidelineSlug}::${s.sectionId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push({
      slug: s.guidelineSlug,
      title: s.guidelineTitle,
      sectionTitle: s.sectionTitle,
    });
  }

  return sources;
}
