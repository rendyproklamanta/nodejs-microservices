require('dotenv').config();
const { sendReply } = require("@config/broker");
const UserModel = require('@services/user/models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signInToken } = require('../middlewares/auth.middleware');

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
         error: err,
      };
      return result;
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithPermissionMsg = async (data, msg) => {
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
const isAuthWithRolesMsg = async (data, msg) => {
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
const isAdminMsg = async (data, msg) => {
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

// ! ==========================================
// ! Controller
// ! ==========================================
const loginMsg = async (data, msg) => {
   try {
      const result = await UserModel.findOne({ username: data.username });
      const password = data?.password;

      if (!result) {
         sendReply(msg, {
            success: false,
            message: 'User not found!',
         });
      }

      if (result && result?.status === 'inactive') {
         sendReply(msg, {
            success: false,
            message: 'User not active!',
         });
      }

      if (bcrypt.compareSync(password, result.password)) {
         const token = signInToken(result);
         sendReply(msg, {
            success: true,
            data: {
               token,
               _id: result._id,
               role: result.role,
               name: result.name,
               username: result.username,
            }
         });

      } else {
         sendReply(msg, {
            success: false,
            message: 'Invalid user or password!',
         });
      }

   } catch (err) {
      sendReply(msg, {
         success: false,
         message: err.message,
      });
   }
};

// ! ==========================================
// ! Constroller
// ! ==========================================
const generateTokenMsg = async (data, msg, queue) => {
   const token = jwt.sign(
      {
         _id: data.user._id,
         name: data.user.name,
         email: data.user.email,
         address: data.user.address,
         role: data.user.role,
         permission: data.user.permission,
      },
      process.env.JWT_SECRET,
      {
         // expiresIn: '365d',
         expiresIn: data.expiresIn ?? '1m',
      }
   );

   sendReply(msg, {
      queue: queue,
      success: true,
      data: token,
   });
};

module.exports = {
   isAdminMsg,
   isAuthWithPermissionMsg,
   isAuthWithRolesMsg,
   loginMsg,
   generateTokenMsg,
};