const { Router } = require('express')
const { connection } = require('../connection/connection')
const { registrarCamping } = require('../controllers/camping.controller')
const { crearConceptos, devolverTodosLosConceptos } = require('../controllers/conceptos.controller')

connection()
const router = Router()

// RUTAS DE USUARIO CAMPING
router.post("/registrar-camping", registrarCamping)

// RUTAS DE ZONA

// RUTAS DE PARCELA

// RUTAS DE ACOMODADOR

// RUTAS DE CONCEPTOS
router.get("/conceptos/devolver-conceptos", devolverTodosLosConceptos)

router.post("/conceptos/crear-conceptos", crearConceptos)

// RUTAS DE ESTANCIA    


// RUTAS DE ESTANCIAS_ACCION

module.exports = { router }