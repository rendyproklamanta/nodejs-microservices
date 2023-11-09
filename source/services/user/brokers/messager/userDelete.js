import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import errorCode from "../../errorCode.js";

export const userDeleteMsg = async (data, msg) => {
   let code = 0;
   let success = true;
   let result;

   try {
      const query = data;

      result = await UserModel.findByIdAndDelete(query);

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
         code: 1,
         success: false,
         error,
      });
   }
};