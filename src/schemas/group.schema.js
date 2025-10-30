import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  iconUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  visibility: z.enum(['public','private','secret']),
  allowMemberPosts: z.boolean().default(true),
  allowMemberEvents: z.boolean().default(true)
})

export const addMemberSchema = z.object({
  userId: z.string().trim().min(1),
  role: z.enum(['admin','member'])
})
