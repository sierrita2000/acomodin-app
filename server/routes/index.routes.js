const { Router } = require('express')
const { connection } = require('../connection/connection')
const { registrarCamping, devolverCamping, devolverCampingPorID, actualizarDatosCamping, actualizarPasswordCamping } = require('../controllers/camping.controller')
const { crearConceptos, devolverTodosLosConceptos } = require('../controllers/conceptos.controller')
const multer = require('multer')
const { registrarZonas, devolverZonas } = require('../controllers/zona.controller')
const { registrarAcomodadores, devolverAcomodador, devolverAcomodadorPorID, actualizarDatosAcomodador, actualizarPasswordAcomodador, devolverAcomodadoresCamping } = require('../controllers/acomodador.controller')
const { devolverParcelas, devolverParceaPorId } = require('../controllers/parcela.controller')

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

router.put("/camping/actualizar-camping/id/:id", upload.single('imagen'), actualizarDatosCamping)
router.put("/camping/actualizar-password/id/:id", actualizarPasswordCamping)

// RUTAS DE ZONA
router.get("/zonas/devolver-zonas/id_camping/:id_camping", devolverZonas)

router.post("/zonas/registrar-zonas", registrarZonas)

// RUTAS DE PARCELA
router.get("/parcelas/devolver-parcelas/id_zona/:id_zona", devolverParcelas)
router.get("/parcelas/id/:id", devolverParceaPorId)

// RUTAS DE ACOMODADOR
router.get("/acomodadores/usuario/:usuario/password/:password", devolverAcomodador)
router.get("/acomodador/id/:id_acomodador", devolverAcomodadorPorID)
router.get("/acomodadores/id_camping/:id_camping", devolverAcomodadoresCamping)

router.post("/acomodadores/registrar-acomodadores", registrarAcomodadores)

router.put("/acomodadores/actualizar-acomodador/id/:id", upload.single('imagen'), actualizarDatosAcomodador)
router.put("/acomodadores/actualizar-password/id/:id", actualizarPasswordAcomodador)

// RUTAS DE CONCEPTOS
router.get("/conceptos/devolver-conceptos", devolverTodosLosConceptos)

router.post("/conceptos/crear-conceptos", crearConceptos)

// RUTAS DE ESTANCIA    


// RUTAS DE ESTANCIAS_ACCION

module.exports = { router }