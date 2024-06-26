import { Router } from 'express';
import { logout, tokenData, testCreateUserFromAuth, getAuthInfo } from '@services/auth/controllers/auth.controller.js';
import { authCreateSchema } from '@services/auth/middlewares/auth.validator.js';
import { validate } from '@config/validate.js';
import { isAuthMiddleware } from '@root/config/middlewares/isAuthMiddleware.js';
import { refreshToken } from '@services/auth/middlewares/refreshToken.js';
import passportLocal from '@services/auth/passport/local.js';
import passportFacebook from '@services/auth/passport/facebook.js';
import { authConsumer } from './brokers/consumer/auth.consumer.js';

(async () => {
   await authConsumer(); // Start Queue Consumer
})();

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

//login passport local
router.post(`${ENDPOINT}/method/local`,
   validate(authCreateSchema),
   passportLocal.authenticate('local', { session: false }),
   (req, res) => {
      if (req.user.success) {
         // res.cookie("refreshToken", req.user.data.refreshToken, {
         //    maxAge: req.user.data.refreshTokenExpiry * 1000, // convert to ms
         //    httpOnly: true,
         //    sameSite: true,
         //    secure: false
         // });
         // res.cookie("accessToken", req.user.data.accessToken, {
         //    maxAge: req.user.data.accessTokenExpiry * 1000, // convert to ms
         //    httpOnly: true,
         //    sameSite: true,
         //    secure: false
         // });
      } else {
         res.clearCookie("refreshToken");
         res.clearCookie("accessToken");
      }

      // delete response data for security purpose
      //delete req.user.data;

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
router.post(`${ENDPOINT}/token/refresh`,
   refreshToken, // controller
);

// get
router.get(`${ENDPOINT}/test/mq`,
   testCreateUserFromAuth, // controller
);

// get
router.get(`${ENDPOINT}/info`,
   isAuthMiddleware, // middleware
   getAuthInfo, // controller
);


export default router;