import dotenv from 'dotenv';
dotenv.config();
import { decrypt } from "@root/config/encryption.js";
import { generateTokenJwt } from "../utils/generateTokenJwt.js";
import jwt from 'jsonwebtoken';

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

      const decoded = jwt.verify(decrypt(refreshToken), process.env.JWT_SECRET);
      const accessToken = await generateTokenJwt(decoded);

      // res.header('Authorization', accessToken).send(decoded.user);
      return res.status(200).send({
         success: true,
         data: {
            accessToken: accessToken.data
         }
      });
   } catch (error) {
      return res.status(401).send({
         status: false,
         message: error
      });
   }
};
