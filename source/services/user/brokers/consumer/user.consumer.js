import { createChannel } from '@config/broker.js';
import { QUEUE_USER_CREATE, QUEUE_USER_GET, QUEUE_USER_GET_ALL, QUEUE_USER_LOGIN, QUEUE_USER_UPDATE } from '@root/config/queue/userQueue.js';
import { userCreateMsg } from '../messager/userCreate.js';
import { userUpdateMsg } from '../messager/userUpdate.js';
import { userLoginMsg } from '../messager/userLogin.js';
import { userGetMsg } from '../messager/userGet.js';
import { userGetAllMsg } from '../messager/userGetAll.js';

let channel;

const userConsumer = async () => {
   channel = await createChannel();

   try {

      // User Create
      await channel.assertQueue(QUEUE_USER_CREATE);
      channel.consume(
         QUEUE_USER_CREATE,
         (msg) => {
            const payload = JSON.parse(msg.content);
            console.log("[=>>] Receive QUEUE_USER_CREATE :", payload);
            userCreateMsg(payload, msg);
            channel.ack(msg);
         },
      );

      // User Update
      await channel.assertQueue(QUEUE_USER_UPDATE);
      channel.consume(
         QUEUE_USER_UPDATE,
         (msg) => {
            const payload = JSON.parse(msg.content);
            console.log("[=>>] Receive QUEUE_USER_UPDATE :", payload);
            userUpdateMsg(payload, msg);
            channel.ack(msg);
         },
      );

      // User login
      await channel.assertQueue(QUEUE_USER_LOGIN);
      channel.consume(
         QUEUE_USER_LOGIN,
         (msg) => {
            const payload = JSON.parse(msg.content);
            console.log("[=>>] Receive QUEUE_USER_LOGIN :", payload);
            userLoginMsg(payload, msg);
            channel.ack(msg);
         },
      );

      // User Get One
      await channel.assertQueue(QUEUE_USER_GET);
      channel.consume(
         QUEUE_USER_GET,
         (msg) => {
            const payload = JSON.parse(msg.content);
            console.log("[=>>] Receive QUEUE_USER_GET :", payload);
            userGetMsg(payload, msg);
            channel.ack(msg);
         },
      );

      // User Get All
      await channel.assertQueue(QUEUE_USER_GET_ALL);
      channel.consume(
         QUEUE_USER_GET_ALL,
         (msg) => {
            const payload = JSON.parse(msg.content);
            console.log("[=>>] Receive QUEUE_USER_GET_ALL :", payload);
            userGetAllMsg(payload, msg);
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
