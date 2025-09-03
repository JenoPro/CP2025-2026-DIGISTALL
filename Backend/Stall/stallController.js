import { createConnection } from '../config/database.js'

// Get all stalls
export const getAllStalls = async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    const [stalls] = await connection.execute(`
      SELECT 
        s.*,
        CONCAT(a1.first_name, ' ', a1.last_name) as created_by_name,
        CONCAT(a2.first_name, ' ', a2.last_name) as updated_by_name
      FROM Stall s
      LEFT JOIN Admin a1 ON s.created_by = a1.ID
      LEFT JOIN Admin a2 ON s.updated_by = a2.ID
      ORDER BY s.created_at DESC
    `)

    res.json({
      success: true,
      message: 'Stalls retrieved successfully',
      data: stalls,
    })
  } catch (error) {
    console.error('❌ Get stalls error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stalls',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get stall by ID
export const getStallById = async (req, res) => {
  let connection
  try {
    const { id } = req.params
    connection = await createConnection()

    const [stalls] = await connection.execute(
      `
      SELECT 
        s.*,
        CONCAT(a1.first_name, ' ', a1.last_name) as created_by_name,
        CONCAT(a2.first_name, ' ', a2.last_name) as updated_by_name
      FROM Stall s
      LEFT JOIN Admin a1 ON s.created_by = a1.ID
      LEFT JOIN Admin a2 ON s.updated_by = a2.ID
      WHERE s.ID = ?
    `,
      [id],
    )

    if (stalls.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found',
      })
    }

    res.json({
      success: true,
      message: 'Stall retrieved successfully',
      data: stalls[0],
    })
  } catch (error) {
    console.error('❌ Get stall by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stall',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Add new stall
export const addStall = async (req, res) => {
  let connection
  try {
    const {
      stallNumber,
      price,
      floor,
      section,
      dimensions,
      location,
      description,
      image,
      isAvailable = true,
      priceType = 'Fixed Price',
    } = req.body

    // Validation
    if (!stallNumber || !price || !floor || !section || !location) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: stallNumber, price, floor, section, location',
      })
    }

    connection = await createConnection()

    // Check if stall number already exists
    const [existingStall] = await connection.execute(
      'SELECT ID FROM Stall WHERE stall_number = ?',
      [stallNumber],
    )

    if (existingStall.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Stall number already exists',
      })
    }

    // Get user ID from token (if authenticated)
    const createdBy = req.user ? req.user.userId : null

    // Insert new stall
    const [result] = await connection.execute(
      `
      INSERT INTO Stall (
        stall_number, price, floor, section, dimensions, 
        location, description, image_data, is_available, 
        price_type, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        stallNumber,
        parseFloat(price),
        floor,
        section,
        dimensions || null,
        location,
        description || null,
        image || null,
        isAvailable,
        priceType,
        createdBy,
      ],
    )

    // Get the created stall
    const [newStall] = await connection.execute('SELECT * FROM Stall WHERE ID = ?', [
      result.insertId,
    ])

    console.log('✅ Stall added successfully:', newStall[0])

    res.status(201).json({
      success: true,
      message: 'Stall added successfully',
      data: newStall[0],
    })
  } catch (error) {
    console.error('❌ Add stall error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add stall',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Update stall
export const updateStall = async (req, res) => {
  let connection
  try {
    const { id } = req.params
    const updateData = req.body

    connection = await createConnection()

    // Check if stall exists
    const [existingStall] = await connection.execute('SELECT ID FROM Stall WHERE ID = ?', [id])

    if (existingStall.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found',
      })
    }

    // If updating stall_number, check if it already exists (excluding current stall)
    if (updateData.stall_number) {
      const [duplicateCheck] = await connection.execute(
        'SELECT ID FROM Stall WHERE stall_number = ? AND ID != ?',
        [updateData.stall_number, id],
      )

      if (duplicateCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Stall number already exists',
        })
      }
    }

    // Get user ID from token (if authenticated)
    const updatedBy = req.user ? req.user.userId : null

    // Define allowed fields for update
    const allowedFields = [
      'stall_number',
      'price',
      'floor',
      'section',
      'dimensions',
      'location',
      'description',
      'image_data',
      'is_available',
      'price_type',
    ]

    // Build dynamic update query
    const updateFields = []
    const updateValues = []

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`)
        // Handle price conversion
        if (field === 'price') {
          updateValues.push(parseFloat(updateData[field]))
        } else {
          updateValues.push(updateData[field])
        }
      }
    })

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      })
    }

    // Add updated_by and updated_at
    updateFields.push('updated_by = ?', 'updated_at = CURRENT_TIMESTAMP')
    updateValues.push(updatedBy)
    updateValues.push(id) // Add ID for WHERE clause

    const updateQuery = `UPDATE Stall SET ${updateFields.join(', ')} WHERE ID = ?`

    await connection.execute(updateQuery, updateValues)

    // Get updated stall with admin names
    const [updatedStall] = await connection.execute(
      `
      SELECT 
        s.*,
        CONCAT(a1.first_name, ' ', a1.last_name) as created_by_name,
        CONCAT(a2.first_name, ' ', a2.last_name) as updated_by_name
      FROM Stall s
      LEFT JOIN Admin a1 ON s.created_by = a1.ID
      LEFT JOIN Admin a2 ON s.updated_by = a2.ID
      WHERE s.ID = ?
    `,
      [id],
    )

    console.log('✅ Stall updated successfully:', updatedStall[0])

    res.json({
      success: true,
      message: 'Stall updated successfully',
      data: updatedStall[0],
    })
  } catch (error) {
    console.error('❌ Update stall error:', error)

    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Stall number already exists',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update stall',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Delete stall
export const deleteStall = async (req, res) => {
  let connection
  try {
    const { id } = req.params

    connection = await createConnection()

    // Check if stall exists
    const [existingStall] = await connection.execute(
      'SELECT ID, stall_number FROM Stall WHERE ID = ?',
      [id],
    )

    if (existingStall.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found',
      })
    }

    // Delete the stall
    await connection.execute('DELETE FROM Stall WHERE ID = ?', [id])

    console.log('✅ Stall deleted successfully:', existingStall[0].stall_number)

    res.json({
      success: true,
      message: 'Stall deleted successfully',
      data: { id: id, stallNumber: existingStall[0].stall_number },
    })
  } catch (error) {
    console.error('❌ Delete stall error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete stall',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get available stalls only
export const getAvailableStalls = async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    const [stalls] = await connection.execute(`
      SELECT * FROM Stall 
      WHERE is_available = TRUE AND status = 'Active'
      ORDER BY floor, section, stall_number
    `)

    res.json({
      success: true,
      message: 'Available stalls retrieved successfully',
      data: stalls,
    })
  } catch (error) {
    console.error('❌ Get available stalls error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve available stalls',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}

// Get stalls by filter
export const getStallsByFilter = async (req, res) => {
  let connection
  try {
    const { floor, section, location, isAvailable, priceType, search, minPrice, maxPrice } =
      req.query

    connection = await createConnection()

    let query = `
      SELECT 
        s.*,
        CONCAT(a1.first_name, ' ', a1.last_name) as created_by_name,
        CONCAT(a2.first_name, ' ', a2.last_name) as updated_by_name
      FROM Stall s
      LEFT JOIN Admin a1 ON s.created_by = a1.ID
      LEFT JOIN Admin a2 ON s.updated_by = a2.ID
      WHERE 1=1
    `
    const queryParams = []

    // Floor filter
    if (floor) {
      query += ' AND s.floor = ?'
      queryParams.push(floor)
    }

    // Section filter
    if (section) {
      query += ' AND s.section = ?'
      queryParams.push(section)
    }

    // Location filter
    if (location) {
      query += ' AND s.location = ?'
      queryParams.push(location)
    }

    // Availability filter
    if (isAvailable !== undefined) {
      query += ' AND s.is_available = ?'
      queryParams.push(isAvailable === 'true')
    }

    // Price type filter
    if (priceType) {
      query += ' AND s.price_type = ?'
      queryParams.push(priceType)
    }

    // Search filter (search in stall number, location, description, section)
    if (search) {
      query += ` AND (
        s.stall_number LIKE ? OR 
        s.location LIKE ? OR 
        s.description LIKE ? OR 
        s.section LIKE ?
      )`
      const searchPattern = `%${search}%`
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }

    // Price range filter
    if (minPrice !== undefined && !isNaN(minPrice)) {
      query += ' AND s.price >= ?'
      queryParams.push(parseFloat(minPrice))
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      query += ' AND s.price <= ?'
      queryParams.push(parseFloat(maxPrice))
    }

    query += ' ORDER BY s.created_at DESC'

    const [stalls] = await connection.execute(query, queryParams)

    res.json({
      success: true,
      message: 'Stalls retrieved successfully',
      data: stalls,
      count: stalls.length,
      filters: {
        floor,
        section,
        location,
        isAvailable,
        priceType,
        search,
        minPrice,
        maxPrice,
      },
    })
  } catch (error) {
    console.error('❌ Get stalls by filter error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stalls',
      error: error.message,
    })
  } finally {
    if (connection) await connection.end()
  }
}
