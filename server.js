// express lib http server
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const  cors  = require('cors')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const { default: mongoose } = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

//user middleware

app.use(logger)

// static middleware

app.use(express.json())
app.use(cors(corsOptions))

app.use(express.static('..public'))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))




app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
})

app.use(errorHandler)


mongoose.connection.on('open' , () => {
    console.log('Connected to MongoDB')

    app.listen(PORT, () => console.log(`Server running on  ${PORT}`))

} )

mongoose.connection.on('error' , err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.name}`, 
    'mongoErrLog.log' )
     
} )
