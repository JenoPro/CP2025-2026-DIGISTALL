import express from 'express'
import {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
  getAreasByCity,
} from './areaController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Public routes (no authentication needed for area fetching)
router.get('/', getAllAreas)
router.get('/city/:city', getAreasByCity)
router.get('/:id', getAreaById)

// Protected routes (admin authentication required)
router.post('/', auth.authenticateToken, createArea)
router.put('/:id', auth.authenticateToken, updateArea)
router.delete('/:id', auth.authenticateToken, deleteArea)

export default router
