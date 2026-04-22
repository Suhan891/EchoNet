import { ALLOWED_POSTS } from "@/utils/constants";
import * as z from "zod";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const postImages = z.object({
  file: z.file().check(z.maxSize(MAX_FILE_SIZE), z.mime([...ALLOWED_MIME])),
  order: z
    .number()
    .max(ALLOWED_POSTS, `Not allowed more than ${ALLOWED_POSTS}`).optional(),
});
export const createPostSchema = z.object({
  caption: z.string().min(3, "Minimum 3 charecters are required"),
  description: z.string().min(10, "Minimum 10 chreacters are required"),
  images: z
    .array(postImages)
    .min(1, "Single image upload is required")
    .max(ALLOWED_POSTS, `Not allowed more than ${ALLOWED_POSTS}`),
});

export type createPostType = z.infer<typeof createPostSchema>