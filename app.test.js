/**
 * Test Server
 */
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3001

mongoose.connect('mongodb://localhost:27017/shopXpress_test')

const routes = require('./routes/main');
app.use("/", routes);

module.exports = app;