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
    const { username, password, branch } = req.body

    console.log('🔐 Login attempt for username:', username, 'branch:', branch)

    // Validation
    if (!username || !password) {
      console.log('❌ Missing username or password')
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    if (!branch) {
      console.log('❌ Missing branch')
      return res.status(400).json({
        success: false,
        message: 'Branch selection is required',
      })
    }

    connection = await createConnection()

    // Find admin user by username and branch
    const [admins] = await connection.execute(
      'SELECT * FROM Admin WHERE username = ? AND branch = ? AND is_active = TRUE',
      [username, branch],
    )

    console.log('🔍 Found admins:', admins.length)

    if (admins.length === 0) {
      console.log('❌ No admin found with username:', username, 'and branch:', branch)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or unauthorized branch access',
      })
    }

    const admin = admins[0]
    console.log('👤 Admin found:', {
      id: admin.ID,
      username: admin.username,
      email: admin.email,
      branch: admin.branch,
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
        branch: admin.branch,
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
          branch: admin.branch,
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
          branch: decoded.branch,
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

// Get available branches for dropdown
export async function getBranches(req, res) {
  let connection

  try {
    connection = await createConnection()

    // Get all unique branches from the Admin table
    const [branches] = await connection.execute(
      'SELECT DISTINCT branch FROM Admin WHERE is_active = TRUE ORDER BY branch ASC',
    )

    console.log('🏢 Found branches:', branches.length)

    res.json({
      success: true,
      message: 'Branches retrieved successfully',
      data: branches.map((b) => b.branch),
    })
  } catch (error) {
    console.error('❌ Get branches error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Create additional admin user for testing
export async function createAdminUser(req, res) {
  let connection

  try {
    const { username, password, email, firstName, lastName, branch, role = 'admin' } = req.body

    // Validation
    if (!username || !password || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and branch are required',
      })
    }

    connection = await createConnection()

    // Check if username already exists
    const [existingUsers] = await connection.execute('SELECT * FROM Admin WHERE username = ?', [
      username,
    ])

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
      })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Insert new admin user
    const [result] = await connection.execute(
      'INSERT INTO Admin (username, password, email, first_name, last_name, branch, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, email, firstName, lastName, branch, role],
    )

    console.log('✅ New admin user created:', username, 'for branch:', branch)

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: result.insertId,
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        branch,
        role,
      },
    })
  } catch (error) {
    console.error('❌ Create admin user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}
