const mongoose = require('mongoose')

const acomodadorSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        match: /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        default: ''
    },
    telefono: {
        type: String,
        minLength: 9,
        maxLength: 9,
        match: /^[0-9]+$/,
        default: '000000000'
    },
    imagen: {
        type: String,
        default: ''
    },
    id_camping: {
        type: mongoose.ObjectId,
        required: true
    }
})

const Acomodador = mongoose.model('Acomodador', acomodadorSchema)

module.exports = { Acomodador }