const { Camping } = require('../models/Camping')
const { ResponseAPI } = require('../classes/ResponseAPI')
const bcrypt = require('bcrypt')

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const registrarCamping = async (req, res, next) => {
    try {
        const { tamanos, tipos, caracteristicas } = req.body
        const logoCamping = req.file.filename

        const datosCamping = JSON.parse(req.body.datosCamping)

        bcrypt.hash(datosCamping.password, 10)
            .then(async passwordHash => {
                const new_camping = new Camping({ 
                    usuario: datosCamping.usuario,
                    password: passwordHash,
                    correo: datosCamping.correo,
                    nombre: datosCamping.nombre,
                    logo: logoCamping,
                    tamanos: tamanos.split(','),
                    caracteristicas: caracteristicas.split(','),
                    conceptos: tipos.split(',')
                })

                await new_camping.save()
                    .then(resultsCamping => res.status(200).send(new ResponseAPI('ok', 'Camping creado correctamente', resultsCamping)))
                    .catch(error => { throw new Error(error) })
            })
    } catch(error) {
        next(error)
    }
}

module.exports = { registrarCamping }

