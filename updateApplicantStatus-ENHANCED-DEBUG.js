import { createConnection } from '../../../config/database.js'

// Update applicant status - ENHANCED VERSION WITH DETAILED DEBUGGING
export const updateApplicantStatus = async (req, res) => {
  let connection
  try {
    const { id } = req.params // This is applicant_id
    const { status, decline_reason, declined_at } = req.body

    console.log('📊 Updating applicant status - ENHANCED DEBUG:', {
      applicant_id: id,
      requested_status: status,
      decline_reason,
      declined_at,
      body: req.body,
      params: req.params,
    })

    // Validate status - matches database enum values EXACTLY
    const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Cancelled']
    if (!validStatuses.includes(status)) {
      console.log('❌ Invalid status provided:', status)
      console.log('✅ Valid statuses are:', validStatuses)
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      })
    }

    console.log('✅ Status validation passed:', status)

    connection = await createConnection()

    // First, get the applicant information and their application with detailed logging
    console.log('🔍 Searching for applicant ID:', id)

    const [applicantData] = await connection.execute(
      `SELECT 
        a.applicant_id,
        a.applicant_full_name,
        oi.email_address,
        app.application_id,
        app.application_status,
        app.stall_id,
        app.application_date,
        app.created_at,
        app.updated_at
      FROM applicant a
      LEFT JOIN other_information oi ON a.applicant_id = oi.applicant_id
      LEFT JOIN application app ON a.applicant_id = app.applicant_id
      WHERE a.applicant_id = ?
      ORDER BY app.application_date DESC
      LIMIT 1`,
      [id],
    )

    console.log('🔍 Database query result:', applicantData)

    if (applicantData.length === 0) {
      console.log('❌ No applicant found with ID:', id)
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      })
    }

    const applicant = applicantData[0]
    console.log('✅ Applicant found:', {
      applicant_id: applicant.applicant_id,
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

    // Prepare the update with enhanced logging
    console.log('📝 Preparing to update application:')
    console.log('   - Application ID:', applicant.application_id)
    console.log('   - Current Status:', applicant.application_status)
    console.log('   - New Status:', status)

    // Update the application status (this is where status is actually stored)
    const updateQuery = `
      UPDATE application 
      SET 
        application_status = ?, 
        updated_at = NOW() 
      WHERE application_id = ?
    `

    const updateParams = [status, applicant.application_id]

    console.log('🔍 Executing SQL query:', updateQuery.replace(/\s+/g, ' ').trim())
    console.log('🔍 With parameters:', updateParams)

    // Execute the update
    const [result] = await connection.execute(updateQuery, updateParams)

    console.log('📊 SQL Update result:', {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
      insertId: result.insertId,
      info: result.info,
      serverStatus: result.serverStatus,
      warningStatus: result.warningStatus,
    })

    if (result.affectedRows === 0) {
      console.log('❌ No rows were updated - application may not exist')
      return res.status(404).json({
        success: false,
        message: 'No rows were updated. Application may not exist.',
      })
    }

    console.log('✅ Update successful, affected rows:', result.affectedRows)

    // Verify the update by querying the record again
    const [verifyData] = await connection.execute(
      `SELECT application_id, application_status, updated_at 
       FROM application 
       WHERE application_id = ?`,
      [applicant.application_id],
    )

    console.log('🔍 Verification query result:', verifyData)

    if (verifyData.length > 0) {
      console.log('✅ Status successfully updated in database:')
      console.log('   - Application ID:', verifyData[0].application_id)
      console.log('   - New Status:', verifyData[0].application_status)
      console.log('   - Updated At:', verifyData[0].updated_at)
    }

    console.log(`✅ Application for ${applicant.applicant_full_name} status updated to: ${status}`)

    res.json({
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
        verification: verifyData[0] || null,
      },
    })
  } catch (error) {
    console.error('❌ Update applicant status error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      errno: error.errno,
      sql: error.sql,
    })

    res.status(500).json({
      success: false,
      message: 'Failed to update applicant status',
      error: error.message,
      details: {
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
      },
    })
  } finally {
    if (connection) {
      console.log('🔌 Closing database connection')
      await connection.end()
    }
  }
}
