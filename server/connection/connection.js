const mongoose = require('mongoose');
require('dotenv').config()

const connection = async () => {
    try {
        console.log("iniciando conexión con la base de datos...")
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m4ibn.mongodb.net/${process.env.DB_NAME}`)
        //mongodb+srv://acomodininfo:<db_password>@clusterprueba.1pxfo0f.mongodb.net/
    } catch(error) {
        console.error(error)
    }
}

module.exports = { connection }