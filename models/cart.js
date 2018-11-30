const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
  sku: { type: 'ObjectId', ref: 'Product' },
  qty: { type: Number, default: 1}
}, {timestamps: true})

module.exports = mongoose.model('Cart', CartSchema)