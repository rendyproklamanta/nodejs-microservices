import dotenv from 'dotenv';
dotenv.config();
import { correlationId, sendQueue } from '@config/broker.js';
import { encrypt } from '@config/encryption.js';
import { QUEUE_USER_CREATE, QUEUE_USER_GET, QUEUE_USER_LOGIN } from '@config/queue/userQueue.js';
import { authConsumer } from '../brokers/consumer/auth.consumer.js';
import getToken from '../../../config/utils/getToken.js';
import { generateTokenJwt } from '../utils/generateTokenJwt.js';
import { QUEUE_AUTH_READ_TOKEN_JWT } from '@root/config/queue/authQueue.js';
import responseCustom from '@root/config/utils/responseCustom.js';

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

// ! ==========================================
// ! Controller
// ! ==========================================
const getAuthInfo = async (req, res, next) => {
   try {
      const replyId = correlationId(); // is unique

      let payload;
      let queue;
      let queueReply;

      // Get token
      const token = await getToken(req);
      payload = token;
      queue = QUEUE_AUTH_READ_TOKEN_JWT;
      queueReply = QUEUE_AUTH_READ_TOKEN_JWT + replyId;
      const resToken = await sendQueue(queue, payload, replyId, queueReply);

      // Get user by ID
      payload = resToken.data._id;
      queue = QUEUE_USER_GET;
      queueReply = QUEUE_USER_GET + replyId;
      const resUser = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(resUser);
   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'Get Token Error',
      });
   }
};

export {
   testCreateUserFromAuth,
   logout,
   tokenData,
   getAuthInfo
};
