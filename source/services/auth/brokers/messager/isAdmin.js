import { sendReply } from "@root/config/broker.js";
import UserModel from "@root/services/user/models/user.model.js";

export const isAdminMsg = async (payload, msg) => {
   const admin = await UserModel.findOne({ role: 'Admin' });
   if (admin) {
      sendReply(msg, {
         success: true,
      });
   } else {
      sendReply(msg, {
         success: false,
         message: "User is not admin"
      });
   }
   
};
