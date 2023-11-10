import express from "express";
// Load route for each microservices
import route from "@root/route.js";
import expressMiddleware from "@root/config/middlewares/expressMiddleware.js";

const app = express();

// Express Middleware
expressMiddleware(app, express);

app.get('/healthcheck', (req, res) => {
   res.send({});
});

app.use("/", route);

export default app;