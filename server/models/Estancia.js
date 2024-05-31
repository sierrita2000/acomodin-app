const mongoose = require('mongoose')

const estanciaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        minLength: 9,
        maxLength: 9,
        match: /^[0-9]+$/
    },
    fecha_inicio: {
        type: Date,
        required: true
    },
    fecha_fin: {
        type: Date,
        required: true
    },
    conceptos: {
        type: Array,
        default: []
    },
    parcelas: {
        type: Array,
        default: []
    },
    caracteristicas: {
        type: Array,
        default: []
    }
})

const Estancia = mongoose.model('Estancia', estanciaSchema)

module.exports = { Estancia }