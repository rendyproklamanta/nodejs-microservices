import { sendReply } from '@config/broker.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const changePassword = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user.password) {
         return res.send({
            success: true,
            message: 'For change password,You need to sign in with email & password!',
         });
      } else if (
         user &&
         bcryptjs.compareSync(req.body.currentPassword, user.password)
      ) {
         user.password = bcryptjs.hashSync(req.body.newPassword);
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
