import dotenv from 'dotenv';
dotenv.config();
import { correlationId, sendQueue } from '@config/broker.js';
import { encrypt } from '@config/encryption.js';
import { QUEUE_USER_CREATE, QUEUE_USER_LOGIN } from '@config/queue/userQueue.js';
import { authConsumer } from '../brokers/consumer/auth.consumer.js';
import { getToken } from '../../../config/utils/getToken.js';
import { generateTokenJwt } from '../utils/generateTokenJwt.js';
import { QUEUE_AUTH_READ_TOKEN_JWT } from '@root/config/queue/authQueue.js';
import { responseCustom } from '@root/config/others.js';

(async () => {
   await authConsumer();
})();

const testCreateUserFromAuth = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique

      const payload = {
         ...req.body,
      };

      const queue = QUEUE_USER_CREATE;
      const queueReply = QUEUE_USER_CREATE + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (error) {
      console.log("🚀 ~ file: auth.controller.js:54 ~ testCreateMsg ~ error:", error);
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const login = async (req, res) => {
   const code = 0;

   try {

      const payload = {
         ...req.body,
      };

      const replyId = correlationId();
      const queue = QUEUE_USER_LOGIN;
      const queueReply = QUEUE_USER_LOGIN + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      if (!result.success) {
         return res.status(500).send(result);
      }

      // Generate TOken
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
      const remembermeTime = 2592000000; // in ms = 30d
      const expireDay = '1d';
      const expireTime = 86400000; // in ms = 1d

      const payloadRefreshToken = {
         token,
         expiresIn: payload.rememberme ? remembermeDay : expireDay
      };

      const refreshToken = await generateTokenJwt(payloadRefreshToken);
      const encryptRefreshToken = encrypt(refreshToken);

      res.cookie("refreshToken", encryptRefreshToken, {
         maxAge: payload.rememberme ? remembermeTime : expireTime,
         httpOnly: true,
         sameSite: true,
         secure: false
      });

      return res.send(responseCustom({
         message: 'Login success',
         code: code,
         success: true,
         data: {
            accessToken: accessToken.data,
            refreshToken: encryptRefreshToken,
            _id: result._id,
            role: result.role,
            name: result.name,
            username: result.username,
         },
      }));

   } catch (error) {
      return res.status(500).send(
         responseCustom({
            code: code,
            success: false,
            error
         })
      );
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const logout = (req, res) => {
   const refreshToken = req.cookies.refreshToken;
   if (refreshToken) {
      res.clearCookie("refreshToken");
      return res.send({
         success: true,
         message: "User signed out",
      });
   } else {
      return res.status(500).send({
         success: false,
         message: "Already signed out",
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const tokenData = async (req, res, next) => {
   try {
      const token = await getToken(req);
      const replyId = correlationId(); // is unique
      const payload = token;
      const queue = QUEUE_AUTH_READ_TOKEN_JWT;
      const queueReply = QUEUE_AUTH_READ_TOKEN_JWT + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);
   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'Get Token Error',
      });
   }
};

export {
   testCreateUserFromAuth,
   login,
   logout,
   tokenData,
};
