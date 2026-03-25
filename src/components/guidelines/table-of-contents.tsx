"use client";

import { useEffect, useState } from "react";
import type { GuidelineSection } from "@/lib/guidelines/types";
import { cn } from "@/lib/utils";

export function TableOfContents({
  sections,
}: {
  sections: GuidelineSection[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -75% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="space-y-0.5" aria-label="Table of contents">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Contents
      </p>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(section.id)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "block rounded-md px-2 py-1 text-xs transition-colors",
            activeId === section.id
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
          )}
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
}
