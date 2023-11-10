import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import errorCode from "../../errorCode.js";

export const userUpdateMsg = async (payload, msg) => {
   let code = 0;
   let success = true;
   let data;

   try {

      const query = payload.id;
      const payload = payload;
      const options = {
         new: true,
         upsert: true,
      };

      data = await UserModel.findByIdAndUpdate(query, payload, options);

      if (!data) {
         code = 200002;
         success = false;
      }

      sendReply(msg, {
         code: code,
         success: success,
         error: errorCode[code],
         data,
      });

   } catch (error) {
      code = 1;
      sendReply(msg, {
         code: code,
         success: false,
         error,
      });
   }
};