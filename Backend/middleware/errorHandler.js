export function errorHandler(err, req, res, next) {
  console.error('❌ Unhandled error:', err)

  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  })
}
