import { createConnection } from '../config/database.js'

// Get all areas
export async function getAllAreas(req, res) {
  let connection
  try {
    connection = await createConnection()
    const [areas] = await connection.execute(`
      SELECT 
        ID,
        city,
        branch,
        description,
        is_active,
        created_at
      FROM Area 
      WHERE is_active = TRUE
      ORDER BY city, branch
    `)

    res.json({
      success: true,
      data: areas,
      message: 'Areas retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching areas:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch areas',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get areas by city
export async function getAreasByCity(req, res) {
  let connection
  try {
    const { city } = req.params
    connection = await createConnection()

    const [areas] = await connection.execute(
      `
      SELECT 
        ID,
        city,
        branch,
        description,
        is_active,
        created_at
      FROM Area 
      WHERE city = ? AND is_active = TRUE
      ORDER BY branch
    `,
      [city],
    )

    res.json({
      success: true,
      data: areas,
      message: `Areas for ${city} retrieved successfully`,
    })
  } catch (error) {
    console.error('Error fetching areas by city:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch areas by city',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get area by ID
export async function getAreaById(req, res) {
  let connection
  try {
    const { id } = req.params
    connection = await createConnection()

    const [areas] = await connection.execute(
      `
      SELECT 
        ID,
        city,
        branch,
        description,
        is_active,
        created_at
      FROM Area 
      WHERE ID = ?
    `,
      [id],
    )

    if (areas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Area not found',
      })
    }

    res.json({
      success: true,
      data: areas[0],
      message: 'Area retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching area by ID:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch area',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Create new area
export async function createArea(req, res) {
  let connection
  try {
    const { city, branch, description } = req.body

    // Validation
    if (!city || !branch) {
      return res.status(400).json({
        success: false,
        message: 'City and branch are required',
      })
    }

    connection = await createConnection()

    // Check if area already exists
    const [existingArea] = await connection.execute(
      'SELECT ID FROM Area WHERE city = ? AND branch = ?',
      [city, branch],
    )

    if (existingArea.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Area with this city and branch already exists',
      })
    }

    // Create new area
    const [result] = await connection.execute(
      'INSERT INTO Area (city, branch, description) VALUES (?, ?, ?)',
      [city, branch, description || null],
    )

    res.status(201).json({
      success: true,
      data: {
        ID: result.insertId,
        city,
        branch,
        description,
      },
      message: 'Area created successfully',
    })
  } catch (error) {
    console.error('Error creating area:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create area',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Update area
export async function updateArea(req, res) {
  let connection
  try {
    const { id } = req.params
    const { city, branch, description, is_active } = req.body

    connection = await createConnection()

    // Check if area exists
    const [existingArea] = await connection.execute('SELECT ID FROM Area WHERE ID = ?', [id])
    if (existingArea.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Area not found',
      })
    }

    // Update area
    await connection.execute(
      'UPDATE Area SET city = ?, branch = ?, description = ?, is_active = ? WHERE ID = ?',
      [city, branch, description, is_active !== undefined ? is_active : true, id],
    )

    res.json({
      success: true,
      message: 'Area updated successfully',
      data: { id, city, branch, description, is_active },
    })
  } catch (error) {
    console.error('Error updating area:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update area',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Delete area (soft delete)
export async function deleteArea(req, res) {
  let connection
  try {
    const { id } = req.params
    connection = await createConnection()

    // Check if area exists
    const [existingArea] = await connection.execute('SELECT ID FROM Area WHERE ID = ?', [id])
    if (existingArea.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Area not found',
      })
    }

    // Check if area is being used by any admin
    const [adminUsing] = await connection.execute('SELECT ID FROM Admin WHERE area_id = ?', [id])
    if (adminUsing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete area that is being used by admin users',
      })
    }

    // Soft delete (set is_active to false)
    await connection.execute('UPDATE Area SET is_active = FALSE WHERE ID = ?', [id])

    res.json({
      success: true,
      message: 'Area deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting area:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete area',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}
