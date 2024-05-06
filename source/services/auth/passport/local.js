import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { correlationId, sendQueue } from '@root/config/broker.js';
import { QUEUE_USER_LOGIN } from '@root/config/queue/userQueue.js';
import { generateTokenJwt } from '../utils/generateTokenJwt.js';
import { encrypt } from '@root/config/encryption.js';
import { QUEUE_LOGGER_USER } from '@root/config/queue/loggerQueue.js';

passport.use(new LocalStrategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true
}, async (req, username, password, done) => {

   const code = 0;
   const rememberMe = req.body.rememberMe;
   let queue = '';
   let queueReply = '';
   let result = '';
   let resLogin = '';
   let success = '';

   try {

      // get user payload
      const payload = {
         username: username,
         password: password,
      };

      const replyId = correlationId();
      queue = QUEUE_USER_LOGIN;
      queueReply = QUEUE_USER_LOGIN + replyId;
      resLogin = await sendQueue(queue, payload, replyId, queueReply);

      if (!resLogin.success) {
         success = false;
         result = resLogin;
      } else {

         // ----- Generate Access Token -----
         const token = {
            ...resLogin.data,
         };
         delete token.password; // remove password for generate token

         const refreshTokenRemembermeDay = '30d';
         const refreshTokenExpiryDay = '1d';
         const refreshTokenExpirySec = 86400; // refreshToken time in seconds
         const accessTokenExpirySec = 600; // accessToken time in seconds
         const remembermeSec = 31536000; // seconds

         const payloadAccessToken = {
            token,
            expiresIn: '1d'
         };

         const accessToken = await generateTokenJwt(payloadAccessToken);

         // ----- Generate Refresh Token -----
         const payloadRefreshToken = {
            token,
            expiresIn: rememberMe ? refreshTokenRemembermeDay : refreshTokenExpiryDay
         };

         const refreshToken = await generateTokenJwt(payloadRefreshToken);
         const encryptRefreshToken = encrypt(refreshToken);

         // ----- Result -----
         success = true;
         const resData = {
            message: 'Login success',
            code: code,
            success,
            data: {
               accessToken: accessToken.data,
               refreshToken: encryptRefreshToken,
               _id: resLogin?.data?._id,
               role: resLogin?.data?.role,
               name: resLogin?.data?.name,
               username: resLogin?.data?.username,
               accessTokenExpiry: accessTokenExpirySec,
               refreshTokenExpiry: rememberMe ? remembermeSec : refreshTokenExpirySec,
            },
         };

         result = resData;
      }

   } catch (error) {
      success = false;
      const errors = {
         success,
         message: error.message,
      };
      result = errors;
   }

   // ----- Send to logger -----
   const payloadLogUser = {
      action: 'USER_LOGGED_IN',
      userId: resLogin?.data?._id,
      success,
      data: result,
   };

   queue = QUEUE_LOGGER_USER;
   await sendQueue(queue, payloadLogUser);

   // ----- Return result -----
   return done(null, result);

})
);

export default passport;
