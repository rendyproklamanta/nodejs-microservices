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
            _id: resLogin?.data?._id
         };
         // delete token.password; // remove password for generate token

         const accessTokenExpiry = 10;
         const refreshTokenExpiry = 86400; // refreshToken time in seconds
         const refreshTokenRememberMe = 31536000; // seconds

         const payloadAccessToken = {
            token,
            expiresIn: accessTokenExpiry
         };

         const accessToken = await generateTokenJwt(payloadAccessToken);

         // ----- Generate Refresh Token -----
         const payloadRefreshToken = {
            token,
            expiresIn: rememberMe ? refreshTokenRememberMe : refreshTokenExpiry
         };

         const refreshToken = await generateTokenJwt(payloadRefreshToken);
         const encryptRefreshToken = encrypt(refreshToken.data);

         // ----- Result -----
         success = true;
         const resData = {
            message: 'Login success',
            code: code,
            success,
            data: {
               accessToken: accessToken.data,
               refreshToken: encryptRefreshToken,
               // _id: resLogin?.data?._id,
               // role: resLogin?.data?.role,
               // name: resLogin?.data?.name,
               // username: resLogin?.data?.username,
               accessTokenExpiry: accessTokenExpiry,
               refreshTokenExpiry: rememberMe ? refreshTokenRememberMe : refreshTokenExpiry,
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
