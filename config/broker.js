const amqplib = require('amqplib');
let events = require('events');

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

const sendMessage = async (routingKey, message) => {
   try {
      await channel.assertQueue(routingKey);
      channel.sendToQueue(routingKey, Buffer.from(JSON.stringify(message)));
      console.log(`[<<=] Sent ${routingKey} :`, message);
   } catch (err) {
      console.warn(err);
   }
};

const sendReply = async (msg, payload) => {
   try {
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(payload)), {
         correlationId: msg.properties.correlationId
      });
   } catch (err) {
      console.warn(err);
   }
};


module.exports = {
   createChannel,
   sendMessage,
   sendReply
};