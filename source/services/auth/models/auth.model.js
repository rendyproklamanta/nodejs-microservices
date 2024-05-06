import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         required: true
      },
      accessToken: {
         type: String,
         required: true
      },
      refreshToken: {
         type: String,
         required: true
      },
      accessTokenExpiresAt: {
         type: Date,
         required: true
      },
      refreshTokenExpiresAt: {
         type: Date,
         required: true
      },
   },
   {
      timestamps: true,
   }
);


const AuthModel = models.Auth || model('Auth', schema);

export default AuthModel;
