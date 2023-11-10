import bcryptjs from 'bcryptjs';
import { ROLE_TYPE_USER } from '../../constants/permission.js';
import UserModel from '../../models/user.model.js';
import { sendReply } from '@root/config/broker.js';
import errorCode from '../../errorCode.js';

export const userCreateMsg = async (payload, msg) => {
   let code = 0;
   let success = true;
   let isAdded = false;
   let data;

   try {

      const body = {
         ...payload,
         password: bcryptjs.hashSync(payload.password),
         role: ROLE_TYPE_USER,
      };

      isAdded = await UserModel.findOne({ username: payload.username });
      if (isAdded) {
         code = 200001;
         success = false;
      } else {
         const user = new UserModel(body);
         data = await user.save();
         success = true;
      }

      sendReply(msg, {
         code: code,
         success: success,
         error: errorCode[code],
         data,
      });
   } catch (error) {
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
   }
};