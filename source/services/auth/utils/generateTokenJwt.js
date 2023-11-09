import { correlationId, sendQueue } from "@root/config/broker.js";
import { GENERATE_TOKEN_JWT_MQ } from "@root/config/queue/authQueue.js";

export const generateTokenJwt = async (payload) => {
   try {
      const replyId = correlationId();
      const queue = GENERATE_TOKEN_JWT_MQ;
      const queueReply = GENERATE_TOKEN_JWT_MQ + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return result;

   } catch (error) {
      console.log("🚀 ~ file: generateTokenJwt.js:21 ~ generateTokenJwt ~ error:", error);
   }
};