import express from "express";
import expressMiddleware from "@config/middlewares/express.middleware";

const app = express();

// Express Middleware
expressMiddleware(app, express);

app.get('/healthcheck', (req, res) => {
   res.send({});
});

// Load route for each microservices
import route from "./route";
app.use("/", route);

// Catch-all route for undefined routes
app.all('*', (req, res) => {
   res.status(404).send('Page not found');
});

export default app;