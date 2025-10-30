import { z } from 'zod'

export const createMessageSchema = z.object({
  authorId: z.string().trim().min(1),
  body: z.string().trim().min(1),
  parentId: z.string().trim().min(1).optional() // reply optionnelle
})
