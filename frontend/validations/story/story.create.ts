import z from "zod";
const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,       // 10 MB
  video: 100 * 1024 * 1024,      // 100 MB
  audio: 20 * 1024 * 1024,       // 20 MB
};

const ALLOWED_MIME = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
};

export const slideSchema = z.object({
    type: z.enum(['image', 'video', 'imageAudio']),
    imageFile: z.instanceof(File).refine(file => file.size <= MAX_FILE_SIZES.image,'Image cannot exceed 10 mb file size').refine(file => ALLOWED_MIME.image.includes(file.type),`Allowed types: ${ALLOWED_MIME.image.map(type => type.split('/')[1]).join(', ')}`).optional(),
    videoFile: z.instanceof(File).refine(file => file.size <= MAX_FILE_SIZES.video,'Video cannot exceed 100 mb file size').refine(file => ALLOWED_MIME.video.includes(file.type),`Allowed types: ${ALLOWED_MIME.video.map(type => type.split('/')[1]).join(', ')}`).optional(),
    audioFile: z.instanceof(File).refine(file => file.size <= MAX_FILE_SIZES.audio,'Audio cannot exceed 20 mb file size').refine(file => ALLOWED_MIME.audio.includes(file.type),`Allowed types: ${ALLOWED_MIME.audio.map(type => type.split('/')[1]).join(', ')}`).optional(),
    caption: z.string().max(100, 'Not more that 100 charecters are qllowed'),
    order: z.number(),
})
export const storySchema = z.object({
    slides: z.array(slideSchema).max(15,'Maximum 15 media are allowed')
})

export type storyType = z.infer<typeof storySchema>