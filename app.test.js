/**
 * Test Server
 */
const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/shopXpress_test', { useNewUrlParser: true })

const app = express()
const port = 3001

const routes = require('./routes/main');
app.use("/", routes);

module.exports = app;