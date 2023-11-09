import { correlationId, sendQueue } from "../broker.js";
import { AUTH_ISADMIN_MQ } from "../queue/authQueue.js";

export const isAdminMiddleware = async (req, res, next) => {
   const payload = {
      req
   };

   const replyId = correlationId(); // is unique
   const queue = AUTH_ISADMIN_MQ;
   const queueReply = AUTH_ISADMIN_MQ + replyId;
   const result = await sendQueue(queue, payload, replyId, queueReply);

   if (result.success) {
      return next();
   } else {
      return res.send(result);
   }
};