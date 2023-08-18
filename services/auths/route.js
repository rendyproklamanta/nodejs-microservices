const express = require('express');
const router = express.Router();
const {
   login,
   logout,
   verifyEmailAddress,
   forgetPassword,
   changePassword,
   resetPassword,
   tokenData,
   testCreateUserFromAuth,
} = require('@services/auths/controllers/auth.controller');

const { passwordVerificationLimit, emailVerificationLimit } = require('@config/others');
const { refreshToken } = require('@services/auths/middlewares/auth.middleware');
const { authCreateSchema } = require('@services/auths/middlewares/auth.validator');
const { validate } = require('@config/validate');
const { isAuth } = require('@config/authMiddleware');

const ENDPOINT = '/api/auths';

//root route
const defaultRes = (res) => {
   return res.status(200).send('Auth Service is Running!');
};
router.get(`${ENDPOINT}`, (req, res) => {
   return defaultRes(res);
});
router.get(`/`, (req, res) => {
   return defaultRes(res);
});

//verify email
router.post(`${ENDPOINT}/vemail/erify`, emailVerificationLimit, verifyEmailAddress);

//login a user
router.post(`${ENDPOINT}/login`, validate(authCreateSchema), login);

//logout a user
router.get(`${ENDPOINT}/logout`, logout);

//forget-password
router.put(`${ENDPOINT}/password/forget`, passwordVerificationLimit, forgetPassword);

//reset-password
router.put(`${ENDPOINT}/password/reset`, resetPassword);

//change password
router.post(`${ENDPOINT}/password/change`, changePassword);

//get
router.get(`${ENDPOINT}/token/check`,
   isAuth, // middleware
);

//get
router.get(`${ENDPOINT}/token/data`,
   isAuth, // middleware
   tokenData,
);

//get
router.get(`${ENDPOINT}/token/refresh`,
   refreshToken,
);

// get
router.get(`${ENDPOINT}/test/mq`,
   testCreateUserFromAuth,
);


module.exports = router;