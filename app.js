/**
 * Main server
 */
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/shopXpress', { 
  useCreateIndex:true,
  useNewUrlParser: true 
})

const app = express()
const port = 3000

app.use(bodyParser.json())

const routes = require('./routes/main');
app.use("/", routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))