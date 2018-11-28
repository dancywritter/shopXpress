/**
 * contains test cases for product module
 */
const request = require('supertest');
const app = require('../app.test');

describe("create a product", () => {
  test("it should clear product collection", async () => {
    const response = await request(app).delete('/products')
    expect(response.status).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("All products cleared.")
    expect(response.body.product.sku).toBe(sku)
    expect(response.body.title)
  })

  test("it should create a dummy product", async () => {
    const product = {
      sku: "dummy-1",
      title: "Dummy Product",
      description: "Dummy Product description",
      slug: "dummy-product-1"
    }

    const response = await request(app).post('/products').send(product)
    
    expect(response.status).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object")
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe("Product with sku created successfully.")

    expect(response.body.product).not.toBeUndefined()
    expect(response.body.product).not.toBeNull()
    expect(typeof response.body.product).toBe("object")
    expect(response.body.product.sku).not.toBeUndefined().not.toBeNull().toBe(product.sku)
    expect(response.body.product.title).not.toBeUndefined().not.toBeNull().toBe(product.title)
    expect(response.body.product.description).not.toBeUndefined().not.toBeNull().toBe(product.description)
    expect(response.body.product.slug).not.toBeUndefined().not.toBeNull().toBe(product.slug)
  })
})