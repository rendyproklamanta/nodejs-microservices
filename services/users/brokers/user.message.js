const { signInToken } = require('@config/authMiddleware');
const { sendReply } = require('@config/broker');
const UserModel = require('../models/user.model');

const createUserMsg = async (data, msg) => {
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
         const token = await signInToken(save);
         sendReply(msg, {
            success: true,
            token: token.data,
            data: save
         });
      }
   } catch (err) {
      sendReply(msg, {
         success: false,
         message: err.message,
      });
   }
};

const updateUserMsg = async (data, msg) => {
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
   createUserMsg,
   updateUserMsg,
};
