import { sendReply } from "@root/config/broker.js";
import UserModel from "../../models/user.model.js";
import errorCode from "../../errorCode.js";

export const userGetAllMsg = async (payload, msg) => {
   let code = 0;
   let success = true;
   let data;

   try {
      const query = {};
      const exclude = '-password'; // exclude property
      const sort = { _id: -1 };

      data = await UserModel.find(query, exclude).sort(sort);

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