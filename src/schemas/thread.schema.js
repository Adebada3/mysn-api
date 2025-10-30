import { z } from 'zod'

export const createThreadSchema = z.object({
  scope: z.object({
    type: z.enum(['group', 'event']),
    id: z.string().trim().min(1)
  })
})
