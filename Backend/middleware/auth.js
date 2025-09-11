import jwt from 'jsonwebtoken'
import process from 'process'

const { verify } = jwt

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    })
  }

  verify(
    token,
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err)

        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expired',
          })
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({
            success: false,
            message: 'Invalid token',
          })
        } else {
          return res.status(403).json({
            success: false,
            message: 'Token verification failed',
          })
        }
      }

      // Add decoded user information to request
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        userType: decoded.userType, // 'admin' or 'branch_manager'
        area: decoded.area,
        location: decoded.location,
        branchManagerId: decoded.branchManagerId || decoded.userId,
        // Keep legacy role field for backward compatibility
        role: decoded.userType === 'admin' ? 'admin' : 'branch_manager',
      }

      console.log('Authenticated user:', req.user.username, 'Type:', req.user.userType)
      next()
    },
  )
}

// Updated role authorization for naga_stall system
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    // Check both userType and legacy role for compatibility
    const userRole = req.user.userType || req.user.role

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}, but user has: ${userRole}`,
      })
    }

    next()
  }
}

// Specific middleware for branch manager authentication
const authenticateBranchManager = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err)

    if (req.user.userType !== 'branch_manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Branch manager access required.',
      })
    }

    // Ensure branch manager ID is available for stall filtering
    if (!req.user.branchManagerId) {
      return res.status(400).json({
        success: false,
        message: 'Branch manager ID not found in token',
      })
    }

    next()
  })
}

// Specific middleware for admin authentication
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err)

    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin access required.',
      })
    }

    next()
  })
}

// General authentication that accepts both admin and branch manager
const authenticateUser = authenticateToken

export default {
  authenticateToken,
  authenticateUser,
  authenticateBranchManager,
  authenticateAdmin,
  authorizeRole,
}
