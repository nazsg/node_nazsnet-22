const path = require('path')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
// import Routes
const authRoute = require('./routes/auth')
const mailRoute = require('./routes/mail')
const journalRoute = require('./routes/journal')
const orderRoute = require('./routes/order')
const menuRoute = require('./routes/menus')
// const wineRoute = require('./routes/wines')
const cors = require('cors')

dotenv.config()

// connect to DB
mongoose.connect(
  process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},
  () => console.log('connected to db!')
)

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

// Middleware
app.use(express.json()) // based on body-parser, included since Express 4.16


// Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/mail', mailRoute)
app.use('/api/journals', journalRoute)
app.use('/api/orders', orderRoute)
app.use('/api/menus', menuRoute)
// app.use('/api/wines', wineRoute)


app.use('/other', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'other.html'))
})


// app.use('*', (req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
// })
app.use('/test', (req, res, next) => {
  res.send('Test..')
})
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'))
})

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(port=3020, () => console.log('Server up and running at port ' + port))