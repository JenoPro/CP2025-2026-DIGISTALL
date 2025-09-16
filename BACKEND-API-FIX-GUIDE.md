# Backend API Fix for Floor/Section Endpoints

## Problem

The `/api/floors` and `/api/sections` endpoints are defined in your server but don't have proper controller implementations.

## Solution

### 1. Create the missing Area Controller file

Create file: `Naga-Stall-Management/Area/areaController.js` with the following content:

```javascript
import { createConnection } from '../config/database.js'

// Get floors for the authenticated branch manager
export const getFloors = async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    // Get the branch manager ID from the authenticated user
    const branchManagerId = req.user?.branchManagerId || req.user?.userId

    if (!branchManagerId) {
      return res.status(400).json({
        success: false,
        message: 'Branch manager ID not found in authentication token',
      })
    }

    console.log('Fetching floors for branch manager ID:', branchManagerId)

    const [floors] = await connection.execute(
      `
      SELECT 
        floor_id,
        floor_name,
        floor_number,
        status,
        created_at,
        updated_at
      FROM floor
      WHERE branch_manager_id = ? AND status = 'Active'
      ORDER BY floor_number ASC
    `,
      [branchManagerId],
    )

    console.log(`Found ${floors.length} floors for branch manager ID: ${branchManagerId}`)

    res.json({
      success: true,
      message: 'Floors retrieved successfully',
      data: floors,
      branchManagerId: branchManagerId,
      count: floors.length,
    })
  } catch (error) {
    console.error('❌ Get floors error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve floors',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get sections for the authenticated branch manager
export const getSections = async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    // Get the branch manager ID from the authenticated user
    const branchManagerId = req.user?.branchManagerId || req.user?.userId

    if (!branchManagerId) {
      return res.status(400).json({
        success: false,
        message: 'Branch manager ID not found in authentication token',
      })
    }

    console.log('Fetching sections for branch manager ID:', branchManagerId)

    // Get sections through the floor relationship
    const [sections] = await connection.execute(
      `
      SELECT 
        s.section_id,
        s.floor_id,
        s.section_name,
        s.section_code,
        s.status,
        s.created_at,
        s.updated_at,
        f.floor_name,
        f.floor_number
      FROM section s
      INNER JOIN floor f ON s.floor_id = f.floor_id
      WHERE f.branch_manager_id = ? AND s.status = 'Active'
      ORDER BY f.floor_number ASC, s.section_name ASC
    `,
      [branchManagerId],
    )

    console.log(`Found ${sections.length} sections for branch manager ID: ${branchManagerId}`)

    res.json({
      success: true,
      message: 'Sections retrieved successfully',
      data: sections,
      branchManagerId: branchManagerId,
      count: sections.length,
    })
  } catch (error) {
    console.error('❌ Get sections error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sections',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}
```

### 2. Update your server file

In your main server file, import the area controller functions at the top:

```javascript
// Add this import near the top with your other imports
import { getFloors, getSections } from './Naga-Stall-Management/Area/areaController.js'
```

Your existing endpoints should then work:

```javascript
// Floor and Section endpoints (require authentication)
app.get('/api/floors', authMiddleware.authenticateToken, getFloors)
app.get('/api/sections', authMiddleware.authenticateToken, getSections)
```

### 3. Test the fix

1. Start your backend server
2. Open your frontend
3. Try adding a stall - select a floor and check if sections appear

## What this fixes

- `/api/floors` will return floors for the authenticated branch manager
- `/api/sections` will return all sections with their floor relationships
- The frontend filtering will work properly with numeric ID comparison

## Debug Information

The frontend now has enhanced logging in the `filterSectionsByFloor` method:

- Shows the floor ID type and value
- Shows how many sections are available
- Shows which sections match the selected floor
- Logs the final section options

Check your browser console for detailed debugging information.
