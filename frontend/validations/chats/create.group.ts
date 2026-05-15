import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const groupSchema = z.object({
  media: z.file().check(z.maxSize(MAX_FILE_SIZE), z.mime([...ALLOWED_MIME])),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 200 characters."),

  profiles: z
    .array(z.uuid())
    .min(2, "Atleast 2 profiles has to be selected"),
});

export type groupType = z.infer<typeof groupSchema>;
