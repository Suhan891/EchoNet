import * as z from 'zod'

const Type = z.enum(['POST','REEL'])
export const commentSchema = z.object({
    name: Type,
    content: z.string().min(5, {message: 'Minimum 5 charecters is required'}),
    id: z.uuid(),
})
export type commentType = z.infer<typeof commentSchema>