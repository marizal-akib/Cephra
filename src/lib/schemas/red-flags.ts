import { z } from "zod/v4";

export const redFlagsSchema = z.object({
  thunderclap_onset: z.boolean().default(false),
  focal_deficit: z.boolean().default(false),
  seizure: z.boolean().default(false),
  confusion: z.boolean().default(false),
  fever: z.boolean().default(false),
  weight_loss: z.boolean().default(false),
  cancer_history: z.boolean().default(false),
  immunosuppression: z.boolean().default(false),
  pregnancy_new_headache: z.boolean().default(false),
  postpartum_new_headache: z.boolean().default(false),
  age_over_50_new_onset: z.boolean().default(false),
  papilloedema_symptoms: z.boolean().default(false),
  trauma: z.boolean().default(false),
  anticoagulation: z.boolean().default(false),
  jaw_claudication: z.boolean().default(false),
  scalp_tenderness: z.boolean().default(false),
  visual_loss: z.boolean().default(false),
  neck_stiffness: z.boolean().default(false),
  notes: z.string().optional(),
});

export type RedFlagsFormData = z.infer<typeof redFlagsSchema>;

export const RED_FLAG_FIELDS = [
  { name: "thunderclap_onset" as const, label: "Thunderclap onset", description: "Worst headache ever, peaking in <1 minute", severity: "urgent" },
  { name: "focal_deficit" as const, label: "New focal neurological deficit", description: "Weakness, numbness, visual loss, speech difficulty", severity: "urgent" },
  { name: "seizure" as const, label: "Seizure", severity: "urgent" },
  { name: "confusion" as const, label: "Altered consciousness / confusion", severity: "urgent" },
  { name: "papilloedema_symptoms" as const, label: "Papilloedema symptoms", description: "Visual obscurations, pulsatile tinnitus", severity: "urgent" },
  { name: "fever" as const, label: "Fever / systemic illness", severity: "high" },
  { name: "weight_loss" as const, label: "Unexplained weight loss", severity: "high" },
  { name: "cancer_history" as const, label: "Active cancer", severity: "high" },
  { name: "immunosuppression" as const, label: "Immunosuppression", description: "HIV, chemotherapy, transplant", severity: "high" },
  { name: "pregnancy_new_headache" as const, label: "New headache in pregnancy", severity: "high" },
  { name: "postpartum_new_headache" as const, label: "New headache postpartum", severity: "high" },
  { name: "age_over_50_new_onset" as const, label: "New-onset headache after age 50", severity: "high" },
  { name: "trauma" as const, label: "Recent head trauma", severity: "high" },
  { name: "anticoagulation" as const, label: "On anticoagulation", severity: "high" },
  { name: "jaw_claudication" as const, label: "Jaw claudication", description: "Pain on chewing (GCA concern)", severity: "high" },
  { name: "scalp_tenderness" as const, label: "Scalp tenderness", description: "Especially temporal (GCA concern)", severity: "high" },
  { name: "visual_loss" as const, label: "Visual loss / amaurosis fugax", description: "Transient or persistent loss of vision (GCA, retinal artery)", severity: "urgent" },
  { name: "neck_stiffness" as const, label: "Neck stiffness", description: "Meningismus — meningitis or SAH concern", severity: "urgent" },
] as const;
