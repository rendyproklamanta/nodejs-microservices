import bcryptjs from 'bcryptjs';
import { ROLE_TYPE_USER } from '../../constants/permission.js';
import UserModel from '../../models/user.model.js';
import { sendReply } from '@root/config/broker.js';
import errorCode from '../../errorCode.js';

export const userCreateMsg = async (data, msg) => {
   let code = 0;
   let success = true;
   let isAdded = false;
   let result;

   try {

      const payload = {
         ...data,
         password: bcryptjs.hashSync(data.password),
         role: ROLE_TYPE_USER,
      };

      isAdded = await UserModel.findOne({ username: data.username });
      if (isAdded) {
         code = 200001;
         success = false;
      } else {
         const scheme = new UserModel(payload);
         result = await scheme.save();
         success = true;
      }

      sendReply(msg, {
         code: code,
         success: success,
         error: errorCode[code],
         data: result,
      });
   } catch (error) {
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
   }
};