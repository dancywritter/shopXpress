const request = require('supertest');
const app = require('../app.test');

describe("Test the root path.", () => {
  test("it should respond with status code 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  })

  test("it should response with content type application/json", async () => {
    const response = await request(app).get("/");
    expect(response.type).toBe("application/json")
  })

  test("the response body should be a valid json", async () => {
    const response = await request(app).get("/");
    expect(typeof response.body).toBe("object"); //check for json object
  })

  test("response status should be true and message should valid for root path", async () => {
    const response = await request(app).get("/");
    const body = response.body;

    expect(body.status).toBe(true);
    expect(body.message).toBe("shopXpress an expressJS based RESTful ecommerce engine.")
  })

  test("POST / should return 405 method not allowed json response.", async () => {
    const response = await request(app).post("/")
    expect(response.statusCode).toBe(405)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe("Method POST not allowed on /")
  })

  test("PUT / should return 405 method not allowed json response.", async () => {
    const response = await request(app).put("/")
    expect(response.statusCode).toBe(405)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe("Method PUT not allowed on /")
  })

  test("PATCH / should return 405 method not allowed json response.", async () => {
    const response = await request(app).patch("/")
    expect(response.statusCode).toBe(405)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe("Method PATCH not allowed on /")
  })

  test("DELETE / should return 405 method not allowed json response.", async () => {
    const response = await request(app).delete("/")
    expect(response.statusCode).toBe(405)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe("Method DELETE not allowed on /")
  })
})

describe("test the /hello path", () => {
  test("should return a valid json response with hello world message.", async () => {
    const response = await request(app).get("/hello")
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("Hello World!");
  })

  test("allow all http methods GET, POST, PUT, PATCH & DELETE", async () => {    
    let response = await request(app).get("/hello")
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("Hello World!");

    response = await request(app).post("/hello")
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("Hello World!");    

    response = await request(app).put("/hello")
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("Hello World!");    

    response = await request(app).patch("/hello")
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("Hello World!");    

    response = await request(app).delete("/hello")
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("Hello World!");
  })
})