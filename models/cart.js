const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
  sku: { type: String },
  qty: { type: Number, default: 1}
}, {timestamps: true})

CartSchema.statics.getCartProducts = () => {
  return Cart.aggregate([
    {$lookup: {
      from: 'products',
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
  ]).exec()
}

CartSchema.statics.getCartProductBySku = sku => {
  return Cart.findOne({sku})
}

const Cart = mongoose.model('Cart', CartSchema)

module.exports = Cart