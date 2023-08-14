require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
   const options = {
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

      await mongoose.connect(mongoUri, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      }), options;
      console.log("mongodb connection success!");
   } catch (err) {
      console.log("mongodb connection failed!", err.message);
   }
};

module.exports = connectDB;
