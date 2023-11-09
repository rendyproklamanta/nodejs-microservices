import dotenv from 'dotenv';
dotenv.config();
import { connect } from "mongoose";

const connectDB = async () => {
   const options = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // logger: console.log,
      // loggerLevel: 'info',
      // poolSize: 10
   };

   try {

      let mongoUri;
      if (process.env.NODE_ENV === 'development') {
         mongoUri = process.env.MONGO_URI_DEV;
      } else {
         mongoUri = process.env.MONGO_URI_PROD;
      }

      // Connect to MongoDB
      await connect(mongoUri, options);
    
      console.log("[ MongoDB ] connection success!");
   } catch (err) {
      console.log("[ MongoDB ] connection failed!", err.message);
   }
};

export default connectDB;
