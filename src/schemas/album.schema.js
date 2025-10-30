import { z } from 'zod'

export const createAlbumSchema = z.object({
  title: z.string().trim().min(1)
})

export const addPhotoSchema = z.object({
  authorId: z.string().trim().min(1),
  url: z.string().url(),
  caption: z.string().trim().optional()
})

export const addCommentSchema = z.object({
  authorId: z.string().trim().min(1),
  body: z.string().trim().min(1)
})
