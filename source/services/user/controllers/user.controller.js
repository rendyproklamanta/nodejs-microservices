import bcryptjs from 'bcryptjs';
import UserModel from '../models/user.model.js';
import { correlationId, sendQueue } from '@config/broker.js';
import { userConsumer } from '../brokers/consumer/user.consumer.js';
import { permissionUserList } from '../constants/permission.js';
import { USER_CREATE_MQ, USER_DELETE_MQ, USER_UPDATE_MQ } from '@root/config/queue/userQueue.js';
import { responseCustom } from '@root/config/others.js';

(async () => {
   await userConsumer();
})();

// ! ==========================================
// ! Controller
// ! ==========================================
const createUser = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique

      const payload = {
         ...req.body,
      };

      const queue = USER_CREATE_MQ;
      const queueReply = USER_CREATE_MQ + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(responseCustom(result));
      
   } catch (err) {
      console.log("🚀 ~ file: user.controller.js:81 ~ createUser ~ err:", err);
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const updateUser = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique

      const payload = {
         ...req.body,
         id: req.params.id
      };

      const queue = USER_UPDATE_MQ;
      const queueReply = USER_UPDATE_MQ + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

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
const deleteUser = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.params.id;
      const queue = USER_DELETE_MQ;
      const queueReply = USER_DELETE_MQ + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (error) {
      return res.status(404).send({
         success: false,
         error: error.message,
      });
   }
   
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
      console.log("🚀 ~ file: user.controller.js:118 ~ getUserById ~ err:", err);
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

export {
   createUser,
   updateUser,
   getAllUsers,
   getUserById,
   deleteUser,
};
