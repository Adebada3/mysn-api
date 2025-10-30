import { z } from 'zod'

export const addOrganizerSchema = z.object({
  userId: z.string().trim().min(1)
})

export const addParticipantSchema = z.object({
  userId: z.string().trim().min(1),
  status: z.enum(['going','interested','declined'])
})
