const mongoose = require('mongoose')

const conceptoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
})

const Concepto = mongoose.model('Concepto', conceptoSchema)

module.exports = { Concepto }