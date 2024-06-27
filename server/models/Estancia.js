const mongoose = require('mongoose')

const estanciaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        match: /^[0-9]+$/
    },
    fecha_inicio: {
        type: String,
        required: true
    },
    fecha_fin: {
        type: String,
        required: true
    },
    conceptos: {
        type: Array,
        default: []
    },
    parcela: {
        type: mongoose.ObjectId,
        default: null
    },
    caracteristicas: {
        type: Array,
        default: []
    },
    id_camping: {
        type: mongoose.ObjectId,
        required: true
    }
})

const Estancia = mongoose.model('Estancia', estanciaSchema)

module.exports = { Estancia }