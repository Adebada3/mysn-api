import { z } from 'zod'

export const createTicketTypeSchema = z.object({
  name: z.string().trim().min(1),
  price: z.number().nonnegative(),
  currency: z.string().trim().min(1).default('EUR'),
  quantity: z.number().int().nonnegative().min(0)
})

export const createOrderSchema = z.object({
  ticketTypeId: z.string().trim().min(1),
  purchaser: z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().trim().email(),
    address: z.string().trim().min(1)
  })
})
