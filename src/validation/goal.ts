import { z } from "zod";

export const goalFormSchema = z.object({
  title: z.string().trim().min(3, "Goal title should be at least 3 characters."),
  category: z.enum(["study", "reading", "exercise", "personal"]),
  type: z.enum(["daily", "weekly", "monthly"]),
  targetHours: z.coerce
    .number()
    .positive("Target hours must be greater than zero."),
  completedHours: z.coerce.number().min(0, "Completed hours cannot be negative."),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
