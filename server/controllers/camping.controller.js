const { Camping } = require('../models/Camping')
const { ResponseAPI } = require('../classes/ResponseAPI')

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const crearCamping = async (req, res, next) => {
    try {
        const usuario_camping = new Camping({ ...req.body })

        await usuario_camping.save()
            .then(results => {
                res.status(200).send(new ResponseAPI('ok', 'usuario creado correctamente', results))
            })
            .catch(error => {
                throw new Error(error)
            })
    } catch(error) {
        next(error)
    }
}

module.exports = { crearCamping }