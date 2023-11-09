import { generateTokenJwt } from "@root/services/auth/utils/generateTokenJwt.js";
import UserModel from "../../models/user.model.js";
import { sendEmail } from "@root/services/notification/sendEmail.js";

export const verifyEmailAddress = async (req, res) => {
   const isAdded = await UserModel.findOne({ email: req.body.email });
   if (isAdded) {
      return res.status(403).send({
         success: true,
         message: 'This Email already Added!',
      });
   } else {
      const token = generateTokenJwt(req.body);
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