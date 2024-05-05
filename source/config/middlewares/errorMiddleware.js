import { sendQueue } from "../broker.js";
import { QUEUE_NOTIFICATION_ZEPTO } from "../queue/notificationQueue.js";

export const errorMiddleware = async (req, res, next) => {
   // Error handling middleware
   process.on('uncaughtException', async (err) => {

      // Send email to developers
      const payload = {
         from: 'your-email@gmail.com',
         to: 'developer1@example.com, developer2@example.com',
         subject: 'Uncaught exception occurred in the application',
         text: `An uncaught exception occurred in the application:\n\n${err.stack}`
      };

      const queue = QUEUE_NOTIFICATION_ZEPTO;
      await sendQueue(queue, payload);

      console.log("🚀 ~ process.on ~ mailPayload:", payload);
   });
};