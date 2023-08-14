require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { signInToken, tokenForVerify, sendEmail, decodedToken } = require('../middlewares/auth.middleware');
const User = require('../../users/models/user.model');

// ! ==========================================
// ! Controller
// ! ==========================================
const login = async (req, res) => {
   try {
      const role = req.body.role;
      const username = req.body.username;
      const data = await User.findOne({ username: username });
      const password = data?.password;

      if (!data && !password) {
         return res.status(401).send({
            success: false,
            message: 'Invalid user or password!',
         });
      }

      if (data && data?.status === 'inactive') {
         return res.status(401).send({
            success: false,
            message: 'Account not active!',
         });
      }

      if (bcrypt.compareSync(req.body.password, password)) {
         const token = signInToken(data);

         // res.cookie("token", token, {
         //    maxAge: 2147483647,
         //    httpOnly: true,
         //    sameSite: true,
         //    secure: false
         // });

         return res.status(200).send({
            success: true,
            data: {
               token,
               _id: data._id,
               role: role,
               name: data.name,
               username: data.username,
            }
         });

      } else {
         return res.status(401).send({
            success: false,
            message: 'Invalid user or password!',
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
const logout = (req, res) => {
   res.clearCookie("token");
   return res.json({
      success: true,
      message: "User signed out",
   });
};

// ! ==========================================
// ! Controller
// ! ==========================================
const tokenData = async (req, res, next) => { // eslint-disable-line no-unused-vars
   try {
      const decoded = await decodedToken(req, res);
      if (decoded) {
         return res.json({
            success: true,
            data: decoded.data,
         });
      } else {
         return res.status(401).json({
            success: false,
            message: decoded.message,
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
// ! Controller
// ! ==========================================
const verifyEmailAddress = async (req, res) => {
   const isAdded = await User.findOne({ email: req.body.email });
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
   const isExist = await User.findOne({ email: req.body.email });
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
   const user = await User.findOne({ email: email });

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
      const user = await User.findOne({ email: req.body.email });
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
      const isAdded = await User.findOne({ email: req.body.email });
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
         const newUser = new User({
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
   login,
   logout,
   tokenData,
   signUpWithProvider,
   verifyEmailAddress,
   forgetPassword,
   changePassword,
   resetPassword,
};