const request = require('supertest')
const _ = require('lodash')
const expectations = require('./commons/expectations')

module.exports = (app) => {
  describe("Test the root path.", () => {
    test("welcome api response at root path", async () => {
      const response = await request(app).get("/");
      expectations.apiBasic(response)
      expectations.statusAndMessage(response, true, "shopXpress an expressJS based RESTful ecommerce engine.")
    })

    test("POST, PUT, PATCH, DELETE on / should return 405 method not allowed json response.", async () => {
      methodNotAllowedExpectations('post', '/')
      methodNotAllowedExpectations('put', '/')
      methodNotAllowedExpectations('patch', '/')
      methodNotAllowedExpectations('delete', '/')

      async function methodNotAllowedExpectations(method, path) {
        const response = await request(app)[method]("/")
        expectations.apiBasic405(response)
        expect(response.body.status).toBe(false)
        expect(response.body.message).toBe("Method "+method.toUpperCase()+" not allowed on /")
      }
    })
  })

  describe("test the /hello path", () => {
    function helloWorldExpectations(response) {
      expectations.apiBasic(response)
      expectations.statusAndMessage(response, true, "Hello World!")
    }

    test("should return a valid json response with hello world message.", async () => {
      const response = await request(app).get("/hello")
      helloWorldExpectations(response)
    })

    test("allow all http methods GET, POST, PUT, PATCH & DELETE", async () => {    
      let response = await request(app).get("/hello")
      helloWorldExpectations(response)

      response = await request(app).post("/hello")
      helloWorldExpectations(response)

      response = await request(app).put("/hello")
      helloWorldExpectations(response)

      response = await request(app).patch("/hello")
      helloWorldExpectations(response)

      response = await request(app).delete("/hello")
      helloWorldExpectations(response)
    })
  })

  describe("testing undefined route for neat 404", () => {
    function undefined404Expectations(response) {
      expectations.apiBasic404(response)
      expectations.statusAndMessage(response, false, "Route /undefinedRoute not found")
    }

    test("it should return a neat json response with 404 status code and message showing the path as invalid.", async () => {
      const response = await request(app).get('/undefinedRoute')
      undefined404Expectations(response)
    })
    
    test("it should return a neat 404 json api response for all request methods: GET, POST, PUT, PATCH & DELETE.", async () => {
      var response = await request(app).get('/undefinedRoute')
      undefined404Expectations(response)
      
      response = await request(app).post('/undefinedRoute')
      undefined404Expectations(response)
      
      response = await request(app).put('/undefinedRoute')
      undefined404Expectations(response)
      
      response = await request(app).patch('/undefinedRoute')
      undefined404Expectations(response)
      
      response = await request(app).delete('/undefinedRoute')
      undefined404Expectations(response)
    })
  })
}