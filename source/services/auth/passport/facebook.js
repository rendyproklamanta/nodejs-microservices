// config/passportFacebook.js
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { correlationId, sendQueue } from '@root/config/broker.js';
import { QUEUE_USER_CREATE, QUEUE_USER_GET } from '@root/config/queue/userQueue.js';

passport.use(new FacebookStrategy({
   clientID: 'YOUR_FACEBOOK_APP_ID',
   clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
   callbackURL: 'http://localhost:5000/auth/facebook/callback'
}, async (accessToken, refreshToken, profile, done) => {
   try {
      const replyId = correlationId(); // is unique

      let payload = {
         facebookId: profile.id,
      };

      let queue = QUEUE_USER_GET;
      let queueReply = QUEUE_USER_GET + replyId;
      let result = await sendQueue(queue, payload, replyId, queueReply);

      if (!result) {
         return done(null, false, { message: 'Invalid email or password' });
      }

      payload = {
         facebookId: profile.id,
         username: profile.displayName
      };

      queue = QUEUE_USER_CREATE;
      queueReply = QUEUE_USER_CREATE + replyId;
      result = await sendQueue(queue, payload, replyId, queueReply);

      return done(null, result);
   } catch (error) {
      return done(error);
   }
}));

export default passport;
