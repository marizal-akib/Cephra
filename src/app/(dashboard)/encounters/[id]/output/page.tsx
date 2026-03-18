"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEncounterContext } from "../layout";

export default function OutputPage() {
  const { encounterId } = useEncounterContext();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/encounters/${encounterId}/workup`);
  }, [encounterId, router]);

  return null;
}
