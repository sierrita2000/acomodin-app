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
        const imagenCamping = req.file ? req.file.filename : null

        const datosCamping = JSON.parse(req.body.datosCamping)

        const fecha_creacion = new Date().getFullYear()

        bcrypt.hash(datosCamping.password, 10)
            .then(async passwordHash => {
                const new_camping = new Camping({ 
                    usuario: datosCamping.usuario,
                    password: passwordHash,
                    correo: datosCamping.correo,
                    nombre: datosCamping.nombre,
                    imagen: imagenCamping,
                    tamanos: tamanos.split(',') || [],
                    caracteristicas: caracteristicas.split(',') || [],
                    conceptos: tipos.split(',').concat(['665a0165c5f8973c88844b8d', '665a0165c5f8973c88844b8c']),
                    fecha_creacion
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

/**
 * Actualiza un camping
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const actualizarCamping = async (req, res, next) => {
    try {
        const { tamanos, tipos, caracteristicas } = req.body
        const { id } = req.params

        const updates = { 
            tamanos: tamanos || [],
            caracteristicas: caracteristicas || [],
            conceptos: tipos.concat(['665a0165c5f8973c88844b8d', '665a0165c5f8973c88844b8c'])
        }
        
        await Camping.findByIdAndUpdate(id, updates, { returnDocument: 'after' }).exec()
            .then(results => {
                res.status(200).send(new ResponseAPI('ok', `Camping con id "${id}" actualizado correctamente`, results))
            })
            .catch(error => {
                throw new Error(error)
            })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve el _id del camping si el usuario y contraseña son correctos.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverCamping = async (req, res, next) => {
    try {
        const { usuario, password } = req.params

        await Camping.findOne({ usuario }).exec()
            .then(results => {
                if (results) {
                    const password_hasheada = results.password

                    bcrypt.compare(password, password_hasheada)
                        .then(result_password => {
                            result_password ?
                                res.status(200).send(new ResponseAPI('ok', 'Log in correcto', results)) // usuario y contraseña correctos
                            :
                                res.status(400).send(new ResponseAPI('error', 'La contraseña no es correcta', null)) // contraseña incorrecta
                        })
                } else {
                    res.status(400).send(new ResponseAPI('not-found', 'El nombre del usuario no existe', null)) // usuario incorrecto
                }
            })
            .catch(error => {
                throw new Error(error)
            })
    } catch (error) {
        next(error)
    }
}

/**
 * Devuelve los datos del camping por su ID.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverCampingPorID = async (req, res, next) => {
    try {
        const { id_camping } = req.params

        await Camping.findById(id_camping).exec()
            .then(results => {
                if(results) {
                    res.status(200).send(new ResponseAPI('ok', `Camping con id "${id_camping}"`, results))
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No se encunetra el camping con id "${id_camping}"`, null))
                }
            })
            .catch(error => {
                throw new Error(error)
            })
    } catch (error) {
        next(error)
    }
}

/**
 * Actualiza los datos de un camping.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const actualizarDatosCamping = async (req, res, next) => {
    try {
        const { id } = req.params
        const imagen = req.file ? req.file.filename : null

        const datosCamping = JSON.parse(req.body.datos)

        const objUpdate = { ...datosCamping }
        if (imagen) objUpdate.imagen = imagen

        await Camping.findByIdAndUpdate(id, objUpdate, { returnDocument: 'after' }).exec()
            .then(results => {
                res.status(200).send(new ResponseAPI('ok', `Camping con id ${id} actualizado correctamente`, results))
            })
            .catch(error => {
                throw new Error(error)
            })

    } catch (error) {
        next(error)
    }
}

/**
 * Actualiza la contraseña de un usuario camping.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const actualizarPasswordCamping = async (req, res, next) => {
    try {
        const { id } = req.params
        const { new_password } = req.body

        await bcrypt.hash(new_password, 10)
            .then(async new_password_hasheada => {
                await Camping.findByIdAndUpdate(id, { password: new_password_hasheada }, { returnDocument: 'after' }).exec()
                    .then(results => {
                        res.status(200).send(new ResponseAPI('ok', 'Contraseña actualizada', results))
                    })
                    .catch(error => {
                        throw new Error(error)
                    })
            })
            .catch(error => {
                throw new Error(error)
            })
    } catch (error) {
        next(error)
    }
}

module.exports = { registrarCamping, devolverCamping, devolverCampingPorID, actualizarDatosCamping, actualizarPasswordCamping, actualizarCamping }
