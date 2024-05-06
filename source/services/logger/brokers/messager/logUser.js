import LogUserModel from '../../models/logUser.model.js';

export const logUserMsg = async (payload) => {
   try {
      const data = new LogUserModel(payload);
      await data.save();
   } catch (error) {
      console.log("🚀 ~ logUserMsg ~ error:", error);
   }
};