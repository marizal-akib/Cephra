"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, FileText, FlaskConical } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { GuidelineCategory } from "@/lib/guidelines/types";
import { CATEGORIES, GUIDELINE_METAS } from "@/lib/guidelines";
import { searchGuidelines } from "@/lib/guidelines/search";
import { CategoryCard } from "./category-card";

const GUIDELINE_CATEGORIES = CATEGORIES.filter(
  (c) => c.id !== "evidence-summaries",
);

export function GuidelineLanding() {
  const [guidelineQuery, setGuidelineQuery] = useState("");
  const [evidenceQuery, setEvidenceQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<GuidelineCategory | null>(null);

  /* ---------- guideline tab data ---------- */
  const guidelineMetas = useMemo(
    () => GUIDELINE_METAS.filter((g) => g.category !== "evidence-summaries"),
    [],
  );

  const filteredGuidelines = useMemo(
    () => searchGuidelines(guidelineMetas, guidelineQuery, activeCategory),
    [guidelineMetas, guidelineQuery, activeCategory],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of GUIDELINE_CATEGORIES) {
      counts[cat.id] = guidelineMetas.filter(
        (g) => g.category === cat.id,
      ).length;
    }
    return counts;
  }, [guidelineMetas]);

  const guidelineSuggestions = useMemo(() => {
    const pool = new Set<string>();
    for (const g of guidelineMetas) {
      pool.add(g.title);
      if (g.subtitle) pool.add(g.subtitle);
      for (const tag of g.tags) pool.add(tag);
    }
    return Array.from(pool);
  }, [guidelineMetas]);

  /* ---------- evidence tab data ---------- */
  const evidenceMetas = useMemo(
    () => GUIDELINE_METAS.filter((g) => g.category === "evidence-summaries"),
    [],
  );

  const filteredEvidence = useMemo(
    () => searchGuidelines(evidenceMetas, evidenceQuery, null),
    [evidenceMetas, evidenceQuery],
  );

  const evidenceSuggestions = useMemo(() => {
    const pool = new Set<string>();
    for (const g of evidenceMetas) {
      pool.add(g.title);
      if (g.subtitle) pool.add(g.subtitle);
      for (const tag of g.tags) pool.add(tag);
    }
    return Array.from(pool);
  }, [evidenceMetas]);

  /* ---------- handlers ---------- */
  function handleCategoryClick(id: GuidelineCategory) {
    setActiveCategory((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-5 p-4 md:p-6 lg:space-y-6 lg:p-8">
      {/* Header */}
      <section className="rounded-lg border border-border bg-card px-4 py-4 md:px-5">
        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
          Guideline &amp; Evidence Library
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Quick reference for headache clinical guidelines and evidence summaries
        </p>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="guidelines">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="guidelines" className="gap-1.5">
            <FileText className="h-4 w-4" />
            Guideline Library
          </TabsTrigger>
          <TabsTrigger value="evidence" className="gap-1.5">
            <FlaskConical className="h-4 w-4" />
            Evidence Library
          </TabsTrigger>
        </TabsList>

        {/* -------- Guideline Library tab -------- */}
        <TabsContent value="guidelines" className="space-y-5 lg:space-y-6">
          {/* Search */}
          <section className="rounded-lg border border-border bg-card px-4 py-3 md:px-5">
            <SearchInput
              value={guidelineQuery}
              onValueChange={setGuidelineQuery}
              suggestions={guidelineSuggestions}
              placeholder="Search guidelines..."
              ariaLabel="Search clinical guidelines by title, subtitle, or tags"
            />
          </section>

          {/* Category cards */}
          <section className="-mx-1 overflow-x-auto px-1 md:mx-0 md:overflow-visible">
            <div className="flex gap-3 md:grid md:grid-cols-3">
              {GUIDELINE_CATEGORIES.map((cat) => (
                <div key={cat.id} className="min-w-[200px] flex-shrink-0 md:min-w-0">
                  <CategoryCard
                    category={cat}
                    count={categoryCounts[cat.id] ?? 0}
                    isActive={activeCategory === cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Guideline list grouped by category */}
          {filteredGuidelines.length === 0 ? (
            <section className="rounded-lg border border-border bg-card">
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <FileText className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No guidelines match your search
                </p>
                <button
                  onClick={() => {
                    setGuidelineQuery("");
                    setActiveCategory(null);
                  }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            </section>
          ) : (
            GUIDELINE_CATEGORIES.filter(
              (cat) =>
                (!activeCategory || activeCategory === cat.id) &&
                filteredGuidelines.some((g) => g.category === cat.id),
            ).map((cat) => (
              <section
                key={cat.id}
                className="rounded-lg border border-border bg-card"
              >
                <div className="border-b border-border px-4 py-3 md:px-5">
                  <h2 className="text-sm font-semibold">
                    {cat.label}
                    {guidelineQuery && (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        matching &ldquo;{guidelineQuery}&rdquo;
                      </span>
                    )}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cat.description}
                  </p>
                </div>

                <div className="divide-y divide-border">
                  {filteredGuidelines
                    .filter((g) => g.category === cat.id)
                    .map((g) => (
                      <Link
                        key={g.slug}
                        href={`/guidelines/${g.slug}`}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 md:px-5"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{g.title}</p>
                          {g.subtitle && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {g.subtitle}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </Link>
                    ))}
                </div>
              </section>
            ))
          )}
        </TabsContent>

        {/* -------- Evidence Library tab -------- */}
        <TabsContent value="evidence" className="space-y-5 lg:space-y-6">
          {/* Search */}
          <section className="rounded-lg border border-border bg-card px-4 py-3 md:px-5">
            <SearchInput
              value={evidenceQuery}
              onValueChange={setEvidenceQuery}
              suggestions={evidenceSuggestions}
              placeholder="Search evidence summaries..."
              ariaLabel="Search evidence summaries by title, subtitle, or tags"
            />
          </section>

          {/* Evidence list */}
          {filteredEvidence.length === 0 ? (
            <section className="rounded-lg border border-border bg-card">
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <FlaskConical className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No evidence summaries match your search
                </p>
                <button
                  onClick={() => setEvidenceQuery("")}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            </section>
          ) : (
            <section className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 py-3 md:px-5">
                <h2 className="text-sm font-semibold">
                  Evidence Summaries
                  {evidenceQuery && (
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      matching &ldquo;{evidenceQuery}&rdquo;
                    </span>
                  )}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Recent research papers with clinical application summaries
                </p>
              </div>

              <div className="divide-y divide-border">
                {filteredEvidence.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guidelines/${g.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 md:px-5"
                  >
                    <FlaskConical className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{g.title}</p>
                      {g.subtitle && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {g.subtitle}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
