import { createConnection } from '../../../config/database.js'

// Generate username with format: 25-XXXXX (year-5digits) - MATCHES FRONTEND
const generateUsername = () => {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // Last 2 digits of year

  // Generate 5 random digits
  const randomDigits = Math.floor(10000 + Math.random() * 90000).toString() // Ensures 5 digits

  const username = `${year}-${randomDigits}`
  console.log('🔑 Generated username:', username)
  return username
}

// Generate password with format: 3 random letters + 3 random numbers - MATCHES FRONTEND
const generatePassword = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'

  let password = ''

  // Add 3 random letters
  for (let i = 0; i < 3; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length))
  }

  // Add 3 random numbers
  for (let i = 0; i < 3; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  console.log('🔑 Generated password:', password)
  return password
}

// Update applicant status - FIXED CREDENTIALS VERSION
export const updateApplicantStatus = async (req, res) => {
  let connection
  try {
    const { id } = req.params // This is applicant_id
    const { status, decline_reason, declined_at, username, password } = req.body

    console.log('📊 Updating applicant status:', {
      id,
      status,
      decline_reason,
      declined_at,
      username,
      password,
    })

    // Validate status - matches database enum values
    const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      })
    }

    connection = await createConnection()

    // First, get the applicant information and their application
    const [applicantData] = await connection.execute(
      `SELECT 
        a.applicant_id,
        a.applicant_full_name,
        oi.email_address,
        app.application_id,
        app.application_status
      FROM applicant a
      LEFT JOIN other_information oi ON a.applicant_id = oi.applicant_id
      LEFT JOIN application app ON a.applicant_id = app.applicant_id
      WHERE a.applicant_id = ?
      ORDER BY app.application_date DESC
      LIMIT 1`,
      [id],
    )

    if (applicantData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      })
    }

    const applicant = applicantData[0]

    if (!applicant.application_id) {
      return res.status(404).json({
        success: false,
        message: 'No application found for this applicant',
      })
    }

    // Start database transaction
    await connection.beginTransaction()

    try {
      // Update the application status (this is where status is actually stored)
      const updateQuery = `
        UPDATE application 
        SET 
          application_status = ?, 
          updated_at = NOW() 
        WHERE application_id = ?
      `

      console.log('🔍 Executing query:', updateQuery.replace(/\s+/g, ' ').trim())
      console.log('🔍 With parameters:', [status, applicant.application_id])

      const [result] = await connection.execute(updateQuery, [status, applicant.application_id])

      console.log('📊 Update result:', result)

      if (result.affectedRows === 0) {
        await connection.rollback()
        return res.status(404).json({
          success: false,
          message: 'No rows were updated. Application may not exist.',
        })
      }

      let credentialsCreated = false
      let finalUsername = null
      let finalPassword = null

      // Check if this is final approval (Under Review -> Approved or Pending -> Approved)
      const shouldCreateCredentials = status === 'Approved'

      console.log(
        `🔍 Approval check: Current status: ${applicant.application_status}, New status: ${status}, Should create credentials: ${shouldCreateCredentials}`,
      )

      // If this is final approval, create credentials for mobile app
      if (shouldCreateCredentials) {
        try {
          console.log('🔑 Creating credentials for final approval...')

          // Use credentials from frontend if provided, otherwise generate new ones
          if (username && password) {
            finalUsername = username
            finalPassword = password
            console.log(
              '🔑 Using frontend-provided credentials:',
              finalUsername,
              '/',
              finalPassword,
            )
          } else {
            // Generate credentials using same logic as frontend
            finalUsername = generateUsername()
            finalPassword = generatePassword()
            console.log('🔑 Generated new credentials:', finalUsername, '/', finalPassword)
          }

          // Check if credentials already exist for this applicant
          const [existingCredential] = await connection.execute(
            'SELECT registrationid FROM credential WHERE applicant_id = ?',
            [applicant.applicant_id],
          )

          if (existingCredential.length > 0) {
            console.log('⚠️ Credentials already exist for this applicant, updating...')

            // Hash the password
            const bcrypt = await import('bcrypt')
            const passwordHash = await bcrypt.hash(finalPassword, 10)

            // Update existing credentials
            await connection.execute(
              `UPDATE credential SET 
                user_name = ?, 
                password_hash = ?, 
                updated_date = NOW(),
                is_active = 1
              WHERE applicant_id = ?`,
              [finalUsername, passwordHash, applicant.applicant_id],
            )

            credentialsCreated = true
            console.log('✅ Credentials updated successfully')
          } else {
            // Hash the password
            const bcrypt = await import('bcrypt')
            const passwordHash = await bcrypt.hash(finalPassword, 10)

            // Store new credentials in credential table for mobile app access
            await connection.execute(
              `INSERT INTO credential (
                applicant_id, user_name, password_hash, created_date, is_active
              ) VALUES (?, ?, ?, NOW(), 1)`,
              [applicant.applicant_id, finalUsername, passwordHash],
            )

            credentialsCreated = true
            console.log('✅ New credentials created successfully for mobile app access')
          }
        } catch (credError) {
          console.error('❌ Error creating credentials:', credError)
          await connection.rollback()
          return res.status(500).json({
            success: false,
            message: 'Failed to create credentials',
            error: credError.message,
          })
        }
      }

      // Commit the transaction
      await connection.commit()

      console.log(
        `✅ Application for ${applicant.applicant_full_name} status updated to: ${status}`,
      )

      const responseData = {
        applicant_id: id,
        application_id: applicant.application_id,
        full_name: applicant.applicant_full_name,
        email: applicant.email_address,
        new_status: status,
        updated_at: new Date().toISOString(),
      }

      // Add credentials info if they were created
      if (credentialsCreated) {
        responseData.credentials_created = true
        responseData.mobile_username = finalUsername
        responseData.mobile_password = finalPassword // Return the actual password for email
      }

      res.json({
        success: true,
        message: credentialsCreated
          ? 'Applicant approved successfully! Mobile app credentials created and stored in database.'
          : 'Applicant status updated successfully',
        data: responseData,
      })
    } catch (transactionError) {
      await connection.rollback()
      throw transactionError
    }
  } catch (error) {
    console.error('❌ Update applicant status error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    })
    res.status(500).json({
      success: false,
      message: 'Failed to update applicant status',
      error: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState,
    })
  } finally {
    if (connection) await connection.end()
  }
}
