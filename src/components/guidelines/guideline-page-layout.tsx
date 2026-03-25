"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Guideline } from "@/lib/guidelines/types";
import { CATEGORIES } from "@/lib/guidelines";
import { GuidelineSectionRenderer } from "./guideline-section-renderer";
import { TableOfContents } from "./table-of-contents";

export function GuidelinePageLayout({
  guideline,
}: {
  guideline: Guideline;
}) {
  const category = CATEGORIES.find((c) => c.id === guideline.category);

  return (
    <div className="space-y-4">
      {/* Back link + header */}
      <div className="space-y-2">
        <Link
          href="/guidelines"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Guideline Library
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              {guideline.title}
            </h1>
            {guideline.subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {guideline.subtitle}
              </p>
            )}
          </div>
          {category && (
            <Badge variant="secondary" className="shrink-0">
              {category.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Main content with TOC sidebar */}
      <div className="flex gap-6">
        {/* TOC - desktop only */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-20">
            <TableOfContents sections={guideline.sections} />
          </div>
        </aside>

        {/* Sections */}
        <div className="min-w-0 flex-1 space-y-4">
          {guideline.sections.map((section) => (
            <Card key={section.id}>
              <CardContent className="space-y-3">
                <GuidelineSectionRenderer section={section} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
