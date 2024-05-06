import LogApiModel from '../../models/logApi.model.js';

export const logApiMsg = async (payload) => {
   try {
      const data = new LogApiModel(payload);

      delete payload.body.password;

      await data.save();
   } catch (error) {
      console.log("🚀 ~ loggerApiMsg ~ error:", error);
   }
};