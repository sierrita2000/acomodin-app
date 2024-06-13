const { Router } = require('express')
const { connection } = require('../connection/connection')
const { registrarCamping, devolverCamping, devolverCampingPorID } = require('../controllers/camping.controller')
const { crearConceptos, devolverTodosLosConceptos } = require('../controllers/conceptos.controller')
const multer = require('multer')
const { registrarZonas } = require('../controllers/zona.controller')
const { registrarAcomodadores, devolverAcomodador, devolverAcomodadorPorID } = require('../controllers/acomodador.controller')

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
router.get("/camping/usuario/:usuario/password/:password", devolverCamping)
router.get("/camping/id/:id_camping", devolverCampingPorID)

router.post("/camping/registrar-camping", upload.single('imagenCamping'), registrarCamping)

// RUTAS DE ZONA
router.post("/zonas/registrar-zonas", registrarZonas)

// RUTAS DE PARCELA

// RUTAS DE ACOMODADOR
router.get("/acomodadores/usuario/:usuario/password/:password", devolverAcomodador)
router.get("/acomodador/id/:id_acomodador", devolverAcomodadorPorID)

router.post("/acomodadores/registrar-acomodadores", registrarAcomodadores)

// RUTAS DE CONCEPTOS
router.get("/conceptos/devolver-conceptos", devolverTodosLosConceptos)

router.post("/conceptos/crear-conceptos", crearConceptos)

// RUTAS DE ESTANCIA    


// RUTAS DE ESTANCIAS_ACCION

module.exports = { router }