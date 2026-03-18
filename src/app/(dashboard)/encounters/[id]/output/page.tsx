"use client";

import { useEncounterContext } from "../layout";
import { OutputScreen } from "@/components/encounters/output-screen";

export default function OutputPage() {
  const { encounterId } = useEncounterContext();

  return <OutputScreen encounterId={encounterId} />;
}
