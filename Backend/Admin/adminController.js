import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import process from 'process'
import { createConnection, testConnection } from '../config/database.js'

const { compare, hash } = bcrypt
const { sign, verify } = jwt

// Create Admin User controller
export async function createAdminUser(req, res) {
  let connection

  try {
    const { username, password, email } = req.body

    console.log('👤 Creating admin user:', username)

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    connection = await createConnection()

    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT admin_id FROM admin WHERE admin_username = ?',
      [username],
    )

    if (existingAdmin.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Admin user already exists',
      })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await hash(password, saltRounds)

    // Insert new admin
    const [result] = await connection.execute(
      'INSERT INTO admin (admin_username, admin_password_hash, email, status) VALUES (?, ?, ?, ?)',
      [username, passwordHash, email || null, 'Active'],
    )

    console.log('✅ Admin user created successfully:', username)

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: result.insertId,
        username: username,
        email: email || null,
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

// Branch Manager Login controller with extensive debugging
export async function branchManagerLogin(req, res) {
  let connection

  try {
    const { username, password, area, location } = req.body

    console.log('🔐 Branch Manager login attempt:')
    console.log('- Username:', username)
    console.log('- Area:', area)
    console.log('- Location:', location)
    console.log('- Password length:', password ? password.length : 'undefined')

    // Validation
    if (!username || !password || !area || !location) {
      console.log('❌ Missing required fields')
      return res.status(400).json({
        success: false,
        message: 'Username, password, area, and location are required',
      })
    }

    connection = await createConnection()

    // Query branch_manager table using naga_stall database structure
    console.log('🔍 Searching for branch manager with:')
    console.log('- Username:', username)
    console.log('- Area:', area)
    console.log('- Location:', location)

    const [branchManagers] = await connection.execute(
      `SELECT 
        branch_manager_id, 
        branch_username, 
        branch_password_hash, 
        area, 
        location, 
        first_name, 
        last_name, 
        email, 
        status 
      FROM branch_manager 
      WHERE branch_username = ? 
        AND area = ? 
        AND location = ? 
        AND status = ?`,
      [username, area, location, 'Active'],
    )

    console.log('🔍 Query results: Found', branchManagers.length, 'branch managers')

    if (branchManagers.length === 0) {
      console.log('❌ No branch manager found with these credentials')
      console.log('🔍 Let me check what branch managers exist in the database...')

      // Debug: Show all branch managers
      const [allManagers] = await connection.execute(
        'SELECT branch_username, area, location, status FROM branch_manager',
      )
      console.log('📋 All branch managers in database:')
      allManagers.forEach((manager, index) => {
        console.log(
          `   ${index + 1}. ${manager.branch_username} - ${manager.area} - ${manager.location} (${manager.status})`,
        )
      })

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or branch not found',
      })
    }

    const branchManager = branchManagers[0]

    console.log('👤 Branch Manager found:')
    console.log('- ID:', branchManager.branch_manager_id)
    console.log('- Username:', branchManager.branch_username)
    console.log('- Name:', branchManager.first_name, branchManager.last_name)
    console.log('- Area:', branchManager.area)
    console.log('- Location:', branchManager.location)
    console.log('- Status:', branchManager.status)
    console.log('- Password hash:', branchManager.branch_password_hash)

    // Enhanced password verification with debugging
    console.log('🔐 Starting password verification...')
    console.log('- Input password:', password)
    console.log('- Stored hash:', branchManager.branch_password_hash)
    console.log('- Hash format valid:', branchManager.branch_password_hash.startsWith('$2b$'))

    const isPasswordValid = await compare(password, branchManager.branch_password_hash)
    console.log('🔐 Password comparison result:', isPasswordValid)

    // If password fails, test common passwords for debugging
    if (!isPasswordValid) {
      console.log('🧪 Password failed. Testing common passwords for debugging:')
      const testPasswords = ['password123', 'admin123', 'manager123', '123456', 'password']

      for (const testPwd of testPasswords) {
        const testResult = await compare(testPwd, branchManager.branch_password_hash)
        console.log(`   Testing "${testPwd}": ${testResult ? '✅ MATCH!' : '❌ No match'}`)
        if (testResult) {
          console.log(`   🎉 The correct password is: "${testPwd}"`)
          break
        }
      }

      console.log('❌ Invalid password for user:', username)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Generate JWT token
    const jwtSecret =
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

    const token = sign(
      {
        userId: branchManager.branch_manager_id,
        username: branchManager.branch_username,
        userType: 'branch_manager',
        area: branchManager.area,
        location: branchManager.location,
        branchManagerId: branchManager.branch_manager_id,
      },
      jwtSecret,
      { expiresIn: '24h' },
    )

    console.log('✅ Branch Manager login successful for user:', branchManager.branch_username)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: branchManager.branch_manager_id,
          username: branchManager.branch_username,
          firstName: branchManager.first_name,
          lastName: branchManager.last_name,
          email: branchManager.email,
          area: branchManager.area,
          location: branchManager.location,
          userType: 'branch_manager',
          branchManagerId: branchManager.branch_manager_id,
        },
      },
    })
  } catch (error) {
    console.error('❌ Branch Manager login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Admin Login controller
export async function adminLogin(req, res) {
  let connection

  try {
    const { username, password } = req.body

    console.log('🔐 Admin login attempt for username:', username)

    // Validation
    if (!username || !password) {
      console.log('❌ Missing username or password')
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    connection = await createConnection()

    // Query admin table
    const [admins] = await connection.execute(
      'SELECT admin_id, admin_username, admin_password_hash, email, status FROM admin WHERE admin_username = ? AND status = ?',
      [username, 'Active'],
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

    // Verify password
    const isPasswordValid = await compare(password, admin.admin_password_hash)

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

    const token = sign(
      {
        userId: admin.admin_id,
        username: admin.admin_username,
        userType: 'admin',
      },
      jwtSecret,
      { expiresIn: '24h' },
    )

    console.log('✅ Admin login successful for user:', admin.admin_username)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin.admin_id,
          username: admin.admin_username,
          email: admin.email,
          userType: 'admin',
        },
      },
    })
  } catch (error) {
    console.error('❌ Admin login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// NEW: Get Branch Manager Info controller
export async function getBranchManagerInfo(req, res) {
  let connection

  try {
    // Get the token from authorization header
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
      })
    }

    // Verify token
    const jwtSecret =
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    const decoded = verify(token, jwtSecret)

    if (decoded.userType !== 'branch_manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Branch manager role required.',
      })
    }

    connection = await createConnection()

    // Get branch manager information
    const [branchManagers] = await connection.execute(
      `SELECT 
        branch_manager_id,
        branch_username,
        area,
        location,
        first_name,
        last_name,
        email,
        status,
        created_at
      FROM branch_manager 
      WHERE branch_manager_id = ? AND status = ?`,
      [decoded.branchManagerId, 'Active'],
    )

    if (branchManagers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch manager not found',
      })
    }

    const branchManager = branchManagers[0]

    console.log('Branch manager info retrieved for:', branchManager.branch_username)

    res.json({
      success: true,
      message: 'Branch manager information retrieved successfully',
      branchManager: {
        id: branchManager.branch_manager_id,
        username: branchManager.branch_username,
        firstName: branchManager.first_name,
        lastName: branchManager.last_name,
        email: branchManager.email,
        area: branchManager.area,
        location: branchManager.location,
        status: branchManager.status,
        createdAt: branchManager.created_at,
        fullName: `${branchManager.first_name} ${branchManager.last_name}`,
        designation: `${branchManager.area} - ${branchManager.location} Manager`,
      },
    })
  } catch (error) {
    console.error('Get branch manager info error:', error)

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get available areas from branch_manager table
export async function getAreas(req, res) {
  let connection

  try {
    connection = await createConnection()

    // Get distinct areas from branch_manager table
    const [areas] = await connection.execute(
      'SELECT DISTINCT area FROM branch_manager WHERE status = ? ORDER BY area ASC',
      ['Active'],
    )

    console.log('🏙️ Found areas:', areas.length)

    res.json({
      success: true,
      message: 'Areas retrieved successfully',
      data: areas.map((row) => row.area),
    })
  } catch (error) {
    console.error('❌ Get areas error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get branches by area from branch_manager table
export async function getBranchesByArea(req, res) {
  let connection

  try {
    const { area } = req.params

    if (!area) {
      return res.status(400).json({
        success: false,
        message: 'Area parameter is required',
      })
    }

    connection = await createConnection()

    // Get locations (branches) for specific area
    const [branches] = await connection.execute(
      'SELECT DISTINCT location FROM branch_manager WHERE area = ? AND status = ? ORDER BY location ASC',
      [area, 'Active'],
    )

    console.log('🏢 Found branches for area', area, ':', branches.length)

    res.json({
      success: true,
      message: 'Branches retrieved successfully',
      data: branches.map((row) => row.location),
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

// Create Password Hash endpoint (for testing)
export async function createPasswordHash(req, res) {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      })
    }

    const saltRounds = 12
    const hashedPassword = await hash(password, saltRounds)

    res.json({
      success: true,
      data: {
        originalPassword: password,
        hashedPassword: hashedPassword,
        instructions: 'Use this hash to update your database password field',
      },
    })
  } catch (error) {
    console.error('❌ Create password hash error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
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
          userType: decoded.userType,
          area: decoded.area,
          location: decoded.location,
          branchManagerId: decoded.branchManagerId,
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

// Get current user info controller
export async function getCurrentUser(req, res) {
  let connection
  try {
    const { userId, userType } = req.user

    connection = await createConnection()

    let userInfo
    if (userType === 'admin') {
      ;[userInfo] = await connection.execute(
        'SELECT admin_id as id, admin_username as username, email FROM admin WHERE admin_id = ?',
        [userId],
      )
    } else if (userType === 'branch_manager') {
      ;[userInfo] = await connection.execute(
        'SELECT branch_manager_id as id, branch_username as username, first_name, last_name, email, area, location FROM branch_manager WHERE branch_manager_id = ?',
        [userId],
      )
    }

    if (!userInfo || userInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.json({
      success: true,
      data: {
        ...userInfo[0],
        userType,
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)
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
