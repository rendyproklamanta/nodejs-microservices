import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connectDB from "@config/db.js";
import { IpFilter } from 'express-ipfilter';
import { rateLimit } from 'express-rate-limit';
import escapeHtml from 'escape-html';
import { errorMiddleware } from './errorMiddleware.js';
import { sendQueue } from '../broker.js';
import { QUEUE_LOGGER_API } from '../queue/loggerQueue.js';
import ipWhitelist from '../utils/ipWhitelist.js';

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

   // Error handling middleware
   // errorMiddleware(); //hide

   // Allow the following IPs
   if (process.env.NODE_ENV === 'production') {
      app.use(IpFilter(ipWhitelist, { mode: 'allow' }));
   }

   // Custom middleware to escape HTML in request body parameters
   const escapeHtmlMiddleware = (req, res, next) => {
      if (req.body) {
         for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
               req.body[key] = escapeHtml(req.body[key]);
            }
         }
      }
      next();
   };
   app.use(escapeHtmlMiddleware);

   // Apply the rate limiting middleware to all requests.
   const limiter = rateLimit({
      windowMs: 1 * 60 * 1000, // per X minutes
      limit: 100, // Limit each IP to 100 requests per `window`.
      standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
      message: async (req, res) => {
         return res.status(429).send({
            success: false,
            message: 'Too Many Request',
         });
      },
   });
   app.use(limiter);

   // Middleware function to log endpoint, IP address, and timestamp
   app.use(async (req, res, next) => {
      // const timestamp = new Date().toISOString();

      // send to logger
      const payload = {
         ip: req.ip,
         method: req.method,
         url: req.url,
         query: req.query,
         body: req.body,
         headers: req.headers,
      };
      //console.log("🚀 ~ logger ~ payload:", payload);

      const queue = QUEUE_LOGGER_API;
      await sendQueue(queue, payload);

      next();
   });

   // HealthCheck
   app.get('/healthz/status', (req, res) => {
      return res.send({ status: 'up' });
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