import { Router } from 'express'
import { v7 as uuidv7 } from 'uuid'
import { validate } from '../middlewares/validate.js'
import { createAlbumSchema, addPhotoSchema, addCommentSchema } from '../schemas/album.schema.js'

const router = Router()

const albums = []    // { id, eventId, title, createdAt }
const photos = []    // { id, albumId, authorId, url, caption?, createdAt }
const comments = []  // { id, photoId, authorId, body, createdAt }

/**
 * Create album for an event
 */
router.post('/events/:eventId/albums', validate(createAlbumSchema), (req, res) => {
  const { eventId } = req.params
  const now = new Date().toISOString()
  const { title } = req.validated
  const album = { id: uuidv7(), eventId, title, createdAt: now }
  albums.push(album)
  res.status(201).json(album)
})

/**
 * List albums of an event
 */
router.get('/events/:eventId/albums', (req, res) => {
  const out = albums.filter(a => a.eventId === req.params.eventId)
  res.json({ data: out, nextCursor: null })
})

/**
 * Add photo to album
 */
router.post('/albums/:albumId/photos', validate(addPhotoSchema), (req, res) => {
  const album = albums.find(a => a.id === req.params.albumId)
  if (!album) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Album not found' } })
  const now = new Date().toISOString()
  const { authorId, url, caption } = req.validated
  const photo = { id: uuidv7(), albumId: album.id, authorId, url, caption, createdAt: now }
  photos.push(photo)
  res.status(201).json(photo)
})

/**
 * List photos of an album
 */
router.get('/albums/:albumId/photos', (req, res) => {
  const album = albums.find(a => a.id === req.params.albumId)
  if (!album) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Album not found' } })
  const out = photos.filter(p => p.albumId === album.id)
  res.json({ data: out, nextCursor: null })
})

/**
 * Comment a photo
 */
router.post('/photos/:photoId/comments', validate(addCommentSchema), (req, res) => {
  const photo = photos.find(p => p.id === req.params.photoId)
  if (!photo) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Photo not found' } })
  const now = new Date().toISOString()
  const { authorId, body } = req.validated
  const comment = { id: uuidv7(), photoId: photo.id, authorId, body, createdAt: now }
  comments.push(comment)
  res.status(201).json(comment)
})

/**
 * List comments of a photo
 */
router.get('/photos/:photoId/comments', (req, res) => {
  const photo = photos.find(p => p.id === req.params.photoId)
  if (!photo) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Photo not found' } })
  const out = comments.filter(c => c.photoId === photo.id)
  res.json({ data: out, nextCursor: null })
})

export default router
