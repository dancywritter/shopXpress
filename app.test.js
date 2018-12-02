/**
 * Test Server
 */
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/shopXpress_test', { 
  useCreateIndex:true,
  useNewUrlParser: true 
})

const app = express()
const port = 3001

app.use(bodyParser.json())

const routes = require('./routes/main');
app.use("/", routes);

app.cleanExit = () => {
  mongoose.connection.close()
}

module.exports = app;