import mongoose from 'mongoose';
import zeptoSchema from './zepto.schema.js';
import pushNotifSchema from './pushNotif.schema.js';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      zepto: [zeptoSchema],
      pushNotif: [pushNotifSchema]
   },
   {
      timestamps: true,
   }
);


const NotificationModel = models.NotificationModel || model('NotificationModel', schema);

export default NotificationModel;
