import { Router } from 'express'
import { v7 as uuidv7 } from 'uuid'
import { validate } from '../middlewares/validate.js'
import { createTicketTypeSchema, createOrderSchema } from '../schemas/ticketing.schema.js'
import eventsRouter from './events.js' // not used directly, just semantic

const router = Router()

// stores
const ticketTypes = []  // { id, eventId, name, price, currency, quantity }
const orders = []       // { id, eventId, ticketTypeId, purchaser:{...}, purchasedAt }

/**
 * Create a ticket type (public events only — on fait une vérif légère via un param "isPublic" si dispo)
 * Ici on ne relit pas l'event, on se contente d'exposer la contrainte à l'API.
 */
router.post('/events/:eventId/ticket-types', validate(createTicketTypeSchema), (req, res) => {
  const { eventId } = req.params
  const t = { id: uuidv7(), eventId, ...req.validated }
  ticketTypes.push(t)
  res.status(201).json(t)
})

router.get('/events/:eventId/ticket-types', (req, res) => {
  const { eventId } = req.params
  const out = ticketTypes.filter(t => t.eventId === eventId)
  res.json({ data: out, nextCursor: null })
})

/**
 * Create order (1 ticket per purchaser email per event)
 */
router.post('/events/:eventId/orders', validate(createOrderSchema), (req, res) => {
  const { eventId } = req.params
  const { ticketTypeId, purchaser } = req.validated
  const tt = ticketTypes.find(t => t.id === ticketTypeId && t.eventId === eventId)
  if (!tt) return res.status(400).json({ error: { code: 'INVALID_TICKET_TYPE', message: 'Ticket type not found for this event' } })

  // stock
  if (tt.quantity <= 0) {
    return res.status(409).json({ error: { code: 'SOLD_OUT', message: 'No more tickets available' } })
  }

  // one per purchaser email per event
  const already = orders.find(o => o.eventId === eventId && o.purchaser.email.toLowerCase() === purchaser.email.toLowerCase())
  if (already) {
    return res.status(409).json({ error: { code: 'LIMIT_REACHED', message: 'This purchaser already has a ticket for this event' } })
  }

  const now = new Date().toISOString()
  const order = { id: uuidv7(), eventId, ticketTypeId, purchaser, purchasedAt: now }
  orders.push(order)
  tt.quantity -= 1
  res.status(201).json(order)
})

router.get('/events/:eventId/orders', (req, res) => {
  const out = orders.filter(o => o.eventId === req.params.eventId)
  res.json({ data: out, nextCursor: null })
})

export default router
