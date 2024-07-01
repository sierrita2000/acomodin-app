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

module.exports = { devolverEstanciaPorIdAccion }