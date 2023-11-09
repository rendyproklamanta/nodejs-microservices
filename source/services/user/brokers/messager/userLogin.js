import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import bcryptjs from 'bcryptjs';
import errorCode from "../../errorCode.js";

export const userLoginMsg = async (data, msg) => {
   let code = 0;
   let success = true;
   let result;

   try {
      const query = { 
         username: data.username 
      };

      result = await UserModel.findOne(query);

      if (!result) {
         code = 200005;
         success = false;
         result = {};
      } else {
         if (result && result?.status === 'inactive') {
            code = 200004;
            success = false;
            result = {};
         }
   
         if (!bcryptjs.compareSync(data.password, result.password)) {
            code = 200003;
            success = false;
            result = {};
         }
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