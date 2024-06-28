const { Router } = require('express')
const { connection } = require('../connection/connection')
const { registrarCamping, devolverCamping, devolverCampingPorID, actualizarDatosCamping, actualizarPasswordCamping, actualizarCamping } = require('../controllers/camping.controller')
const { crearConceptos, devolverTodosLosConceptos } = require('../controllers/conceptos.controller')
const multer = require('multer')
const { registrarZonas, devolverZonas, actualizarZonas } = require('../controllers/zona.controller')
const { registrarAcomodadores, devolverAcomodador, devolverAcomodadorPorID, actualizarDatosAcomodador, actualizarPasswordAcomodador, devolverAcomodadoresCamping, actualizarAcomodadoresCamping, devolverCampingDeAcomodador } = require('../controllers/acomodador.controller')
const { devolverParceaPorId, devolverParcelasPorZona } = require('../controllers/parcela.controller')
const { crearEstancia, devolverEstanciaPorId, devolverEstanciaActualYReservasFuturasDeParcela, devolverEstadoParcelaDia } = require('../controllers/estancia.controller')

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

router.put("/camping/actualizar-camping/id/:id", actualizarCamping)
router.put("/camping/actualizar-datos-camping/id/:id", upload.single('imagen'), actualizarDatosCamping)
router.put("/camping/actualizar-password/id/:id", actualizarPasswordCamping)

// RUTAS DE ZONA
router.get("/zonas/devolver-zonas/id_camping/:id_camping", devolverZonas)

router.post("/zonas/registrar-zonas", registrarZonas)

router.put("/zonas/actualizar-zonas/id_camping/:id_camping", actualizarZonas)

// RUTAS DE PARCELA
router.get("/parcelas/devolver-parcelas/id_zona/:id_zona", devolverParcelasPorZona)
router.get("/parcelas/id/:id", devolverParceaPorId)

// RUTAS DE ACOMODADOR
router.get("/acomodadores/usuario/:usuario/password/:password", devolverAcomodador)
router.get("/acomodador/id/:id_acomodador", devolverAcomodadorPorID)
router.get("/acomodadores/id_camping/:id_camping", devolverAcomodadoresCamping)
router.get("/acomodador/:id/devolver-camping", devolverCampingDeAcomodador)

router.post("/acomodadores/registrar-acomodadores", registrarAcomodadores)

router.put("/acomodadores/actualizar-acomodador/id/:id", upload.single('imagen'), actualizarDatosAcomodador)
router.put("/acomodadores/actualizar-password/id/:id", actualizarPasswordAcomodador)
router.put("/acomodadores/actualizar-acomodadores/id_camping/:id_camping", actualizarAcomodadoresCamping)

// RUTAS DE CONCEPTOS
router.get("/conceptos/devolver-conceptos", devolverTodosLosConceptos)

router.post("/conceptos/crear-conceptos", crearConceptos)

// RUTAS DE ESTANCIA    
router.get("/estancias/reservas/id_parcela/:id_parcela", devolverEstanciaActualYReservasFuturasDeParcela)
router.get("/estancia/id/:id", devolverEstanciaPorId)
router.get("/estancia/id_parcela/:id_parcela/fecha/:fecha", devolverEstadoParcelaDia)
router.get("/estancias/filtros/fecha/:fecha/estado/:estado")

router.post("/estancias/crear-estancia", crearEstancia)

// RUTAS DE ESTANCIAS_ACCION

module.exports = { router }