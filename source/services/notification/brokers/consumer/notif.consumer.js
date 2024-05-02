import { createChannel } from '@config/broker.js';

let channel;

const userConsumer = async () => {
   channel = await createChannel();

   try {


      console.log("[ Notification Service ] Waiting for messages broker...");
      return channel;

   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
};

export {
   userConsumer,
};
