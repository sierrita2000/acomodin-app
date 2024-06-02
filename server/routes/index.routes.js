const { Router } = require('express')
const { connection } = require('../connection/connection')
const { registrarCamping } = require('../controllers/camping.controller')
const { crearConceptos, devolverTodosLosConceptos } = require('../controllers/conceptos.controller')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

connection()
const router = Router()

// RUTAS DE USUARIO CAMPING
router.post("/registrar-camping", upload.single('logoCamping'), registrarCamping)

// RUTAS DE ZONA

// RUTAS DE PARCELA

// RUTAS DE ACOMODADOR

// RUTAS DE CONCEPTOS
router.get("/conceptos/devolver-conceptos", devolverTodosLosConceptos)

router.post("/conceptos/crear-conceptos", crearConceptos)

// RUTAS DE ESTANCIA    


// RUTAS DE ESTANCIAS_ACCION

module.exports = { router }