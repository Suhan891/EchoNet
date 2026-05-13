import * as z from 'zod'

export const messageSchema = z.object({
    format: z.enum(['TEXT', 'FILE', 'VIDEO', 'GIF', 'IMAGE']),
    content: z.string(),
    chatId: z.uuid(),
})

export type messageType = z.infer<typeof messageSchema>