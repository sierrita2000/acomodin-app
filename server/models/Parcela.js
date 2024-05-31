const mongoose = require('mongoose')

const parcelaSchema = new mongoose.Schema({
    
})

const Parcela = mongoose.model('Parcela', parcelaSchema)

module.exports = { Parcela }