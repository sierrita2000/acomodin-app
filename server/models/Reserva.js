const mongoose = require('mongoose')

const reservaSchema = new mongoose.Schema({
    
})

const Reserva = mongoose.model('Reserva', reservaSchema)

module.exports = { Reserva }