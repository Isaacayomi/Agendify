import { z } from "zod";

export const authFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;
