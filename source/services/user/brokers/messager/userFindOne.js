import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import errorCode from "../../errorCode.js";

export const userFindOneMsg = async (data, msg) => {
   let code = 0;
   let success = true;
   let result;

   try {
      const query = { 
         _id: data 
      };

      result = await UserModel.findOne(query);

      if (!result) {
         code = 200005;
         success = false;
         result = {};
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