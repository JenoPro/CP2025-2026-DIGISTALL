# Backend API Requirements for Hierarchical Stall Management

## Overview

The frontend has been updated to work with the new hierarchical database structure:
`branch_manager` → `floor` → `section` → `stall`

## Required API Endpoints

### 1. **GET /api/stalls** (UPDATED)

**Purpose**: Fetch stalls with hierarchical data for the current branch manager

**Authentication**: Bearer token required

**SQL Query Structure Needed**:

```sql
SELECT
    s.stall_id,
    s.stall_no,
    s.stall_location,
    s.size,
    s.dimensions,
    s.rental_price,
    s.price_type,
    s.status,
    s.stamp,
    s.description,
    s.stall_image,
    s.created_at,
    s.is_available,

    -- Floor information
    f.floor_id,
    f.floor_name,
    f.floor_number,

    -- Section information
    sec.section_id,
    sec.section_name,
    sec.section_code,

    -- Branch manager information
    bm.first_name as manager_first_name,
    bm.last_name as manager_last_name,
    bm.area,
    bm.location as branch_location
FROM stall s
JOIN section sec ON s.section_id = sec.section_id
JOIN floor f ON sec.floor_id = f.floor_id
JOIN branch_manager bm ON f.branch_manager_id = bm.branch_manager_id
WHERE bm.branch_manager_id = ? -- Current logged-in branch manager
ORDER BY f.floor_number, sec.section_name, s.stall_no
```

**Expected Response**:

```json
{
  "success": true,
  "data": [
    {
      "stall_id": 50,
      "stall_no": "NPM-001",
      "stall_location": "Main Entrance Area",
      "size": "3x3",
      "dimensions": null,
      "rental_price": 2800.0,
      "price_type": "Fixed Price",
      "status": "Active",
      "stamp": "APPROVED",
      "description": "Prime location electronics store near main entrance",
      "stall_image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      "created_at": "2025-09-07T14:00:00.000Z",
      "is_available": 1,
      "floor_id": 1,
      "floor_name": "1st Floor",
      "floor_number": 1,
      "section_id": 1,
      "section_name": "Electronics Section",
      "section_code": "ELEC-01",
      "manager_first_name": "Juan",
      "manager_last_name": "Dela Cruz",
      "area": "Naga City",
      "branch_location": "Peoples Mall"
    }
  ]
}
```

### 2. **GET /api/floors** (NEW ENDPOINT)

**Purpose**: Fetch floors for the current branch manager

**Authentication**: Bearer token required

**SQL Query**:

```sql
SELECT floor_id, floor_name, floor_number, status
FROM floor
WHERE branch_manager_id = ? -- Current logged-in branch manager
AND status = 'Active'
ORDER BY floor_number
```

**Expected Response**:

```json
{
  "success": true,
  "data": [
    {
      "floor_id": 1,
      "floor_name": "1st Floor",
      "floor_number": 1,
      "status": "Active"
    },
    {
      "floor_id": 2,
      "floor_name": "2nd Floor",
      "floor_number": 2,
      "status": "Active"
    }
  ]
}
```

### 3. **GET /api/sections** (NEW ENDPOINT)

**Purpose**: Fetch sections for the current branch manager

**Authentication**: Bearer token required

**SQL Query**:

```sql
SELECT
    s.section_id,
    s.section_name,
    s.section_code,
    s.status,
    s.floor_id,
    f.floor_name,
    f.floor_number
FROM section s
JOIN floor f ON s.floor_id = f.floor_id
WHERE f.branch_manager_id = ? -- Current logged-in branch manager
AND s.status = 'Active'
ORDER BY f.floor_number, s.section_name
```

**Expected Response**:

```json
{
  "success": true,
  "data": [
    {
      "section_id": 1,
      "section_name": "Electronics Section",
      "section_code": "ELEC-01",
      "status": "Active",
      "floor_id": 1,
      "floor_name": "1st Floor",
      "floor_number": 1
    },
    {
      "section_id": 2,
      "section_name": "Clothing Section",
      "section_code": "CLTH-01",
      "status": "Active",
      "floor_id": 1,
      "floor_name": "1st Floor",
      "floor_number": 1
    }
  ]
}
```

### 4. **POST /api/stalls** (UPDATED)

**Purpose**: Create new stall with hierarchical structure

**Authentication**: Bearer token required

**Request Body Changes**:

```json
{
  "stall_no": "NPM-012",
  "rental_price": 3000,
  "section_id": 5, // NEW: Use section_id instead of section name
  "size": "4x3",
  "stall_location": "Corner Area",
  "description": "Prime corner location",
  "price_type": "Fixed Price",
  "is_available": 1,
  "stall_image": "base64_image_data_or_url"
}
```

**SQL Insert**:

```sql
INSERT INTO stall (
    section_id,  -- NEW: Use section_id
    stall_no,
    stall_location,
    size,
    rental_price,
    price_type,
    status,
    description,
    stall_image,
    created_at,
    is_available
) VALUES (?, ?, ?, ?, ?, ?, 'Active', ?, ?, NOW(), ?)
```

**Validation Required**:

- Verify that section_id belongs to a floor managed by the current branch manager
- Ensure stall_no is unique
- Validate section_id exists and is active

## Authentication & Authorization

**Branch Manager Token Validation**:

```javascript
// In all endpoints, extract branch_manager_id from JWT token
const branchManagerId = extractBranchManagerIdFromToken(bearerToken)
```

## Error Responses

**401 Unauthorized**:

```json
{
  "success": false,
  "message": "Authentication token required"
}
```

**403 Forbidden**:

```json
{
  "success": false,
  "message": "Access denied. Branch manager access required."
}
```

**400 Bad Request**:

```json
{
  "success": false,
  "message": "Invalid section_id for your branch",
  "details": "The selected section does not belong to your managed floors"
}
```

## Migration Notes for Backend

1. **Update existing stall endpoints** to use JOINs with the new hierarchical structure
2. **Add new floor and section endpoints** for dynamic dropdown population
3. **Update stall creation logic** to use section_id instead of hardcoded section names
4. **Add validation** to ensure branch managers can only access/modify their own floors/sections/stalls
5. **Update authentication middleware** to work with the new structure

## Database Relations Validation

Always validate:

- `floor.branch_manager_id` matches the authenticated branch manager
- `section.floor_id` exists and belongs to the branch manager's floors
- `stall.section_id` exists and belongs to the branch manager's sections

This ensures proper data isolation between different branch managers.
