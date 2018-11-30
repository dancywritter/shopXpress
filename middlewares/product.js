module.exports = {
  getAll(req, res, next) {
    console.log("middleware called")
    next()
  }
}