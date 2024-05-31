const mongoose = require('mongoose')

const acomodadorSchema = new mongoose.Schema({
    
})

const Acomodador = mongoose.model('Acomodador', acomodadorSchema)

module.exports = { Acomodador }