const mongoose = require('mongoose')

const tiposSchema = new mongoose.Schema({
    
})

const Tipo = mongoose.model('Tipo', tiposSchema)

module.exports = { Tipo }