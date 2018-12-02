/**
 * contains test cases for product module
 */
const request = require('supertest')
const _ = require('lodash')
const expectations = require('./commons/expectations')

module.exports = (app) => {
  test("create a product", async () => { 
    const product = {
      sku: 'sku-1',
      title: 'title-1',
      description: 'description-1',
      qty: 10
    }
    const response = await request(app).post("/products").send(product)
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product with sku: sku-1 created successfully!")
    expect(_.pick(response.body.product, ['sku', 'title', 'description', 'qty'])).toEqual(product)
  })

  test("test avoid creation of product with same sku", async () => {
    const product = {
      sku: 'sku-1',
      title: 'title-1',
      description: 'description-1',
      qty: 10
    }
    const response = await request(app).post("/products").send(product)
    expectations.apiBasic500(response)
    expectations.statusAndMessage(response, false, "Product with sku: sku-1 already exist!")
  })

  test("retrieve created product", async () => { 
    const response = await request(app).get("/products/sku-1")
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing product with sku: sku-1")
    expect(_.pick(response.body.product, ['sku', 'title', 'description', 'qty'])).toEqual({
      sku: 'sku-1',
      title: 'title-1',
      description: 'description-1',
      qty: 10
    })
  })

  test("update created product", async () => { 
    updatedProduct = { //fields to be updated
      title: 'title-1-updated',
      description: 'description-1-updated-2',
      qty: 15
    }
    var response = await request(app).put("/products/sku-1").send(updatedProduct)
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product with sku: sku-1 updated!")
    expect(_.pick(response.body.product, _.keys(updatedProduct))).toEqual(updatedProduct)

    //update only 1 field

    updatedProduct = { //fields to be updated
      qty: 10
    }
    response = await request(app).put("/products/sku-1").send(updatedProduct)
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product with sku: sku-1 updated!")
    expect(_.pick(response.body.product, _.keys(updatedProduct))).toEqual(updatedProduct)
  })

  test("delete created product", async () => { 
    const response = await request(app).delete("/products/sku-1").send(updatedProduct)
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product with sku: sku-1 deleted!")
  })

  test("non existing product", async () => {
    var response = await request(app).get("/products/sku-5")
    nonExistentExpectations(response)
    response = await request(app).put("/products/sku-5")
    nonExistentExpectations(response)
    response = await request(app).delete("/products/sku-5")
    nonExistentExpectations(response)

    function nonExistentExpectations(response) {
      expectations.apiBasic(response)
      expectations.statusAndMessage(response, false, "Product with sku: sku-5 doesn't exist!")
    }
  })

  test("retrieve multiple products, should return an empty set", async () => { 
    var response = await request(app).get('/products') //no request parameters & query parameters specified
    
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing available products")
    expect(response.body.products).toEqual([]) //not products currently in the database
    expect(response.body.pagination).toEqual({
      page: 1, //default page
      totalPages: 0,
      pageSize: 100, //default size
      total: 0, //available products count
      showing: 0 //retrieved products count
    })
    // TODO: expect(response.body.filter).toEqual({}) //no filter parameters passed in query string

    response = await request(app).get('/products/?page=3&size=200') //query parameters specified
    
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing available products")
    expect(response.body.products).toEqual([]) //not products currently in the database
    expect(response.body.pagination).toEqual({
      page: 3, //default page
      totalPages: 0,
      pageSize: 200, //default size
      total: 0, //available products count
      showing: 0 //retrieved products count
    })
    // TODO: expect(response.body.filter).toEqual({}) //no filter parameters passed in query string
  })

  test("create multiple products in loop", async () => { 
    for(product of require('./data/products')) {
      var response = await request(app).post('/products').send(product)
      expectations.apiBasic(response)
      expectations.statusAndMessage(response, true, "Product with sku: "+product.sku+" created successfully!")
      expect(_.pick(response.body.product, ['sku', 'title', 'description', 'qty'])).toEqual(product)
    }
  })

  test("retrieve multiple products as array of products", async () => { 
    var response = await request(app).get('/products') //no request parameters & query parameters specified
    
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing available products")
    expect(_.map(response.body.products, product => _.pick(product, ['sku', 'title', 'description', 'qty']))).toEqual(require("./data/products")) //not products currently in the database
    expect(response.body.pagination).toEqual({
      page: 1, //default page
      totalPages: 1,
      pageSize: 100, //default size
      total: 10, //available products count
      showing: 10 //retrieved products count
    })
    // TODO: expect(response.body.filter).toEqual({}) //no filter parameters passed in query string

    response = await request(app).get('/products/?page=3&size=200') //query parameters specified
    
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing available products")
    expect(_.map(response.body.products, product => _.pick(product, ['sku', 'title', 'description', 'qty']))).toEqual([]) //not products at page 3
    expect(response.body.pagination).toEqual({
      page: 3, //default page
      totalPages:1,
      pageSize: 200, //default size
      total: 10, //available products count
      showing: 0 //retrieved products count
    })
    // TODO: expect(response.body.filter).toEqual({}) //no filter parameters passed in query string

    response = await request(app).get('/products/?page=1&size=5') //query parameters specified
    
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing available products")
    expect(_.map(response.body.products, product => _.pick(product, ['sku', 'title', 'description', 'qty']))).toEqual(_.slice(require('./data/products'), 0, 5)) //not products at page 3
    expect(response.body.pagination).toEqual({
      page: 1, //default page
      totalPages: 2,
      pageSize: 5, //default size
      total: 10, //available products count
      showing: 5 //retrieved products count
    })
    // TODO: expect(response.body.filter).toEqual({}) //no filter parameters passed in query string
  })
}