import * as z from 'zod'

export const searchSchema = z.object({
    name: z.string().min(3,'Minimum 3 charecters are required')
})
export type searchType = z.infer<typeof searchSchema>

export const avatarSchema = z.object({
    avatar: z.string().min(1,'You must select an avatar')
})
export type avatarType = z.infer<typeof avatarSchema>
