const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { router } = require('./routes/index.routes')
const { errores } = require('./middlewares/errores')

const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res, next) => {
    res.send("<h1>API ACOMODIN</h1>")
    next()
})

app.use(router)
app.use(errores)

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})