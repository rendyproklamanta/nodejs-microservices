const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const { roleUser } = require('../../../config/permission');
const { correlationId } = require('@config/others');
const { userBroker } = require('../brokers/user.broker');

let channel;

(async () => {
   channel = await userBroker();
})();


// ! ==========================================
// ! Controller
// ! ==========================================
const createUser = async (req, res) => {

   try {
      let replyId = correlationId();

      const payload = {
         ...req.body,
         password: bcrypt.hashSync(req.body.password),
         permission: roleUser,
      };
      await channel.assertQueue(`USER_UPDATE_REQ`);
      channel.sendToQueue('USER_CREATE_REQ',
         Buffer.from(JSON.stringify(payload)),
         { correlationId: replyId, replyTo: `USER_CREATE_REP_${replyId}` }
      );

      const options = {
         autoDelete: true,
         arguments: {
            "x-message-ttl": 1000,
            "x-expires": 1000
         }
      };

      await channel.assertQueue(`USER_CREATE_REP_${replyId}`, options);
      channel.consume(`USER_CREATE_REP_${replyId}`, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });
      channel.responseEmitter.once(replyId, msg => {
         return res.send(JSON.parse(msg));
      });

   } catch (err) {
      console.log("🚀 ~ file: user.controller.js:81 ~ createUser ~ err:", err);
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const updateUser = async (req, res) => {
   try {
      let replyId = correlationId();

      const payload = {
         ...req.body,
         password: bcrypt.hashSync(req.body.password),
         permission: roleUser,
         id: req.params.id
      };

      await channel.assertQueue(`USER_UPDATE_REQ`);
      channel.sendToQueue('USER_UPDATE_REQ',
         Buffer.from(JSON.stringify(payload)),
         { correlationId: replyId, replyTo: `USER_UPDATE_REP_${replyId}` }
      );

      await channel.assertQueue(`USER_UPDATE_REP_${replyId}`);
      channel.consume(`USER_UPDATE_REP_${replyId}`, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });
      channel.responseEmitter.once(replyId, msg => {
         return res.send(JSON.parse(msg));
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
