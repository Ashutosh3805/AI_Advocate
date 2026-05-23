/**
 * Centralized Express Error Handling Middleware.
 * Formats all internal exceptions cleanly matching the required standard format.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[SERVER_ERROR_CAUGHT]', err);

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal system error occurred. Secure terminal connection maintained.',
    data: process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  });
};
