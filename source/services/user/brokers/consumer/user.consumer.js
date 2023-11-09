import { createChannel } from '@config/broker.js';
import { USER_CREATE_MQ, USER_FIND_ONE_MQ, USER_LOGIN_MQ, USER_UPDATE_MQ } from '@root/config/queue/userQueue.js';
import { userCreateMsg } from '../messager/userCreate.js';
import { userUpdateMsg } from '../messager/userUpdate.js';
import { userLoginMsg } from '../messager/userLogin.js';
import { userFindOneMsg } from '../messager/userFindOne.js';

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
            userCreateMsg(data, msg);
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
            userUpdateMsg(data, msg);
            channel.ack(msg);
         },
      );

      // User login
      await channel.assertQueue(USER_LOGIN_MQ);
      channel.consume(
         USER_LOGIN_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            console.log("[=>>] Receive USER_LOGIN_MQ :", data);
            userLoginMsg(data, msg);
            channel.ack(msg);
         },
      );

      // User Find One
      await channel.assertQueue(USER_FIND_ONE_MQ);
      channel.consume(
         USER_FIND_ONE_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            console.log("[=>>] Receive USER_FIND_ONE_MQ :", data);
            userFindOneMsg(data, msg);
            channel.ack(msg);
         },
      );


      console.log("[ User Service ] Waiting for messages broker...");
      return channel;

   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
};

export {
   userConsumer,
};
