import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { correlationId, sendQueue } from '@root/config/broker.js';
import { QUEUE_USER_LOGIN } from '@root/config/queue/userQueue.js';
import { generateTokenJwt } from '../utils/generateTokenJwt.js';
import { encrypt } from '@root/config/encryption.js';

passport.use(new LocalStrategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true
}, async (req, username, password, done) => {
   const code = 0;
   const rememberMe = req.body.rememberMe;

   try {

      // get user by email
      const payload = {
         username: username,
         password: password,
      };

      const replyId = correlationId();
      const queue = QUEUE_USER_LOGIN;
      const queueReply = QUEUE_USER_LOGIN + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      if (!result.success) {
         return done(null, result);
      }

      // Generate Token
      const token = {
         ...result.data,
      };

      delete token.password; // remove password for generate token

      const payloadAccessToken = {
         token,
         expiresIn: '1d'
      };

      const accessToken = await generateTokenJwt(payloadAccessToken);
      const remembermeDay = '30d';
      const expireDay = '1d';

      const payloadRefreshToken = {
         token,
         expiresIn: rememberMe === 1 ? remembermeDay : expireDay
      };

      const refreshToken = await generateTokenJwt(payloadRefreshToken);
      const encryptRefreshToken = encrypt(refreshToken);

      const resData = {
         message: 'Login success',
         code: code,
         success: true,
         data: {
            accessToken: accessToken.data,
            refreshToken: encryptRefreshToken,
            _id: result.data._id,
            role: result.data.role,
            name: result.data.name,
            username: result.data.username,
         },
      };

      return done(null, resData);

   } catch (error) {
      return done(error);
   }
})
);

export default passport;
