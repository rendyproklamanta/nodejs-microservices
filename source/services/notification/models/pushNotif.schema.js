import mongoose from 'mongoose';

const { Schema } = mongoose;

const pushNotifSchema = new Schema(
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
         type: Object,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);

export default pushNotifSchema;
