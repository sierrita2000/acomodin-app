const { Router } = require('express')
const { registrarCamping, devolverCamping, devolverCampingPorID, actualizarDatosCamping, actualizarPasswordCamping, actualizarCamping } = require('../controllers/camping.controller')
const { crearConceptos, devolverTodosLosConceptos } = require('../controllers/conceptos.controller')
const multer = require('multer')
const { registrarZonas, devolverZonas, actualizarZonas } = require('../controllers/zona.controller')
const { registrarAcomodadores, devolverAcomodador, devolverAcomodadorPorID, actualizarDatosAcomodador, actualizarPasswordAcomodador, devolverAcomodadoresCamping, actualizarAcomodadoresCamping, devolverCampingDeAcomodador } = require('../controllers/acomodador.controller')
const { devolverParceaPorId, devolverParcelasPorZona, devolverParcelasPorCamping, devolverParcelasLibresEntreFechasConConceptos, devolverParcelasOcupadasCampingEnFecha, devolverZonasYParcelasConFiltros } = require('../controllers/parcela.controller')
const { crearEstancia, devolverEstanciaPorId, devolverEstanciaActualYReservasFuturasDeParcela, devolverEstadoParcelaDia, devolverEstanciasPorEstadoYFecha, devolverEstanciasPorFiltros, devolverEntradasHoySinSalir, devolverReservasHoySinLlegar, eliminarEstancia, editarEstancia, devolverEstanciasConAccionPendiente } = require('../controllers/estancia.controller')
const { devolverEstanciaPorIdAccion, crearLlegadaSalidaReserva, deshacerLegadaOSalida } = require('../controllers/estancia-accion.controller')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })
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
router.get("/parcelas/devolver-parcelas/id_camping/:id_camping", devolverParcelasPorCamping)
router.get("/parcelas/ocupadas/id_camping/:id_camping/fecha/:fecha", devolverParcelasOcupadasCampingEnFecha)

router.post("/parcelas/devolver-parcelas-filtradas", devolverParcelasLibresEntreFechasConConceptos)
router.post("/parcelas/zonas-parcelas-filtradas/id_camping/:id_camping", devolverZonasYParcelasConFiltros)

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
router.get("/estancias/id_camping/:id_camping/filtros/fecha/:fecha/estado/:estado", devolverEstanciasPorEstadoYFecha)
router.get("/estancias/devolver-reservas-hoy-sin-llegar/id_camping/:id_camping", devolverReservasHoySinLlegar)
router.get("/estancias/devolver-entradas-hoy-sin-salir/id_camping/:id_camping", devolverEntradasHoySinSalir)
router.get("/estancias/pendientes/id_camping/:id_camping", devolverEstanciasConAccionPendiente)

router.post("/estancias/crear-estancia", crearEstancia)
router.post("/estancias/devolver-estancias-filtros/id_camping/:id_camping", devolverEstanciasPorFiltros)

router.put("/estancia/editar/id/:id", editarEstancia)

router.delete("/estancia/eliminar/id/:id", eliminarEstancia)

// RUTAS DE ESTANCIAS_ACCION
router.get("/estancia-accion/id/:id", devolverEstanciaPorIdAccion)

router.post("/estancia/marcar-llegada/id_estancia/:id_estancia", crearLlegadaSalidaReserva)
router.post("/estancia/marcar-salida/id_estancia/:id_estancia", crearLlegadaSalidaReserva)

router.delete("/estancia/deshacer-accion/id_estancia_accion/:id", deshacerLegadaOSalida)

module.exports = { router }