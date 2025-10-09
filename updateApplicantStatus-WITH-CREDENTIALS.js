import { createConnection } from '../../../config/database.js'
import bcrypt from 'bcrypt'

// Update applicant status with credential storage for approvals
export const updateApplicantStatus = async (req, res) => {
  let connection
  try {
    const { id } = req.params // This is applicant_id
    const { status, decline_reason, declined_at, username, password } = req.body

    console.log('📊 Updating applicant status:', {
      applicant_id: id,
      requested_status: status,
      decline_reason,
      declined_at,
      username: username ? 'provided' : 'not provided',
      password: password ? 'provided' : 'not provided',
    })

    // Validate status - matches database enum values EXACTLY
    const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Cancelled']
    if (!validStatuses.includes(status)) {
      console.log('❌ Invalid status provided:', status)
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      })
    }

    // For approval, username and password are required
    if (status === 'Approved' && (!username || !password)) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required for approval',
      })
    }

    connection = await createConnection()

    // Get the applicant information and their application
    console.log('🔍 Searching for applicant ID:', id)

    const [applicantData] = await connection.execute(
      `SELECT 
        a.applicant_id,
        a.applicant_full_name,
        oi.email_address,
        app.application_id,
        app.application_status,
        app.stall_id
      FROM applicant a
      LEFT JOIN other_information oi ON a.applicant_id = oi.applicant_id
      LEFT JOIN application app ON a.applicant_id = app.applicant_id
      WHERE a.applicant_id = ?
      ORDER BY app.application_date DESC
      LIMIT 1`,
      [id],
    )

    if (applicantData.length === 0) {
      console.log('❌ No applicant found with ID:', id)
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      })
    }

    const applicant = applicantData[0]
    console.log('✅ Applicant found:', {
      name: applicant.applicant_full_name,
      current_status: applicant.application_status,
      application_id: applicant.application_id,
    })

    if (!applicant.application_id) {
      console.log('❌ No application found for applicant ID:', id)
      return res.status(404).json({
        success: false,
        message: 'No application found for this applicant',
      })
    }

    // Start transaction for atomic operations
    await connection.beginTransaction()

    try {
      // Update the application status
      const updateQuery = `
        UPDATE application 
        SET 
          application_status = ?, 
          updated_at = NOW() 
        WHERE application_id = ?
      `

      console.log('🔍 Executing application update query:', updateQuery.replace(/\s+/g, ' ').trim())
      console.log('🔍 With parameters:', [status, applicant.application_id])

      const [result] = await connection.execute(updateQuery, [status, applicant.application_id])

      console.log('📊 Application update result:', {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      })

      if (result.affectedRows === 0) {
        throw new Error('No rows were updated in application table')
      }

      // If status is Approved, store credentials in credential table
      if (status === 'Approved' && username && password) {
        console.log('💾 Storing credentials for approved applicant...')

        // Check if credentials already exist for this applicant
        const [existingCredentials] = await connection.execute(
          'SELECT registrationid FROM credential WHERE applicant_id = ?',
          [id],
        )

        if (existingCredentials.length > 0) {
          console.log('⚠️ Credentials already exist, updating...')

          // Hash the password
          const saltRounds = 10
          const password_hash = await bcrypt.hash(password, saltRounds)

          // Update existing credentials
          await connection.execute(
            `UPDATE credential 
             SET user_name = ?, password_hash = ?, created_date = NOW(), is_active = 1 
             WHERE applicant_id = ?`,
            [username, password_hash, id],
          )

          console.log('✅ Credentials updated successfully')
        } else {
          console.log('➕ Creating new credentials...')

          // Hash the password
          const saltRounds = 10
          const password_hash = await bcrypt.hash(password, saltRounds)

          // Insert new credentials
          await connection.execute(
            `INSERT INTO credential (applicant_id, user_name, password_hash, created_date, is_active) 
             VALUES (?, ?, ?, NOW(), 1)`,
            [id, username, password_hash],
          )

          console.log('✅ New credentials created successfully')
        }

        // Verify credentials were stored
        const [verifyCredentials] = await connection.execute(
          'SELECT registrationid, user_name, created_date FROM credential WHERE applicant_id = ?',
          [id],
        )

        if (verifyCredentials.length > 0) {
          console.log('✅ Credentials verification:', {
            registrationid: verifyCredentials[0].registrationid,
            user_name: verifyCredentials[0].user_name,
            created_date: verifyCredentials[0].created_date,
          })
        }
      }

      // Commit the transaction
      await connection.commit()

      console.log(
        `✅ Application for ${applicant.applicant_full_name} status updated to: ${status}`,
      )

      const responseData = {
        success: true,
        message: 'Applicant status updated successfully',
        data: {
          applicant_id: id,
          application_id: applicant.application_id,
          full_name: applicant.applicant_full_name,
          email: applicant.email_address,
          old_status: applicant.application_status,
          new_status: status,
          updated_at: new Date().toISOString(),
        },
      }

      // Add credentials info to response for approved applicants
      if (status === 'Approved' && username) {
        responseData.data.credentials = {
          username: username,
          password: password, // Send back for email/frontend display
          stored_in_database: true,
        }
      }

      res.json(responseData)
    } catch (transactionError) {
      // Rollback transaction on error
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
      details: error.code
        ? {
            code: error.code,
            sqlState: error.sqlState,
          }
        : undefined,
    })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
