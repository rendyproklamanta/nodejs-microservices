import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema(
   {
      from: {
         type: String,
         trim: true,
      },
      to: {
         type: Schema.Types.Mixed,
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
      response: {
         type: Schema.Types.Mixed,
         trim: true,
      },
      error: {
         type: Schema.Types.Mixed,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);


const LogEmailModel = models.LogEmail || model('LogEmail', schema);

export default LogEmailModel;
