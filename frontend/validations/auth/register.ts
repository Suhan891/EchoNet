import * as z from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(200, "Name must be at most 200 characters."),

  email: z.email("Please provide a valid email"),

  password: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(200, "Name must be at most 200 characters."),
});

export type RegisterType = z.infer<typeof RegisterSchema>
