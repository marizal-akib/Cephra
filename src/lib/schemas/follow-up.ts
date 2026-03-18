import { z } from "zod/v4";

export const followUpSchema = z.object({
  follow_up_date: z.string().optional(),
  follow_up_time: z.string().optional(),
});

export type FollowUpFormData = z.infer<typeof followUpSchema>;
