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

      const decryptToken = decrypt(refreshToken);
      const decoded = jwt.verify(decryptToken, process.env.JWT_SECRET);

      const accessTokenExpiry = 10;
      const token = {
         _id: decoded._id
      };

      const payload = {
         token,
         expiresIn: accessTokenExpiry
      };

      const accessToken = await generateTokenJwt(payload);
      const tokenExpireTime = 86400;

      res.cookie("accessToken", accessToken.data, {
         maxAge: 10 * 1000, // convert to ms
         httpOnly: true,
         sameSite: true,
         secure: false
      });

      // res.header('Authorization', accessToken).send(decoded.user);
      return res.status(200).send({
         success: true,
         data: {
            accessToken: accessToken.data,
            accessTokenExpiry: tokenExpireTime,
         }
      });
   } catch (error) {
      return res.status(401).send({
         status: false,
         message: error
      });
   }
};
