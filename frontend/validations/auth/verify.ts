import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/PNG"];

export const VerifySchema = z.object({
  token: z
    .string()
    .min(10, "Token is too Short")
    .regex(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      "Invalid Token",
    ),
  avatar: z
    .any(),
    // .refine(
    //   (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    //   "Invalid document Type",
    // )
    // .refine(
    //   (file) => file.size <= MAX_FILE_SIZE,
    //   "File size shouldnot exceed 5 MB",
    // ),
  bio: z.string().max(150, "Bio must not be more than 150 charecters").optional(),

  name: z
    .string()
    .min(3, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
});

export type VerifyType = z.infer<typeof VerifySchema>
