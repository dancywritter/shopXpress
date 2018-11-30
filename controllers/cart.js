const Cart = require('../models/cart')

module.exports = {
  async index(req, res) {
    await Cart.aggregate([
      {$lookup: {
        from: 'product',
        localField: 'sku',
        foreignField: 'sku',
        as: 'product'
      }},
      {$addFields: {
        product: {$arrayElemAt: ['$product', 0]}
      }},
      {$addFields: {
        'product.qty': '$qty'
      }},
      {$replaceRoot: {
        newRoot: "$product"
      }}
    ]).exec().then(products => {
      res.json({
        status:true,
        message: "Showing products in cart.",
        products
      })
    }).catch(err => {
      res.json({
        status:false,
        message: err.message,
        errorCode: err.code
      })
    })
  },

  addProduct() {

  },
  changeProductQty() {

  },
  removeSingleProduct() {

  },
  empty() {

  }
}