const mongoose = require('mongoose')

const entradasSalidasSchema = new mongoose.Schema({
    
})

const EntradasSalidas = mongoose.model('EntradasSalidas', entradasSalidasSchema)

module.exports = { EntradasSalidas }