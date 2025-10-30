import { Router } from 'express'
import { v7 as uuidv7 } from 'uuid'
import { createGroupSchema, addMemberSchema } from '../schemas/group.schema.js'
import { validate } from '../middlewares/validate.js'

const router = Router()

// stores in-memory (à remplacer par DB plus tard)
const groups = []                // {id, name, visibility, ...}
const groupMembers = []          // {id, groupId, userId, role, joinedAt}

// Créer un groupe
router.post('/', validate(createGroupSchema), (req, res) => {
  const data = req.validated
  const now = new Date().toISOString()
  const group = { id: uuidv7(), ...data, createdAt: now, updatedAt: now }
  groups.push(group)
  // sécurité: au moins 1 admin ? → on laisse l'ajout de membres via endpoint dédié.
  res.status(201).json(group)
})

// Lister les groupes (optionnel: filtrer par visibilité)
router.get('/', (req, res) => {
  const { visibility } = req.query
  let out = [...groups]
  if (visibility) out = out.filter(g => g.visibility === visibility)
  res.json({ data: out, nextCursor: null })
})

// Détail d'un groupe
router.get('/:groupId', (req, res) => {
  const g = groups.find(x => x.id === req.params.groupId)
  if (!g) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Group not found' } })
  res.json(g)
})

// Ajouter un membre (admin ou member)
router.post('/:groupId/members', validate(addMemberSchema), (req, res) => {
  const g = groups.find(x => x.id === req.params.groupId)
  if (!g) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Group not found' } })

  const { userId, role } = req.validated
  const exists = groupMembers.find(m => m.groupId === g.id && m.userId === userId)
  if (exists) {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'User already member of this group' } })
  }
  const now = new Date().toISOString()
  const member = { id: uuidv7(), groupId: g.id, userId, role, joinedAt: now }
  groupMembers.push(member)
  res.status(201).json(member)
})

// Lister les membres d'un groupe
router.get('/:groupId/members', (req, res) => {
  const g = groups.find(x => x.id === req.params.groupId)
  if (!g) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Group not found' } })
  const members = groupMembers.filter(m => m.groupId === g.id)
  res.json({ data: members, nextCursor: null })
})

export default router
