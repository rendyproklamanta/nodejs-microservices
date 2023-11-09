import { Router } from 'express';
import { createUser, updateUser, deleteUser, getUserById, getAllUsers } from '@services/user/controllers/user.controller.js';
import { teamCreateGenerate, teamCreate } from '@services/user/controllers/team.controller.js';
import { validate } from '@config/validate.js';
import { userCreateSchema, userUpdateSchema, userParamsIdSchema } from '@services/user/middlewares/user.validator.js';
import { PERMISSION_USER_DELETE, PERMISSION_USER_GET, PERMISSION_USER_GET_ALL, PERMISSION_USER_UPDATE } from './constants/permission.js';
import isAuthWithPermissionMiddleware from '@root/config/middlewares/isAuthWithPermissionMiddleware.js';
import { isApiKey } from '../auth/middlewares/isApiKey.js';

const router = Router();
const ENDPOINT = '/api/users';

//root route
const defaultRes = (res) => {
   return res.status(200).send('User Service is Running!');
};
router.get(`${ENDPOINT}`, (_, res) => {
   return defaultRes(res);
});
router.get(`/`, (_, res) => {
   return defaultRes(res);
});

//create
router.post(`${ENDPOINT}`,
   validate(userCreateSchema), // middleware
   createUser // controller
);

//update by id
router.put(`${ENDPOINT}/:id`,
   isAuthWithPermissionMiddleware(PERMISSION_USER_UPDATE), // middleware
   validate(userUpdateSchema), // validator
   updateUser // controller
);

//delete
router.delete(`${ENDPOINT}/:id`,
   isAuthWithPermissionMiddleware(PERMISSION_USER_DELETE), // middleware
   validate(userParamsIdSchema), // validator
   deleteUser // controller
);

//get by id
router.get(`${ENDPOINT}/:id`,
   isAuthWithPermissionMiddleware(PERMISSION_USER_GET), // middleware
   validate(userParamsIdSchema), // validator
   getUserById // controller
);

//get all
router.get(`${ENDPOINT}`,
   isAuthWithPermissionMiddleware(PERMISSION_USER_GET_ALL), // middleware
   validate(userParamsIdSchema),  // validator
   getAllUsers // controller
);

//create
router.post(`${ENDPOINT}`,
   isApiKey,
   teamCreate
);

//create
router.get(`${ENDPOINT}/generate/:role`,
   isApiKey,
   teamCreateGenerate,
);

export default router;
