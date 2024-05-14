import { sendReply } from "@root/config/broker.js";
import AuthModel from "../../models/auth.model.js";

// QUEUE_AUTH_SAVE_TOKEN_JWT
export const saveTokenMsg = async (payload, msg) => {
   try {
      // Define the update options
      const options = {
         upsert: true, // If the document doesn't exist, insert it
         new: true, // Return the updated document if upserted
      };

      const saveToken = await AuthModel.findOneAndUpdate({ userId: payload.userId }, payload, options);
      if (saveToken) {
         sendReply(msg, {
            success: true,
            data: payload,
         });
      }
   } catch (error) {
      console.log("🚀 ~ saveTokenMsg ~ error:", error);
      sendReply(msg, {
         success: false,
         error: error,
      });
   }

};