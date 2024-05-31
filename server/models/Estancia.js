const mongoose = require('mongoose')

const estanciaSchema = new mongoose.Schema({
    
})

const Estancia = mongoose.model('Estancia', estanciaSchema)

module.exports = { Estancia }