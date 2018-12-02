const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  sku: {
    type: String,
    index: true,
    unique: true
  },
  title: String,
  description: String,
  qty: {
    type: Number,
    default: 0
  }
}, {timestamps: true})

ProductSchema.statics.findBySku = sku => {
  return Product.findOne({sku: sku})
}

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product