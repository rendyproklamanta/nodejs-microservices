import LogEmailModel from '../../models/logEmail.model.js';

export const logEmailMsg = async (payload) => {
   try {
      const data = new LogEmailModel(payload);
      await data.save();
   } catch (error) {
      console.log("🚀 ~ loggerApiMsg ~ error:", error);
   }
};