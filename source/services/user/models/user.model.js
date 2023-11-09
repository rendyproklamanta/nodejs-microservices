import mongoose from 'mongoose';
import validator from 'validator';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      email: {
         type: String,
         validate: [
            { validator: validator.isEmail, message: 'Invalid email.' },
         ],
         required: [true, "email is required"]
      },
      name: {
         type: String,
         trim: true,
         required: [true, "name is required"]
      },
      username: {
         type: String,
         unique: true,
         trim: true,
         required: [true, "username is required"]
      },
      password: {
         type: String,
         trim: true,
         required: [true, "password is required"]
      },
      role: {
         type: String,
         trim: true,
         required: [true, "Role is required"]
      }

   },
   {
      timestamps: true,
   }
);

const UserModel = models.User || model('User', schema);

export default UserModel;
