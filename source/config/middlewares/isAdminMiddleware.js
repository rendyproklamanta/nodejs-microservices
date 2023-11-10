import { correlationId, sendQueue } from "../broker.js";
import { QUEUE_AUTH_ISADMIN } from "../queue/authQueue.js";

export const isAdminMiddleware = async (req, res, next) => {
   const payload = {
      req
   };

   const replyId = correlationId(); // is unique
   const queue = QUEUE_AUTH_ISADMIN;
   const queueReply = QUEUE_AUTH_ISADMIN + replyId;
   const result = await sendQueue(queue, payload, replyId, queueReply);

   if (result.success) {
      return next();
   } else {
      return res.send(result);
   }
};