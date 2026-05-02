import * as z from "zod";
import { avatarSchema } from "./create.avatar";

export const profileSchema = z.object({
  avatar: avatarSchema,
  bio: z
    .string()
    .max(150, "Bio must not be more than 150 charecters")
    .optional(),

  name: z
    .string()
    .min(3, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),

  isPrivate: z.boolean().default(false)
});

export type profileType = z.infer<typeof profileSchema>
