const { ResponseAPI } = require('../classes/ResponseAPI')
const { Parcela } = require('../models/Parcela')
const { Zona } = require('../models/Zona')
const { Estancia } = require('../models/Estancia')
const { EstanciasAccion } = require('../models/EstanciasAccion')

/**
 * Devuelve todas las parcelas de una zona
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverParcelasPorZona = async (req, res, next) => {
    try {
        const { id_zona } = req.params
        
        await Parcela.find({ id_zona }).exec()
            .then(results => {
                if (results.length != 0) {
                    res.status(200).send(new ResponseAPI('ok', `Parcelas de la zona con id "${id_zona}"`, results))
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen parcelas que pertenezcan a la zona con id "${id_zona}"`, null))
                }
            })
            .catch(error => {
                res.status(404).send(new ResponseAPI('not-found', `No existe ninguna zona con id "${id_zona}"`, null))
            })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todas las parcelas de un camping
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverParcelasPorCamping = async (req, res, next) => {
    try {
        const { id_camping } = req.params
        
        parcelasCamping(id_camping)
            .then(parcelas_camping => {
                res.status(200).send(new ResponseAPI('ok', `Parcelas del camping con id ${id_camping}`, parcelas_camping))
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todas las parcelas ocupadas de un camping
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverParcelasOcupadasCampingEnFecha = async (req, res, next) => {
    try {
        const { id_camping, fecha } = req.params
        
        parcelasCamping(id_camping)
            .then(parcelas_camping => {
                const promises_parcelas_ocupadas = parcelas_camping.map(async parcela => {
                    const estancia_en_parcela = await estanciaParcelaEnFecha(parcela._id, fecha) 
                    if(estancia_en_parcela) {
                        if(estancia_en_parcela.estancia_accion.estado === 'entrada') return 1
                        else return 0
                    } else {
                        return 0
                    }
                })

                Promise.all(promises_parcelas_ocupadas)
                    .then(values => {
                        const parcelas_ocupadas = values.reduce((acumulador, valorActual) => acumulador + valorActual, 0)
                        res.status(200).send(new ResponseAPI('ok', `Parcelas ocupadas en ${fecha} del camping con id ${id_camping}`, parcelas_ocupadas))
                    })
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuleve una parcel por si ID.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverParceaPorId = async (req, res, next) => {
    try {
        const { id } = req.params

        await Parcela.findById(id).exec()
            .then(results => { res.status(200).send(new ResponseAPI('ok', `Datos de la parcela con id "${id}"`, results)) })
            .catch(() => { res.status(404).send(new ResponseAPI('not-found', `No existe una parcela con el id "${id}"`, null)) })
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Devuleve las parcelas libres de un camping entre 2 fechas, y que incluyan los conceptos dados.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverParcelasLibresEntreFechasConConceptos = async (req, res, next) => {
    try {
        const { id_camping, fecha_inicio, fecha_fin, tipos, parcela_seleccionada } = req.body

        parcelasCamping(id_camping)
            .then(parcelas_camping => {
                const parcelas_camping_con_tipos = parcelas_camping.filter(parcela => tipos.every(tipo => parcela.tipos.includes(tipo)))
                if(parcelas_camping_con_tipos.length > 0) {
                    const parcelas_camping_con_tipos_libres = parcelas_camping_con_tipos.map(async parcela => {
                        const validacion = await validarParcelaLibrePorFecha(parcela._id, fecha_inicio, fecha_fin)
                        if(validacion || (parcela._id.toString() === parcela_seleccionada)) {
                            return parcela
                        } else {
                            return []
                        }
                    })

                    Promise.all(parcelas_camping_con_tipos_libres)
                        .then(parcelas_libres => {
                            if(parcelas_libres.flat().length > 0) {
                                res.status(200).send(new ResponseAPI('ok', 'Parcelas libres', parcelas_libres.flat()))
                            } else {
                                res.status(400).send(new ResponseAPI('error', 'No hay parcelas libres disponibles para los tipos seleccionados', null))
                            }
                        })
                } else {
                    res.status(400).send(new ResponseAPI('error', 'No hay parcelas disponibles para los tipos seleccionados', null))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuleve las parcelas de las zonas que cumplan con los filtros
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverZonasYParcelasConFiltros = async (req, res, next) => {
    try {
        const { id_camping } = req.params
        const { caracteristicas, tipos, tamano, electricidad } = req.body

        obj_filtros = new Object()
        if(caracteristicas) obj_filtros.caracteristicas = { $all: caracteristicas }
        if(tipos) obj_filtros.tipos = { $all: tipos }
        if(tamano) obj_filtros.tamano = tamano
        if(electricidad) obj_filtros.electricidad = electricidad

        const results_zonas = await Zona.find({ id_camping }).exec()
        if(results_zonas.length > 0) {
            const response_parcelas = results_zonas.map(async zona => {
                const results_parcelas_zona = await Parcela.find({ ...obj_filtros, id_zona: zona._id }).exec()
                return { zona: zona, parcelas: results_parcelas_zona.sort((a, b) => {
                                                                        const nameA = a.nombre.toUpperCase()
                                                                        const nameB = b.nombre.toUpperCase()
                                                                        if (nameA < nameB) {
                                                                            return -1
                                                                        }
                                                                        if (nameA > nameB) {
                                                                            return 1
                                                                        }
                                                                        return 0;
                                                                    }) }
            })

            Promise.all(response_parcelas)
                .then(results => {
                    res.status(200).send(new ResponseAPI('ok', `Zonas y parcelas filtradas del camping con id ${id_camping}`, results))
                })
                .catch(error => { throw new Error(error) })
        } else {
            throw new Error(`No hay zonas para el camping con id ${id_camping}`)
        }
    } catch(error) {
        next(error)
    }
}

module.exports = { devolverParcelasPorZona, devolverParceaPorId, devolverParcelasPorCamping, devolverParcelasLibresEntreFechasConConceptos, devolverParcelasOcupadasCampingEnFecha, devolverZonasYParcelasConFiltros }


/********************************************************************************************/
/********************************************************************************************/
/********************************************************************************************/

/**
 * 
 * @param {String} id_camping 
 */
const parcelasCamping = async (id_camping) => {
    let parcelas_camping = new Array()
    const zonas_camping = await Zona.find({id_camping}).exec()

    const parcelas_camping_promises = zonas_camping.map(async zona => {
        const parcelas_zona = await Parcela.find({ id_zona: zona._id }).exec()
        return parcelas_zona
    })

    parcelas_camping = await Promise.all(parcelas_camping_promises)

    return parcelas_camping.flat()
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
        const estancia_en_parcela = resultsEstancias.find(estancia => (new Date(estancia.fecha_inicio) <= fecha_) && (new Date(estancia.fecha_fin) >= fecha_))
        if(estancia_en_parcela) {
            const lista_estancias_accion = await EstanciasAccion.find({ id_estancia: estancia_en_parcela._id }).exec()
            const estancia_accion_mas_reciente = estanciaAccionMasReciente(lista_estancias_accion)
            estancia = { estancia: estancia_en_parcela, estancia_accion: estancia_accion_mas_reciente }
        }
    }

    return estancia
}

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
        } else if(estancia_accion.fecha === estancia_accion_mas_reciente.fecha) {
            estancia_accion_mas_reciente = [estancia_accion, estancia_accion_mas_reciente].find(e_a => e_a.estado === 'entrada')
        }
    })

    return estancia_accion_mas_reciente
}