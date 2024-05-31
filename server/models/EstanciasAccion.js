const mongoose = require('mongoose')

const estanciasAccionSchema = new mongoose.Schema({
    id_estancia: {
        type: mongoose.ObjectId,
        required: true
    },
    id_parcela: {
        type: mongoose.ObjectId,
        required: true
    },
    
})

const EstanciasAccion = mongoose.model('EstanciasAccion', estanciasAccionSchema)

module.exports = { EstanciasAccion }