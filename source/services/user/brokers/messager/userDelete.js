import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import errorCode from "../../errorCode.js";

export const userDeleteMsg = async (payload, msg) => {
   let code = 0;
   let success = true;
   let data;

   try {
      const query = payload;

      data = await UserModel.findByIdAndDelete(query);

      if (!data) {
         code = 200005;
         success = false;
         data = {};
      }

      sendReply(msg, {
         code: code,
         success: success,
         error: errorCode[code],
         data,
      });

   } catch (error) {
      sendReply(msg, {
         code: 1,
         success: false,
         error,
      });
   }
};