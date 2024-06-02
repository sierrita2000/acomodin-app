const { Camping } = require('../models/Camping')
const { Zona } = require('../models/Zona')
const { Parcela } = require('../models/Parcela')
const { Acomodador } = require('../models/Acomodador')
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
                    .then(resultsCamping => { res.status(200).send(new ResponseAPI('ok', 'Camping creado correctamente', resultsCamping))
                        /*zonas.forEach(async zona => {
                            const new_zona = new Zona({ 
                                nombre: zona.nombre,
                                tipos: zona.tipos,
                                id_camping: id_camping
                            })

                            await new_zona.save()
                                .then(resultsZona => {
                                    const id_zona = resultsZona._id

                                    zona.parcelas.forEach(async parcela => {
                                        const new_parcela = new Parcela({ 
                                            nombre: parcela.nombre,
                                            tamano: parcela.tamano,
                                            electricidad: parcela.electricidad,
                                            tipos: parcela.tipos,
                                            caracteristicas: parcela.caracteristicas,
                                            id_zona: id_zona
                                        })

                                        await new_parcela.save()
                                            .catch(error => { throw new Error(error) })
                                    })
                                })
                                .catch(error => { throw new Error(error) })
                        })

                        acomodadores.forEach(async acomodador => {
                            const usuario_acomodador = `${acomodador.nombre}_${camping.nombre}`
                            const password_acomodador = crearPasswordAleatorio()

                            bcrypt.hash(password_acomodador, 10)
                                .then(async password_acomodador_encriptada => {
                                    const new_acomodador = new Acomodador({
                                        usuario: usuario_acomodador,
                                        password: password_acomodador_encriptada,
                                        nombre: acomodador.nombre,
                                        correo: acomodador.correo,
                                        id_camping: id_camping
                                    })

                                    await new_acomodador.save()
                                        .catch(error => { throw new Error(error) })
                                })
                        })*/
                    })
                    .catch(error => { throw new Error(error) })
            })
    } catch(error) {
        next(error)
    }
}

module.exports = { registrarCamping }

/**
 * Genera una contraseña de 12 caracteres aleatoria.
 * @returns String
 */
const crearPasswordAleatorio = () => {
    const letras = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']
    const puntuacion = [...'!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~']
    const numeros = new Array(10).fill(0).map((n, indice) => n = indice)

    const caracteres = [...letras, ...puntuacion, ...numeros]

    let password = ''

    for(let i = 0; i < 12; i++) {
        const caracter = caracteres[Math.floor(Math.random() * caracteres.length - 1)]
        password += caracter
    }

    return password
}