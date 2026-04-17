import { z } from "zod";

const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  audio: 20 * 1024 * 1024,
};

const ALLOWED_MIME = {
  image: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
};

const fileValidator = (
  category: "image" | "video" | "audio"
) =>
  z
    .instanceof(File)
    .refine(
      (file) => ALLOWED_MIME[category].includes(file.type),
      `Invalid ${category} type`
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZES[category],
      `${category} file too large`
    );

export const storySchema = z.object({
  slides: z.array(
    z
      .object({
        type: z.enum(["image", "video", "imageAudio"]),
        caption: z.string().max(100).optional(),

        imageFile: z.any().optional().nullable(),
        videoFile: z.any().optional().nullable(),
        audioFile: z.any().optional().nullable(),
      })
      .superRefine((data, ctx) => {

        if (data.type === "image") {
          if (!data.imageFile) {
            ctx.addIssue({
              code: 'custom',
              message: "Image required",
              path: ["imageFile"],
            });
            return;
          }

          const result = fileValidator("image").safeParse(data.imageFile);
          if (!result.success) {
            result.error.issues.forEach((issue) =>
              ctx.addIssue({
                ...issue,
                path: ["imageFile"],
              })
            );
          }
        }

        if (data.type === "video") {
          if (!data.videoFile) {
            ctx.addIssue({
              code: 'custom',
              message: "Video required",
              path: ["videoFile"],
            });
            return;
          }

          const result = fileValidator("video").safeParse(data.videoFile);
          if (!result.success) {
            result.error.issues.forEach((issue) =>
              ctx.addIssue({
                ...issue,
                path: ["videoFile"],
              })
            );
          }
        }

        if (data.type === "imageAudio") {
          if (!data.imageFile || !data.audioFile) {
            ctx.addIssue({
              code: 'custom',
              message: "Image + Audio required",
            });
            return;
          }

          const img = fileValidator("image").safeParse(data.imageFile);
          if (!img.success) {
            img.error.issues.forEach((issue) =>
              ctx.addIssue({ ...issue, path: ["imageFile"] })
            );
          }

          const aud = fileValidator("audio").safeParse(data.audioFile);
          if (!aud.success) {
            aud.error.issues.forEach((issue) =>
              ctx.addIssue({ ...issue, path: ["audioFile"] })
            );
          }
        }
      })
  ),
});

export type storyType = z.infer<typeof storySchema>;