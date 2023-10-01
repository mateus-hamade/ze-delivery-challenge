const express = require('express')

const app = express()

const partnerRoutes = require('./routes/partnerRoutes')

app.use(express.json())
app.use('/partner', partnerRoutes)

module.exports = app