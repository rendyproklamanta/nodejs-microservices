import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      id: {
         type: String,
         trim: true,
      },
      username: {
         type: String,
         trim: true,
      },
      action: {
         type: String,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);


const LoggerModel = models.Logger || model('Logger', schema);

export default LoggerModel;
