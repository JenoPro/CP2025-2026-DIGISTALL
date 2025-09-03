import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import process from 'process'

const { hash } = bcrypt
const { createConnection: _createConnection } = mysql

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'naga_stall',
}

console.log('🔧 Database Config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  passwordSet: !!dbConfig.password,
})

// Create database connection
export async function createConnection() {
  try {
    const connection = await _createConnection(dbConfig)
    console.log('✅ Connected to MySQL database')
    return connection
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    throw error
  }
}

// Initialize database and tables
export async function initializeDatabase() {
  let connection
  let dbConnection

  try {
    // First connect without database to create it
    connection = await _createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    })

    console.log('🔧 Creating database if not exists...')
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)
    await connection.end()

    // Now connect to the specific database
    dbConnection = await _createConnection(dbConfig)

    // Create Admin table
    const createAdminTable = `
      CREATE TABLE IF NOT EXISTS Admin (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `

    console.log('🔧 Creating Admin table if not exists...')
    await dbConnection.execute(createAdminTable)

    // Create Stall table
    const createStallTable = `
      CREATE TABLE IF NOT EXISTS Stall (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        stall_number VARCHAR(20) UNIQUE NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        floor VARCHAR(50) NOT NULL,
        section VARCHAR(100) NOT NULL,
        dimensions VARCHAR(50),
        location VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        image_data LONGTEXT,
        is_available BOOLEAN DEFAULT TRUE,
        price_type ENUM('Raffle', 'Auction', 'Fixed Price') DEFAULT 'Fixed Price',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        updated_by INT,
        status ENUM('Active', 'Inactive', 'Maintenance') DEFAULT 'Active',
        
        INDEX idx_stall_number (stall_number),
        INDEX idx_floor_section (floor, section),
        INDEX idx_location (location),
        INDEX idx_availability (is_available),
        INDEX idx_status (status)
      )
    `

    console.log('🔧 Creating Stall table if not exists...')
    await dbConnection.execute(createStallTable)

    // Add foreign key constraints after both tables are created
    try {
      await dbConnection.execute(`
        ALTER TABLE Stall 
        ADD CONSTRAINT fk_stall_created_by 
        FOREIGN KEY (created_by) REFERENCES Admin(ID) ON DELETE SET NULL
      `)
    } catch (error) {
      // Constraint might already exist, ignore error
      if (!error.message.includes('Duplicate key name')) {
        console.log('Foreign key constraint already exists or error:', error.message)
      }
    }

    try {
      await dbConnection.execute(`
        ALTER TABLE Stall 
        ADD CONSTRAINT fk_stall_updated_by 
        FOREIGN KEY (updated_by) REFERENCES Admin(ID) ON DELETE SET NULL
      `)
    } catch (error) {
      // Constraint might already exist, ignore error
      if (!error.message.includes('Duplicate key name')) {
        console.log('Foreign key constraint already exists or error:', error.message)
      }
    }

    // Check if admin user exists
    const [existingAdmin] = await dbConnection.execute('SELECT * FROM Admin WHERE username = ?', [
      'admin',
    ])

    if (existingAdmin.length === 0) {
      console.log('🔧 Creating default admin user...')
      const hashedPassword = await hash('admin123', 12)

      await dbConnection.execute(
        'INSERT INTO Admin (username, password, email, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', hashedPassword, 'admin@nagastall.com', 'System', 'Administrator', 'admin'],
      )

      console.log('✅ Default admin user created successfully!')
    } else {
      console.log('✅ Admin user already exists')

      // FORCE UPDATE the password to ensure it works
      console.log('🔧 Updating admin password to ensure compatibility...')
      const hashedPassword = await hash('admin123', 12)
      await dbConnection.execute('UPDATE Admin SET password = ? WHERE username = ?', [
        hashedPassword,
        'admin',
      ])
      console.log('✅ Admin password updated!')
    }

    // Check if sample stalls exist
    const [existingStalls] = await dbConnection.execute('SELECT COUNT(*) as count FROM Stall')

    if (existingStalls[0].count === 0) {
      console.log('🔧 Creating sample stalls...')

      const sampleStalls = [
        [
          'STALL# 01',
          15000.0,
          '1st Floor',
          'Grocery Section',
          '10x10 meters',
          "Naga City People's Mall",
          'Prime location stall perfect for grocery business',
          'Fixed Price',
          1,
        ],
        [
          'STALL# 02',
          12000.0,
          '1st Floor',
          'Fresh Produce',
          '8x10 meters',
          "Naga City People's Mall",
          'Fresh produce section with good foot traffic',
          'Auction',
          1,
        ],
        [
          'STALL# 03',
          18000.0,
          '2nd Floor',
          'Clothing Section',
          '12x8 meters',
          'Satellite Market',
          'Spacious clothing retail space',
          'Raffle',
          1,
        ],
      ]

      for (const stall of sampleStalls) {
        await dbConnection.execute(
          `
          INSERT INTO Stall (
            stall_number, price, floor, section, dimensions, 
            location, description, price_type, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          stall,
        )
      }

      console.log('✅ Sample stalls created successfully!')
    } else {
      console.log('✅ Stalls already exist in database')
    }

    console.log('📋 Login Credentials:')
    console.log('   Username: admin')
    console.log('   Password: admin123')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  } finally {
    if (dbConnection) await dbConnection.end()
  }
}

// Test database connection
export async function testConnection() {
  let connection
  try {
    connection = await createConnection()
    const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM Admin')
    const [stallRows] = await connection.execute('SELECT COUNT(*) as count FROM Stall')

    return {
      success: true,
      message: 'Database connection successful',
      adminCount: adminRows[0].count,
      stallCount: stallRows[0].count,
    }
  } catch (error) {
    console.error('Database test error:', error)
    throw error
  } finally {
    if (connection) await connection.end()
  }
}
