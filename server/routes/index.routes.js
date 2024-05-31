const { Router } = require('express')
const { connection } = require('../connection/connection')
const { registrarCamping } = require('../controllers/camping.controller')
const { crearConceptos, devolverConceptos } = require('../controllers/conceptos.controller')

connection()
const router = Router()

// RUTAS DE USUARIO CAMPING
router.post("/registrar-camping", registrarCamping)

// RUTAS DE ZONA
router.post("/registrar-camping")

// RUTAS DE ACOMODADOR
router.post("/registrar-camping")

// RUTAS DE CONCEPTOS
router.get("/conceptos/devolver-conceptos", devolverConceptos)

router.post("/conceptos/crear-conceptos", crearConceptos)

// RUTAS DE ESTANCIA    


// RUTAS DE ESTANCIAS_ACCION


// RUTAS DE PARCELA
router.post("/registrar-camping")

module.exports = { router }