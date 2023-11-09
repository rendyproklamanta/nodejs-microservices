import dotenv from 'dotenv';
dotenv.config();
import { createChannel } from "@config/broker.js";
import { AUTH_ISADMIN_MQ, AUTH_READ_TOKEN_MQ } from '@config/queue/authQueue.js';
import { readTokenMsg } from '../messager/readToken.js';
import { isAdminMsg } from '../messager/isAdmin.js';
import { generateTokenMsg } from '../messager/generateToken.js';

const authConsumer = async () => {
   const channel = await createChannel();

   try {

      // Generate Token
      await channel.assertQueue('GENERATE_TOKEN_JWT_MQ');
      channel.consume(
         'GENERATE_TOKEN_JWT_MQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            generateTokenMsg(data, msg, 'GENERATE_TOKEN_JWT_MQ');
            channel.ack(msg);
         },
      );


      // Check isadmin
      await channel.assertQueue(AUTH_ISADMIN_MQ);
      channel.consume(
         AUTH_ISADMIN_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            isAdminMsg(data, msg);
            channel.ack(msg);
         },
      );

      // Login
      await channel.assertQueue(AUTH_READ_TOKEN_MQ);
      channel.consume(
         AUTH_READ_TOKEN_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            readTokenMsg(data, msg);
            channel.ack(msg);
         },
      );

      console.log("[ Auth Service ] Waiting for messages broker...");
      return channel;
   } catch (err) {
      console.log("🚀 ~ file: auth.consumer.js:51 ~ authConsumer ~ err:", err);
   }

};

export {
   authConsumer
};