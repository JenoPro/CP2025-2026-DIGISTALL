import { createConnection } from '../config/database.js'

// Get all areas (branch managers)
export const getAreas = async (req, res) => {
  let connection
  try {
    connection = await createConnection()
    const [areas] = await connection.execute(`
      SELECT 
        branch_manager_id,
        area,
        location,
        first_name,
        last_name,
        email,
        status
      FROM branch_manager 
      WHERE status = 'Active'
      ORDER BY area, location
    `)

    res.json({
      success: true,
      message: 'Areas retrieved successfully',
      data: areas,
    })
  } catch (error) {
    console.error('❌ Get areas error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve areas',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get all areas by city
export const getAreasByCity = async (req, res) => {
  let connection
  try {
    const { city } = req.params
    connection = await createConnection()

    const [areas] = await connection.execute(
      `
      SELECT DISTINCT area, location, branch_manager_id
      FROM branch_manager 
      WHERE area = ? AND status = 'Active'
      ORDER BY location
    `,
      [city],
    )

    res.json({
      success: true,
      message: 'Areas retrieved successfully',
      data: areas,
    })
  } catch (error) {
    console.error('❌ Get areas by city error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve areas',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get locations by city
export const getLocationsByCity = async (req, res) => {
  let connection
  try {
    const { city } = req.params
    connection = await createConnection()

    const [locations] = await connection.execute(
      `
      SELECT DISTINCT location
      FROM branch_manager 
      WHERE area = ? AND status = 'Active'
      ORDER BY location
    `,
      [city],
    )

    res.json({
      success: true,
      message: 'Locations retrieved successfully',
      data: locations,
    })
  } catch (error) {
    console.error('❌ Get locations by city error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve locations',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

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

// Get sections by floor ID (for filtering)
export const getSectionsByFloor = async (req, res) => {
  let connection
  try {
    const { floorId } = req.params
    connection = await createConnection()

    // Get the branch manager ID from the authenticated user
    const branchManagerId = req.user?.branchManagerId || req.user?.userId

    if (!branchManagerId) {
      return res.status(400).json({
        success: false,
        message: 'Branch manager ID not found in authentication token',
      })
    }

    console.log(
      'Fetching sections for floor ID:',
      floorId,
      'and branch manager ID:',
      branchManagerId,
    )

    // Verify the floor belongs to the authenticated branch manager
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
      WHERE s.floor_id = ? AND f.branch_manager_id = ? AND s.status = 'Active'
      ORDER BY s.section_name ASC
    `,
      [floorId, branchManagerId],
    )

    console.log(`Found ${sections.length} sections for floor ID: ${floorId}`)

    res.json({
      success: true,
      message: 'Sections retrieved successfully',
      data: sections,
      floorId: parseInt(floorId),
      branchManagerId: branchManagerId,
      count: sections.length,
    })
  } catch (error) {
    console.error('❌ Get sections by floor error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sections',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get all areas (for public use - no authentication required)
export const getAllAreas = async (req, res) => {
  let connection
  try {
    connection = await createConnection()
    const [areas] = await connection.execute(`
      SELECT DISTINCT area
      FROM branch_manager 
      WHERE status = 'Active'
      ORDER BY area
    `)

    res.json({
      success: true,
      message: 'Areas retrieved successfully',
      data: areas,
    })
  } catch (error) {
    console.error('❌ Get all areas error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve areas',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}
