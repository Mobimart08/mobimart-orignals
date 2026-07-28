/* ==========================================================================
   src/middlewares/role.middleware.js
   Role-based authorization guard middleware.
   Ensures the authenticated user has the necessary roles/permissions.
   Must be registered AFTER auth.middleware.js.
   ========================================================================== */

import { ForbiddenError } from '../utils/ApiError.js';

/**
 * Authorization guard for roles.
 *
 * @param {Array<string>} allowedRoles - List of roles permitted to access the route
 */
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // Safety check: verify auth.middleware has run
    if (!req.user) {
      return next(new ForbiddenError('Access denied. Authentication context missing.'));
    }

    // Super admins always have permission unless strictly excluded (which we don't do for this app)
    const hasPermission = allowedRoles.includes(req.user.role) || req.user.role === 'super_admin';

    if (!hasPermission) {
      return next(
        new ForbiddenError(
          `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export default roleMiddleware;
