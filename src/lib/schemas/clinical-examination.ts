import { z } from "zod/v4";

const generalExamStatus = z.enum(["absent", "present", "not_assessed"]).optional();
const neuroExamStatus = z.enum(["normal", "abnormal", "not_assessed"]).optional();

export const clinicalExaminationSchema = z.object({
  // ── General Examination ──
  anaemia: generalExamStatus,
  cyanosis: generalExamStatus,
  lymphadenopathy: generalExamStatus,
  peripheral_oedema: generalExamStatus,

  // Observations / vitals
  heart_rate_bpm: z.coerce.number().min(20).max(250).optional().or(z.literal("")),
  bp_systolic: z.coerce.number().min(40).max(300).optional().or(z.literal("")),
  bp_diastolic: z.coerce.number().min(20).max(200).optional().or(z.literal("")),
  oxygen_saturation: z.coerce.number().min(40).max(100).optional().or(z.literal("")),
  temperature: z.coerce.number().min(30).max(45).optional().or(z.literal("")),
  weight_kg: z.coerce.number().min(1).max(400).optional().or(z.literal("")),
  height_cm: z.coerce.number().min(30).max(250).optional().or(z.literal("")),
  bmi: z.coerce.number().optional().or(z.literal("")),

  // ── Neurological Examination ──
  gcs_eye: z.coerce.number().min(1).max(4).optional().or(z.literal("")),
  gcs_verbal: z.coerce.number().min(1).max(5).optional().or(z.literal("")),
  gcs_motor: z.coerce.number().min(1).max(6).optional().or(z.literal("")),
  gcs_total: z.coerce.number().min(3).max(15).optional().or(z.literal("")),

  gait_status: neuroExamStatus,
  gait_details: z.string().optional(),
  cranial_nerves_status: neuroExamStatus,
  cranial_nerves_details: z.string().optional(),
  fundoscopy_status: neuroExamStatus,
  fundoscopy_details: z.string().optional(),
  motor_status: neuroExamStatus,
  motor_details: z.string().optional(),
  sensory_status: neuroExamStatus,
  sensory_details: z.string().optional(),
  cerebellar_status: neuroExamStatus,
  cerebellar_details: z.string().optional(),
  reflexes_status: neuroExamStatus,
  reflexes_details: z.string().optional(),

  // General notes
  notes: z.string().optional(),
});

export type ClinicalExaminationFormData = z.infer<typeof clinicalExaminationSchema>;
