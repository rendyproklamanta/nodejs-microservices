import machineId from "node-machine-uid";
import { correlationId, sendQueue } from "../broker.js";
import { QUEUE_AUTH_READ_TOKEN_JWT } from "../queue/authQueue.js";
import getToken from '@root/config/utils/getToken.js';

export const isAuthMiddleware = async (req, res, next) => {
   try {
      const token = await getToken(req);

      if (!token) {
         return res.status(401).send({
            success: false,
            message: 'No token provided',
         });
      }

      const replyId = correlationId(); // is unique
      const payload = token;
      const queue = QUEUE_AUTH_READ_TOKEN_JWT;
      const queueReply = QUEUE_AUTH_READ_TOKEN_JWT + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      if (result?.success) {
         const machineUid = await machineId()

         if (result?.data?.machineId === machineUid) {
            return next();
         } else {
            return res.status(401).send({
               success: false,
               message: 'Machine ID not match',
            });
         }
      } else {
         return res.status(401).send(result);
      }

   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'You are not logged in',
      });
   }
};