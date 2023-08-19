require('dotenv').config();
const { sendMessage } = require('@config/broker');
const { AUTH_GENERATE_TOKEN_MQ, AUTH_PERMISSION_ROLE_MQ, AUTH_PERMISSION_ACCESS_MQ, AUTH_ISADMIN_MQ } = require('./constants');
const { correlationId } = require('./others');

// ! ==========================================
// ! Middleware
// ! ==========================================
const getToken = async (req) => { // eslint-disable-line no-unused-vars
   try {
      if (
         req.headers.authorization &&
         req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
         return req.headers.authorization.split(" ")[1];
      } else if (req.cookies.token) {
         return req.cookies.token;
      } else {
         return false;
      }
   } catch (err) {
      return false;
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const signInToken = async (user, expiresIn) => {
   try {
      let replyId = correlationId();

      const payload = {
         user,
         expiresIn,
      };

      const queue = AUTH_GENERATE_TOKEN_MQ;
      const queueReply = AUTH_GENERATE_TOKEN_MQ + replyId;
      const result = await sendMessage(queue, replyId, queueReply, payload);

      return result;

   } catch (error) {
      console.log("🚀 ~ file: user.broker.js:86 ~ signInToken ~ error:", error);
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithRoles = (...permittedRoles) => {
   return async (req, res, next) => {

      if (permittedRoles.length === 0) res.status(401).send({ message: "You have no roles access" });

      const token = await getToken(req);

      if (!token) {
         return res.status(500).send({
            success: false,
            message: 'No token'
         });
      }

      const payload = {
         permittedRoles: permittedRoles,
         token: token,
      };

      const queue = AUTH_PERMISSION_ROLE_MQ;
      const result = await sendMessage(queue, payload);

      if (result.success) {
         return next();
      } else {
         return res.send(result);
      }

   };
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithPermission = (access) => {
   return async (req, res, next) => {

      if (!access) {
         return res.status(401).send({ success: false, message: "No roles access defined" });
      }

      const token = await getToken(req);

      if (!token) {
         return res.status(500).send({
            success: false,
            message: 'No token provided'
         });
      }

      let replyId = correlationId(); // is unique

      const payload = {
         access: access,
         token: token,
      };

      const queue = AUTH_PERMISSION_ACCESS_MQ;
      const queueReply = AUTH_PERMISSION_ACCESS_MQ + replyId;
      const result = await sendMessage(queue, replyId, queueReply, payload);

      if (result.success) {
         return next();
      } else {
         return res.send(result);
      }
   };
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuth = async (req, res, next) => { // eslint-disable-line no-unused-vars
   // try {
   //    const result = await decodedToken(req, res);

   //    if (result.success) {
   //       next();
   //    } else {
   //       return res.status(401).send({
   //          success: false,
   //          message: result.message,
   //       });
   //    }
   // } catch (err) {
   //    return res.status(401).send({
   //       success: false,
   //       message: 'You are not logged in',
   //    });
   // }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAdmin = async (req, res, next) => {
   const payload = {
      req
   };

   let replyId = correlationId(); // is unique

   const queue = AUTH_ISADMIN_MQ;
   const queueReply = AUTH_ISADMIN_MQ + replyId;
   const result = await sendMessage(queue, replyId, queueReply, payload);

   if (result.success) {
      return next();
   } else {
      return res.send(result);
   }
};

module.exports = {
   getToken,
   signInToken,
   isAuthWithRoles,
   isAuthWithPermission,
   isAuth,
   isAdmin
};
