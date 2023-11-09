import { sendEmail } from "@root/services/notification/sendEmail.js";
import UserModel from "../../models/user.model.js";
import { generateTokenJwt } from "@root/services/auth/utils/generateTokenJwt.js";

export const forgetPassword = async (req, res) => {
   const isExist = await UserModel.findOne({ email: req.body.email });
   if (!isExist) {
      return res.status(404).send({
         success: false,
         message: 'User Not found with this email!',
      });
   } else {
      const token = generateTokenJwt(isExist);
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
