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

module.exports = mongoose.model('Product', ProductSchema)