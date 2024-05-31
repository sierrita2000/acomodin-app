const { Camping } = require('../models/Camping')
const { ResponseAPI } = require('../classes/ResponseAPI')

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const registrarCamping = async (req, res, next) => {
    try {
        
    } catch(error) {
        next(error)
    }
}

module.exports = { registrarCamping }