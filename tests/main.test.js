const request = require('supertest');
const app = require('../app.test');
const mongoose = require('mongoose')

beforeAll(() => {
  mongoose.connection.dropDatabase('shopXpress_test')
})

afterAll(() => {
  app.cleanExit()
})

//core
describe("core", () => require('./core')(app));
//ecommerce
describe("product", () => require('./product')(app));
describe("cart", () => require('./cart')(app));