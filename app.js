const express = require('express')
const app = express()
const errorMiddleware = require('./middlewares/errors')
const cookieParser = require('cookie-parser')




app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

// import all routes
const blood = require('./routes/blood')
app.use(blood);

const user = require('./routes/auth')
app.use(user)


app.use(errorMiddleware);
module.exports = app