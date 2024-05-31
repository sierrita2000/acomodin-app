const mongoose = require('mongoose')

const conceptosSchema = new mongoose.Schema({
    
})

const Conceptos = mongoose.model('Conceptos', conceptosSchema)

module.exports = { Conceptos }