const request = require("supertest");
const express = require("express");
const app = express();
const index = require("@root/index.micro");

app.use('/', index);

// eslint-disable-next-line
test("healthcheck test", done => {
   request(app).get('/healthcheck').expect(200, done);
});