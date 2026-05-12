import * as z from 'zod'

export const privateSchema = z.object({
    profile:  z
        .string()
        .min(3, "Name must be at least 2 characters.")
        .max(50, "Name must be at most 50 characters."),
})

export type privateType = z.infer<typeof privateSchema>