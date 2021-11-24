const express = require('express')
const app = express()
const errorMiddleware = require('./middlewares/errors')
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// import all routes
const blood = require('./routes/blood')
app.use(blood);

app.use(errorMiddleware);
module.exports = app