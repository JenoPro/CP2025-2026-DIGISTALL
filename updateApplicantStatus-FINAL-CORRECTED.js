import { createConnection } from '../../../config/database.js'

// Update applicant status - FINAL CORRECTED VERSION
export const updateApplicantStatus = async (req, res) => {
  let connection
  try {
    const { id } = req.params // This is applicant_id
    const { status, decline_reason, declined_at } = req.body

    console.log('📊 Updating applicant status:', {
      applicant_id: id,
      requested_status: status,
      decline_reason,
      declined_at,
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

    // Update the application status (this is where status is stored in your database)
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

    console.log('📊 Update result:', {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
    })

    if (result.affectedRows === 0) {
      console.log('❌ No rows were updated')
      return res.status(404).json({
        success: false,
        message: 'No rows were updated. Application may not exist.',
      })
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
