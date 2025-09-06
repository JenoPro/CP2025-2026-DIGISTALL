import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import process from 'process'
import { initializeDatabase } from './config/database.js'
import { corsConfig } from './config/cors.js'
import adminRoutes from './Admin/adminRoutes.js'
import { login, testDb } from './Admin/adminController.js'
import { errorHandler } from './middleware/errorHandler.js'
import stallRoutes from './Stall/stallRoutes.js'
import areaRoutes from './Area/areaRoutes.js'

// Configure dotenv FIRST
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors(corsConfig))
app.use(express.json())

// Routes
app.use('/api/admin', adminRoutes)
app.use('/api/stalls', stallRoutes)
app.use('/api/areas', areaRoutes)

// Backward compatibility route for old frontend
app.post('/api/Admin', login)

// Test database connection endpoint (backward compatibility)
app.get('/api/test-db', testDb)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      port: PORT,
      dbHost: process.env.DB_HOST || 'localhost',
      dbName: process.env.DB_NAME || 'naga_stall',
    },
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, async () => {
  console.log('🚀 Server starting...')
  console.log(`🌐 Server running on http://localhost:${PORT}`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 CORS enabled for frontend URLs`)
  console.log('🔧 Available endpoints:')
  console.log('   POST /api/Admin - Admin login (backward compatibility)')
  console.log('   POST /api/admin/login - Admin login (new)')
  console.log('   GET  /api/admin/verify-token - Verify JWT token')
  console.log('   POST /api/admin/logout - Admin logout')
  console.log('   GET  /api/admin/info - Get admin user info')
  console.log('   POST /api/admin/reset-password - Reset admin password')
  console.log('   GET  /api/stalls - Get all stalls')
  console.log('   POST /api/stalls - Add new stall')
  console.log('   GET  /api/stalls/available - Get available stalls')
  console.log('   GET  /api/stalls/filter - Get stalls by filter')
  console.log('   GET  /api/stalls/:id - Get stall by ID')
  console.log('   PUT  /api/stalls/:id - Update stall')
  console.log('   DELETE /api/stalls/:id - Delete stall')
  console.log('   GET  /api/areas - Get all areas')
  console.log('   GET  /api/areas/city/:city - Get areas by city')
  console.log('   GET  /api/areas/:id - Get area by ID')
  console.log('   POST /api/areas - Create new area')
  console.log('   PUT  /api/areas/:id - Update area')
  console.log('   DELETE /api/areas/:id - Delete area')
  console.log('   GET  /api/health - Health check')
  console.log('   GET  /api/test-db - Test database connection')

  try {
    await initializeDatabase()
    console.log('✅ Database initialization completed successfully')
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    process.exit(1)
  }
})
