import dotenv from 'dotenv';
dotenv.config();
import { decrypt } from "@root/config/encryption.js";
import { generateTokenJwt } from "../utils/generateTokenJwt.js";
import jwt from 'jsonwebtoken';
import { sendQueue } from '@root/config/broker.js';
import { QUEUE_AUTH_SAVE_TOKEN_JWT } from '@root/config/queue/authQueue.js';

export const refreshToken = async (req, res, next) => {
   try {
      let refreshToken;

      if (req.cookies.refreshToken) {
         refreshToken = req.cookies.refreshToken;
      } else {
         refreshToken = req.body.refreshToken;
      }

      if (!refreshToken) {
         return res.status(401).send({
            status: false,
            message: 'Access Denied. No refresh token provided.'
         });
      }

      const decryptToken = decrypt(refreshToken);
      const decoded = jwt.verify(decryptToken, process.env.JWT_SECRET);

      const currentDate = new Date();
      const accessTokenExpiry = 10;

      const token = {
         _id: decoded._id
      };

      const payload = {
         token,
         expiresIn: accessTokenExpiry
      };

      const accessToken = await generateTokenJwt(payload);

      // ----- Save Token -----
      const payloadSaveToken = {
         userId: decoded._id,
         accessToken: accessToken.data,
         accessTokenExpiresAt: new Date(currentDate.getTime() + (accessTokenExpiry * 1000)),
      };

      const queue = QUEUE_AUTH_SAVE_TOKEN_JWT;
      const resSaveToken = await sendQueue(queue, payloadSaveToken);

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
