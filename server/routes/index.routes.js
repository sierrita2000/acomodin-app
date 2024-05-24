const { Router } = require('express')
const { connection } = require('../connection/connection')
const { crearCamping } = require('../controllers/camping.controller')

connection()
const router = Router()

// RUTAS DE USUARIO CAMPING
router.post("/camping/crear-usuario", crearCamping)

module.exports = { router }