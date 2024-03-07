import { Router } from 'express';
import { login, logout, tokenData, testCreateUserFromAuth } from '@services/auth/controllers/auth.controller.js';
import { authCreateSchema } from '@services/auth/middlewares/auth.validator.js';
import { validate } from '@config/validate.js';
import { isAuthMiddleware } from '@root/config/middlewares/isAuthMiddleware.js';
import { refreshToken } from '@services/auth/middlewares/refreshToken.js';

import '@services/auth/passport/local.js';
import '@services/auth/passport/google.js';
import '@services/auth/passport/facebook.js';

const router = Router();
const ENDPOINT = '/api/auths';

//root route
const defaultRes = (res) => {
   return res.status(200).send('Auth Service is Running!');
};
router.get(`${ENDPOINT}`, (_, res) => {
   return defaultRes(res);
});
router.get(`/`, (_, res) => {
   return defaultRes(res);
});


//login a user
router.post(`${ENDPOINT}/login`,
   validate(authCreateSchema), // middleware
   login // controller
);

//logout a user
router.get(`${ENDPOINT}/logout`,
   logout // controller
);

//get
router.get(`${ENDPOINT}/token/check`,
   isAuthMiddleware, // middleware
);

//get
router.get(`${ENDPOINT}/token/data`,
   isAuthMiddleware, // middleware
   tokenData, // controller
);

//get
router.get(`${ENDPOINT}/token/refresh`,
   refreshToken, // controller
);

// get
router.get(`${ENDPOINT}/test/mq`,
   testCreateUserFromAuth, // controller
);


export default router;