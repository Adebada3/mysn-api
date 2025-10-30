import { Router } from 'express'
import { v7 as uuidv7 } from 'uuid'
import { createThreadSchema } from '../schemas/thread.schema.js'
import { createMessageSchema } from '../schemas/message.schema.js'
import { validate } from '../middlewares/validate.js'

const router = Router()

// In-memory stores
const threads = []   // { id, scopeType, scopeId, createdAt }
const messages = []  // { id, threadId, authorId, body, parentId?, createdAt }

// Créer un thread (attaché soit à un group, soit à un event)
router.post('/', validate(createThreadSchema), (req, res) => {
  const { scope } = req.validated
  const now = new Date().toISOString()
  const thread = { id: uuidv7(), scopeType: scope.type, scopeId: scope.id, createdAt: now }
  threads.push(thread)
  res.status(201).json(thread)
})

// Récupérer un thread
router.get('/:threadId', (req, res) => {
  const t = threads.find(th => th.id === req.params.threadId)
  if (!t) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Thread not found' } })
  res.json(t)
})

// Poster un message (ou une réponse si parentId présent)
router.post('/:threadId/messages', validate(createMessageSchema), (req, res) => {
  const t = threads.find(th => th.id === req.params.threadId)
  if (!t) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Thread not found' } })

  const { authorId, body, parentId } = req.validated
  if (parentId) {
    const parent = messages.find(m => m.id === parentId)
    if (!parent || parent.threadId !== t.id) {
      return res.status(400).json({ error: { code: 'INVALID_PARENT', message: 'parentId must be a message of this thread' } })
    }
  }
  const msg = { id: uuidv7(), threadId: t.id, authorId, body, parentId, createdAt: new Date().toISOString() }
  messages.push(msg)
  res.status(201).json(msg)
})

// Lister les messages d’un thread (ordre chrono)
router.get('/:threadId/messages', (req, res) => {
  const t = threads.find(th => th.id === req.params.threadId)
  if (!t) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Thread not found' } })
  const list = messages
    .filter(m => m.threadId === t.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  res.json({ data: list, nextCursor: null })
})

export default router
