require('dotenv').config();
const UserModel = require('@services/user/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { signInToken, tokenForVerify, sendEmail, decodedToken } = require('../middlewares/auth.middleware');
const { roleUser } = require('@config/permission');
const { correlationId, optionsRabbitMq } = require('@config/others');
const { authConsumer } = require('../brokers/auth.consumer');
const { AUTH_LOGIN_MQ, USER_CREATE_MQ } = require('@config/constants');
const { sendQueue } = require('@config/broker');

let channel;

(async () => {
   channel = await authConsumer();
})();

const testCreateUserFromAuth = async (req, res) => {
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

   } catch (error) {
      console.log("🚀 ~ file: auth.controller.js:54 ~ testCreateMsg ~ error:", error);
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const login = async (req, res) => {
   try {
      let replyId = correlationId();
      const rememberme = req.body.rememberme;

      const payload = {
         ...req.body,
      };

      await channel.assertQueue(AUTH_LOGIN_MQ);
      channel.sendToQueue(AUTH_LOGIN_MQ,
         Buffer.from(JSON.stringify(payload)),
         { correlationId: replyId, replyTo: `AUTH_LOGIN_REP_${replyId}` }
      );

      await channel.assertQueue(`AUTH_LOGIN_REP_${replyId}`, optionsRabbitMq);
      channel.consume(`AUTH_LOGIN_REP_${replyId}`, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), { noAck: true });
      channel.responseEmitter.once(replyId, msg => {
         const data = JSON.parse(msg);
         const refreshToken = signInToken(data, rememberme ? '30d' : '1d');
         res.cookie("refreshToken", refreshToken, {
            maxAge: rememberme ? 2592000000 : 86400000, // 30d || 1d
            httpOnly: true,
            sameSite: true,
            secure: false
         });
         return res.send(JSON.parse(msg));
      });
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const logout = (req, res) => {
   const refreshToken = req.cookies.refreshToken;
   if (refreshToken) {
      res.clearCookie("refreshToken");
      return res.send({
         success: true,
         message: "User signed out",
      });
   } else {
      return res.status(500).send({
         success: false,
         message: "Already signed out",
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const tokenData = async (req, res, next) => { // eslint-disable-line no-unused-vars
   try {
      const decoded = await decodedToken(req, res);
      if (decoded) {
         return res.send({
            success: true,
            data: decoded.data,
         });
      } else {
         return res.status(401).send({
            success: false,
            message: decoded.message,
         });
      }
   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'You are not logged in',
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const verifyEmailAddress = async (req, res) => {
   const isAdded = await UserModel.findOne({ email: req.body.email });
   if (isAdded) {
      return res.status(403).send({
         success: true,
         message: 'This Email already Added!',
      });
   } else {
      const token = tokenForVerify(req.body);
      const body = {
         from: process.env.EMAIL_USER,
         to: `${req.body.email}`,
         //subject: 'Email Activation',
         subject: 'Verify Your Email',
         html: `<h2>Hello ${req.body.email}</h2>
               <p>Verify your email address to complete the signup and login into your <strong>KachaBazar</strong> account.</p>
               <p>This link will expire in <strong> 15 minute</strong>.</p>
               <p style="margin-bottom:20px;">Click this link for active your account</p>
               <a href=${process.env.STORE_URL}/user/email-verification/${token} style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Account</a>
               <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@kachabazar.com</p>
               <p style="margin-bottom:0px;">Thank you</p>
               <strong>Kachabazar Team</strong>
             `,
      };

      const message = 'Please check your email to verify!';
      sendEmail(body, res, message);
   }
};


// ! ==========================================
// ! Controller
// ! ==========================================
const forgetPassword = async (req, res) => {
   const isExist = await UserModel.findOne({ email: req.body.email });
   if (!isExist) {
      return res.status(404).send({
         success: false,
         message: 'User Not found with this email!',
      });
   } else {
      const token = tokenForVerify(isExist);
      const body = {
         from: process.env.EMAIL_USER,
         to: `${req.body.email}`,
         subject: 'Password Reset',
         html: `<h2>Hello ${req.body.email}</h2>
            <p>A request has been received to change the password for your <strong>Kachabazar</strong> account </p>
            <p>This link will expire in <strong> 15 minute</strong>.</p>
            <p style="margin-bottom:20px;">Click this link for reset your password</p>
            <a href=${process.env.STORE_URL}/user/forget-password/${token} style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>
            <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@kachabazar.com</p>
            <p style="margin-bottom:0px;">Thank you</p>
            <strong>Kachabazar Team</strong>
            `,
      };

      const message = 'Please check your email to reset password!';
      sendEmail(body, res, message);
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const resetPassword = async (req, res) => {
   const token = req.body.token;
   const { email } = jwt.decode(token);
   const user = await UserModel.findOne({ email: email });

   if (token) {
      jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => { // eslint-disable-line no-unused-vars
         if (err) {
            return res.status(500).send({
               success: false,
               message: 'Token expired, please try again!',
            });
         } else {
            user.password = bcrypt.hashSync(req.body.newPassword);
            user.save();
            return res.send({
               success: true,
               message: 'Your password changed successful, you can login now!',
            });
         }
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const changePassword = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user.password) {
         return res.send({
            success: true,
            message: 'For change password,You need to sign in with email & password!',
         });
      } else if (
         user &&
         bcrypt.compareSync(req.body.currentPassword, user.password)
      ) {
         user.password = bcrypt.hashSync(req.body.newPassword);
         await user.save();
         return res.send({
            success: true,
            message: 'Your password change successfully!',
         });
      } else {
         return res.status(401).send({
            success: false,
            message: 'Invalid email or current password!',
         });
      }
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const signUpWithProvider = async (req, res) => {
   try {
      const isAdded = await UserModel.findOne({ email: req.body.email });
      if (isAdded) {
         const token = signInToken(isAdded);
         return res.send({
            success: true,
            data: {
               token,
               _id: isAdded._id,
               name: isAdded.name,
               email: isAdded.email,
               address: isAdded.address,
               phone: isAdded.phone,
               image: isAdded.image,
            }
         });
      } else {
         const newUser = new UserModel({
            name: req.body.name,
            email: req.body.email,
            image: req.body.image,
         });

         const user = await newUser.save();
         const token = signInToken(user);
         return res.send({
            success: true,
            data: {
               token,
               _id: user._id,
               name: user.name,
               email: user.email,
               image: user.image,
            }
         });
      }
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

module.exports = {
   testCreateUserFromAuth,
   login,
   logout,
   tokenData,
   signUpWithProvider,
   verifyEmailAddress,
   forgetPassword,
   changePassword,
   resetPassword,
};
