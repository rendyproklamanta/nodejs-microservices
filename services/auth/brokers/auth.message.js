require('dotenv').config();
const { sendReply } = require("@config/broker");
const UserModel = require('@services/user/models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signInToken } = require('../middlewares/auth.middleware');
const errorCode = require('../errorCode.json');

// ! ==========================================
// ! Middleware
// ! ==========================================
const decodedToken = async (token) => { // eslint-disable-line no-unused-vars
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
         const result = {
            code: 0,
            success: true,
            data: decoded,
         };
         return result;
      } else {
         const code = 100005;
         const result = {
            code: code,
            success: false,
            data: decoded,
            error: errorCode[code],
         };
         return result;
      }
   } catch (error) {
      const result = {
         code: 0,
         success: false,
         error,
      };
      return result;
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithPermissionMsg = async (data, msg) => {
   try {
      const res = await decodedToken(data.token);
      let hasAccess = false;

      if (res?.success) {

         if (res.data?.permission?.includes('all')) {
            hasAccess = true;
         } else if (res.data?.permission?.includes(data.access)) {
            hasAccess = true;
         }

         if (hasAccess) {
            sendReply(msg, {
               code: 0,
               success: true,
            });
         } else {
            const code = 100004;
            sendReply(msg, {
               code: code,
               success: false,
               error: errorCode[code],
            });
         }
      } else {
         sendReply(msg, {
            code: res.code,
            success: false,
            error: res.error,
         });
      }

   } catch (error) {
      console.log("🚀 ~ file: auth.broker.js:94 ~ isAuthWithPermission ~ error:", error);
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithRolesMsg = async (data, msg) => {
   try {
      const res = await decodedToken(data.token);
      let hasAccess = false;

      if (res?.success) {

         if (await UserModel.findById(res._id)) {
            hasAccess = true;
         }

         if (hasAccess && data.permittedRoles.includes(res.role)) {
            sendReply(msg, {
               code: 0,
               success: true,
            });
         } else {
            const code = 100004;
            sendReply(msg, {
               code: code,
               success: false,
               error: errorCode[code],
            });
         }
      } else {
         sendReply(msg, {
            code: 0,
            success: false,
            message: res.message,
         });
      }

   } catch (error) {
      console.log("🚀 ~ file: auth.message.js:125 ~ isAuthWithRolesMsg ~ error:", error)
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
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
         const code = 100001;
         sendReply(msg, {
            code: code,
            success: false,
            error: errorCode[code],
         });
      }

      if (result && result?.status === 'inactive') {
         const code = 100003;
         sendReply(msg, {
            code: code,
            success: false,
            error: errorCode[code],
         });
      }

      if (bcrypt.compareSync(password, result.password)) {
         const token = signInToken(result);
         sendReply(msg, {
            code: 0,
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
         const code = 100002;
         sendReply(msg, {
            success: false,
            error: errorCode[code],
         });
      }

   } catch (error) {
      sendReply(msg, {
         code: 0,
         success: false,
         error: error,
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