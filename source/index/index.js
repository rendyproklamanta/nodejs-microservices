import expressMiddleware from '@root/config/middlewares/expressMiddleware.js';
import routes from '@config/routes.js';
import express from "express";
import * as path from 'path'; // Use the 'path' module for resolving module paths

const app = express();

// Express Middleware
expressMiddleware(app, express);

app.get('/', (req, res) => {
   res.send('API service is running');
});

app.get('/healthcheck', (req, res) => {
   res.send({});
});

// routes.forEach(route => {
//    app.use(route.service);
// });

for (const route of routes) {
   const routePath = path.resolve(route.service);
   const { default: middleware } = await import(routePath);
 
   app.use(middleware);
 }

// Catch-all route for undefined routes
app.all('*', (req, res) => {
   res.status(404).send('Page not found');
});

export default app;