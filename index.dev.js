require("dotenv").config();
require('module-alias/register');
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require("@config/db");
connectDB();
const app = express();

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
// app.enable('trust proxy');

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
// app.use(cors());

app.get('/healthcheck', (req, res) => {
   res.send({});
});

// Load all routes here for development purpose
const authRoute = require("@services/auths/route");
const userRoute = require("@services/users/route");
app.use("/", authRoute);
app.use("/", userRoute);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
   if (res.headersSent) return next(err);
   res.status(400).send({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
   console.log(`server running on port http://localhost:${PORT}`)
);

module.exports = app;