import dotenv from 'dotenv';
dotenv.config();
import { sendReply } from "@config/broker.js";
import jwt from 'jsonwebtoken';

export const generateTokenMsg = async (data, msg, queue) => {
   const token = jwt.sign(data?.token,
      process.env.JWT_SECRET,
      {
         // expiresIn: '365d',
         expiresIn: data?.expiresIn ?? '1m',
      }
   );

   sendReply(msg, {
      queue: queue,
      success: true,
      data: token,
   });
};