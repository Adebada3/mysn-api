import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  avatarUrl: z.string().url().optional()
})
