import { Router } from 'express';
import { createUser, updateUser, deleteUser, getUserById, getAllUsers, forgetPassword, resetPassword, changePassword, verifyEmailAddress, generateDummy } from '@services/user/controllers/user.controller.js';
import { teamCreateGenerate, teamCreate } from '@services/user/controllers/team.controller.js';
import { validate } from '@config/validate.js';
import { userCreateSchema, userUpdateSchema, userParamsIdSchema } from '@services/user/middlewares/user.validator.js';
import { PERMISSION_USER_DELETE, PERMISSION_USER_GET, PERMISSION_USER_GET_ALL, PERMISSION_USER_UPDATE } from '@services/user/constants/roles.js';
import isAuthWithPermissionMiddleware from '@root/config/middlewares/isAuthWithPermissionMiddleware.js';
import { isApiKey } from '@config/middlewares/isApiKey.js';
import emailVerificationLimit from '@root/services/auth/utils/emailVerificationLimit.js';
import passwordVerificationLimit from '@root/services/auth/utils/passwordVerificationLimit.js';
import { isAuthMiddleware } from '@root/config/middlewares/isAuthMiddleware.js';
import { userConsumer } from './brokers/consumer/user.consumer.js';

(async () => {
   await userConsumer();
})();

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
   // isAuthWithPermissionMiddleware(PERMISSION_USER_GET), // middleware
   validate(userParamsIdSchema), // validator
   getUserById // controller
);

//get all
router.get(`${ENDPOINT}/all`,
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

//verify email
router.post(`${ENDPOINT}/email/verify`,
   emailVerificationLimit, // middleware
   verifyEmailAddress // controller
);

//forget-password
router.put(`${ENDPOINT}/password/forget`,
   passwordVerificationLimit, // middleware
   forgetPassword // controller
);

//reset-password
router.put(`${ENDPOINT}/password/reset`,
   resetPassword // controller
);

//change password
router.post(`${ENDPOINT}/password/change`,
   changePassword // controller
);

//get all
router.get(`${ENDPOINT}/generate/dummy/table`,
   isAuthMiddleware, // middleware
   generateDummy // controller
);

router.post(`${ENDPOINT}/generate/dummy/:type`,
   isAuthMiddleware, // middleware
   generateDummy // controller
);

export default router;
