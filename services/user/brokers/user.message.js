const { signInToken } = require('@config/middlewares/auth.middleware');
const { sendReply } = require('@config/broker');
const UserModel = require('../models/user.model');
const errorCode = require('../errorCode.json');

const createUserMsg = async (data, msg) => {
   try {
      const isAdded = await UserModel.findOne({ username: data.username });
      if (isAdded) {
         const code = 200001;
         sendReply(msg, {
            code: code,
            success: false,
            message: `${data.username} is already added!`,
            error: errorCode[code],
         });
      } else {
         const scheme = new UserModel(data);
         const save = await scheme.save();
         const token = await signInToken(save);
         sendReply(msg, {
            code: 0,
            success: true,
            token: token.data,
            data: save
         });
      }
   } catch (error) {
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
   }
};

const updateUserMsg = async (data, msg) => {
   try {
      const res = await UserModel.findByIdAndUpdate(data.id, data);
      if (res) {
         sendReply(msg, {
            code: 0,
            success: true,
            data: res
         });
      } else {
         const code = 200002;
         sendReply(msg, {
            code: code,
            success: false,
            error: errorCode[code],
         });
      }
   } catch (error) {
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
   }
};

module.exports = {
   createUserMsg,
   updateUserMsg,
};
