const mongoose = require('mongoose')

const acomodadorSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String
    },
    telefono: {
        type: String,
        minLength: 9,
        maxLength: 9,
        match: /^[0-9]+$/
    },
    imagen: {
        type: String
    },
    id_camping: {
        type: mongoose.ObjectId,
        required: true
    }
})

const Acomodador = mongoose.model('Acomodador', acomodadorSchema)

module.exports = { Acomodador }