import { z } from "zod/v4";

export const examinationSchema = z.object({
  // General observations
  bp_systolic: z.number().optional(),
  bp_diastolic: z.number().optional(),
  heart_rate_bpm: z.number().optional(),
  weight_kg: z.number().optional(),

  // Examination approach
  exam_unchanged: z.boolean().optional(),
  exam_unchanged_date: z.string().optional(),

  // Focused neurological
  neuro_status: z.enum(["normal", "abnormal", "not_assessed"]).optional(),
  neuro_details: z.string().optional(),

  // Fundoscopy
  fundoscopy_status: z.enum(["normal", "abnormal", "not_assessed"]).optional(),
  fundoscopy_details: z.string().optional(),

  // Diagnosis-specific exam findings
  // Cervicogenic
  cervical_rom: z.string().optional(),
  neck_palpation: z.string().optional(),
  headache_reproduced_by_neck: z.boolean().optional(),

  // Cluster/TAC
  autonomic_signs_present: z.boolean().optional(),
  autonomic_signs_details: z.string().optional(),

  // TTH
  pericranial_tenderness: z.enum(["absent", "mild", "moderate", "severe"]).optional(),

  // General notes
  notes: z.string().optional(),
});

export type ExaminationFormData = z.infer<typeof examinationSchema>;
