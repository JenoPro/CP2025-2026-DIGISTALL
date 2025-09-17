# Admin Backend API Requirements

This document outlines the backend API endpoints that need to be implemented to support the admin branch management functionality.

## Updated Admin Table Schema

The admin table now includes additional fields:

```sql
CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_username` varchar(50) NOT NULL,
  `admin_password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
);
```

## Authentication Endpoints (Need Updates)

### POST /api/auth/admin/login - UPDATED REQUIRED

**Purpose:** Admin login endpoint - MUST return the new fields
**Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Updated Response Required:**

````json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "adminId": 1,
      "username": "admin",
      "firstName": "System",
      "lastName": "Administrator",
      "contactNumber": "+63917000000",
      "email": "admin@nagastall.com",
      "userType": "admin",
      "status": "Active"
    }
  }
}

## Branch Management Endpoints (Need to be implemented)

### GET /api/admin/branches

**Purpose:** Get all branches managed by the admin
**Headers:** Authorization: Bearer {token}
**Response:**

```json
{
  "success": true,
  "data": [
    {
      "branch_id": 1,
      "branch_name": "Naga City Peoples Mall",
      "area": "Naga City",
      "location": "Peoples Mall",
      "address": "Peoples Mall Complex, Naga City, Camarines Sur",
      "contact_number": "+63917123456",
      "email": "ncpm@nagastall.com",
      "status": "Active",
      "manager_name": "Juan Dela Cruz",
      "manager_assigned": true,
      "created_at": "2025-09-15T16:00:00.000Z",
      "updated_at": "2025-09-15T16:00:00.000Z"
    }
  ]
}
````

### POST /api/admin/branches

**Purpose:** Create a new branch
**Headers:** Authorization: Bearer {token}
**Body:**

```json
{
  "branch_name": "New Branch Name",
  "area": "Area Name",
  "location": "Location Name",
  "address": "Full Address",
  "contact_number": "+63XXXXXXXXX",
  "email": "branch@example.com",
  "status": "Active"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Branch created successfully",
  "data": {
    "branch_id": 4,
    "branch_name": "New Branch Name",
    "area": "Area Name",
    "location": "Location Name",
    "address": "Full Address",
    "contact_number": "+63XXXXXXXXX",
    "email": "branch@example.com",
    "status": "Active",
    "manager_assigned": false,
    "created_at": "2025-09-17T10:00:00.000Z"
  }
}
```

### POST /api/admin/branch-managers

**Purpose:** Create and assign a branch manager to a branch
**Headers:** Authorization: Bearer {token}
**Body:**

```json
{
  "branch_id": 4,
  "first_name": "John",
  "last_name": "Doe",
  "manager_username": "john_manager",
  "manager_password": "securepassword",
  "email": "john@example.com",
  "contact_number": "+63XXXXXXXXX",
  "status": "Active"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Branch manager assigned successfully",
  "data": {
    "branch_manager_id": 4,
    "branch_id": 4,
    "manager_username": "john_manager",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "contact_number": "+63XXXXXXXXX",
    "status": "Active",
    "created_at": "2025-09-17T10:00:00.000Z"
  }
}
```

### PUT /api/admin/branches/{id}

**Purpose:** Update branch information
**Headers:** Authorization: Bearer {token}
**Body:** (same as POST /api/admin/branches)

### DELETE /api/admin/branches/{id}

**Purpose:** Delete a branch
**Headers:** Authorization: Bearer {token}
**Response:**

```json
{
  "success": true,
  "message": "Branch deleted successfully"
}
```

## Database Schema Updates Required

### branch table

- Add `manager_assigned` BOOLEAN field (calculated based on branch_manager table)
- Add computed field for `manager_name` in queries

### Query Examples

#### Get branches with manager information:

```sql
SELECT
  b.*,
  CASE
    WHEN bm.branch_manager_id IS NOT NULL THEN true
    ELSE false
  END as manager_assigned,
  CONCAT(bm.first_name, ' ', bm.last_name) as manager_name
FROM branch b
LEFT JOIN branch_manager bm ON b.branch_id = bm.branch_id
WHERE b.admin_id = ? AND bm.status = 'Active'
ORDER BY b.created_at DESC
```

#### Create branch manager with password hashing:

```javascript
// Hash password before storing
const hashedPassword = await bcrypt.hash(manager_password, 12);

// Insert into branch_manager table
INSERT INTO branch_manager (
  branch_id, manager_username, manager_password_hash,
  first_name, last_name, email, contact_number, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

## Authentication Middleware

Ensure all admin endpoints verify:

1. Valid JWT token
2. User type is 'admin'
3. Admin has permission to access/modify the resource

```javascript
// Example middleware
const requireAdmin = (req, res, next) => {
  const { userType, adminId } = req.user // from JWT
  if (userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    })
  }
  next()
}
```

## Error Handling

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development only)"
}
```

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 12
2. **Input Validation**: Validate all input fields
3. **SQL Injection**: Use parameterized queries
4. **Authorization**: Ensure admin can only access their managed branches
5. **Rate Limiting**: Implement rate limiting for authentication endpoints
6. **CORS**: Configure appropriate CORS settings
