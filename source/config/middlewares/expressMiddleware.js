import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connectDB from "@config/db.js";

const expressMiddleware = (app, express) => {
   connectDB();

   // We are using this for the express-rate-limit middleware
   // See: https://github.com/nfriedly/express-rate-limit
   // app.enable('trust proxy');

   // app.use(cors());
   app.set("trust proxy", 1);
   app.disable('x-powered-by');
   app.use(express.json({ limit: "4mb" }));
   app.use(express.urlencoded({ extended: true }));
   app.use(express.text());
   app.use(cookieParser());
   app.use(cors({ origin: true, credentials: true }));
   app.use(helmet());
   app.use(morgan('combined'));
   app.use(bodyParser.json());

   // Use express's default error handling middleware
   app.use((err, req, res, next) => {
      if (res.headersSent) return next(err);
      res.status(400).send({ message: err.message });
   });

   const PORT = process.env.PORT_GATEWAY_SERVICE || 5000;

   try {
      app.listen(PORT, () =>
         console.log(`[ Server ] running on http://localhost:${PORT} || use port 5001-500x for microservice`)
      );
   } catch (error) {
      console.error(`[ Server ] Failed to start on port ${PORT}. Error: ${error.message}`);
   }

};

export default expressMiddleware;