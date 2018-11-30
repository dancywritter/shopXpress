const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Cart = new Schema({
  sku: { type: 'ObjectId', ref: 'Product' },
  qty: { type: Number, default: 1}
}, {timestamps: true})

module.exports = Cart