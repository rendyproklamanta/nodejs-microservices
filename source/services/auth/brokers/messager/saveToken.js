import { sendReply } from "@root/config/broker.js";
import AuthModel from "../../models/auth.model.js";

export const saveTokenMsg = async (payload, msg) => {
   let success = false;
   let data = '';

   try {
      // Define the update options
      const options = {
         upsert: true, // If the document doesn't exist, insert it
         new: true, // Return the updated document if upserted
      };

      const saveToken = await AuthModel.findOneAndUpdate({ userId: payload.userId }, payload, options);
      //console.log("🚀 ~ saveTokenMsg ~ saveToken:", saveToken);
      if (saveToken) {
         success = true;
      }
      data = payload;
   } catch (error) {
      console.log("🚀 ~ saveTokenMsg ~ error:", error);
      data = error;
   }

   sendReply(msg, {
      success,
      data,
   });
};