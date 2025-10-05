# Applicant Management Backend API Requirements

## Missing API Endpoint

The frontend is trying to call `PUT /api/applicants/:id/status` but this endpoint doesn't exist on the backend. Here's what needs to be implemented:

## Required API Endpoint

### PUT /api/applicants/:id/status

**Purpose**: Update applicant status (approve/decline) with credentials and reason

**Authentication**: Bearer token required

**URL Parameters**:

- `id` (integer): The applicant_id from the applicant table

**Request Body**:

```json
{
  "status": "approved", // or "declined"
  "username": "25-12345", // only for approved status
  "password": "temp123", // only for approved status
  "decline_reason": "Insufficient documentation" // only for declined status
}
```

**Response Success**:

```json
{
  "success": true,
  "message": "Applicant status updated successfully",
  "data": {
    "applicant_id": 4,
    "status": "approved",
    "updated_at": "2025-10-05T12:00:00Z"
  }
}
```

**Response Error**:

```json
{
  "success": false,
  "message": "Applicant not found"
}
```

## Backend Implementation

Add this to your applicant controller file:

```javascript
// Update applicant status (approve/decline)
export const updateApplicantStatus = async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    const applicantId = req.params.id
    const { status, username, password, decline_reason } = req.body

    // Validate status
    if (!['approved', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, declined, or pending',
      })
    }

    // Check if applicant exists
    const [applicantCheck] = await connection.execute(
      'SELECT applicant_id FROM applicant WHERE applicant_id = ?',
      [applicantId],
    )

    if (applicantCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      })
    }

    // Prepare update data
    let updateFields = ['status = ?']
    let updateValues = [status]

    // Add credentials for approved status
    if (status === 'approved' && username && password) {
      updateFields.push('username = ?', 'password = ?')
      updateValues.push(username, password)
    }

    // Add decline reason for declined status
    if (status === 'declined' && decline_reason) {
      updateFields.push('decline_reason = ?')
      updateValues.push(decline_reason)
    }

    // Add timestamp
    updateFields.push('updated_at = NOW()')
    updateValues.push(applicantId)

    // Execute update
    const [result] = await connection.execute(
      `UPDATE applicant SET ${updateFields.join(', ')} WHERE applicant_id = ?`,
      updateValues,
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update applicant status',
      })
    }

    // Get updated applicant data
    const [updatedApplicant] = await connection.execute(
      'SELECT applicant_id, status, updated_at FROM applicant WHERE applicant_id = ?',
      [applicantId],
    )

    res.json({
      success: true,
      message: 'Applicant status updated successfully',
      data: updatedApplicant[0],
    })
  } catch (error) {
    console.error('❌ Update applicant status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update applicant status',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}
```

## Add Route to Server

Add this route to your main server file:

```javascript
import { updateApplicantStatus } from './path/to/applicantController.js'

// Add this route
app.put('/api/applicants/:id/status', authMiddleware.authenticateToken, updateApplicantStatus)
```

## Database Schema Requirements

Make sure your `applicant` table has these columns:

```sql
ALTER TABLE applicant ADD COLUMN IF NOT EXISTS username VARCHAR(50) NULL;
ALTER TABLE applicant ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL;
ALTER TABLE applicant ADD COLUMN IF NOT EXISTS decline_reason TEXT NULL;
ALTER TABLE applicant ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

## Frontend Fix (Temporary)

If you can't implement the backend immediately, you can temporarily modify the frontend to skip the status update:

### Option 1: Mock Success Response

Update the `updateApplicantStatus` method in ApproveApplicants.js:

```javascript
async updateApplicantStatus(applicantId, status, username = null, password = null) {
  try {
    console.log('📤 Updating applicant status:', { applicantId, status, username })

    // TEMPORARY: Mock successful response until backend is implemented
    console.log('⚠️ WARNING: Using mock response - backend endpoint not implemented')

    return {
      success: true,
      message: 'Status updated successfully (mocked response)'
    }

    // TODO: Uncomment this when backend endpoint is implemented
    /*
    const token = sessionStorage.getItem('authToken') ||
                 localStorage.getItem('token') ||
                 localStorage.getItem('authToken')

    if (!token) {
      throw new Error('Authentication token not found. Please log in again.')
    }

    const updateData = { status: status }

    if (status === 'approved' && username && password) {
      updateData.username = username
      updateData.password = password
    }

    const response = await fetch(`http://localhost:3001/api/applicants/${applicantId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    console.log('📡 Status update response:', response.status)

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.')
      } else if (response.status === 403) {
        throw new Error('You do not have permission to update this applicant.')
      } else if (response.status === 404) {
        throw new Error('Applicant not found.')
      } else {
        throw new Error(`Server error: ${response.status}`)
      }
    }

    const result = await response.json()
    console.log('📦 Status update result:', result)

    if (result.success) {
      return { success: true, message: 'Status updated successfully' }
    } else {
      throw new Error(result.message || 'Failed to update status')
    }
    */

  } catch (error) {
    console.error('❌ Error updating applicant status:', error)
    return { success: false, message: error.message }
  }
}
```

## Next Steps

1. **Implement the backend endpoint** using the code above
2. **Update your database schema** with the new columns
3. **Add the route** to your server file
4. **Test the endpoint** with the frontend
5. **Remove the temporary mock** from the frontend

## Testing the Backend

You can test the endpoint with curl:

```bash
# Test approve
curl -X PUT http://localhost:3001/api/applicants/4/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","username":"25-12345","password":"temp123"}'

# Test decline
curl -X PUT http://localhost:3001/api/applicants/4/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"declined","decline_reason":"Insufficient documentation"}'
```
