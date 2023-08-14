require('module-alias/register');
const request = require("supertest");
const express = require("express");
const app = express();
const index = require("../index.dev");

app.use('/', index);

// eslint-disable-next-line
test("healthcheck test", done => {
   request(app).get('/healthcheck').expect(200, done);
});