import { z } from "zod/v4";

export const followUpSchema = z.object({
  follow_up_date: z.string().optional(),
  follow_up_time: z.string().optional(),
  follow_up_type: z.enum(["clinic", "virtual", "gp_review", "telephone"]).optional(),
  follow_up_purpose: z.string().optional(),
  follow_up_clinician: z.string().optional(),
  safety_counselling: z.string().optional(),
});

export type FollowUpFormData = z.infer<typeof followUpSchema>;
