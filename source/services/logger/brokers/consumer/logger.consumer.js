import { createChannel } from '@config/broker.js';

let channel;

const loggerConsumer = async () => {
   channel = await createChannel();

   try {


      console.log("[ Logger Service ] Waiting for messages broker...");
      return channel;

   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
};

export {
   loggerConsumer,
};
