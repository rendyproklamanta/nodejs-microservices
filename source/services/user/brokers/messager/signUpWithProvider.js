import { generateTokenJwt } from "@root/services/auth/utils/generateTokenJwt.js";
import UserModel from "../../models/user.model.js";

export const signUpWithProvider = async (req, res) => {
   try {
      const isAdded = await UserModel.findOne({ email: req.body.email });
      if (isAdded) {
         const token = generateTokenJwt(isAdded);
         return res.send({
            success: true,
            data: {
               token,
               _id: isAdded._id,
               name: isAdded.name,
               email: isAdded.email,
               address: isAdded.address,
               phone: isAdded.phone,
               image: isAdded.image,
            }
         });
      } else {
         const newUser = new UserModel({
            name: req.body.name,
            email: req.body.email,
            image: req.body.image,
         });

         const user = await newUser.save();
         const token = generateTokenJwt(user);
         return res.send({
            success: true,
            data: {
               token,
               _id: user._id,
               name: user.name,
               email: user.email,
               image: user.image,
            }
         });
      }
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};
