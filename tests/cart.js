/**
 * contains test cases for product module
 */
const request = require('supertest')
const _ = require('lodash')
const expectations = require('./commons/expectations')

module.exports = (app) => {
  test("cart should be empty", async () => {
    const response = await request(app).get('/cart')

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing products in cart.")
    expectations.fieldExistence(response.body.products)

    expect(response.body.products).toEqual([])
  })

  test("add existing product to cart", async () => { 
    var response = await request(app).post('/cart/sku-1').send({qty: 1})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product added to cart.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 1
      }
    ])
  })

  test("try adding a non existent product to cart", async () => {
    var response = await request(app).post('/cart/sku-21').send({qty: 2})
    expectations.apiBasic(response)
    expectations.statusAndMessage(response, false, "Product with sku-21 not found in our database.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 1
      }
    ])
  })

  test("try adding more than available quantity", async () => {
    var response = await request(app).post('/cart/sku-3').send({qty: 70})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, false, "We currently have only 25 sku-3 in stock.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 1
      }
    ])
  })

  test("try adding same sku again", async () => {
    var response = await request(app).post('/cart/sku-1').send({qty: 5})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product added to cart.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      }
    ])
  })

  test("try adding same sku again but resultant qty exceeding stock", async () => {
    var response = await request(app).post('/cart/sku-1').send({qty: 10})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, false, "We currently have only 15 sku-1 in stock.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      }
    ])
  })
  
  test("add another product to cart", async () => {
    var response = await request(app).post('/cart/sku-2').send({qty: 10})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product added to cart.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      },
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 10
      }
    ])
  })

  test("reduce cart product quantity", async () => {
    //reduce qty
    var response = await request(app).put('/cart/sku-2').send({qty: 2})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Qty for sku-2 in cart updated to 2.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      },
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 2
      }
    ])
  })

  test("increase cart product qty", async () => {
    var response = await request(app).put('/cart/sku-2').send({qty: 8})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Qty for sku-2 in cart updated to 8.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      },
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 8
      }
    ])
  })

  test("increase cart product qty beyond in-stock", async () => {
    var response = await request(app).put('/cart/sku-2').send({qty: 15})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, false, "We currently have only 12 sku-2 in stock.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      },
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 8
      }
    ])
  })

  test("try changing qty of a non existing product", async () => {
    var response = await request(app).put('/cart/sku-32').send({qty: 15})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, false, "Cannot find product sku-32.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      },
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 8
      }
    ])
  })

  test("show all products in cart", async () => { 
    var response = await request(app).get('/cart').send({qty: 15})

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing products in cart.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-1",
        "title": "title-1",
        "description": "description-1",
        "qty": 6
      },
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 8
      }
    ])
  })

  test("remove single product from cart", async () => { 
    var response = await request(app).delete('/cart/sku-1')

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Product sku-1 removed from cart.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 8
      }
    ])
  })

  test("remove a non existing product from cart", async () => {
    var response = await request(app).delete('/cart/sku-15')

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, false, "Cannot find product sku-15.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([
      {
        "sku": "sku-2",
        "title": "title-2",
        "description": "description-2",
        "qty": 8
      }
    ])
  })

  test("empty cart", async () => { 
    var response = await request(app).delete('/cart')

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Cart has been emptied.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([])
  })
}