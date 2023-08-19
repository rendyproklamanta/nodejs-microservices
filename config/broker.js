const amqplib = require('amqplib');
let events = require('events');
const { optionsRabbitMq } = require('./others');

let channel, connection;
async function createChannel() {
   try {
      connection = await amqplib.connect(process.env.AMQP_SERVER, {
         timeout: 2000,
      });
      channel = await connection.createChannel();
      channel.responseEmitter = new events.EventEmitter();
      return channel;
   } catch (err) {
      console.log("🚀 ~ file: broker.js:12 ~ createChannel ~ err:", err);
   }

}
createChannel();

// const sendMessage = async (routingKey, message) => {
//    try {
//       await channel.assertQueue(routingKey);
//       channel.sendToQueue(routingKey, Buffer.from(JSON.stringify(message)));
//       console.log(`[<<=] Sent ${routingKey} :`, message);
//    } catch (err) {
//       console.warn(err);
//    }
// };

const sendMessage = async (queue, replyId, queueReply, payload) => {
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

// const getReply = async (queueReply, replyId) => {
//    console.log("🚀 ~ file: broker.js:75 ~ getReply ~ queueReply:", queueReply)
//    try {
//       await channel.assertQueue(queueReply, optionsRabbitMq);
//       channel.consume(queueReply, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });

//       const replyMsg = new Promise((resolve) => {
//          channel.responseEmitter.once(replyId, async msg => {
//             const data = JSON.parse(msg);
//             resolve(data);
//          });
//       });

//       const res = await replyMsg;

//       return res;

//    } catch (err) {
//       console.warn(err);
//    }

//    return true;
// };


module.exports = {
   createChannel,
   sendMessage,
   sendReply,
   // getReply
};