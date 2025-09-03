import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import process from 'process'
import { createConnection, testConnection } from '../config/database.js'

const { hash, compare } = bcrypt
const { sign, verify } = jwt

// Login controller
export async function login(req, res) {
  let connection

  try {
    const { username, password } = req.body

    console.log('🔐 Login attempt for username:', username)

    // Validation
    if (!username || !password) {
      console.log('❌ Missing username or password')
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    connection = await createConnection()

    // Find admin user by username
    const [admins] = await connection.execute(
      'SELECT * FROM Admin WHERE username = ? AND is_active = TRUE',
      [username],
    )

    console.log('🔍 Found admins:', admins.length)

    if (admins.length === 0) {
      console.log('❌ No admin found with username:', username)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const admin = admins[0]
    console.log('👤 Admin found:', {
      id: admin.ID,
      username: admin.username,
      email: admin.email,
      hasPassword: !!admin.password,
    })

    // Verify password
    console.log('🔍 Comparing passwords...')
    const isPasswordValid = await compare(password, admin.password)
    console.log('🔐 Password comparison result:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', username)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Generate JWT token
    const jwtSecret =
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    console.log('🔑 JWT Secret configured:', !!jwtSecret)

    const token = sign(
      {
        userId: admin.ID,
        username: admin.username,
        role: admin.role,
      },
      jwtSecret,
      { expiresIn: '24h' },
    )

    console.log('✅ Login successful for user:', admin.username)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin.ID,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          first_name: admin.first_name,
          last_name: admin.last_name,
        },
      },
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Verify token controller
export async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    const jwtSecret =
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    const decoded = verify(token, jwtSecret)

    res.json({
      success: true,
      data: {
        user: {
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
        },
      },
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }
}

// Logout controller
export function logout(req, res) {
  res.json({
    success: true,
    message: 'Logout successful',
  })
}

// Get admin info controller
export async function getAdminInfo(req, res) {
  let connection
  try {
    connection = await createConnection()
    const [admins] = await connection.execute(
      'SELECT ID, username, email, first_name, last_name, role, created_at, is_active FROM Admin WHERE username = ?',
      ['admin'],
    )

    res.json({
      success: true,
      admin: admins[0] || null,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Reset admin password controller
export async function resetAdminPassword(req, res) {
  let connection

  try {
    connection = await createConnection()

    // Hash the new password
    const newHashedPassword = await hash('admin123', 12)

    // Update the admin password
    const [result] = await connection.execute('UPDATE Admin SET password = ? WHERE username = ?', [
      newHashedPassword,
      'admin',
    ])

    if (result.affectedRows > 0) {
      console.log('✅ Admin password reset successfully!')
      res.json({
        success: true,
        message: 'Admin password reset to admin123',
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Admin user not found',
      })
    }
  } catch (error) {
    console.error('❌ Password reset error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Test database connection controller
export async function testDb(req, res) {
  try {
    const result = await testConnection()
    res.json(result)
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    })
  }
}
