import { createChannel } from '@config/broker.js';
import { sendEmailZeptoMsg } from '../messager/sendEmailZepto.js';
import { QUEUE_NOTIFICATION_ZEPTO } from '@root/config/queue/notificationQueue.js';

let channel;

const userConsumer = async () => {
   channel = await createChannel();

   try {
      // Generate Token
      await channel.assertQueue(QUEUE_NOTIFICATION_ZEPTO);
      channel.consume(
         QUEUE_NOTIFICATION_ZEPTO,
         (msg) => {
            const payload = JSON.parse(msg.content);
            sendEmailZeptoMsg(payload, msg, QUEUE_NOTIFICATION_ZEPTO);
            channel.ack(msg);
         },
      );

      console.log("[ Notification Service ] Waiting for messages broker...");
      return channel;

   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
};

export {
   userConsumer,
};
