import * as z from "zod";

export const UpdateProfileSchema = z.object({
  bio: z
    .string()
    .min(10, "Bio must include 10 charecters")
    .optional(),

  name: z
    .string()
    .min(3, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 200 characters."),
});

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>
