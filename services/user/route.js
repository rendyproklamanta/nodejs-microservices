const express = require('express');
const router = express.Router();
const {
   createUser,
   updateUser,
   deleteUser,
   getUserById,
   getAllUsers,
} = require('@services/user/controllers/user.controller');
const { teamCreateGenerate, teamCreate } = require('@services/user/controllers/team.controller');
const { validate } = require('@config/validate');
const { userCreateSchema, userUpdateSchema, userParamsIdSchema } = require('@services/user/middlewares/user.validator');
const { isAuthWithPermission } = require('@config/middlewares/auth.middleware');

const ENDPOINT = '/api/users';

//root route
const defaultRes = (res) => {
   return res.status(200).send('User Service is Running!');
};
router.get(`${ENDPOINT}`, (req, res) => {
   return defaultRes(res);
});
router.get(`/`, (req, res) => {
   return defaultRes(res);
});

//create
router.post(`${ENDPOINT}`,
   validate(userCreateSchema), // middleware
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
   // isApiKey,
   teamCreate
);

//create
router.get(`${ENDPOINT}/generate/:role`,
   teamCreateGenerate,
);

module.exports = router;
