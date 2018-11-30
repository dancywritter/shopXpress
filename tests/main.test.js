const request = require('supertest');
const app = require('../app.test');
const mongoose = require('mongoose')

afterAll(() => {
  mongoose.connection.close()
})

//core
describe("core", () => require('./core')(app));
//ecommerce
describe("ecommerce", () => require('./ecommerce')(app));