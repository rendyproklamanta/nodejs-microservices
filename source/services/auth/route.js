import { Router } from 'express';
import { login, logout, tokenData, testCreateUserFromAuth } from '@services/auth/controllers/auth.controller.js';
import { authCreateSchema } from '@services/auth/middlewares/auth.validator.js';
import { validate } from '@config/validate.js';
import { isAuthMiddleware } from '@root/config/middlewares/isAuthMiddleware.js';
import { refreshToken } from '@services/auth/middlewares/refreshToken.js';
import passportLocal from '@services/auth/passport/local.js';
import passportFacebook from '@services/auth/passport/facebook.js';

const router = Router();
const ENDPOINT = '/api/auths';

router.use(passportLocal.initialize());
router.use(passportFacebook.initialize());

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

//login passport local
router.post(`${ENDPOINT}/auth/local`,
   validate(authCreateSchema),
   passportLocal.authenticate('local', { session: false }),
   (req, res) => {
      const rememberMe = req.body.rememberMe;
      const remembermeTime = 2592000000; // in ms = 30d
      const expireTime = 86400000; // in ms = 1d
      res.cookie("refreshToken", req.user.data.refreshToken, {
         maxAge: rememberMe ? remembermeTime : expireTime,
         httpOnly: true,
         sameSite: true,
         secure: false
      });
      return res.send(req.user);
   }
);

// Facebook authentication route
router.get('/auth/facebook', passportFacebook.authenticate('facebook'));

// Facebook authentication callback route
router.get('/auth/facebook/callback', passportFacebook.authenticate('facebook', {
   successRedirect: '/',
   failureRedirect: '/login' // Redirect to login page on authentication failure
}));

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