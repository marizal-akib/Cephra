import type { ContentBlock, GuidelineSection } from "@/lib/guidelines/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-sm leading-relaxed text-foreground">{block.text}</p>
      );

    case "bullets":
      return (
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "numbered":
      return (
        <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {block.headers.map((h, i) => (
                  <TableHead key={i} className="text-xs font-semibold">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {block.rows.map((row, ri) => (
                <TableRow key={ri}>
                  {row.map((cell, ci) => (
                    <TableCell key={ci} className="text-xs">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );

    case "callout":
      return (
        <div
          className={`rounded-md border-l-4 px-4 py-3 text-sm ${
            block.variant === "warning"
              ? "border-l-warning bg-warning/5"
              : "border-l-primary bg-primary/5"
          }`}
        >
          {block.title && (
            <p className="mb-1 font-semibold">{block.title}</p>
          )}
          <p className="leading-relaxed">{block.text}</p>
        </div>
      );

    case "subheading":
      return (
        <h4 className="text-sm font-semibold text-foreground">{block.text}</h4>
      );

    default:
      return null;
  }
}

export function GuidelineSectionRenderer({
  section,
  level = 0,
}: {
  section: GuidelineSection;
  level?: number;
}) {
  const HeadingTag = level === 0 ? "h3" : "h4";
  const headingClass =
    level === 0
      ? "text-base font-semibold tracking-tight"
      : "text-sm font-semibold tracking-tight";

  return (
    <div id={section.id} className="scroll-mt-20 space-y-3">
      <HeadingTag className={headingClass}>{section.title}</HeadingTag>
      {section.content.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}
      {section.subsections?.map((sub) => (
        <div key={sub.id} className="ml-0 mt-4">
          <GuidelineSectionRenderer section={sub} level={level + 1} />
        </div>
      ))}
    </div>
  );
}
