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
        const { id_usuario, tipo_usuario, fecha, comentarios, estado } = req.body

        const obj_estancia_accion = new EstanciasAccion({
            id_estancia,
            id_usuario,
            tipo_usuario,
            fecha,
            estado,
            comentarios
        })

        await obj_estancia_accion.save()
            .then(results => { res.status(200).send(new ResponseAPI('ok', `${estado} de la estancia con id ${id_estancia} en el camping registrada`, results)) })
            .catch(error => { throw new Error(error) })
        } catch(error) {
        next(error)
    }
}

module.exports = { devolverEstanciaPorIdAccion, crearLlegadaSalidaReserva }