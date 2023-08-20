require('module-alias/register');
const expressMiddleware = require("@config/expressMiddleware");
const routes = require('@config/routes');
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

// Express Middleware
expressMiddleware(app, express);

app.get('/', (req, res) => {
   res.send('Gateway service is running');
});

app.get('/healthcheck', (req, res) => {
   res.send({});
});

routes.forEach(route => {
   app.use(createProxyMiddleware(route.endpoint, route.proxy));
});

module.exports = app;