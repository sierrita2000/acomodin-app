const { ResponseAPI } = require('../classes/ResponseAPI')
const { Estancia } = require('../models/Estancia')
const { EstanciasAccion } = require('../models/EstanciasAccion')
const { Parcela } = require('../models/Parcela')
const { Zona } = require('../models/Zona')

const devolverEstanciaActualYReservasFuturasDeParcela = async (req, res, next) => {
    try {
        const { id_parcela } = req.params
        const fecha_actual = new Date()

        // Estancias que incluyan la parcela con id "id_parcela" y que sean de hoy o más adelante. 
        await Estancia.find({ parcela: id_parcela }).exec()
            .then(async results => {
                if(results.length > 0) {
                    const estancias_parcela = results.filter(estancia => new Date(estancia.fecha_fin) > fecha_actual)
                    if (estancias_parcela.length > 0) {
                        const promises = results.map(async estancia => {
                            const results_estancia_accion = await EstanciasAccion.find({ id_estancia: estancia._id }).exec()

                            let obj_estancia_accion = results_estancia_accion[0]

                            if(results_estancia_accion.length > 1) {
                                results_estancia_accion.shift()
                                results_estancia_accion.forEach(ea => {
                                    if(new Date(ea.fecha) > new Date(obj_estancia_accion.fecha)) {
                                        obj_estancia_accion = ea
                                    }
                                })
                            }

                            return { estancia: estancia, estancia_accion: obj_estancia_accion }
                        })

                        await Promise.all(promises).then(estancias => {
                            res.status(200).send(new ResponseAPI('ok', `Estancias futuras para la parcela con id ${id_parcela}`, estancias))
                        })
                    } else {
                        res.status(404).send(new ResponseAPI('not-found', `No existen reservas futuras para la parcela con id ${id_parcela}`, null))
                    }
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen reservas futuras para la parcela con id ${id_parcela}`, null))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch (error) {
        next(error)
    }
}

/**
 * Devuelve una estancia por su ID.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverEstanciaPorId = async (req, res, next) => {
    try {
        const { id } = req.params

        await Estancia.findById(id).exec()
            .then(async results_estancia => {
                await EstanciasAccion.find({ id_estancia: id }).exec()
                    .then(results_estancia_accion => {
                        let obj_estancia_accion = results_estancia_accion[0]

                        if(results_estancia_accion.length > 1) {
                            results_estancia_accion.shift()
                            results_estancia_accion.forEach(ea => {
                                if(new Date(ea.fecha) > new Date(obj_estancia_accion.fecha)) {
                                    obj_estancia_accion = ea
                                }
                            })
                        }

                        res.status(200).send(new ResponseAPI('ok', `Estancia con id ${id}`, { estancia: results_estancia, estancia_accion: obj_estancia_accion }))
                    })
                    .catch(error => { throw new Error(error) })
            })
            .catch(error => { throw new Error(error) })
    } catch (error) {
        next(error)
    }
}

/**
 * Registra una estancia.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const crearEstancia = async (req, res, next) => {
    try {
        const { estancia, estancia_accion } = req.body

        huecosLibresCampingPorFecha(estancia.id_camping, estancia.fecha_inicio, estancia.fecha_fin)
            .then(resultHuecosLibresCamping => {
                if (resultHuecosLibresCamping > 0) {
                    if (estancia.parcela) {
                        validarParcelaLibrePorFecha(estancia.parcela, estancia.fecha_inicio, estancia.fecha_fin)
                            .then(async resultsValidarParcelaFecha => {
                                if (resultsValidarParcelaFecha) { // Crea la estancia.
                                    grabarEstancia(estancia, estancia_accion, res)
                                } else { // Devuelve el número de huecos libres que quedan en el camping
                                    res.status(200).send(new ResponseAPI('not-allowed', `Esta parcela está ocupada para las fechas ${estancia.fecha_inicio.replace('-', '/')} - ${estancia.fecha_fin.replace('-', '/')}.`, { huecosLibresCamping: resultHuecosLibresCamping }))
                                }
                            })
                    } else { // Reserva sin parcela especificada.
                        grabarEstancia(estancia, estancia_accion, res)
                    }
                } else {
                    res.status(200).send(new ResponseAPI('not-allowed', `No hay hueco en el camping entre las fechas ${estancia.fecha_inicio.replace('-', '/')} - ${estancia.fecha_fin.replace('-', '/')}.`, null))
                }
            })
    } catch(error) {
        next(error)
    }
}

/**
 * Graba una estancia en la BBDD.
 * @param {Object} estancia 
 * @param {Object} estancia_accion 
 */
const grabarEstancia = async (estancia, estancia_accion, res) => {
    const obj_estancia = new Estancia({ ...estancia })
    await obj_estancia.save()
        .then(async results_estancia => {
            const id_estancia = results_estancia._id

            const obj_estancia_accion = new EstanciasAccion({ id_estancia, ...estancia_accion })
            await obj_estancia_accion.save()
                .then(results_estancia_accion => {
                    res.status(200).send(new ResponseAPI('ok', `${estancia_accion.estado} registrada correctamente.`, { results_estancia, results_estancia_accion }))
                })
                .catch(error => { throw new Error(error) })
        })
        .catch(error => { throw new Error(error) })
}

/**
 * Devuelve una estancia de una parcela en un día específico
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverEstadoParcelaDia = async (req, res, next) => {
    try {
        const { id_parcela, fecha } = req.params

        estanciaParcelaEnFecha(id_parcela, fecha)
            .then(async estancia => {
                if (estancia) {
                    if (new Date(estancia.fecha_inicio) < new Date(fecha) && new Date(estancia.fecha_fin) > new Date(fecha)) {
                        res.status(200).send(new ResponseAPI('ok', 'estado parcela', 'ocupada'))
                    } else {
                        await EstanciasAccion.find({ id_estancia: estancia._id }).exec()
                            .then(results_estancia_accion => {
                                const estancia_accion_mas_reciente = estanciaAccionMasReciente(results_estancia_accion)
                                let estado = ''
                                if (estancia_accion_mas_reciente.estado === 'reserva') {
                                    if (fecha === estancia.fecha_inicio) {
                                        estado = 'reservada'
                                    } else {
                                        estado = 'salida prevista para hoy'
                                    }
                                } else if (estancia_accion_mas_reciente.estado === 'entrada') {
                                    estado = 'ocupada'
                                } else if (estancia_accion_mas_reciente.estado === 'salida') {
                                    estado = 'libre'
                                }

                                res.status(200).send(new ResponseAPI('ok', `estado parcela ${fecha}`, estado))
                            })
                            .catch(error => {  throw new Error(error)})
                    }
                } else {
                    res.status(200).send(new ResponseAPI('ok', `estado parcela ${fecha}`, 'libre'))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todas las estancias de un camping en una fecha y de un tipo de estado.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverEstanciasPorFiltros = async (req, res, next) => {
    try {
        const { fecha, estado } = req.params


    } catch(error) {
        next(error)
    }
}

module.exports = { devolverEstanciaActualYReservasFuturasDeParcela, crearEstancia, devolverEstanciaPorId, devolverEstadoParcelaDia }

/**************************************************************************************************************/
/**************************************************************************************************************/
/**************************************************************************************************************/

/**
 * Devuelve la instancia de estancia_accion más reciente
 * @param {Array} lista_estancias_accion 
 * @returns Object
 */
const estanciaAccionMasReciente = (lista_estancias_accion) => {
    let estancia_accion_mas_reciente = lista_estancias_accion[0]
    lista_estancias_accion?.shift()

    lista_estancias_accion?.forEach(estancia_accion => {
        if (new Date(estancia_accion.fecha) > new Date(estancia_accion_mas_reciente.fecha)) {
            estancia_accion_mas_reciente = estancia_accion
        }
    })

    return estancia_accion_mas_reciente
}

/**
 * Devuelve la estancia, si existe, de una parcela en la fecha indicada.
 * @param {String} parcela 
 * @param {Date} fecha
 * @returns Object
 */
const estanciaParcelaEnFecha = async (parcela, fecha) => {
    let estancia = null
    const fecha_ = new Date(fecha)

    const resultsEstancias = await Estancia.find({ parcela }).exec()

    if (resultsEstancias.length > 0) {
        estancia = resultsEstancias.find(estancia => (new Date(estancia.fecha_inicio) <= fecha_) && (new Date(estancia.fecha_fin) >= fecha_))
    }

    return estancia
}

/**
 * Comprueba si una parcela esta libre sin estancias durante unas fechas.
 * @param {String} id_parcela 
 * @param {Date} fecha_inicio 
 * @param {Date} fecha_fin 
 * @returns Boolean
 */
const validarParcelaLibrePorFecha = async (parcela, fecha_inicio, fecha_fin) => {
    let parcela_libre = true
    const fecha_inicio_nueva_estancia = new Date(fecha_inicio)
    const fecha_fin_nueva_estancia = new Date(fecha_fin)

    const resultsEstancias = await Estancia.find({ parcela }).exec()

    if (resultsEstancias.length > 0) {
        const estancias_parcela_en_fechas = resultsEstancias.filter(estancia => (new Date(estancia.fecha_inicio) < fecha_fin_nueva_estancia) && (new Date(estancia.fecha_fin) > fecha_inicio_nueva_estancia))
        if (estancias_parcela_en_fechas.length > 0) parcela_libre = false
    }

    return parcela_libre
}

/**
 * Devuelve los huecos losbres de un camping entre dos fechas dadas.
 * @param {String} id_camping 
 * @param {Date} fecha_inicio 
 * @param {Date} fecha_fin  
 * @returns Number
 */
const huecosLibresCampingPorFecha = async (id_camping, fecha_inicio, fecha_fin) => {
    const promises = [cantidadParcelasCamping(id_camping), cantidadEstanciasCampingPorFecha(id_camping, fecha_inicio, fecha_fin)]

    const huecos_libres = await Promise.all(promises)
    return huecos_libres[0]-huecos_libres[1]
}

/**
 * Cuenta la cantidad de parcelas de un camping.
 * @param {String} id_camping 
 * @returns Number
 */
const cantidadParcelasCamping = async (id_camping) => {
    let cantidad_parcelas = 0
    const resultsZonas = await Zona.find({ id_camping }).exec()
    
    if (resultsZonas.length > 0) {
        const promises = resultsZonas.map(async (zona) => {
            const id_zona = zona._id
            const resultsParcelas = await Parcela.find({ id_zona }).exec()
            return resultsParcelas.length
        });

        const parcelasCounts = await Promise.all(promises)
        cantidad_parcelas = parcelasCounts.reduce((acc, count) => acc + count, 0)
    }

    return cantidad_parcelas
}

/**
 * Devuelve el número de parcelas libres de un camping entre dos fechas.
 * @param {String} id_camping 
 * @param {Date} fecha_inicio 
 * @param {Date} fecha_fin 
 * @returns Number
 */
const cantidadEstanciasCampingPorFecha = async (id_camping, fecha_inicio, fecha_fin) => {
    let cantidad_parcelas = 0
    const fecha_inicio_nueva_estancia = new Date(fecha_inicio)
    const fecha_fin_nueva_estancia = new Date(fecha_fin)

    const resultsEstancias = await Estancia.find({ id_camping }).exec()

    if(resultsEstancias.length > 0) {
        const parcelas_dentro_de_fecha = resultsEstancias.filter(estancia => (new Date(estancia.fecha_inicio) < fecha_fin_nueva_estancia) && (new Date(estancia.fecha_fin) > fecha_inicio_nueva_estancia))
        cantidad_parcelas = parcelas_dentro_de_fecha.length
    }

    return cantidad_parcelas
}