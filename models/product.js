const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
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

module.exports = Product