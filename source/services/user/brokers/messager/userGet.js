import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import errorCode from "../../errorCode.js";

export const userGetMsg = async (payload, msg) => {
   let code = 0;
   let success = true;
   let data;

   try {
      const exclude = '-password'; // exclude property

      data = await UserModel.findById(payload, exclude);

      if (!data) {
         code = 200005;
         success = false;
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