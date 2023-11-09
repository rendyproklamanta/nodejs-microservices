import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import errorCode from "../../errorCode.js";

export const userUpdateMsg = async (data, msg) => {
   let code = 0;
   let success = true;

   try {

      const query = data.id;
      const payload = data;
      const options = {
         new: true,
         upsert: true,
      };

      const result = await UserModel.findByIdAndUpdate(query, payload, options);

      if (!result) {
         code = 200002;
         success = false;
      }

      sendReply(msg, {
         code: code,
         success: success,
         error: errorCode[code],
         data: result,
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