import type { GuidelineMeta, GuidelineCategory } from "./types";

export function searchGuidelines(
  guidelines: GuidelineMeta[],
  query: string,
  category?: GuidelineCategory | null,
): GuidelineMeta[] {
  let results = guidelines;

  if (category) {
    results = results.filter((g) => g.category === category);
  }

  if (!query.trim()) return results;

  const terms = query.trim().toLowerCase().split(/\s+/);

  return results
    .map((g) => {
      const searchable = [g.title, g.subtitle ?? "", ...g.tags, ...g.sectionTitles]
        .join(" ")
        .toLowerCase();
      const matchCount = terms.filter((t) => searchable.includes(t)).length;
      return { guideline: g, matchCount };
    })
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(({ guideline }) => guideline);
}
