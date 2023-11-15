import { Router } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { correlationId, sendQueue } from '@root/config/broker.js';
import { QUEUE_USER_GET } from '@root/config/queue/userQueue.js';

const router = Router();
const ENDPOINT = '/api/auths';

router.use(passport.initialize());

passport.use(
   new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
         const replyId = correlationId(); // is unique

         // get user by email
         const payload = {
            email: email,
         };
         const queue = QUEUE_USER_GET;
         const queueReply = QUEUE_USER_GET + replyId;
         const result = await sendQueue(queue, payload, replyId, queueReply);

         // If user not found or password is incorrect, return error
         if (!result || !bcrypt.compareSync(password, result.password)) {
            return done(null, false, { message: 'Invalid email or password' });
         }

         // User and password are correct, return user
         return done(null, result);
      } catch (error) {
         return done(error);
      }
   })
);

router.post(`${ENDPOINT}/login/local`, passport.authenticate('local', { session: false }),
   (req, res) => {
      // Generate JWT token
      const token = jwt.sign(req.user.toJSON(), 'your-secret-key');

      return res.json({ token });
   }
);