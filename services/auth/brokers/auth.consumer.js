require('dotenv').config();
const { createChannel } = require("@config/broker");
const { AUTH_LOGIN_MQ, AUTH_PERMISSION_ACCESS_MQ, AUTH_PERMISSION_ROLE_MQ, AUTH_ISADMIN_MQ } = require('@config/constants');
const { loginMsg, isAuthWithPermissionMsg, isAuthWithRolesMsg, isAdminMsg, generateTokenMsg } = require('./auth.message');

let channel;

const authConsumer = async () => {
   channel = await createChannel();

   try {

      // Login
      await channel.assertQueue(AUTH_LOGIN_MQ);
      channel.consume(
         AUTH_LOGIN_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            loginMsg(data, msg);
            channel.ack(msg);
         },
      );

      // Generate Token
      await channel.assertQueue('AUTH_GENERATE_TOKEN_MQ');
      channel.consume(
         'AUTH_GENERATE_TOKEN_MQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            generateTokenMsg(data, msg, 'AUTH_GENERATE_TOKEN_MQ');
            channel.ack(msg);
         },
      );

      // Auth check
      await channel.assertQueue(AUTH_PERMISSION_ACCESS_MQ);
      channel.consume(
         AUTH_PERMISSION_ACCESS_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            isAuthWithPermissionMsg(data, msg);
            channel.ack(msg);
         },
      );

      // Auth check with roles
      await channel.assertQueue(AUTH_PERMISSION_ROLE_MQ);
      channel.consume(
         AUTH_PERMISSION_ROLE_MQ,
         (msg) => {
            const data = JSON.parse(msg.content);
            isAuthWithRolesMsg(data, msg);
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

      console.log("[ Auth Service ] Waiting for messages broker...");
      return channel;
   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }

};

module.exports = {
   authConsumer,
};