const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => res.json({status: true, message: "shopXpress an expressJS based RESTful ecommerce engine."}));
app.get('/hello', (req, res) => res.json({status:true, message: "Hello World!"}));

module.exports = app;