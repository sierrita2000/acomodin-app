const { Camping } = require('../models/Camping')
const { ResponseAPI } = require('../classes/ResponseAPI')
const bcrypt = require('bcrypt')
const { ValidationError, DuplicatedError } = require('../errors/errors')

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const registrarCamping = async (req, res, next) => {
    try {
        const { tamanos, tipos, caracteristicas } = req.body
        const logoCamping = req.file ? req.file.filename : null

        const datosCamping = JSON.parse(req.body.datosCamping)

        bcrypt.hash(datosCamping.password, 10)
            .then(async passwordHash => {
                const new_camping = new Camping({ 
                    usuario: datosCamping.usuario,
                    password: passwordHash,
                    correo: datosCamping.correo,
                    nombre: datosCamping.nombre,
                    logo: logoCamping,
                    tamanos: tamanos.split(',') || [],
                    caracteristicas: caracteristicas.split(',') || [],
                    conceptos: tipos.split(',').concat(['665a0165c5f8973c88844b8d', '665a0165c5f8973c88844b8c'])
                })

                await new_camping.save()
                    .then(resultsCamping => res.status(200).send(new ResponseAPI('ok', 'Camping creado correctamente', resultsCamping)))
                    .catch(error => { 
                        if (error.name === 'ValidationError') {
                            next(new ValidationError('correo', `El campo "correo" en Datos del Camping no es correcto.`))
                        }
                        if (error.name === 'MongoServerError') {
                            next(new DuplicatedError('usuario', `El nombre del usuario en Datos del Camping ya existe. Escoge otro.`))
                        }
                    })
            })
    } catch(error) {
        next(error)
    }
}

module.exports = { registrarCamping }

