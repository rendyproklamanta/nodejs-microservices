require('dotenv').config();
const { createChannel } = require('@config/broker');
const { correlationId } = require('@config/others');

let channel;

(async () => {
   channel = await createChannel();
})();

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

const isAuthWithRoles = (...permittedRoles) => {
   return async (req, res, next) => {
      let replyId = correlationId();

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

      const options = {
         autoDelete: true,
         arguments: {
            "x-message-ttl": 1000,
            "x-expires": 1000
         }
      };

      await channel.assertQueue(`AUTH_PERMISSION_ROLE_REQ`, options);
      channel.sendToQueue('AUTH_PERMISSION_ROLE_REQ',
         Buffer.from(JSON.stringify(payload)),
         { correlationId: replyId, replyTo: `AUTH_PERMISSION_ROLE_REP_${replyId}` }
      );

      await channel.assertQueue(`AUTH_PERMISSION_ROLE_REP_${replyId}`, options);
      channel.consume(`AUTH_PERMISSION_ROLE_REP_${replyId}`, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });
      channel.responseEmitter.once(replyId, msg => {
         const data = JSON.parse(msg);
         if (data.success) {
            return next();
         } else {
            return res.send(data);
         }
      });

   };
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithPermission = (access) => {
   return async (req, res, next) => {
      let replyId = correlationId();

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

      const payload = {
         access: access,
         token: token,
      };

      const options = {
         autoDelete: true,
         arguments: {
            "x-message-ttl": 1000,
            "x-expires": 1000
         }
      };

      await channel.assertQueue(`AUTH_PERMISSION_ACCESS_REQ`, options);
      channel.sendToQueue('AUTH_PERMISSION_ACCESS_REQ',
         Buffer.from(JSON.stringify(payload)),
         { correlationId: replyId, replyTo: `AUTH_PERMISSION_ACCESS_REP_${replyId}` }
      );

      await channel.assertQueue(`AUTH_PERMISSION_ACCESS_REP_${replyId}`, options);
      channel.consume(`AUTH_PERMISSION_ACCESS_REP_${replyId}`, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });
      channel.responseEmitter.once(replyId, msg => {
         const data = JSON.parse(msg);
         if (data.success) {
            return next();
         } else {
            return res.send(data);
         }
      });
   };
};

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
   let replyId = correlationId();

   const payload = {
      req
   };

   await channel.assertQueue(`AUTH_ISADMIN_REQ`);
   channel.sendToQueue('AUTH_ISADMIN_REQ',
      Buffer.from(JSON.stringify(payload)),
      { correlationId: replyId, replyTo: `AUTH_ISADMIN_REP_${replyId}` }
   );

   const options = {
      autoDelete: true,
      arguments: {
         "x-message-ttl": 1000,
         "x-expires": 1000
      }
   };

   await channel.assertQueue(`AUTH_ISADMIN_REP_${replyId}`, options);
   channel.consume(`AUTH_ISADMIN_REP_${replyId}`, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });
   channel.responseEmitter.once(replyId, msg => {
      const data = JSON.parse(msg);
      if (data.success) {
         next();
      } else {
         res.status(401).send({
            message: 'User is not Admin',
         });
      }
   });
};

module.exports = {
   getToken,
   isAuthWithRoles,
   isAuthWithPermission,
   isAuth,
   isAdmin
};
