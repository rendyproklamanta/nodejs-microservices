const mongoose = require('mongoose');
const { isEmail } = require('validator');

const schema = new mongoose.Schema(
   {
      role: {
         type: String,
         trim: true,
         required: [true, "role is required"]
      },
      email: {
         type: String,
         validate: [
            { validator: isEmail, message: 'Invalid email.' },
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
      permission: {
         type: Array,
         required: [true, "permission is required"]
      },
   },
   {
      timestamps: true,
   }
);

const UserModel = mongoose.models.User || mongoose.model('User', schema);

module.exports = UserModel;
