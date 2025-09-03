import express from 'express'
import {
  login,
  verifyToken,
  logout,
  getAdminInfo,
  resetAdminPassword,
  testDb,
} from './adminController.js'

const router = express.Router()

// Admin authentication routes
router.post('/login', login)
router.get('/verify-token', verifyToken)
router.post('/logout', logout)

// Admin management routes
router.get('/info', getAdminInfo)
router.post('/reset-password', resetAdminPassword)

// Utility routes
router.get('/test-db', testDb)

export default router
