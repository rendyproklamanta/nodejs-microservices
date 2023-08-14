const express = require('express');
const router = express.Router();
const {
   createUser,
   updateUser,
   deleteUser,
   getUserById,
   getAllUsers,
} = require('@services/users/controllers/user.controller');
const { teamCreateGenerate, teamCreate } = require('@services/users/controllers/team.controller');
const { isAuthWithPermission, isApiKey } = require('@services/auths/middlewares/auth.middleware');
const { validate } = require('@config/validate');
const { userCreateSchema, userUpdateSchema, userParamsIdSchema } = require('@services/users/middlewares/user.validator');

const ENDPOINT = '/api/users';

//root route
router.get(`${ENDPOINT}`, (req, res) => {
   res.status(200).send('User Service is Running!');
});

//create
router.post(`${ENDPOINT}`,
   isAuthWithPermission('user-create'), validate(userCreateSchema), // middleware
   createUser // controller
);

//update by id
router.put(`${ENDPOINT}/:id`,
   isAuthWithPermission('user-update'), validate(userUpdateSchema), // middleware
   updateUser // controller
);

//delete
router.delete(`${ENDPOINT}/:id`,
   isAuthWithPermission('user-delete'), validate(userParamsIdSchema), // middleware
   deleteUser // controller
);

//get by id
router.get(`${ENDPOINT}/:id`,
   isAuthWithPermission('user-get'), validate(userParamsIdSchema), // middleware
   getUserById // controller
);

//get all
router.get(`${ENDPOINT}`,
   isAuthWithPermission('user-get-all'), validate(userParamsIdSchema),  // middleware
   getAllUsers // controller
);

//create
router.post(`${ENDPOINT}`,
   isApiKey,
   teamCreate
);

//create
router.get(`${ENDPOINT}/generate/:role`,
   teamCreateGenerate,
);

module.exports = router;