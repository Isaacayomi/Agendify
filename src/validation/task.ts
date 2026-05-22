import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().trim().min(3, "Task title should be at least 3 characters."),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().trim().optional(),
  dueTime: z.string().trim().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
