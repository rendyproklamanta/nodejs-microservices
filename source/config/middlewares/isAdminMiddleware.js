import { correlationId, sendQueue } from "../broker.js";
import { QUEUE_USER_ISADMIN } from "../queue/userQueue.js";

export const isAdminMiddleware = async (req, res, next) => {
   const payload = {
      req
   };

   const replyId = correlationId(); // is unique
   const queue = QUEUE_USER_ISADMIN;
   const queueReply = QUEUE_USER_ISADMIN + replyId;
   const result = await sendQueue(queue, payload, replyId, queueReply);

   if (result.success) {
      return next();
   } else {
      return res.send(result);
   }
};