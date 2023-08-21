require('module-alias/register');
const express = require("express");
const app = express();
const expressMiddleware = require("@config/middlewares/express.middleware");

// Express Middleware
expressMiddleware(app, express);

app.get('/healthcheck', (req, res) => {
   res.send({});
});

// Load route for each microservices
const route = require("./route");
app.use("/", route);

module.exports = app;