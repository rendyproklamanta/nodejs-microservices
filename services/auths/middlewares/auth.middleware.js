require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { ADMIN, USER } = require('@config/constants');
const UserModel = require('@services/users/models/user.model');

// ! ==========================================
// ! Middleware
// ! ==========================================
const signInToken = (user) => {
   return jwt.sign(
      {
         _id: user._id,
         name: user.name,
         email: user.email,
         address: user.address,
         role: user.role,
         permission: user.permission,
      },
      process.env.JWT_SECRET,
      {
         // expiresIn: '365d',
         expiresIn: '5m',
      }
   );
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const tokenForVerify = (user) => {
   return jwt.sign(
      {
         _id: user._id,
         name: user.name,
         email: user.email,
         password: user.password,
      },
      process.env.JWT_SECRET_FOR_VERIFY,
      { expiresIn: '15m' }
   );
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuth = async (req, res, next) => {
   try {
      const result = await decodedToken(req, res);

      if (result.success) {
         next();
      } else {
         return res.status(401).json({
            success: false,
            message: result.message,
         });
      }
   } catch (err) {
      return res.status(401).json({
         success: false,
         message: 'You are not logged in',
      });
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isApiKey = async (req, res, next) => {
   try {
      const headerApiKey = req.header("x-api-key");
      const apiKey = process.env.API_KEY;
      if (apiKey === headerApiKey) {
         next();
      } else {
         res.status(401).send({
            message: 'API Key failed',
         });
      }
   } catch (err) {
      res.status(401).send({
         message: 'You are not logged in',
      });
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAdmin = async (req, res, next) => {
   const admin = await UserModel.findOne({ role: 'Admin' });
   if (admin) {
      next();
   } else {
      res.status(401).send({
         message: 'User is not Admin',
      });
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const decodedToken = async (req, res, next) => { // eslint-disable-line no-unused-vars
   try {
      let token;
      if (
         req.headers.authorization &&
         req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
         token = req.headers.authorization.split(" ")[1];
      } else {
         token = req.cookies.token;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded)
      if (decoded) {
         const res = {
            success: true,
            data: decoded,
         };
         return res;
      } else {
         const res = {
            success: false,
            message: decoded,
         };
         return res;
      }
   } catch (err) {
      const res = {
         success: false,
         message: err.message,
      };
      return res;
   }

};

// ! ==========================================
// ! Middleware
// ! ==========================================
const isAuthWithPermission = (access) => {
   return async (req, res, next) => {

      if (!access) {
         return res.status(401).json({ success: false, message: "No roles access defined" });
      }

      const result = await decodedToken(req, res);
      let hasAccess = false;

      if (result.success) {
         if (result.data?.permission?.includes('all')) {
            hasAccess = true;
         } else if (result.data?.permission?.includes(access)) {
            hasAccess = true;
         }

         if (hasAccess) {
            next(); // role is allowed, so continue on the next middleware
         } else {
            return res.status(401).json({
               success: false,
               message: "You don't have permission!"
            });
         }
      } else {
         return res.status(401).json({
            success: false,
            message: result.message,
         });
      }
   };
};

const isAuthWithRoles = (...permittedRoles) => {
   return async (req, res, next) => {

      if (permittedRoles.length === 0) res.status(401).json({ message: "You have no roles access" });

      const token = await isAuth(req, res);
      //console.log("🚀 ~ file: auth.js:136 ~ return ~ token:", token);
      let hasAccess = false;

      if (token?.role === ADMIN) {
         if (await UserModel.findById(token?._id)) {
            hasAccess = true;
         }
      }

      if (token?.role === USER) {
         if (await UserModel.findById(token?._id)) {
            hasAccess = true;
         }
      }

      if (hasAccess && permittedRoles.includes(token.role)) {
         next(); // role is allowed, so continue on the next middleware
      } else {
         res.status(401).json({ message: "You have no right access!" });
      }

   };
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const sendEmail = (body, res, message) => {
   const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE, //comment this line if you use custom server/domain
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },

      //comment out this one if you usi custom server/domain
      // tls: {
      //   rejectUnauthorized: false,
      // },
   });

   transporter.verify(function (err, success) { // eslint-disable-line no-unused-vars
      if (err) {
         console.log(err.message);
         res.status(403).send({
            message: `Error happen when verify ${err.message}`,
         });
      } else {
         console.log('Server is ready to take our messages');
      }
   });

   transporter.sendMail(body, (err, data) => { // eslint-disable-line no-unused-vars
      if (err) {
         res.status(403).send({
            message: `Error happen when sending email ${err.message}`,
         });
      } else {
         res.send({
            message: message,
         });
      }
   });
};

module.exports = {
   signInToken,
   tokenForVerify,
   decodedToken,
   isAuth,
   isApiKey,
   isAdmin,
   sendEmail,
   isAuthWithRoles,
   isAuthWithPermission,
};
