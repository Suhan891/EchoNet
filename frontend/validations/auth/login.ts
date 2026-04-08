import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email("Please provide a valid email"),

  password: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(200, "Name must be at most 200 characters."),
});

export type LoginType = z.infer<typeof LoginSchema>
