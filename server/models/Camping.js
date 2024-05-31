const mongoose = require('mongoose')

const campingSchema = new mongoose.Schema({
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
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
    },
    nombre: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    tamanos: {
        type: Array
    },
    id_conceptos: {
        type: mongoose.ObjectId
    }
})

const Camping = mongoose.model("Camping", campingSchema)

module.exports = { Camping }