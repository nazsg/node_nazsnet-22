const path = require('path')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const mailRoute = require('./routes/mail')
const journalRoute = require('./routes/journal')
const orderRoute = require('./routes/order')
const menuRoute = require('./routes/menus')
const productRoute = require('./routes/product')
const expressHbs = require('express-handlebars')
const cors = require('cors')
const compression = require('compression')

dotenv.config()

// connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log('connected to db!')
)

app.engine('hbs', expressHbs())
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(compression)
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) // based on body-parser, included since Express 4.16

// Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/mail', mailRoute)
app.use('/api/journals', journalRoute)
app.use('/api/orders', orderRoute)
app.use('/api/menus', menuRoute)
app.use('/api/products', productRoute)

app.use('/other', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'other.html'))
})

app.get('/api/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'))
})

app.use('/test', (req, res, next) => {
  res.send('Test')
})
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'))
})

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found again' })
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen((port = 3020), () => console.log('Server up and running at port ' + port))
