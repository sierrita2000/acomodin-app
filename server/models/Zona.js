const mongoose = require('mongoose')

const zonaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    id_tipos: {
        type: mongoose.ObjectId,
        required: true
    },
    id_camping: {
        type: mongoose.ObjectId,
        required: true
    }
})

const Zona = mongoose.model('Zona', zonaSchema)

module.exports = { Zona }