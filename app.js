const express = require('express')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// import all routes
const blood = require('./routes/blood')
app.use(blood);


module.exports = app