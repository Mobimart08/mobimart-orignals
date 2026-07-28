/* ==========================================================================
   src/middlewares/notFound.middleware.js
   Handles all requests to routes that don't exist.
   Registered after all routes in app.js.
   ========================================================================== */

/**
 * 404 Not Found handler for undefined routes.
 * Returns a consistent JSON response matching the ApiError shape.
 */
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export default notFoundMiddleware;
