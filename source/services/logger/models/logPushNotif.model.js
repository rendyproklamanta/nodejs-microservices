import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      token: {
         type: String,
         trim: true,
      },
      title: {
         type: String,
         trim: true,
      },
      message: {
         type: String,
         trim: true,
      },
      options: {
         type: Schema.Types.Mixed,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);


const LogPushNotifModel = models.LogPushNotif || model('LogPushNotif', schema);

export default LogPushNotifModel;
