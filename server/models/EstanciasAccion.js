const mongoose = require('mongoose')

const estanciasAccionSchema = new mongoose.Schema({
    id_estancia: {
        type: mongoose.ObjectId,
        required: true
    },
    id_usuario: {
        type: mongoose.ObjectId,
        required: true
    },
    tipo_usuario: {
        type: String,
        enum: ['acomodador', 'camping']
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    estado: {
        type: String,
        enum: ['reserva', 'entrada', 'salida'],
        required: true
    },
    comentarios: {
        type: Array
    }
})

const EstanciasAccion = mongoose.model('EstanciasAccion', estanciasAccionSchema)

module.exports = { EstanciasAccion }