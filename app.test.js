/**
 * Test Server
 */
const express = require('express')
const app = express()
const port = 3001

const routes = require('./routes/main');
app.use("/", routes);

module.exports = app;