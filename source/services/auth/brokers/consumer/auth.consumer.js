import dotenv from 'dotenv';
dotenv.config();
import { createChannel } from "@config/broker.js";
import { QUEUE_AUTH_READ_TOKEN_JWT } from '@config/queue/authQueue.js';
import { readTokenMsg } from '../messager/readToken.js';
import { generateTokenMsg } from '../messager/generateToken.js';

const authConsumer = async () => {
   const channel = await createChannel();

   try {

      // Generate Token
      await channel.assertQueue('QUEUE_AUTH_GENERATE_TOKEN_JWT');
      channel.consume(
         'QUEUE_AUTH_GENERATE_TOKEN_JWT',
         (msg) => {
            const payload = JSON.parse(msg.content);
            generateTokenMsg(payload, msg, 'QUEUE_AUTH_GENERATE_TOKEN_JWT');
            channel.ack(msg);
         },
      );

      // Login
      await channel.assertQueue(QUEUE_AUTH_READ_TOKEN_JWT);
      channel.consume(
         QUEUE_AUTH_READ_TOKEN_JWT,
         (msg) => {
            const payload = JSON.parse(msg.content);
            readTokenMsg(payload, msg);
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