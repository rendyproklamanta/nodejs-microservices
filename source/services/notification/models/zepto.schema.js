import mongoose from 'mongoose';

const { Schema } = mongoose;

const zeptoSchema = new Schema(
   {
      from: {
         type: String,
         trim: true,
      },
      to: {
         type: String,
         trim: true,
      },
      subject: {
         type: String,
         trim: true,
      },
      text: {
         type: String,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);


export default zeptoSchema;
