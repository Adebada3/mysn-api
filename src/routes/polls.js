import { Router } from 'express'
import { v7 as uuidv7 } from 'uuid'
import { createPollSchema, castVoteSchema } from '../schemas/poll.schema.js'
import { validate } from '../middlewares/validate.js'

const router = Router()

// stores
const polls = []          // { id, eventId, title, questions:[{id,text,options:[{id,text}]}], createdAt }
const pollVotes = []      // { id, pollId, questionId, optionId, voterId, createdAt }

/**
 * Create poll for an event
 */
router.post('/events/:eventId/polls', validate(createPollSchema), (req, res) => {
  const { eventId } = req.params
  const now = new Date().toISOString()
  const payload = req.validated
  const poll = {
    id: uuidv7(),
    eventId,
    title: payload.title,
    questions: payload.questions.map(q => ({
      id: uuidv7(),
      text: q.text,
      options: q.options.map(o => ({ id: uuidv7(), text: o.text }))
    })),
    createdAt: now
  }
  polls.push(poll)
  res.status(201).json(poll)
})

/**
 * List polls of an event
 */
router.get('/events/:eventId/polls', (req, res) => {
  const out = polls.filter(p => p.eventId === req.params.eventId)
  res.json({ data: out, nextCursor: null })
})

/**
 * Vote: exactly one option per (question, voter)
 */
router.post('/polls/:pollId/votes', validate(castVoteSchema), (req, res) => {
  const poll = polls.find(p => p.id === req.params.pollId)
  if (!poll) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Poll not found' } })
  const { voterId, questionId, optionId } = req.validated

  const q = poll.questions.find(q => q.id === questionId)
  if (!q) return res.status(400).json({ error: { code: 'INVALID_QUESTION', message: 'Question not found in this poll' } })
  const opt = q.options.find(o => o.id === optionId)
  if (!opt) return res.status(400).json({ error: { code: 'INVALID_OPTION', message: 'Option not found in this question' } })

  // one vote per voter per question
  const existing = pollVotes.find(v => v.pollId === poll.id && v.questionId === questionId && v.voterId === voterId)
  if (existing) {
    existing.optionId = optionId
    existing.createdAt = new Date().toISOString()
    return res.json(existing)
  }

  const vote = { id: uuidv7(), pollId: poll.id, questionId, optionId, voterId, createdAt: new Date().toISOString() }
  pollVotes.push(vote)
  res.status(201).json(vote)
})

/**
 * Results: counts per option
 */
router.get('/polls/:pollId/results', (req, res) => {
  const poll = polls.find(p => p.id === req.params.pollId)
  if (!poll) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Poll not found' } })
  const results = poll.questions.map(q => ({
    questionId: q.id,
    text: q.text,
    options: q.options.map(o => ({
      optionId: o.id,
      text: o.text,
      votes: pollVotes.filter(v => v.pollId === poll.id && v.questionId === q.id && v.optionId === o.id).length
    }))
  }))
  res.json({ poll: { id: poll.id, title: poll.title }, results })
})

export default router
