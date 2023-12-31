import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import bcryptjs from 'bcryptjs';
import errorCode from "../../errorCode.js";

export const userLoginMsg = async (payload, msg) => {
   let code = 0;
   let success = true;
   let data;

   try {
      const query = { 
         username: payload.username 
      };

      data = await UserModel.findOne(query);

      if (!data) {
         code = 200005;
         success = false;
      } else {
         if (data && data?.status === 'inactive') {
            code = 200004;
            success = false;
         }
   
         if (!bcryptjs.compareSync(payload.password, data.password)) {
            code = 200003;
            success = false;
         }
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