import { correlationId, sendQueue } from "@root/config/broker.js";
import { QUEUE_AUTH_GENERATE_TOKEN_JWT } from "@root/config/queue/authQueue.js";

export const generateTokenJwt = async (payload) => {
   try {
      const replyId = correlationId();
      const queue = QUEUE_AUTH_GENERATE_TOKEN_JWT;
      const queueReply = QUEUE_AUTH_GENERATE_TOKEN_JWT + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return result;

   } catch (error) {
      console.log("🚀 ~ file: generateTokenJwt.js:21 ~ generateTokenJwt ~ error:", error);
   }
};