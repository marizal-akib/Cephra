import { z } from "zod/v4";

const redFlagItemSchema = z.object({
  flag: z.string(),
  present: z.boolean(),
  details: z.string().optional(),
});

export const redFlagReviewSchema = z.object({
  // Diagnosis-specific red flag checklist items
  flags: z.array(redFlagItemSchema).optional(),

  // General red flag notes
  notes: z.string().optional(),
});

export type RedFlagReviewFormData = z.infer<typeof redFlagReviewSchema>;
export type RedFlagItem = z.infer<typeof redFlagItemSchema>;

// Diagnosis-specific red flag checklists
export const DIAGNOSIS_RED_FLAGS: Record<string, string[]> = {
  migraine: [
    "New or changed aura pattern",
    "Aura lasting >60 minutes",
    "Thunderclap headache onset",
    "New focal neurological deficit",
    "Headache always on same side (consider secondary cause)",
    "Significant escalation in frequency or severity",
  ],
  tension_type: [
    "New focal neurological signs",
    "Progressive worsening despite treatment",
    "Significant change in headache character",
    "New onset after age 50",
    "Associated systemic symptoms",
  ],
  cluster: [
    "Change in attack pattern suggesting secondary cause",
    "Persistent neurological deficit between attacks",
    "Loss of remission in previously episodic CH",
    "Suicidal ideation or severe psychological distress",
    "New autonomic features not previously present",
    "Failure to respond to expected hallmark treatment",
  ],
  tac: [
    "Poor response to indomethacin (PH/HC)",
    "Change in attack frequency or character",
    "New neurological signs between attacks",
    "Secondary cause features (structural lesion)",
    "Failure to respond to expected hallmark treatment",
  ],
  medication_overuse: [
    "Progressive headache despite withdrawal",
    "New neurological symptoms during withdrawal",
    "Relapse into overuse pattern",
    "Secondary headache features emerging",
    "Severe withdrawal symptoms requiring medical intervention",
  ],
  cervicogenic: [
    "Progressive neurological deficit",
    "New radiculopathy or myelopathy signs",
    "Severe neck pain with systemic features",
    "Failure to respond to appropriate treatment",
    "New onset of cervicogenic features after trauma",
  ],
  occipital_neuralgia: [
    "Progressive sensory loss in occipital distribution",
    "New neurological deficit beyond expected territory",
    "Structural lesion features on examination",
    "Failure to respond to nerve block",
    "Bilateral spread suggesting central cause",
  ],
};
