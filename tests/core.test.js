const request = require('supertest');
const app = require('../app.test');

describe("Test the root path.", () => {
  test("it should respond with status code 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  })
})