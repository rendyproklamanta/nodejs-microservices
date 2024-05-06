import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      ip: {
         type: String,
         trim: true,
      },
      method: {
         type: String,
         trim: true,
      },
      url: {
         type: String,
         trim: true,
      },
      query: {
         type: Object,
         trim: true,
      },
      body: {
         type: Object,
         trim: true,
      },
      headers: {
         type: Object,
         trim: true,
      }
   },
   {
      timestamps: true,
   }
);


const LogApiModel = models.LogApi || model('LogApi', schema);

export default LogApiModel;
