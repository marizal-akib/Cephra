import { z } from "zod/v4";

export const assessmentPlanSchema = z.object({
  // Assessment subsection
  assessment_summary: z.string().optional(),
  diagnosis_status: z.enum(["confirmed", "revised", "unchanged", "uncertain"]).optional(),
  trend_overall: z.enum(["improving", "stable", "worsening"]).optional(),

  // Treatment changes subsection
  treatment_changes: z.string().optional(),

  // Safety counselling subsection
  safety_counselling: z.string().optional(),

  // Follow-up plan subsection
  follow_up_type: z.enum(["clinic", "virtual", "gp_review", "telephone"]).optional(),
  follow_up_date: z.string().optional(),
  follow_up_time: z.string().optional(),
  follow_up_purpose: z.string().optional(),
  follow_up_clinician: z.string().optional(),

  // Discharge
  discharge: z.boolean().optional(),
  discharge_criteria: z.string().optional(),
});

export type AssessmentPlanFormData = z.infer<typeof assessmentPlanSchema>;
