const amqplib = require('amqplib');

let channel, connection;
async function connect() {
   try {
      connection = await amqplib.connect(process.env.AMQP_SERVER);
      channel = await connection.createChannel();
      return channel;
   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
}
connect();

const sendMessage = async (routingKey, message) => {
   try {
      await channel.assertQueue(routingKey);
      channel.sendToQueue(routingKey, Buffer.from(JSON.stringify(message)));
      console.log(`[<<=] Sent ${routingKey} :`, message);
   } catch (err) {
      console.warn(err);
   }
};

module.exports = {
   sendMessage,
};