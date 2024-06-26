const { ResponseAPI } = require('../classes/ResponseAPI')
const { Parcela } = require('../models/Parcela')
const { Zona } = require('../models/Zona')

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
            .catch(error => { res.status(404).send(new ResponseAPI('not-found', `No existe una parcela con el id "${id}"`, error)) })
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { devolverParcelasPorZona, devolverParceaPorId }