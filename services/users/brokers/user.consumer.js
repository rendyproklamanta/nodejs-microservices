const { createChannel } = require('@config/broker');
const { USER_UPDATE_MQ, USER_CREATE_MQ } = require('@config/constants');
const { createUserMsg, updateUserMsg } = require('./user.message');

let channel;

const userConsumer = async () => {
   channel = await createChannel();

   try {

      // User Create
      await channel.assertQueue(USER_CREATE_MQ);
      channel.consume(
         USER_CREATE_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            console.log("[=>>] Receive USER_CREATE_MQ :", data);
            createUserMsg(data, msg);
            channel.ack(msg);
         },
      );

      // User Update
      await channel.assertQueue(USER_UPDATE_MQ);
      channel.consume(
         USER_UPDATE_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            console.log("[=>>] Receive USER_UPDATE_MQ :", data);
            updateUserMsg(data, msg);
            channel.ack(msg);
         },
      );

      console.log("[ User Service ] Waiting for messages broker...");
      return channel;

   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
};

module.exports = {
   userConsumer,
};
