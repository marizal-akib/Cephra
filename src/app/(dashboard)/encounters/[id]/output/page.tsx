"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEncounterContext } from "../layout";

/**
 * Legacy alias: `/output` was the original placeholder for a post-completion
 * view. The Assessment Report now lives at `/report`; this route just
 * forwards so any existing links keep working.
 */
export default function OutputPage() {
  const { encounterId } = useEncounterContext();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/encounters/${encounterId}/report`);
  }, [encounterId, router]);

  return null;
}
