import * as z from "zod";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const searchSchema = z.object({
  name: z.string().optional(),
});
export type searchType = z.infer<typeof searchSchema>;

export const avatarSchema = z
  .discriminatedUnion("mode", [
    z.object({
      mode: z.literal("create"),
      avatarUrl: z.string().min(1, "You must select an avatar"),
    }),
    z.object({
      mode: z.literal("upload"),
      avatar: z
        .file()
        .check(z.maxSize(MAX_FILE_SIZE), z.mime([...ALLOWED_MIME])),
    }),
  ])

export type avatarType = z.infer<typeof avatarSchema>;
