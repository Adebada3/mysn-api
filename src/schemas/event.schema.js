import { z } from 'zod'

const ISODate = z.string().datetime({ offset: true })

export const createEventSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  startAt: ISODate,
  endAt: ISODate,
  location: z.object({
    address: z.string().trim().min(1),
    lat: z.number().optional(),
    lng: z.number().optional()
  }),
  coverUrl: z.string().url().optional(),
  isPublic: z.boolean().default(true)
}).refine((data) => new Date(data.startAt) < new Date(data.endAt), {
  message: 'startAt must be before endAt',
  path: ['startAt']
})
