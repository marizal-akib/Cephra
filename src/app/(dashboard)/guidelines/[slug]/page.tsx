import { notFound } from "next/navigation";
import { GUIDELINE_BY_SLUG, ALL_GUIDELINES } from "@/lib/guidelines";
import { GuidelinePageLayout } from "@/components/guidelines/guideline-page-layout";

export function generateStaticParams() {
  return ALL_GUIDELINES.map((g) => ({ slug: g.slug }));
}

export default async function GuidelinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guideline = GUIDELINE_BY_SLUG[slug];

  if (!guideline) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <GuidelinePageLayout guideline={guideline} />
    </div>
  );
}
