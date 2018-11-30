module.exports = {
  apiBasic() {
    expect(response.statusCode).toBe(200)
    expect(response.type).toMatch(/json/)
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