import dotenv from 'dotenv';
dotenv.config();
import { decrypt } from "@root/config/encryption.js";
import { generateTokenJwt } from "../utils/generateTokenJwt.js";
import jwt from 'jsonwebtoken';
import { correlationId, sendQueue } from '@root/config/broker.js';
import { QUEUE_AUTH_SAVE_TOKEN_JWT } from '@root/config/queue/authQueue.js';

export const refreshToken = async (req, res, next) => {
   try {
      const replyId = correlationId(); // is unique
      let refreshToken;
      let refreshTokenDB;
      let payload;

      // if (req.cookies.refreshToken) {
      //    refreshToken = req.cookies.refreshToken;
      // } else {
      //    refreshToken = req.body.refreshToken;
      // }

      refreshToken = req.body.refreshToken;
      
      // [TODO] 
      // Get refresh token from database and compore to refreshToken
      // 
      
      //refreshTokenDB = get from database where id 
      if (refreshTokenDB !== refreshToken) {
         return res.status(401).send({
            status: false,
            message: 'Access Denied. refresh token invalid.'
         });
      }

      if (!refreshToken) {
         return res.status(401).send({
            status: false,
            message: 'Access Denied. No refresh token provided.'
         });
      }

      const decryptToken = decrypt(refreshToken);
      const decodedToken = jwt.verify(decryptToken, process.env.JWT_SECRET);
      const currentDate = new Date();
      const accessTokenExpiry = 3600; // 1 hour

      const token = {
         _id: decodedToken._id,
         machineId: decodedToken.machineId
      };

      payload = {
         token,
         expiresIn: accessTokenExpiry
      };

      const accessToken = await generateTokenJwt(payload);

      // ----- Save Token -----
      payload = {
         userId: decodedToken._id,
         machineId: decodedToken.machineId,
         accessToken: accessToken.data,
         accessTokenExpiresAt: new Date(currentDate.getTime() + (accessTokenExpiry * 1000)),
      };

      const queue = QUEUE_AUTH_SAVE_TOKEN_JWT;
      const queueReply = QUEUE_AUTH_SAVE_TOKEN_JWT + replyId;
      const resSaveToken = await sendQueue(queue, payload, replyId, queueReply);

      if (!resSaveToken.success) {
         return res.status(500).send({
            success: false,
            resSaveToken
         });
      }

      // res.cookie("accessToken", accessToken.data, {
      //    maxAge: 10 * 1000, // convert to ms
      //    httpOnly: true,
      //    sameSite: true,
      //    secure: false
      // });

      return res.status(200).send({
         success: true,
         data: {
            accessToken: accessToken.data,
            accessTokenExpiry: accessTokenExpiry,
         }
      });
   } catch (error) {
      return res.status(401).send({
         status: false,
         message: error
      });
   }
};
