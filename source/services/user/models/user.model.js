import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

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

// schema.pre('save', function (next) {
//    // eslint-disable-next-line no-invalid-this
//    const user = this;

//    if (!user.isModified('password')) {
//       return next();
//    }

//    // Hash the password
//    bcrypt.genSalt(10, (error, salt) => {
//       if (error) {
//          return next(error);
//       }

//       bcrypt.hashSync(user.password, salt, (error, hash) => {
//          if (error) {
//             return next(error);
//          }

//          user.password = hash;
//          next();
//       });
//    });
// });


const UserModel = models.User || model('User', schema);

export default UserModel;
