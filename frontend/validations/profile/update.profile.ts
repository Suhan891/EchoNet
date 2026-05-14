import * as z from "zod";

export const UpdateProfileSchema = z.object({
  bio: z
    .string()
    .max(100, "Bio must not be at more than 100 characters.")
    .optional(),

  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 200 characters."),
});

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>
