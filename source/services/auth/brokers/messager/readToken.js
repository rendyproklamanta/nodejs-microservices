import { sendReply } from "@root/config/broker.js";
import { decodedToken } from "../../utils/decodedToken.js";
import errorCode from '../../errorCode.js';

export const readTokenMsg = async (data, msg) => {
   try {
      const res = await decodedToken(data);
      if (res?.success) {
         sendReply(msg, {
            code: 0,
            success: true,
            data: res.data
         });
      } else {
         const code = 100005;
         sendReply(msg, {
            code: code,
            success: false,
            error: {
               ...errorCode[code],
               description:res.error
            },  
         });
      }
   } catch (error) {
      sendReply(msg, {
         code: 0,
         success: false,
         error,
      });
   }
};