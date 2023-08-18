const { signInToken } = require('../../auths/middlewares/auth.middleware');
const UserModel = require('../models/user.model');
const { createChannel, sendReply } = require('@config/broker');

let channel;

const userBroker = async () => {
   channel = await createChannel();

   try {

      // User Create
      await channel.assertQueue('USER_CREATE_REQ');
      channel.consume(
         'USER_CREATE_REQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            console.log("[=>>] Receive USER_CREATE_REQ :", data);
            createUser(data, msg);
            channel.ack(msg);
         },
      );

      // User Update
      await channel.assertQueue('USER_UPDATE_REQ');
      channel.consume(
         'USER_UPDATE_REQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            console.log("[=>>] Receive USER_UPDATE_REQ :", data);
            updateUser(data, msg);
            channel.ack(msg);
         },
      );

      console.log("[ User Service ] Waiting for messages broker...");
      return channel;

   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }
};

const createUser = async (data, msg) => {
   try {
      const isAdded = await UserModel.findOne({ username: data.username });
      if (isAdded) {
         sendReply(msg, {
            success: false,
            message: `${data.username} is already added!`,
         });
      } else {
         const scheme = new UserModel(data);
         const save = await scheme.save();
         const token = signInToken(save);
         sendReply(msg, {
            success: true,
            token,
            data
         });
      }
   } catch (err) {
      sendReply(msg, {
         success: false,
         message: err.message,
      });
   }
};

const updateUser = async (data, msg) => {
   try {
      const res = await UserModel.findByIdAndUpdate(data.id, data);
      if (res) {
         sendReply(msg, {
            success: true,
            data: res
         });
      } else {
         sendReply(msg, {
            success: false,
            data: res
         });
      }
   } catch (err) {
      sendReply(msg, {
         success: false,
         message: err.message,
      });
   }
};

module.exports = {
   userBroker,
   createUser,
   updateUser,
};
