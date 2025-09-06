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
        branch VARCHAR(100) DEFAULT 'Naga Branch',
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

    // Add branch column if it doesn't exist (for existing databases)
    try {
      await dbConnection.execute(`
        ALTER TABLE Admin 
        ADD COLUMN branch VARCHAR(100) DEFAULT 'Naga Branch'
      `)
      console.log('✅ Branch column added to Admin table')
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('✅ Branch column already exists in Admin table')
      } else {
        console.log('Branch column error:', error.message)
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

    // Add foreign key constraints after both tables are created
    try {
      await dbConnection.execute(`
        ALTER TABLE Admin 
        ADD CONSTRAINT fk_admin_area_id 
        FOREIGN KEY (area_id) REFERENCES Area(ID) ON DELETE SET NULL
      `)
    } catch (error) {
      // Constraint might already exist, ignore error
      if (!error.message.includes('Duplicate key name')) {
        console.log('Admin-Area foreign key constraint already exists or error:', error.message)
      }
    }

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

    // Check and create sample areas
    console.log('🔧 Creating sample areas...')
    const sampleAreas = [
      {
        city: 'Naga City',
        branch: "Naga City People's Mall",
        description: 'Main mall in Naga City',
      },
      {
        city: 'Naga City',
        branch: 'Satellite Market 1',
        description: 'Satellite market location 1',
      },
      { city: 'Pili', branch: 'Pili Public Market', description: 'Main market in Pili' },
      { city: 'Sipocot', branch: 'Sipocot Public Market', description: 'Main market in Sipocot' },
      { city: 'Albay', branch: 'Albay Central Market', description: 'Central market in Albay' },
      {
        city: 'Legaspi',
        branch: 'Legaspi City Market',
        description: 'Main market in Legaspi City',
      },
      { city: 'Milaor', branch: 'Milaor Public Market', description: 'Main market in Milaor' },
    ]

    for (const area of sampleAreas) {
      const [existingArea] = await dbConnection.execute(
        'SELECT * FROM Area WHERE city = ? AND branch = ?',
        [area.city, area.branch],
      )

      if (existingArea.length === 0) {
        console.log(`🏢 Creating area: ${area.city} - ${area.branch}`)
        await dbConnection.execute(
          'INSERT INTO Area (city, branch, description) VALUES (?, ?, ?)',
          [area.city, area.branch, area.description],
        )
        console.log(`✅ ${area.city} - ${area.branch} created successfully!`)
      } else {
        console.log(`✅ ${area.city} - ${area.branch} already exists`)
      }
    }

    // Get area IDs for admin user creation
    const [areas] = await dbConnection.execute(
      'SELECT ID, city, branch FROM Area ORDER BY city, branch',
    )
    const areaMap = new Map()
    areas.forEach((area) => {
      areaMap.set(`${area.city}-${area.branch}`, area.ID)
    })

    // Check and create admin users for each branch
    const adminUsers = [
      {
        username: 'admin_naga',
        password: await hash('Admin123', 12),
        email: 'admin@nagastall.com',
        first_name: 'System',
        last_name: 'Administrator',
        role: 'admin',
        branch: "Naga City People's Mall",
        area_id: areaMap.get("Naga City-Naga City People's Mall"),
      },
      {
        username: 'admin_satellite1',
        password: await hash('Admin123', 12),
        email: 'admin.satellite1@nagastall.com',
        first_name: 'Satellite1',
        last_name: 'Administrator',
        role: 'admin',
        branch: 'Satellite Market 1',
        area_id: areaMap.get('Naga City-Satellite Market 1'),
      },
      {
        username: 'admin_pili',
        password: await hash('Admin123', 12),
        email: 'admin.pili@nagastall.com',
        first_name: 'Pili',
        last_name: 'Administrator',
        role: 'admin',
        branch: 'Pili Public Market',
        area_id: areaMap.get('Pili-Pili Public Market'),
      },
      {
        username: 'admin_sipocot',
        password: await hash('Admin123', 12),
        email: 'admin.sipocot@nagastall.com',
        first_name: 'Sipocot',
        last_name: 'Administrator',
        role: 'admin',
        branch: 'Sipocot Public Market',
        area_id: areaMap.get('Sipocot-Sipocot Public Market'),
      },
      {
        username: 'admin_albay',
        password: await hash('Admin123', 12),
        email: 'admin.albay@nagastall.com',
        first_name: 'Albay',
        last_name: 'Administrator',
        role: 'admin',
        branch: 'Albay Central Market',
        area_id: areaMap.get('Albay-Albay Central Market'),
      },
      {
        username: 'admin_legaspi',
        password: await hash('Admin123', 12),
        email: 'admin.legaspi@nagastall.com',
        first_name: 'Legaspi',
        last_name: 'Administrator',
        role: 'admin',
        branch: 'Legaspi City Market',
        area_id: areaMap.get('Legaspi-Legaspi City Market'),
      },
      {
        username: 'admin_milaor',
        password: await hash('Admin123', 12),
        email: 'admin.milaor@nagastall.com',
        first_name: 'Milaor',
        last_name: 'Administrator',
        role: 'admin',
        branch: 'Milaor Public Market',
        area_id: areaMap.get('Milaor-Milaor Public Market'),
      },
    ]

    console.log('🔧 Checking and creating admin users...')

    for (const admin of adminUsers) {
      const [existingAdmin] = await dbConnection.execute('SELECT * FROM Admin WHERE username = ?', [
        admin.username,
      ])

      if (existingAdmin.length === 0) {
        console.log(`👤 Creating admin: ${admin.username} for ${admin.branch}`)
        await dbConnection.execute(
          'INSERT INTO Admin (username, password, email, first_name, last_name, role, branch, area_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            admin.username,
            admin.password,
            admin.email,
            admin.first_name,
            admin.last_name,
            admin.role,
            admin.branch,
            admin.area_id,
          ],
        )
        console.log(`✅ ${admin.username} created successfully!`)
      } else {
        console.log(`✅ ${admin.username} already exists`)
        // No password update for existing admins
      }
    }

    console.log('✅ All admin users processed successfully!')

    // Clean up any unwanted admin users (like removed CamSur)
    console.log('🔧 Cleaning up unwanted admin users...')
    await dbConnection.execute('DELETE FROM Admin WHERE username = ?', ['admin_camsur'])
    console.log('✅ Cleanup completed!')

    // Remove unwanted admins
    const unwantedAdmins = [
      'admin_satellite2',
      'pamplona_admin',
      // Add more usernames if needed
    ]
    for (const username of unwantedAdmins) {
      await dbConnection.execute('DELETE FROM Admin WHERE username = ?', [username])
    }

    // Remove this section after running once if you don't want auto-updates
    const newPasswordHash = await hash('Admin123', 12)
    console.log('🔧 One-time password update to Admin123...')
    await dbConnection.execute('UPDATE Admin SET password = ?', [newPasswordHash])
    console.log('✅ All admin passwords updated to Admin123')

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
    // Dynamically show all admin users with their areas
    const [allAdmins] = await dbConnection.execute(`
      SELECT a.username, a.branch, ar.city 
      FROM Admin a 
      LEFT JOIN Area ar ON a.area_id = ar.ID 
      ORDER BY ar.city, a.branch, a.username
    `)
    allAdmins.forEach((admin) => {
      console.log(
        `   ${admin.city || 'Unknown'} - ${admin.branch} - Username: ${admin.username}, Password: Admin123`,
      )
    })
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
