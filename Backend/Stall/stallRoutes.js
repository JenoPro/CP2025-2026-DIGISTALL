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
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Apply branch manager authentication to all stall routes
// This ensures only authenticated branch managers can access their own stalls
router.use(authMiddleware.authenticateBranchManager)

// GET routes
router.get('/', getAllStalls) // GET /api/stalls - filtered by branch_manager_id
router.get('/available', getAvailableStalls) // GET /api/stalls/available - filtered by branch_manager_id
router.get('/filter', getStallsByFilter) // GET /api/stalls/filter - filtered by branch_manager_id
router.get('/:id', getStallById) // GET /api/stalls/:id - only if belongs to branch manager

// POST routes
router.post('/', addStall) // POST /api/stalls - assigns to current branch manager

// PUT routes
router.put('/:id', updateStall) // PUT /api/stalls/:id - only if belongs to branch manager

// DELETE routes
router.delete('/:id', deleteStall) // DELETE /api/stalls/:id - only if belongs to branch manager

export default router