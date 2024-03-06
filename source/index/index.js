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

async function importRoutes() {
   for (const route of routes) {
      const routePath = path.resolve(route.service);
      const { default: middleware } = await import(routePath);

      app.use(middleware);
   }
}

importRoutes();

export default app;