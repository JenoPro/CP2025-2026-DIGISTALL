# Credentials Management Backend API Requirements

## Missing API Endpoint

The frontend is trying to call `POST /api/credentials` but this endpoint doesn't exist on the backend. Here's what needs to be implemented for mobile app credential storage:

## Required API Endpoint

### POST /api/credentials

**Purpose**: Store approved applicant credentials for mobile app access

**Authentication**: Bearer token required

**Request Body**:

```json
{
  "applicant_id": 4,
  "username": "25-12345",
  "password": "temp123",
  "email": "john.doe@example.com",
  "full_name": "John Doe",
  "contact_number": "09123456789",
  "status": "active",
  "created_by": "branch_manager"
}
```

**Response Success**:

```json
{
  "success": true,
  "message": "Credentials stored successfully for mobile app access",
  "data": {
    "credential_id": 15,
    "applicant_id": 4,
    "username": "25-12345",
    "status": "active",
    "created_at": "2025-10-05T12:00:00Z"
  }
}
```

**Response Error**:

```json
{
  "success": false,
  "message": "Username already exists in mobile app credentials"
}
```

## Backend Implementation

Add this to your credentials controller file:

```javascript
// Store credentials for mobile app access
export const storeCredentials = async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    const {
      applicant_id,
      username,
      password,
      email,
      full_name,
      contact_number,
      status = 'active',
      created_by
    } = req.body

    // Validate required fields
    if (!applicant_id || !username || !password || !email || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: applicant_id, username, password, email, full_name',
      })
    }

    // Check if username already exists
    const [existingUser] = await connection.execute(
      'SELECT credential_id FROM credential WHERE username = ?',
      [username],
    )

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists in mobile app credentials',
      })
    }

    // Check if applicant exists
    const [applicantCheck] = await connection.execute(
      'SELECT applicant_id FROM applicant WHERE applicant_id = ?',
      [applicant_id],
    )

    if (applicantCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      })
    }

    // Insert credentials
    const [result] = await connection.execute(`
      INSERT INTO credential (
        applicant_id, 
        username, 
        password, 
        email, 
        full_name, 
        contact_number, 
        status, 
        created_by, 
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      applicant_id,
      username,
      password, // Note: Should be hashed in production
      email,
      full_name,
      contact_number,
      status,
      created_by
    ])

    // Get the created credential
    const [newCredential] = await connection.execute(`
      SELECT 
        credential_id,
        applicant_id,
        username,
        email,
        full_name,
        contact_number,
        status,
        created_at
      FROM credential 
      WHERE credential_id = ?
    `, [result.insertId])

    res.status(201).json({
      success: true,
      message: 'Credentials stored successfully for mobile app access',
      data: newCredential[0],
    })

  } catch (error) {
    console.error('❌ Store credentials error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to store credentials',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}
```

## Additional API Endpoints (Optional)

### GET /api/credentials/:username

**Purpose**: Verify mobile app login credentials

```javascript
export const verifyCredentials = async (req, res) => {
  let connection
  try {
    connection = await createConnection()
    
    const { username } = req.params
    const { password } = req.body

    const [user] = await connection.execute(`
      SELECT 
        credential_id,
        applicant_id,
        username,
        email,
        full_name,
        contact_number,
        status
      FROM credential 
      WHERE username = ? AND password = ? AND status = 'active'
    `, [username, password])

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: user[0]
    })

  } catch (error) {
    console.error('❌ Verify credentials error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify credentials'
    })
  } finally {
    if (connection) await connection.end()
  }
}
```

### PUT /api/credentials/:id/status

**Purpose**: Activate/deactivate mobile app credentials

```javascript
export const updateCredentialStatus = async (req, res) => {
  let connection
  try {
    connection = await createConnection()
    
    const credentialId = req.params.id
    const { status } = req.body

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or inactive'
      })
    }

    const [result] = await connection.execute(
      'UPDATE credential SET status = ?, updated_at = NOW() WHERE credential_id = ?',
      [status, credentialId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      })
    }

    res.json({
      success: true,
      message: `Credential ${status === 'active' ? 'activated' : 'deactivated'} successfully`
    })

  } catch (error) {
    console.error('❌ Update credential status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update credential status'
    })
  } finally {
    if (connection) await connection.end()
  }
}
```

## Add Routes to Server

Add these routes to your main server file:

```javascript
import { 
  storeCredentials, 
  verifyCredentials, 
  updateCredentialStatus 
} from './path/to/credentialsController.js'

// Add these routes
app.post('/api/credentials', authMiddleware.authenticateToken, storeCredentials)
app.post('/api/credentials/:username/verify', verifyCredentials)
app.put('/api/credentials/:id/status', authMiddleware.authenticateToken, updateCredentialStatus)
```

## Database Schema

Ensure your `credential` table exists with the correct structure:

```sql
CREATE TABLE IF NOT EXISTS credential (
  credential_id INT AUTO_INCREMENT PRIMARY KEY,
  applicant_id INT NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (applicant_id) REFERENCES applicant(applicant_id) ON DELETE CASCADE,
  INDEX idx_username (username),
  INDEX idx_applicant_id (applicant_id),
  INDEX idx_status (status)
);
```

## Security Considerations

### Password Hashing

In production, passwords should be hashed before storage:

```javascript
import bcrypt from 'bcrypt'

// Before storing password
const hashedPassword = await bcrypt.hash(password, 10)

// When verifying
const isValid = await bcrypt.compare(password, hashedPassword)
```

### JWT Tokens for Mobile App

Consider implementing JWT tokens for mobile app authentication:

```javascript
import jwt from 'jsonwebtoken'

// Generate token after successful login
const token = jwt.sign(
  { 
    credentialId: user.credential_id, 
    username: user.username 
  },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }
)
```

## Testing the Backend

You can test the endpoint with curl:

```bash
# Store credentials
curl -X POST http://localhost:3001/api/credentials \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "applicant_id": 4,
    "username": "25-12345",
    "password": "temp123",
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "contact_number": "09123456789",
    "status": "active",
    "created_by": "branch_manager"
  }'

# Verify credentials (for mobile app login)
curl -X POST http://localhost:3001/api/credentials/25-12345/verify \
  -H "Content-Type: application/json" \
  -d '{"password": "temp123"}'
```

## Frontend Integration

Once the backend is implemented, uncomment the real API calls in:

1. **ApproveApplicants.js** - `storeCredentialsForMobileApp()` method
2. **DeclineApplicants.js** - `deleteApplicantData()` method (if implemented)

## Next Steps

1. **Implement the credentials endpoint** using the code above
2. **Add password hashing** for security
3. **Create the mobile app login endpoint**
4. **Implement JWT tokens** for mobile authentication
5. **Test all endpoints** thoroughly
6. **Remove the temporary mocks** from the frontend