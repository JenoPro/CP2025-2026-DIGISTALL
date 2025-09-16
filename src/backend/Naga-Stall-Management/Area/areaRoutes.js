import express from 'express'
import {
  getAreas,
  getAreasByCity,
  getLocationsByCity,
  getFloors,
  getSections,
  getSectionsByFloor,
  getAllAreas,
} from './areaController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Public routes (no authentication required)
router.get('/all', getAllAreas) // GET /api/areas/all
router.get('/cities', getAllAreas) // GET /api/areas/cities (alias)
router.get('/city/:city', getAreasByCity) // GET /api/areas/city/:city
router.get('/locations/:city', getLocationsByCity) // GET /api/areas/locations/:city

// Protected routes (require authentication)
router.get('/', authMiddleware.authenticateToken, getAreas) // GET /api/areas
router.get('/floors', authMiddleware.authenticateToken, getFloors) // GET /api/areas/floors
router.get('/sections', authMiddleware.authenticateToken, getSections) // GET /api/areas/sections
router.get('/floors/:floorId/sections', authMiddleware.authenticateToken, getSectionsByFloor) // GET /api/areas/floors/:floorId/sections

export default router
