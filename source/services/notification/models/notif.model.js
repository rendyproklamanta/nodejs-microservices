import mongoose from 'mongoose';
import validator from 'validator';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      email: {
         type: String,
         trim: true,
      },
      username: {
         type: String,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);


const NotificationModel = models.Notification || model('Notification', schema);

export default NotificationModel;
