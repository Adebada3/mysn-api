import { Router } from 'express'
import { v7 as uuidv7 } from 'uuid'
import { createUserSchema } from '../schemas/user.schema.js'
import { validate } from '../middlewares/validate.js'

const router = Router()
const users = [] // mémoire

router.post('/', validate(createUserSchema), (req, res) => {
  const data = req.validated
  const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase())
  if (exists) {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already exists' } })
  }
  const now = new Date().toISOString()
  const user = { id: uuidv7(), ...data, createdAt: now, updatedAt: now }
  users.push(user)
  res.status(201).json(user)
})

router.get('/', (_req, res) => {
  res.json({ data: users, nextCursor: null })
})

router.get('/:id', (req, res) => {
  const u = users.find(x => x.id === req.params.id)
  if (!u) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } })
  res.json(u)
})

export default router
