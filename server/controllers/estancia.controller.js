const { ResponseAPI } = require('../classes/ResponseAPI')
const { Estancia } = require('../models/Estancia')
const { EstanciasAccion } = require('../models/EstanciasAccion')
const { Parcela } = require('../models/Parcela')
const { Zona } = require('../models/Zona')

const devolverEstanciaActualYReservasFuturasDeParcela = async (req, res, next) => {
    try {
        const { id_parcela } = req.params
        const fecha_actual = new Date().setHours(0, 0, 0, 0)

        // Estancias que incluyan la parcela con id "id_parcela" y que sean de hoy o más adelante. 
        await Estancia.find({ parcela: id_parcela }).exec()
            .then(async results => {
                if(results.length > 0) {
                    const estancias_parcela = results.filter(estancia => (new Date(estancia.fecha_fin) >= fecha_actual))
                    
                    if (estancias_parcela.length > 0) {
                        const promises = estancias_parcela.map(async estancia => {
                            const results_estancia_accion = await EstanciasAccion.find({ id_estancia: estancia._id }).exec()
                            const obj_estancia_accion = estanciaAccionMasReciente(results_estancia_accion)

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
                        let obj_estancia_accion = estanciaAccionMasReciente(results_estancia_accion)

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

        const tipos_acomodacion_estancia = estancia.conceptos.filter(c => ['665a0165c5f8973c88844b82', '665a0165c5f8973c88844b81', '665a0165c5f8973c88844b86', '665a0165c5f8973c88844b85', '665a0165c5f8973c88844b87', '665a0165c5f8973c88844b84', '665a0165c5f8973c88844b83'].includes(c[0])).map(tipo => tipo[0])

        huecosLibresCampingPorFecha(estancia.id_camping, estancia.fecha_inicio, estancia.fecha_fin) // Comprobamos si queda hueco libre en el camping
            .then(resultHuecosLibresCamping => {
                if (resultHuecosLibresCamping > 0) {
                                if (estancia.parcela) {
                                    validarParcelaLibrePorFecha(estancia.parcela, estancia.fecha_inicio, estancia.fecha_fin) // Comprobamos si la parcela está libre durante las fechas dadas
                                        .then(async resultsValidarParcelaFecha => {
                                            if (resultsValidarParcelaFecha) { // Crea la estancia.
                                                grabarEstancia(estancia, estancia_accion, res)
                                            } else { // Devuelve el número de huecos libres que quedan en el camping
                                                res.status(200).send(new ResponseAPI('not-allowed', `Esta parcela está ocupada para las fechas ${estancia.fecha_inicio.replaceAll('-', '/')} - ${estancia.fecha_fin.replaceAll('-', '/')}.`, { huecosLibresCamping: resultHuecosLibresCamping }))
                                            }
                                        })
                                } else { // Reserva sin parcela especificada.
                                    parcelasLibresPorFechaYTipos(estancia.id_camping, estancia.fecha_inicio, estancia.fecha_fin, tipos_acomodacion_estancia)
                                        .then(parcelas_libres_fecha_tipos => {
                                            if(parcelas_libres_fecha_tipos.length > 0) {
                                                grabarEstancia(estancia, estancia_accion, res)
                                            } else {
                                                res.status(200).send(new ResponseAPI('not-allowed', `No quedan huecos libres para los tipos seleccionados para las fechas ${estancia.fecha_inicio.replaceAll('-', '/')} - ${estancia.fecha_fin.replaceAll('-', '/')}.`, { huecosLibresCamping: resultHuecosLibresCamping }))
                                            }
                                        })
                                }
                } else {
                    res.status(200).send(new ResponseAPI('not-allowed', `No hay hueco en el camping entre las fechas ${estancia.fecha_inicio.replaceAll('-', '/')} - ${estancia.fecha_fin.replaceAll('-', '/')}.`, null))
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
            .then(async estancias => {
                if (estancias.length > 0) {
                    if (estancias.length === 1) {
                        await EstanciasAccion.find({ id_estancia: estancias[0]._id }).exec()
                            .then(results_estancia_accion => {
                                const estancia_accion_mas_reciente = estanciaAccionMasReciente(results_estancia_accion)
                                const estado = devolverEstado(estancia_accion_mas_reciente, estancias[0], fecha)

                                res.status(200).send(new ResponseAPI('ok', `estado parcela ${fecha}`, [estado]))
                            })
                            .catch(error => {  throw new Error(error)})
                    } else {
                        const promises = estancias.map(async estancia => {
                            const result_estancia_accion = await EstanciasAccion.find({ id_estancia: estancia._id }).exec()
                            const estancia_accion_mas_reciente = estanciaAccionMasReciente(result_estancia_accion)
                            return devolverEstado(estancia_accion_mas_reciente, estancia, fecha)
                        })

                        Promise.all(promises)
                            .then(estados_estancias_acciones => {
                                res.status(200).send(new ResponseAPI('ok', `estado parcela ${fecha}`, estados_estancias_acciones))
                            })
                    }
                } else {
                    res.status(200).send(new ResponseAPI('ok', `estado parcela ${fecha}`, ['libre']))
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
const devolverEstanciasPorEstadoYFecha = async (req, res, next) => {
    try {
        const { id_camping, fecha, estado } = req.params

        await Estancia.find({ id_camping }).exec()
            .then(results_estancias => {
                if (results_estancias.length > 0) {
                    const results_estancias_accion = results_estancias.map(async estancia => {
                        const filtros = { id_estancia:estancia._id }
                        if(fecha != 'null') filtros.fecha = fecha
                        if(estado != 'todos') filtros.estado = estado

                        const estancia_acciones = await EstanciasAccion.find(filtros).exec()
                        let array_estancias = new Array()
                        if(estancia_acciones.length > 0) {
                            estancia_acciones.forEach(estancia_accion => {
                                array_estancias.push({ estancia, estancia_accion })
                            })
                        }

                        return array_estancias
                    })

                    Promise.all(results_estancias_accion)
                        .then(results => {
                            const new_results = results.flat()
                            new_results.length > 0 
                                ? res.status(200).send(new ResponseAPI('ok', `Estancias filtradas`, new_results))
                                : res.status(404).send(new ResponseAPI('not-found', `No existen estancias para los filtros`, null))
                        })
                        .catch(err => { throw new Error(err) })
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen estancias para el camping con id ${id_camping}`, null))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todas las estancias de un camping cumpliendo unos filtros.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverEstanciasPorFiltros = async (req, res, next) => {
    try {
        const { id_camping } = req.params
        const { filtros, estado } = req.body

        await Estancia.find({ id_camping, ...filtros }).exec()
            .then(results_estancias => {
                if (results_estancias.length > 0) {
                    const results_estancias_accion = results_estancias.map(async estancia => {
                        const estancia_accion = await EstanciasAccion.findOne({ id_estancia: estancia._id, estado }).exec()
                        if(estancia_accion) return { estancia, estancia_accion }
                        else return []
                    })

                    Promise.all(results_estancias_accion)
                        .then(results => {
                            const new_results = results.flat()
                            new_results.length > 0 
                                ? res.status(200).send(new ResponseAPI('ok', `Estancias filtradas`, new_results))
                                : res.status(200).send(new ResponseAPI('not-found', `No existen estancias para los filtros`, []))
                        })
                        .catch(err => { throw new Error(err) })
                } else {
                    res.status(200).send(new ResponseAPI('not-found', `No existen estancias para el camping con id ${id_camping}`, []))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todas las reservas del día actual que aun no han llegado.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverReservasHoySinLlegar = async (req, res, next) => {
    try {
        const { id_camping } = req.params

        await Estancia.find({ id_camping, fecha_inicio: formatearFecha(new Date()) }).exec()
            .then(results_estancias => {
                if (results_estancias.length > 0) {
                    const results_estancias_accion = results_estancias.map(async estancia => {
                        const estancia_accion = await EstanciasAccion.find({ id_estancia: estancia._id }).exec()
                        const estancia_accion_mas_reciente = estanciaAccionMasReciente(estancia_accion)
                        if(estancia_accion_mas_reciente.estado === 'reserva') return { estancia, estancia_accion: estancia_accion_mas_reciente }
                        else return []
                    })

                    Promise.all(results_estancias_accion)
                        .then(results => {
                            const new_results = results.flat()
                            new_results.length > 0 
                                ? res.status(200).send(new ResponseAPI('ok', `Estancias con reserva para hoy sin realizar`, new_results))
                                : res.status(404).send(new ResponseAPI('not-found', `No existen estancias con reserva para hoy`, []))
                        })
                        .catch(err => { throw new Error(err) })
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen estancias para el camping con id ${id_camping}`, []))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todas las entradas con fecha de salida el día actual que aun no han salido.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverEntradasHoySinSalir = async (req, res, next) => {
    try {
        const { id_camping } = req.params

        await Estancia.find({ id_camping, fecha_fin: formatearFecha(new Date()) }).exec()
            .then(results_estancias => {
                if (results_estancias.length > 0) {
                    const results_estancias_accion = results_estancias.map(async estancia => {
                        const estancia_accion = await EstanciasAccion.find({ id_estancia: estancia._id }).exec()
                        const estancia_accion_mas_reciente = estanciaAccionMasReciente(estancia_accion)
                        if(estancia_accion_mas_reciente.estado === 'entrada') return { estancia, estancia_accion: estancia_accion_mas_reciente }
                        else return []
                    })

                    Promise.all(results_estancias_accion)
                        .then(results => {
                            const new_results = results.flat()
                            new_results.length > 0 
                                ? res.status(200).send(new ResponseAPI('ok', `Estancias con salida para hoy sin realizar`, new_results))
                                : res.status(404).send(new ResponseAPI('not-found', `No existen estancias con salida para hoy`, []))
                        })
                        .catch(err => { throw new Error(err) })
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen estancias para el camping con id ${id_camping}`, []))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

/**
 * Elimina una estancia por su ID.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const eliminarEstancia = async (req, res, next) => {
    try {
        const { id } = req.params

        const resultsEstancia = await Estancia.findByIdAndDelete(id).exec()

        const resultsEstanciaAcciones = await EstanciasAccion.deleteMany({ id_estancia: id }).exec()

        Promise.all([resultsEstancia, resultsEstanciaAcciones])
            .then(results => {
                res.status(200).send(new ResponseAPI('ok', `Estancia con id ${id} eliminada`, results))
            })
            .catch(error => { throw new Error(error) })

    } catch(error) {
        next(error)
    }
}

/**
 * Actualiza una estancia.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const editarEstancia = async (req, res, next) => {
    try {
        const { id } = req.params
        const { updates, id_camping, tipos } = req.body

        huecosLibresCampingPorFecha(id_camping, updates.fecha_inicio, updates.fecha_fin, id)    
            .then(hueco_libre_camping => {
                if(hueco_libre_camping > 0) {
                    if(updates.parcela) { // Si hay parcela validar que esté libre para esas fechas
                        validarParcelaLibrePorFecha(updates.parcela, updates.fecha_inicio, updates.fecha_fin, id)
                            .then(async results_validar_parcela => {
                                if(results_validar_parcela) {
                                    await Estancia.findByIdAndUpdate(id, { ...updates }, { returnDocument: 'after' }).exec()
                                        .then(results => { res.status(200).send(new ResponseAPI('ok', `Estancia con id ${id} actualizada`, results)) })
                                        .catch(error => { throw new Error(error) })
                                } else {
                                    res.status(200).send(new ResponseAPI('not-allowed', `No hay hueco en la parcela entre ${updates.fecha_inicio.replaceAll('-', '/')} y ${updates.fecha_fin.replaceAll('-', '/')}`, null))
                                }
                            })
                    } else { // Sin parcela validar que hay una parcela libre del tipo seleccionado
                        parcelasLibresPorFechaYTipos(id_camping, updates.fecha_inicio, updates.fecha_fin, tipos)
                            .then(async results_validar_parcelas => {
                                if(results_validar_parcelas) {
                                    await Estancia.findByIdAndUpdate(id, { ...updates }, { returnDocument: 'after' }).exec()
                                        .then(results => { res.status(200).send(new ResponseAPI('ok', `Estancia con id ${id} actualizada`, results)) })
                                        .catch(error => { throw new Error(error) })
                                } else {
                                    res.status(200).send(new ResponseAPI('not-allowed', `No hay hueco en el camping entre ${updates.fecha_inicio.replaceAll('-', '/')} y ${updates.fecha_fin.replaceAll('-', '/')} para los tipos seleccionados`, null))
                                }
                            })
                    }
                } else {
                    res.status(200).send(new ResponseAPI('not-allowed', `No hay hueco en el camping entre ${updates.fecha_inicio.replaceAll('-', '/')} y ${updates.fecha_fin.replaceAll('-', '/')}`, null))
                }
            })
            .catch(error => { throw new Error(error) })
        } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todas las estancias de un camping con una acción pendiente.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverEstanciasConAccionPendiente = async (req, res, next) => {
    try {
        const { id_camping } = req.params

        let entradas_sin_registrar = new Array()
        let salidas_sin_registrar = new Array()

        const estancias = await Estancia.find({ id_camping }).exec()

        const estancias_promises = estancias.map(async estancia => {
            const estancia_accion_lista = await EstanciasAccion.find({ id_estancia: estancia._id }).exec()
            const estancia_accion = estanciaAccionMasReciente(estancia_accion_lista)

            // Reserva sin llegar
            if((estancia_accion.estado === 'reserva') && (new Date(estancia.fecha_inicio) < new Date(formatearFecha(new Date())))) {
                return [{ estancia, estancia_accion }, 1]
            }
            // Entradas sin salir
            else if((estancia_accion.estado === 'entrada') && (new Date(estancia.fecha_fin) < new Date(formatearFecha(new Date())))) {
                return [{ estancia, estancia_accion }, 2]
            } 
            // Estancia no válida
            else {
                return [null, 0]
            }
        })

        Promise.all(estancias_promises)
            .then(values => {

                values.forEach(value => {
                    if(value[1] === 1) entradas_sin_registrar.push(value[0])
                    else if(value[1] === 2) salidas_sin_registrar.push(value[0])
                })
            })  
            .catch(error => {
                throw new Error(error)
            })  
            .finally(() => {
                res.status(200).send(new ResponseAPI('ok', 'Tareas pendientes', (entradas_sin_registrar.length > 0 || salidas_sin_registrar.length > 0) ? [entradas_sin_registrar, salidas_sin_registrar] : null))
            })    
    } catch(error) {
        next(error)
    }
}

module.exports = { devolverEstanciaActualYReservasFuturasDeParcela, crearEstancia, devolverEstanciaPorId, devolverEstadoParcelaDia, devolverEstanciasPorEstadoYFecha, devolverEstanciasPorFiltros, devolverReservasHoySinLlegar, devolverEntradasHoySinSalir, eliminarEstancia, editarEstancia, devolverEstanciasConAccionPendiente }

/**************************************************************************************************************/
/**************************************************************************************************************/
/**************************************************************************************************************/

/**
* Formatea la fecha de hoy
* @returns String
*/
const formatearFecha = (fecha) => {
    return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
}

/**
 * Devuelve el estado de una parcela.
 * @param {Object} estancia_accion 
 * @param {Object} estancia 
 */
const devolverEstado = (estancia_accion, estancia, fecha) => {
    let estado = ''
    if (estancia_accion.estado === 'reserva') {
        if (fecha === estancia.fecha_fin) {
            estado = 'fin de reserva hoy'
        } else {
            estado = 'reservada'
        }
    } else {
        if (fecha === estancia.fecha_fin) {
            estado = 'salida prevista para hoy'
        } else {
            estado = 'ocupada'
        }
    } 

    return estado
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

/**
 * Devuelve la estancia, si existe, de una parcela en la fecha indicada.
 * @param {String} parcela 
 * @param {Date} fecha
 * @returns Object
 */
const estanciaParcelaEnFecha = async (parcela, fecha) => {
    let estancia = []
    const fecha_ = new Date(fecha)

    const resultsEstancias = await Estancia.find({ parcela }).exec()

    if (resultsEstancias.length > 0) {
        estancia = resultsEstancias.filter(estancia => (new Date(estancia.fecha_inicio) <= fecha_) && (new Date(estancia.fecha_fin) >= fecha_))
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
const validarParcelaLibrePorFecha = async (parcela, fecha_inicio, fecha_fin, estancia_opcional = null) => {
    let parcela_libre = true
    const fecha_inicio_nueva_estancia = new Date(fecha_inicio)
    const fecha_fin_nueva_estancia = new Date(fecha_fin)

    const resultsEstancias = await Estancia.find({ parcela }).exec()

    if(estancia_opcional) {
        if(resultsEstancias.findIndex(estancia => estancia._id.toString() === estancia_opcional) != -1) resultsEstancias.splice(resultsEstancias.findIndex(estancia => estancia._id.toString() === estancia_opcional), 1)
    }

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
const huecosLibresCampingPorFecha = async (id_camping, fecha_inicio, fecha_fin, estancia_opcional = null) => { // Estancia opcional, para el caso de que quiera calcular el hueco sin contar con la estancia que estoy editando
    const promises = [cantidadParcelasCamping(id_camping), cantidadHuecosOcupadosCampingPorFecha(id_camping, fecha_inicio, fecha_fin, estancia_opcional)]

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
 * Devuelve el número de huecos que habrá ocupados entre dos fechas.
 * @param {String} id_camping 
 * @param {Date} fecha_inicio 
 * @param {Date} fecha_fin 
 * @returns Number
 */
const cantidadHuecosOcupadosCampingPorFecha = async (id_camping, fecha_inicio, fecha_fin, estancia_opcional = null) => {
    let cantidad_parcelas = 0
    const fecha_inicio_nueva_estancia = new Date(fecha_inicio)
    const fecha_fin_nueva_estancia = new Date(fecha_fin)

    const resultsEstancias = await Estancia.find({ id_camping }).exec()

    if(estancia_opcional) {
        if(resultsEstancias.findIndex(estancia => estancia._id.toString() === estancia_opcional) != -1) resultsEstancias.splice(resultsEstancias.findIndex(estancia => estancia._id.toString() === estancia_opcional), 1)
    }

    if(resultsEstancias.length > 0) {
        const estancias_dentro_de_fecha = resultsEstancias.filter(estancia => (new Date(estancia.fecha_inicio) < fecha_fin_nueva_estancia) && (new Date(estancia.fecha_fin) > fecha_inicio_nueva_estancia))
        // comprobar que no hay dos estancias con la misma parcela en el array
        estancias_dentro_de_fecha.forEach((estancia_filtrada, indice) => {
            if(estancia_filtrada.parcela) {
                if(estancias_dentro_de_fecha.filter(e => e.parcela && (e.parcela.toString() === estancia_filtrada.parcela.toString())).length > 1) {
                    estancias_dentro_de_fecha.splice(indice, 1)                    
              }
            }
        })
        cantidad_parcelas = estancias_dentro_de_fecha.length
    }

    return cantidad_parcelas
}

/**
 * Devuelve las parcelas libres de un camping en unas fechas dadas, y que incluyan unos tipos de acomodación.
 * @param {string} id_camping 
 * @param {Date} fecha_inicio 
 * @param {Date} fecha_fin 
 * @param {Array} tipos 
 * @returns Array
 */
const parcelasLibresPorFechaYTipos = async (id_camping, fecha_inicio, fecha_fin, tipos) => {
    let lista_parcelas = new Array()

    const fecha_inicio_nueva_estancia = new Date(fecha_inicio)
    const fecha_fin_nueva_estancia = new Date(fecha_fin)

    const resultsEstancias = await Estancia.find({ id_camping }).exec()

    if(resultsEstancias.length > 0) {
        // Estancias con parcela asignada dentro de las fechas
        const estancias_dentro_de_fecha = resultsEstancias.filter(estancia => (estancia.parcela) && ((new Date(estancia.fecha_inicio) < fecha_fin_nueva_estancia) && (new Date(estancia.fecha_fin) > fecha_inicio_nueva_estancia)))
        
        // Parcelas ocupadas dentro de las fechas
        const parcelas_ocupadas_en_fechas = estancias_dentro_de_fecha.map(estancia => estancia.parcela)

        // Zonas del camping
        const resultsZonas = await Zona.find({ id_camping }).exec()
        const zonas_camping = resultsZonas.map(zona => zona._id)

        // Parcelas del camping que no estén ocupadas
        const resultsParcelas = await Parcela.find({ _id: { $nin: parcelas_ocupadas_en_fechas }, id_zona: { $in: zonas_camping }}).exec()

        // Sacamos las parcelas que incluyan los tipos de la reserva
        resultsParcelas.forEach(parcela => {
            let parcela_valida = true

            tipos.forEach(tipo => {
                if(!parcela.tipos.includes(tipo)) parcela_valida = false
            })

            parcela_valida && lista_parcelas.push(parcela)
        })
    }

    return lista_parcelas
}

/**
 * Devuelve las estancias sin parcela asignada que incluyan los tipos dados entre dos fechas
 * @param {string} id_camping 
 * @param {Date} fecha_inicio 
 * @param {Date} fecha_fin 
 * @param {Array} tipos 
 * @returns Array 
 */
const reservasSinParcelaPorFechaYtipo = async (id_camping, fecha_inicio, fecha_fin, tipos) => {
    let lista_estancias = new Array()

    const fecha_inicio_nueva_estancia = new Date(fecha_inicio)
    const fecha_fin_nueva_estancia = new Date(fecha_fin)

    const resultsEstancias = await Estancia.find({ id_camping, parcela: null }).exec()

    if(resultsEstancias.length > 0) {
        // Estancias dentro de fechas sin parcela asignada
        const estancias_dentro_de_fecha = resultsEstancias.filter(estancia => (new Date(estancia.fecha_inicio) < fecha_fin_nueva_estancia) && (new Date(estancia.fecha_fin) > fecha_inicio_nueva_estancia))
    
        // Sacamos las estancias que incluyan los tipos de la reserva
        estancias_dentro_de_fecha.forEach(estancia => {
            let estancia_valida = true

            tipos.forEach(tipo => {
                if(!estancia.conceptos.includes(tipo)) estancia_valida = false
            })

            estancia_valida && lista_estancias.push(estancia)
        })
    }

    return lista_estancias
}