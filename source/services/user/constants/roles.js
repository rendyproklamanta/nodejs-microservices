
// Roles ===========================================
export const ROLE_TYPE_ADMIN        = 'admin';
export const ROLE_TYPE_USER         = 'user';
export const ROLE_TYPE_ACCOUNTING   = 'accounting';

export const userRoles = [
   ROLE_TYPE_ADMIN,
   ROLE_TYPE_USER,
   ROLE_TYPE_ACCOUNTING,
];

// User Permission ===================================
export const PERMISSION_USER_CREATE  = 'PERMISSION_USER_CREATE';
export const PERMISSION_USER_UPDATE  = 'PERMISSION_USER_UPDATE';
export const PERMISSION_USER_DELETE  = 'PERMISSION_USER_DELETE';
export const PERMISSION_USER_GET     = 'PERMISSION_USER_GET';
export const PERMISSION_USER_GET_ALL = 'PERMISSION_USER_GET_ALL';

export const permissionUserList = [
   PERMISSION_USER_CREATE,
   PERMISSION_USER_UPDATE,
   PERMISSION_USER_DELETE,
   PERMISSION_USER_GET,
   PERMISSION_USER_GET_ALL,
];

export const roleAdmin = [
   'all',
];

export const roleUser = [
   ...permissionUserList,
   // ...patientPermission,
];

export const roleAccounting = [
   ...permissionUserList,
   // ...patientPermission,
];