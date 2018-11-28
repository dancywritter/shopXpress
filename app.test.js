const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/hello', (req, res) => res.json({status:true, message: "Hello World!"}));

module.exports = app;