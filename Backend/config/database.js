import mysql from 'mysql2/promise'
import process from 'process'

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

    // Create Area table first
    const createAreaTable = `
      CREATE TABLE IF NOT EXISTS Area (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        city VARCHAR(100) NOT NULL,
        branch VARCHAR(100) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_city (city),
        INDEX idx_branch (branch)
      )
    `

    console.log('🔧 Creating Area table if not exists...')
    await dbConnection.execute(createAreaTable)

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
        area_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        
        INDEX idx_area_id (area_id)
      )
    `

    console.log('🔧 Creating Admin table if not exists...')
    await dbConnection.execute(createAdminTable)

    // Add area_id column if it doesn't exist (for existing databases)
    try {
      await dbConnection.execute(`
        ALTER TABLE Admin 
        ADD COLUMN area_id INT
      `)
      console.log('✅ Area_id column added to Admin table')
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('✅ Area_id column already exists in Admin table')
      } else {
        console.log('Area_id column error:', error.message)
      }
    }

    // Remove redundant branch column if it exists
    try {
      await dbConnection.execute(`
        ALTER TABLE Admin 
        DROP COLUMN branch
      `)
      console.log('✅ Redundant branch column removed from Admin table')
    } catch (error) {
      if (error.message.includes("Can't DROP")) {
        console.log('✅ Branch column already removed from Admin table')
      } else {
        console.log('Drop branch column error:', error.message)
      }
    }

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

    // Add foreign key constraints after both tables are created (silently handle errors)
    try {
      await dbConnection.execute(`
        ALTER TABLE Admin 
        ADD CONSTRAINT fk_admin_area_id 
        FOREIGN KEY (area_id) REFERENCES Area(ID) ON DELETE SET NULL
      `)
    } catch {
      // Constraint might already exist, ignore silently
    }

    try {
      await dbConnection.execute(`
        ALTER TABLE Stall 
        ADD CONSTRAINT fk_stall_created_by 
        FOREIGN KEY (created_by) REFERENCES Admin(ID) ON DELETE SET NULL
      `)
    } catch {
      // Constraint might already exist, ignore silently
    }

    try {
      await dbConnection.execute(`
        ALTER TABLE Stall 
        ADD CONSTRAINT fk_stall_updated_by 
        FOREIGN KEY (updated_by) REFERENCES Admin(ID) ON DELETE SET NULL
      `)
    } catch {
      // Constraint might already exist, ignore silently
    }

    // Show existing login credentials
    console.log('📋 Available Login Credentials:')
    const [allAdmins] = await dbConnection.execute(`
      SELECT a.username, ar.city, ar.branch 
      FROM Admin a 
      LEFT JOIN Area ar ON a.area_id = ar.ID 
      WHERE a.is_active = TRUE
      ORDER BY ar.city, ar.branch, a.username
    `)

    if (allAdmins.length > 0) {
      allAdmins.forEach((admin) => {
        console.log(
          `   ${admin.city || 'No City'} - ${admin.branch || 'No Branch'} - Username: ${admin.username}`,
        )
      })
    } else {
      console.log('   No admin users found. You may need to create them manually.')
    }
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
