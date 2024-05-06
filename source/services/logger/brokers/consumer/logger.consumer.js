import { createChannel } from '@config/broker.js';
import { QUEUE_LOGGER_API, QUEUE_LOGGER_MAIL, QUEUE_LOGGER_USER } from '@root/config/queue/loggerQueue.js';
import { logApiMsg } from '../messager/logApi.js';
import { logEmailMsg } from '../messager/logEmail.js';
import { logUserMsg } from '../messager/logUser.js';

let channel;

const loggerConsumer = async () => {
   channel = await createChannel();

   try {
      // Consumer
      await channel.assertQueue(QUEUE_LOGGER_API);
      channel.consume(
         QUEUE_LOGGER_API,
         (msg) => {
            const payload = JSON.parse(msg.content);
            logApiMsg(payload, msg);
            channel.ack(msg);
         },
      );

      // Consumer
      await channel.assertQueue(QUEUE_LOGGER_MAIL);
      channel.consume(
         QUEUE_LOGGER_MAIL,
         (msg) => {
            const payload = JSON.parse(msg.content);
            logEmailMsg(payload, msg);
            channel.ack(msg);
         },
      );

      // Consumer
      await channel.assertQueue(QUEUE_LOGGER_USER);
      channel.consume(
         QUEUE_LOGGER_USER,
         (msg) => {
            const payload = JSON.parse(msg.content);
            logUserMsg(payload, msg);
            channel.ack(msg);
         },
      );

      console.log("[ Logger Service ] Waiting for messages broker...");
      return channel;

   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
};

export {
   loggerConsumer,
};
