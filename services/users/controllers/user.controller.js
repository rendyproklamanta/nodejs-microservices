const bcrypt = require('bcryptjs');
const { signInToken } = require('../../auths/middlewares/auth.middleware');
const UserModel = require('../models/user.model');
const { roleUser } = require('../../../config/permission');
const amqp = require("amqplib");
const { sendMessage } = require('@config/broker');

let channel, connection;

(async () => {
   try {
      connection = await amqp.connect(process.env.AMQP_SERVER);
      channel = await connection.createChannel();

      await channel.assertQueue('USER_CREATE_MSG');
      await channel.consume(
         'USER_CREATE_MSG',
         (msg) => {
            if (msg) {
               const data = JSON.parse(msg.content);
               console.log("[=>>] Receive USER_CREATE_MSG :", data);
               createUserMsg(data);
               channel.ack(msg);
            }
         },
      );

      console.log("[ User Service ] Waiting for messages broker...");
   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }

})();

const createUserMsg = async (result) => {
   try {
      const data = {
         role: result.role,
         name: result.name,
         username: result.username,
         email: result.email,
         password: bcrypt.hashSync(result.password),
         permission: roleUser,
      };

      const isAdded = await UserModel.findOne({ username: data.username });
      if (isAdded) {
         await channel.assertQueue('USER_TOKEN_ERROR_MSG');
         await sendMessage('USER_TOKEN_ERROR_MSG', 'error');
      } else {
         const scheme = new UserModel(data);
         const save = await scheme.save();
         const token = signInToken(save);
         await channel.assertQueue('USER_TOKEN_SUCCESS_MSG');
         await sendMessage('USER_TOKEN_SUCCESS_MSG', token);
      }
   } catch (err) {
      console.log("🚀 ~ file: user.controller.js:58 ~ createUserMsg ~ err:", err);
   }
};

// async function connect() {
//    const oke = await SubscribeMessage('USER_CREATE_MSG');
//    console.log("🚀 ~ file: route.js:72 ~ router.get ~ oke:", oke)
//    return res.status(200).json({ msg: 'receive user service' });
// }
// connect();

// const setUserMQ = async (result) => {
//    console.log("🚀 ~ file: user.controller.js:27 ~ MQ_USER_TEST_REQ ~ data:", result);
//    const data = {
//       response: 'oke',
//    };
//    await channel.sendToQueue(
//       MQ_USER_TEST_RES,
//       Buffer.from(JSON.stringify(data))
//    );
// };

// const setUserMQ = async (result) => {
//    console.log("🚀 ~ file: user.controller.js:27 ~ MQ_USER_TEST_REQ ~ data:", result);
//    const data = {
//       response: 'oke',
//    };
//    await channel.sendToQueue(
//       MQ_USER_TEST_RES,
//       Buffer.from(JSON.stringify(data))
//    );
// };

// ! ==========================================
// ! Controller
// ! ==========================================
const createUser = async (req, res) => {
   try {
      const data = {
         role: req.body.role,
         name: req.body.name,
         username: req.body.username,
         password: bcrypt.hashSync(req.body.password),
         permission: roleUser,
      };

      const isAdded = await UserModel.findOne({ username: data.username });
      if (isAdded) {
         return res.status(403).send({
            success: false,
            message: `Username ${data.username} is already Added!`,
         });
      } else {
         const scheme = new UserModel(data);
         const save = await scheme.save();
         const token = signInToken(save);
         res.send({
            success: true,
            token,
            data
         });
      }
   } catch (err) {
      res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const updateUser = async (req, res) => {
   try {
      const data = {
         role: req.body.role,
         name: req.body.name,
         username: req.body.username,
         password: bcrypt.hashSync(req.body.password),
      };
      await UserModel.findByIdAndUpdate(req.params.id, data);
      return res.status(200).send({
         success: true,
         data,
      });
   } catch (err) {
      return res.status(404).send({
         success: false,
         message: 'Update user failed',
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const deleteUser = (req, res) => {
   UserModel.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
         return res.status(500).send({
            success: false,
            message: err.message,
         });
      } else {
         return res.status(200).send({
            success: true,
            message: 'User Deleted Successfully!',
         });
      }
   });
};

// ! ==========================================
// ! Controller
// ! ==========================================
const getAllUsers = async (req, res) => {
   try {
      const exclude = '-password'; // exclude property
      const data = await UserModel.find({}, exclude).sort({ _id: -1 });
      return res.status(200).send({
         success: true,
         data
      });

   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const getUserById = async (req, res) => {
   try {
      const data = await UserModel.findById(req.params.id);
      return res.status(200).send({
         success: true,
         data
      });
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

module.exports = {
   createUser,
   updateUser,
   deleteUser,
   getAllUsers,
   getUserById,

};
