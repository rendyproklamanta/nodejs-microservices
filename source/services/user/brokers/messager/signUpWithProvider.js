import { generateTokenJwt } from "@root/services/auth/utils/generateTokenJwt.js";
import UserModel from "../../models/user.model.js";
import { sendReply } from "@root/config/broker.js";
import errorCode from "../../errorCode.js";

export const signUpWithProvider = async (payload, msg) => {
   let code = 0;
   let success = true;
   let isAdded = false;
   let data;
   let accessToken;

   try {
      isAdded = await UserModel.findOne({ email: payload.email });
      if (isAdded) {
         code = 200001;
         success = false;
      } else {
         const user = new UserModel(payload);
         data = await user.save();
         accessToken = generateTokenJwt(data);
      }

      sendReply(msg, {
         code: code,
         success: success,
         error: errorCode[code],
         data,
         accessToken,
      });
   } catch (error) {
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
   }
};
