import { z } from 'zod'

export const createPollSchema = z.object({
  title: z.string().trim().min(1),
  questions: z.array(z.object({
    text: z.string().trim().min(1),
    options: z.array(z.object({
      text: z.string().trim().min(1)
    })).min(2)
  })).min(1)
})

export const castVoteSchema = z.object({
  voterId: z.string().trim().min(1),
  questionId: z.string().trim().min(1),
  optionId: z.string().trim().min(1)
})
