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
    (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token',
        })
      }

      req.user = user
      next()
    },
  )
}

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      })
    }

    next()
  }
}

export default {
  authenticateToken,
  authorizeRole,
}
