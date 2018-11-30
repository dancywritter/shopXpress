module.exports = {
  index(req, res) {
    console.log("main called")
    res.send({status:true, message: "hello product"})
  },

  create() {

  },

  update() {

  },
}