require('module-alias/register');
const expressMiddleware = require("@config/expressMiddleware");
const routes = require('@config/routes');
const express = require("express");
const app = express();

// Express Middleware
expressMiddleware(app, express);

app.get('/', (req, res) => {
   res.send('API service is running');
});

app.get('/healthcheck', (req, res) => {
   res.send({});
});

routes.forEach(route => {
   app.use(require(route.service));
});

module.exports = app;