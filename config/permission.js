// User Permission
const userPermission = [
   'users-create',
   'users-update',
   'users-delete',
   'users-get',
   'users-get-all',
];

// Patient Permission
const patientPermission = [
   'patients-create',
   'patients-update',
   'patients-delete',
   'patients-get',
   'patients-get-all',
];

const roleAdmin = [
   'all',
];

const roleUser = [
   ...userPermission,
   ...patientPermission,
];


module.exports = {
   roleAdmin,
   roleUser,
};
