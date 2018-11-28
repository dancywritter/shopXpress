const express = require('express')
const app = express()
const port = 3001

app.all('/', (req, res) => {
  if(req.method == 'GET') {
    res.json({status: true, message: "shopXpress an expressJS based RESTful ecommerce engine."})
  } else {
    res.status(405).json({status: false, message: "Method "+req.method.toUpperCase()+" not allowed on /"})
  }
});
app.get('/hello', (req, res) => res.json({status:true, message: "Hello World!"}));

module.exports = app;