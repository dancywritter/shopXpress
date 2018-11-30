const Product = require('../models/product')

module.exports = {
  index(req, res) {
    
  },

  async create(req, res) {
    const product = new Product(req.body)
    await product.save().then(product => {
      res.json({
        status:true,
        message: "Product with sku: "+product.sku+" created successfully!",
        product: product
      })
    }).catch(err => {
      res.status(500).json({
        status:false,
        message: err.code == 11000 ? "Product with sku: "+req.body.sku+" already exist!" : err.message
      })
    })

    //res.json({message: 'reach'})
  },

  update() {

  },
}