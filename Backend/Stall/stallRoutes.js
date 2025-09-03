import express from 'express'
import {
  getAllStalls,
  getStallById,
  addStall,
  updateStall,
  deleteStall,
  getAvailableStalls,
  getStallsByFilter,
} from './stallController.js'

const router = express.Router()

// GET routes
router.get('/', getAllStalls) // GET /api/stalls
router.get('/available', getAvailableStalls) // GET /api/stalls/available
router.get('/filter', getStallsByFilter) // GET /api/stalls/filter
router.get('/:id', getStallById) // GET /api/stalls/:id

// POST routes
router.post('/', addStall) // POST /api/stalls

// PUT routes
router.put('/:id', updateStall) // PUT /api/stalls/:id

// DELETE routes
router.delete('/:id', deleteStall) // DELETE /api/stalls/:id

export default router
