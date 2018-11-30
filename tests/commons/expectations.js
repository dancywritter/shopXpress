module.exports = {
  apiBasic(response) {
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object"); //check for json object
    expect(response.body).not.toBeNull()
    expect(response.body).not.toBeUndefined()
  },

  apiBasic404(response) {
    expect(response.statusCode).toBe(404)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object"); //check for json object
    expect(response.body).not.toBeNull()
    expect(response.body).not.toBeUndefined()
  },

  apiBasic405(response) {
    expect(response.statusCode).toBe(405)
    expect(response.type).toMatch(/json/)
    expect(typeof response.body).toBe("object"); //check for json object
    expect(response.body).not.toBeNull()
    expect(response.body).not.toBeUndefined()
  },

  statusAndMessage(response, status, message) {
    expect(response.body.status).toBe(status)
    expect(response.body.message).toBe(message)
  },

  fieldExistence(field) {
    expect(field).not.toBeNull()
    expect(field).not.toBeUndefined()
  }
}