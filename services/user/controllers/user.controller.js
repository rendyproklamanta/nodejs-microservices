const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const { roleUser } = require('../../../config/permission');
const { correlationId } = require('@config/others');
const { userConsumer } = require('../brokers/user.consumer');
const { USER_CREATE_MQ, USER_UPDATE_MQ } = require('@config/constants');
const { sendQueue } = require('@config/broker');

let channel; // eslint-disable-line no-unused-vars

(async () => {
   channel = await userConsumer();
})();


// ! ==========================================
// ! Controller
// ! ==========================================
const createUser = async (req, res) => {
   try {
      let replyId = correlationId(); // is unique

      const payload = {
         ...req.body,
         password: bcrypt.hashSync(req.body.password),
         permission: roleUser,
      };

      const queue = USER_CREATE_MQ;
      const queueReply = USER_CREATE_MQ + replyId;
      const result = await sendQueue(queue, replyId, queueReply, payload);

      return res.send(result);

   } catch (err) {
      console.log("🚀 ~ file: user.controller.js:81 ~ createUser ~ err:", err);
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const updateUser = async (req, res) => {
   try {
      let replyId = correlationId(); // is unique

      const payload = {
         ...req.body,
         password: bcrypt.hashSync(req.body.password),
         permission: roleUser,
         id: req.params.id
      };

      const queue = USER_UPDATE_MQ;
      const queueReply = USER_UPDATE_MQ + replyId;
      const result = await sendQueue(queue, replyId, queueReply, payload);

      return res.send(result);

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
