import { z } from "zod";

export const sessionFormSchema = z.object({
  title: z.string().trim().min(3, "Session title should be at least 3 characters."),
  subject: z.string().trim().min(2, "Subject should be at least 2 characters."),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."),
  startTime: z.string().trim().regex(/^\d{2}:\d{2}$/, "Use HH:mm."),
  endTime: z.string().trim().regex(/^\d{2}:\d{2}$/, "Use HH:mm."),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
