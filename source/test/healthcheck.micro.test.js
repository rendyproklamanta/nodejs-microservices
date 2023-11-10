import request from "supertest";
import express from "express";
import index from "@root/index/index.micro.js";

const app = express();

app.use('/', index);

// eslint-disable-next-line
test("healthcheck test", done => {
   request(app).get('/healthcheck').expect(200, done);
});