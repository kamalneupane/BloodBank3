const express = require('express')
const app = express()
const errorMiddleware = require('./middlewares/errors')
const cookieParser = require('cookie-parser')




app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

// import all routes
const blood = require('./routes/blood')
const user = require('./routes/auth')
const request = require('./routes/request')


app.use(blood);
app.use(user)
app.use(request);

app.use(errorMiddleware);
module.exports = app