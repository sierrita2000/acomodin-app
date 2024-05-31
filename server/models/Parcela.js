const mongoose = require('mongoose')

const parcelaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    tamano: {
        type: String,
        enum: ['pequeña', 'media', 'grande'],
        required: true
    },
    electricidad: {
        type: Boolean,
        default: false
    },
    tipos: {
        type: Array,
        required: true
    },
    caracteristicas: {
        type: Array,
        default: []
    },
    id_zona : {
        type: mongoose.ObjectId,
        required: true
    }
})

const Parcela = mongoose.model('Parcela', parcelaSchema)

module.exports = { Parcela }