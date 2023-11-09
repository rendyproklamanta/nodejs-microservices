import dotenv from 'dotenv';
dotenv.config();
import errorCode from "../errorCode.js";
import jwt from 'jsonwebtoken';

export const decodedToken = async (token) => { // eslint-disable-line no-unused-vars

   try {
      let code = 0;
      let success = true;

      const result = jwt.verify(token, process.env.JWT_SECRET);

      if (!result) {
         code = 100005;
         success = false;
      }

      const data = {
         code: code,
         success: success,
         data: result,
         error: errorCode[code],
      };

      return data;
   } catch (error) {
      const data = {
         code: 0,
         success: false,
         error,
      };
      return data;
   }
};