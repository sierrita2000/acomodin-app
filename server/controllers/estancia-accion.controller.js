const { ResponseAPI } = require('../classes/ResponseAPI')
const { Estancia } = require('../models/Estancia')
const { EstanciasAccion } = require('../models/EstanciasAccion')

/**
 * Devuelve una estancia completa por el id de estancia Acción
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverEstanciaPorIdAccion = async (req, res, next) => {
    try {
        const { id } = req.params

        await EstanciasAccion.findById(id).exec()
            .then(async results_estancia_accion => {
                await Estancia.findById(results_estancia_accion.id_estancia).exec()
                    .then(results_estancia => {
                        res.status(200).send(new ResponseAPI('ok', `Estancia con id ${id}`, { estancia: results_estancia, estancia_accion: results_estancia_accion }))
                    })
                    .catch(() => { throw new Error("No se puede cargar la estancia") })
            })  
            .catch(() => { throw new Error("No se puede cargar la estancia") })
    } catch(error) {
        next(error) 
    }
}

/**
 * Crea una estanciaAccion de tipo entrada de una reserva
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const crearLlegadaSalidaReserva = async (req, res, next) => {
    try {
        const { id_estancia } = req.params
        const { id_usuario, tipo_usuario, fecha, comentarios, estado, parcela } = req.body

        const obj_estancia_accion = new EstanciasAccion({
            id_estancia,
            id_usuario,
            tipo_usuario,
            fecha,
            estado,
            comentarios
        })

        if(estado === 'entrada') {
            estanciaParcelaEnFecha(parcela, formatearFecha(new Date()))
                .then(async estancia_parcela => {
                    if(!estancia_parcela) {
                        await obj_estancia_accion.save()
                            .then(results => { res.status(200).send(new ResponseAPI('ok', `${estado} de la estancia con id ${id_estancia} en el camping registrada`, results)) })
                            .catch(error => { throw new Error(error) })
                    } else {
                        res.status(200).send(new ResponseAPI('not-allowed', `La parcela con id ${parcela} está actualmente ocupada`, estancia_parcela))
                    }
                })
        } else {
            await obj_estancia_accion.save()
                .then(results => { res.status(200).send(new ResponseAPI('ok', `${estado} de la estancia con id ${id_estancia} en el camping registrada`, results)) })
                .catch(error => { throw new Error(error) })
        }
        } catch(error) {
        next(error)
    }
}

/**
 * Elimina la accion dada
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const deshacerLegadaOSalida = async (req, res, next) => {
    try {
        const { id } = req.params
        
        const estancia_accion = await EstanciasAccion.findById(id).exec()
        if(estancia_accion.estado === 'salida') {
            await EstanciasAccion.findByIdAndDelete(id).exec()
                .then(() => {
                    res.status(200).send(new ResponseAPI('ok', `Deshecha la salida de la estancia`, null))
                })
                .catch(error => { throw new Error(error) })
        } else {
            const estancia_acciones = await EstanciasAccion.find({ id_estancia: estancia_accion.id_estancia }).exec()
            if(estancia_acciones.find(e_a => e_a.estado === 'reserva')) { // Se trata de una entrada con reserva previa
                await EstanciasAccion.findByIdAndDelete(id).exec()
                    .then(() => {
                        res.status(200).send(new ResponseAPI('ok', `Deshecha la llegada de la estancia`, null))
                    })
                    .catch(error => { throw new Error(error) })
            } else { // Llegada directa, sin reserva previa
                await Estancia.findByIdAndDelete(estancia_accion.id_estancia).exec()
                    .then(async () => {
                        await EstanciasAccion.findByIdAndDelete(id).exec()
                            .then(() => {
                                res.status(200).send(new ResponseAPI('ok', `Eliminada la estancia`, null))
                            })
                            .catch(error => { throw new Error(error) })
                    })
                    .catch(error => { throw new Error(error) })
            }
        }
    } catch(error) {
        next(error)
    }
}

module.exports = { devolverEstanciaPorIdAccion, crearLlegadaSalidaReserva, deshacerLegadaOSalida }

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

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
        if(estancia) {
            const estancia_accion = await EstanciasAccion.find({ id_estancia: estancia._id }).exec()
            estancia = { estancia, estancia_accion }
        }
    }

    return estancia
}

/**
* Formatea la fecha de hoy
* @returns String
*/
const formatearFecha = (fecha) => {
    return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
}