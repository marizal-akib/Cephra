"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronRight, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { GuidelineCategory } from "@/lib/guidelines/types";
import { CATEGORIES, GUIDELINE_METAS } from "@/lib/guidelines";
import { searchGuidelines } from "@/lib/guidelines/search";
import { CategoryCard } from "./category-card";

export function GuidelineLanding() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<GuidelineCategory | null>(null);

  const filteredGuidelines = useMemo(
    () => searchGuidelines(GUIDELINE_METAS, query, activeCategory),
    [query, activeCategory],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat.id] = GUIDELINE_METAS.filter(
        (g) => g.category === cat.id,
      ).length;
    }
    return counts;
  }, []);

  function handleCategoryClick(id: GuidelineCategory) {
    setActiveCategory((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-5 p-4 md:p-6 lg:space-y-6 lg:p-8">
      {/* Header */}
      <section className="rounded-lg border border-border bg-card px-4 py-4 md:px-5">
        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
          Guideline Library
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Quick reference for headache clinical guidelines
        </p>
      </section>

      {/* Search */}
      <section className="rounded-lg border border-border bg-card px-4 py-3 md:px-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search guidelines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </section>

      {/* Category cards */}
      <section className="-mx-1 overflow-x-auto px-1 md:mx-0 md:overflow-visible">
        <div className="flex gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((cat) => (
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

      {/* Guideline list */}
      <section className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3 md:px-5">
          <h2 className="text-sm font-semibold">
            {activeCategory
              ? CATEGORIES.find((c) => c.id === activeCategory)?.label
              : "All Guidelines"}
            {query && ` matching "${query}"`}
          </h2>
        </div>

        {filteredGuidelines.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No guidelines match your search
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory(null);
              }}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredGuidelines.map((g) => {
              const cat = CATEGORIES.find((c) => c.id === g.category);
              return (
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
                  {cat && (
                    <Badge
                      variant="secondary"
                      className="hidden shrink-0 sm:inline-flex"
                    >
                      {cat.label}
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
