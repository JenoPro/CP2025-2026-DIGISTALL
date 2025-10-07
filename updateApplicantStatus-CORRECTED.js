import { createConnection } from '../config/database.js'

// Update applicant status - CORRECTED VERSION
export const updateApplicantStatus = async (req, res) => {
  let connection
  try {
    const { id } = req.params
    const { status, decline_reason, declined_at } = req.body

    console.log('📊 Updating applicant status:', { id, status, decline_reason, declined_at })

    // Validate status - includes both database enum values and frontend status values
    const validStatuses = [
      'Pending',
      'Approved',
      'Declined',
      'Rejected',
      'Under Review',
      'Cancelled',
    ]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      })
    }

    // Map frontend status to database enum if needed
    let dbStatus = status
    if (status === 'Rejected') {
      dbStatus = 'Declined' // Map frontend "Rejected" to database "Declined"
    }

    connection = await createConnection()

    // Check if applicant exists and get their information
    const [existingApplicant] = await connection.execute(
      `SELECT 
        a.applicant_id,
        a.applicant_full_name,
        oi.email_address
      FROM applicant a
      LEFT JOIN other_information oi ON a.applicant_id = oi.applicant_id
      WHERE a.applicant_id = ?`,
      [id],
    )

    if (existingApplicant.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      })
    }

    // FIXED: Prepare update query with correct parameter order and WHERE clause
    let updateQuery
    let updateParams

    // Add decline-specific fields if status is Declined/Rejected
    if (dbStatus === 'Declined' && decline_reason) {
      updateQuery =
        'UPDATE applicant SET application_status = ?, decline_reason = ?, declined_at = ?, updated_at = NOW() WHERE applicant_id = ?'
      updateParams = [dbStatus, decline_reason, declined_at || new Date().toISOString(), id]
    } else {
      // FIXED: Ensure WHERE clause is always present
      updateQuery =
        'UPDATE applicant SET application_status = ?, updated_at = NOW() WHERE applicant_id = ?'
      updateParams = [dbStatus, id]
    }

    console.log('🔍 Executing query:', updateQuery)
    console.log('🔍 With parameters:', updateParams)

    // Update applicant status
    const [result] = await connection.execute(updateQuery, updateParams)

    console.log('📊 Update result:', result)

    // Check if any rows were actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No rows were updated. Applicant may not exist.',
      })
    }

    console.log(
      `✅ Applicant ${existingApplicant[0].applicant_full_name} status updated to: ${status} (DB: ${dbStatus})`,
    )

    res.json({
      success: true,
      message: 'Applicant status updated successfully',
      data: {
        applicant_id: id,
        full_name: existingApplicant[0].applicant_full_name,
        email: existingApplicant[0].email_address,
        new_status: status, // Return the frontend status
        db_status: dbStatus, // Also return the database status for debugging
        updated_at: new Date().toISOString(),
      },
    })
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
      // Add more debugging info in development
      stack: error.stack,
    })
  } finally {
    if (connection) await connection.end()
  }
}
