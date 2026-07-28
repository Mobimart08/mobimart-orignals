/* ==========================================================================
   src/constants/roles.js
   User role constants. Single source of truth — used in models,
   middlewares, and services. Never hardcode role strings anywhere else.
   ========================================================================== */

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

/** All valid role values — used in Mongoose enum and validator checks */
export const ROLE_VALUES = Object.values(ROLES);

/** Roles that have admin-panel access */
export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN];
