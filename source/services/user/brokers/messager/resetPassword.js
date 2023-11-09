import { sendReply } from '@config/broker.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { decodedToken } from '@root/services/auth/utils/decodedToken.js';

export const resetPassword = async (req, res) => {
   const token = req.body.token;
   const { email } = decodedToken(token);
   const user = await UserModel.findOne({ email: email });

   if (token) {
      jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => { // eslint-disable-line no-unused-vars
         if (err) {
            return res.status(500).send({
               success: false,
               message: 'Token expired, please try again!',
            });
         } else {
            user.password = bcryptjs.hashSync(req.body.newPassword);
            user.save();
            return res.send({
               success: true,
               message: 'Your password changed successful, you can login now!',
            });
         }
      });
   }
};