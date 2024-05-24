const mongoose = require('mongoose');
require('dotenv').config()

const connection = async () => {
    try {
        console.log("iniciando conexión con la base de datos...")
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterprueba.1pxfo0f.mongodb.net/${process.env.DB_NAME}`)
    } catch(error) {
        console.error(error)
    }
}

module.exports = { connection }