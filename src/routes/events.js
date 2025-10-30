import { Router } from 'express'
import { v7 as uuidv7 } from 'uuid'
import { createEventSchema } from '../schemas/event.schema.js'
import { addOrganizerSchema, addParticipantSchema } from '../schemas/event-members.schema.js'
import { validate } from '../middlewares/validate.js'

const router = Router()

const events = [] // { id, title, ... }
const eventOrganizers = []   // { id, eventId, userId, addedAt }
const eventParticipants = [] // { id, eventId, userId, status, updatedAt }

/**
 * Create event
 */
router.post('/', validate(createEventSchema), (req, res) => {
  const data = req.validated
  const now = new Date().toISOString()
  const event = { id: uuidv7(), ...data, createdAt: now, updatedAt: now }
  events.push(event)
  res.status(201).json(event)
})

/**
 * List events
 */
router.get('/', (req, res) => {
  const { publicOnly, from, to } = req.query
  let out = [...events]
  if (publicOnly === 'true') out = out.filter(e => e.isPublic)
  if (from) out = out.filter(e => new Date(e.startAt) >= new Date(from))
  if (to) out = out.filter(e => new Date(e.startAt) <= new Date(to))
  res.json({ data: out, nextCursor: null })
})

/**
 * Get event by id
 */
router.get('/:id', (req, res) => {
  const e = events.find(ev => ev.id === req.params.id)
  if (!e) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } })
  res.json(e)
})

/**
 * Add organizer to event
 */
router.post('/:eventId/organizers', validate(addOrganizerSchema), (req, res) => {
  const ev = events.find(e => e.id === req.params.eventId)
  if (!ev) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } })
  const { userId } = req.validated
  const exists = eventOrganizers.find(o => o.eventId === ev.id && o.userId === userId)
  if (exists) return res.status(409).json({ error: { code: 'CONFLICT', message: 'Already organizer' } })
  const now = new Date().toISOString()
  const org = { id: uuidv7(), eventId: ev.id, userId, addedAt: now }
  eventOrganizers.push(org)
  res.status(201).json(org)
})

/**
 * List organizers
 */
router.get('/:eventId/organizers', (req, res) => {
  const ev = events.find(e => e.id === req.params.eventId)
  if (!ev) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } })
  const orgs = eventOrganizers.filter(o => o.eventId === ev.id)
  res.json({ data: orgs, nextCursor: null })
})

/**
 * Add/update participant
 */
router.post('/:eventId/participants', validate(addParticipantSchema), (req, res) => {
  const ev = events.find(e => e.id === req.params.eventId)
  if (!ev) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } })
  const { userId, status } = req.validated
  const existing = eventParticipants.find(p => p.eventId === ev.id && p.userId === userId)
  const now = new Date().toISOString()
  if (existing) {
    existing.status = status
    existing.updatedAt = now
    return res.json(existing)
  }
  const part = { id: uuidv7(), eventId: ev.id, userId, status, updatedAt: now }
  eventParticipants.push(part)
  res.status(201).json(part)
})

/**
 * List participants
 */
router.get('/:eventId/participants', (req, res) => {
  const ev = events.find(e => e.id === req.params.eventId)
  if (!ev) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } })
  const parts = eventParticipants.filter(p => p.eventId === ev.id)
  res.json({ data: parts, nextCursor: null })
})

export default router
