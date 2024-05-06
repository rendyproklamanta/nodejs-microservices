import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         trim: true,
      },
      action: {
         type: String, // USER_LOGGED_IN, etc..
         trim: true,
      },
      success: {
         type: String,
         trim: true,
      },
      data: {
         type: Schema.Types.Mixed,
         trim: true,
      },
      // data : {
      //    payload,
      // }
   },
   {
      timestamps: true,
   }
);


const LogUserModel = models.LogUser || model('LogUser', schema);

export default LogUserModel;
