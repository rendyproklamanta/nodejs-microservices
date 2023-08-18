require('dotenv').config();
const { createChannel, sendReply } = require("@config/broker");
const UserModel = require('@services/users/models/user.model');
const jwt = require('jsonwebtoken');

let channel;

const authBroker = async () => {
   channel = await createChannel();

   const options = {
      autoDelete: true,
      arguments: {
         "x-message-ttl": 1000,
         "x-expires": 1000
      }
   };

   try {
      // Auth decode token
      await channel.assertQueue('AUTH_DECODED_TOKEN_REQ', options);
      channel.consume(
         'AUTH_DECODED_TOKEN_REQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            decodedToken(data);
            channel.ack(msg);
         },
      );

      // Auth check
      await channel.assertQueue('AUTH_PERMISSION_ACCESS_REQ', options);
      channel.consume(
         'AUTH_PERMISSION_ACCESS_REQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            isAuthWithPermission(data, msg);
            channel.ack(msg);
         },
      );

      // Auth check with roles
      await channel.assertQueue('AUTH_PERMISSION_ROLE_REQ', options);
      channel.consume(
         'AUTH_PERMISSION_ROLE_REQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            isAuthWithRoles(data, msg);
            channel.ack(msg);
         },
      );

      // Check isadmin
      await channel.assertQueue('AUTH_ISADMIN_REQ');
      channel.consume(
         'AUTH_ISADMIN_REQ',
         (msg) => {
            const data = JSON.parse(msg.content);
            isAdmin(data, msg);
            channel.ack(msg);
         },
      );

      console.log("[ Auth Service ] Waiting for messages broker...");
      return channel;
   } catch (err) {
      console.log("🚀 ~ file: auth.controller.js:18 ~ connect ~ err:", err);
   }

};

// ! ==========================================
// ! Middleware
// ! ==========================================
const decodedToken = async (token) => { // eslint-disable-line no-unused-vars
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
         const result = {
            success: true,
            data: decoded,
         };
         return result;
      } else {
         const result = {
            success: false,
            data: decoded,
         };
         return result;
      }
   } catch (err) {
      const result = {
         success: false,
         message: err.message,
      };
      return result;
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithPermission = async (data, msg) => {
   try {
      const result = await decodedToken(data.token);
      let hasAccess = false;

      if (result?.success) {

         if (result.data?.permission?.includes('all')) {
            hasAccess = true;
         } else if (result.data?.permission?.includes(data.access)) {
            hasAccess = true;
         }

         if (hasAccess) {
            sendReply(msg, {
               success: true,
               message: "You have permission"
            });
         } else {
            sendReply(msg, {
               success: false,
               message: "You don't have permission"
            });
         }
      } else {
         sendReply(msg, {
            success: false,
            message: result.message,
         });
      }

   } catch (error) {
      console.log("🚀 ~ file: auth.broker.js:94 ~ isAuthWithPermission ~ error:", error);
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithRoles = async (data, msg) => {
   try {
      const result = await decodedToken(data.token);
      let hasAccess = false;

      if (result?.success) {

         if (await UserModel.findById(result._id)) {
            hasAccess = true;
         }

         if (hasAccess && data.permittedRoles.includes(result.role)) {
            sendReply(msg, {
               success: true,
               message: "You have permission"
            });
         } else {
            sendReply(msg, {
               success: false,
               message: "You don't have permission"
            });
         }
      } else {
         sendReply(msg, {
            success: false,
            message: result.message,
         });
      }


   } catch (error) {
      console.log("🚀 ~ file: auth.broker.js:94 ~ isAuthWithPermission ~ error:", error);
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAdmin = async (data, msg) => {
   const admin = await UserModel.findOne({ role: 'Admin' });
   if (admin) {
      sendReply(msg, {
         success: true,
      });
   } else {
      sendReply(msg, {
         success: false,
         message: "User is not admin"
      });
   }
};

module.exports = {
   authBroker,
   isAdmin,
   isAuthWithPermission,
   isAuthWithRoles,
};