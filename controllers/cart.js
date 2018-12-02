const Cart = require('../models/cart')
const Product = require('../models/product')

module.exports = {
  async index(req, res) {
    await Cart.getCartProducts().then(products => {
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

  /**
   * addProduct
   * 
   * @param {Request} req 
   * @param {Response} res 
   */
  async addProduct(req, res) {
    try {
      const product = await Product.findBySku(req.params.sku).catch(err => { throw err })

      if(product == null) return res.json({
        status:false,
        message: "Product with "+req.params.sku+" not found in our database.",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })

      //see if already in cart
      var cartProduct = await Cart.getCartProductBySku(req.params.sku).catch(err => { throw err })

      if((cartProduct ? cartProduct.qty + req.body.qty : req.body.qty) > product.qty) return res.json({
        status:false,
        message: "We currently have only "+product.qty+" "+product.sku+" in stock.",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })

      if(cartProduct) {
        await Cart.updateOne({sku: cartProduct.sku}, {$set: {qty: cartProduct.qty + req.body.qty}}).catch(err => { throw err })
      } else {
        cartProduct = new Cart({sku: req.params.sku, qty: req.body.qty});
        await cartProduct.save().catch(err => { throw err})
      }

      res.json({
        status:true,
        message: "Product added to cart.",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })
    } catch(err) {
      res.json({
        status:false,
        message: err.message
      })
    }
  },

  async changeProductQty(req, res) {
    try {
      const product = await Product.findBySku(req.params.sku).catch(err => { throw err })
      const cartProduct = await Cart.getCartProductBySku(req.params.sku).catch(err => { throw err })

      if(product == null || cartProduct == null) return res.json({
        status:false,
        message: "Cannot find product "+req.params.sku+".",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })

      if(req.body.qty > product.qty) return res.json({
        status:false,
        message: "We currently have only "+product.qty+" "+product.sku+" in stock.",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })

      //update cart qty
      await Cart.updateOne({sku: req.params.sku}, {$set: {qty: req.body.qty}}).catch(err => { throw err })

      res.json({
        status: true,
        message: "Qty for "+req.params.sku+" in cart updated to "+req.body.qty+".",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })
    } catch(err) {
      res.json({
        status:false,
        message: err.message
      })
    }
  },

  async removeSingleProduct(req, res) {
    try {
      const product = await Product.findBySku(req.params.sku).catch(err => { throw err })
      const cartProduct = await Cart.getCartProductBySku(req.params.sku).catch(err => { throw err })

      if(product == null || cartProduct == null) return res.json({
        status:false,
        message: "Cannot find product "+req.params.sku+".",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })

      //update cart qty
      await Cart.deleteOne({sku: req.params.sku}).catch(err => { throw err })

      res.json({
        status: true,
        message: "Product "+req.params.sku+" removed from cart.",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })
    } catch(err) {
      res.json({
        status:false,
        message: err.message
      })
    }
  },

  async empty(req, res) {
    try {
      //update cart qty
      await Cart.deleteMany({}).catch(err => { throw err })

      res.json({
        status: true,
        message: "Cart has been emptied.",
        products: await Cart.getCartProducts().catch(err => { throw err })
      })
    } catch(err) {
      res.json({
        status:false,
        message: err.message
      })
    }
  },
}