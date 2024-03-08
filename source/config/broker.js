import dotenv from 'dotenv';
dotenv.config();
import { connect } from 'amqplib';
import { EventEmitter } from 'events';

let channel, connection;
async function createChannel() {
   const username = process.env.AMQP_USER;
   const password = process.env.AMQP_PASSWORD;
   const hostname = process.env.AMQP_SERVER;
   const port = process.env.AMQP_PORT;

   const connectionString = `amqp://${username}:${password}@${hostname}:${port}`;

   try {
      connection = await connect(connectionString, {
         timeout: 10000,
      });
      channel = await connection.createChannel();
      channel.responseEmitter = new EventEmitter();

      return channel;
   } catch (err) {
      console.log("🚀 ~ file: broker.js:12 ~ createChannel ~ err:", err);
      process.exit(1);
   }
}
createChannel();

const optionsRabbitMq = {
   arguments: {
      "x-message-ttl": 1000,
      "x-expires": 1000
   }
};

const correlationId = () => {
   return new Date().getTime().toString() + Math.random().toString();
};

const sendQueueOnly = async (queue, payload) => {
   try {
      await channel.assertQueue(queue);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
      console.log(`[=>>] Sent ${queue} :`, payload);
   } catch (err) {
      console.warn(err);
   }
};

const sendQueue = async (queue, payload, replyId, queueReply) => {
   try {
      await channel.assertQueue(queue);
      channel.sendToQueue(queue,
         Buffer.from(JSON.stringify(payload)),
         { correlationId: replyId, replyTo: queueReply }
      );

      await channel.assertQueue(queueReply, optionsRabbitMq);
      channel.consume(queueReply, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });

      const replyMsg = new Promise((resolve) => {
         channel.responseEmitter.once(replyId, async msg => {
            const data = JSON.parse(msg);
            resolve(data);
         });

      });

      const res = await replyMsg;
      return res;

   } catch (err) {
      console.warn(err);
   }

   return true;

};

const sendReply = async (msg, payload) => {
   try {
      channel.sendToQueue(msg.properties.replyTo,
         Buffer.from(JSON.stringify(payload)), {
         correlationId: msg.properties.correlationId,
      });
   } catch (err) {
      console.warn(err);
   }
};

export {
   createChannel,
   sendQueue,
   sendQueueOnly,
   sendReply,
   correlationId,
};