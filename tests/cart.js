/**
 * contains test cases for product module
 */
const request = require('supertest')
const _ = require('lodash')
const expectations = require('./commons/expectations')

module.exports = (app) => {
  test("it should show products array empty when there is no product in add to the cart", async () => {
    const response = await request(app).get('/cart')

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Showing products in cart.")
    expectations.fieldExistence(response.body.products)

    expect(response.body.products).toEqual([])
  })

  test("it should succesfully add an existing product to the cart", async () => { 
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

  test("it should not allow non-existing sku to be added in cart", async () => {
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

  test("it should not allow an sku to be added to the cart if the supplied quantity is more than available for the sku", async () => {
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

  test("it should add up the quantity supplied for the same sku rather than making a duplicate entry in cart", async () => {
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

  test("it should not add up the quantity supplied for the same sku if the resultant quantity exceeds the available", async () => {
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
  
  test("it should show products array with two entries when another product is added to the cart", async () => {
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

  test("it should update the selected quantity for the product in card and show the reduced quantity for the target product in the products array", async () => {
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

  test("it should update the selected quantity for the product in card and show the increased quantity for the target product in the products array", async () => {
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

  test("it should not allow updating quantity above the available", async () => {
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

  test("it should not allow updating quantity for a non-existing product", async () => {
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

  test("it should show all products in cart", async () => { 
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

  test("it should remove only target sku from the cart", async () => { 
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

  test("it should return a cannot find product message when a non-existing sku is removed", async () => {
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

  test("it should empty the cart", async () => { 
    var response = await request(app).delete('/cart')

    expectations.apiBasic(response)
    expectations.statusAndMessage(response, true, "Cart has been emptied.")
    expectations.fieldExistence(response.body.products)

    expect(_.map(response.body.products, product => _.pick(product, ["sku", "title", "description", "qty"]))).toEqual([])
  })
}