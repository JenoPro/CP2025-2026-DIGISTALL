// test-password.js - Run this to fix your password issue
import bcrypt from 'bcrypt'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // your DB password
  database: 'naga_stall',
}

async function fixPasswords() {
  try {
    console.log('🔧 Fixing password hashes...')
    
    // Generate proper password hash for "password123"
    const password = 'password123'
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    console.log('Generated hash:', hashedPassword)
    console.log('Original password:', password)
    
    // Connect to database
    const connection = await mysql.createConnection(dbConfig)
    
    // Update both branch managers with the correct hash
    const updateQuery = `
      UPDATE branch_manager 
      SET branch_password_hash = ? 
      WHERE branch_manager_id IN (1, 2)
    `
    
    const [result] = await connection.execute(updateQuery, [hashedPassword])
    console.log('✅ Updated', result.affectedRows, 'branch managers')
    
    // Verify the update
    const [managers] = await connection.execute(`
      SELECT branch_manager_id, branch_username, area, location, 
             LENGTH(branch_password_hash) as hash_length,
             LEFT(branch_password_hash, 10) as hash_preview
      FROM branch_manager 
      WHERE branch_manager_id IN (1, 2)
    `)
    
    console.log('📋 Updated branch managers:')
    managers.forEach(manager => {
      console.log(`- ID: ${manager.branch_manager_id}`)
      console.log(`  Username: ${manager.branch_username}`)
      console.log(`  Area: ${manager.area}`)
      console.log(`  Location: ${manager.location}`)
      console.log(`  Hash length: ${manager.hash_length} chars`)
      console.log(`  Hash preview: ${manager.hash_preview}...`)
      console.log(`  Password: ${password}`)
      console.log('')
    })
    
    // Test the hash
    console.log('🧪 Testing password verification...')
    const isValid = await bcrypt.compare(password, hashedPassword)
    console.log('Password verification test:', isValid ? '✅ PASS' : '❌ FAIL')
    
    await connection.end()
    
    console.log('\n🎉 PASSWORD FIX COMPLETE!')
    console.log('Now you can login with:')
    console.log('- Area: "Naga City"')
    console.log('- Location: "Peoples Mall"') 
    console.log('- Username: "NCPM_Manager"')
    console.log('- Password: "password123"')
    console.log('\nOr:')
    console.log('- Area: "Legazpi"')
    console.log('- Location: "SM"')
    console.log('- Username: "SM_Manager"') 
    console.log('- Password: "password123"')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixPasswords()