import { z } from "zod/v4";

export const clinicalExaminationSchema = z.object({
  general_status: z.enum(["well", "unwell", "not_done"]).optional(),
  general_status_note: z.string().optional(),
  orientation: z.enum(["normal", "abnormal", "not_done"]).optional(),
  orientation_note: z.string().optional(),
  cranial_nerves: z.enum(["normal", "abnormal", "not_done"]).optional(),
  cranial_nerves_note: z.string().optional(),
  focal_neurology: z.enum(["absent", "present", "not_done"]).optional(),
  focal_neurology_note: z.string().optional(),
  motor_sensory: z.enum(["normal", "abnormal", "not_done"]).optional(),
  motor_sensory_note: z.string().optional(),
  gait_cerebellar: z.enum(["normal", "abnormal", "not_done"]).optional(),
  gait_cerebellar_note: z.string().optional(),
  meningeal_signs: z.enum(["absent", "present", "not_done"]).optional(),
  meningeal_signs_note: z.string().optional(),
  fundoscopy: z
    .enum(["normal", "papilledema", "abnormal_other", "not_done"])
    .optional(),
  fundoscopy_note: z.string().optional(),
  notes: z.string().optional(),
});

export type ClinicalExaminationFormData = z.infer<typeof clinicalExaminationSchema>;
