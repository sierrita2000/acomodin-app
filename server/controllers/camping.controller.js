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
        const { camping, zonas, acomodadores } = req.body

        bcrypt.hash(camping?.password, 10)
            .then(async passwordHash => {
                const new_camping = new Camping({ 
                    usuario: camping.usuario,
                    password: passwordHash,
                    correo: camping.correo,
                    nombre: camping.nombre,
                    logo: camping.logo || "",
                    tamanos: camping.tamanos,
                    caracteristicas: camping.caracteristicas,
                    conceptos: camping.conceptos
                })

                await new_camping.save()
                    .then(resultsCamping => {
                        const id_camping = resultsCamping._id

                        zonas.forEach(async zona => {
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

                            const new_acomodador = new Acomodador({
                                usuario: usuario_acomodador,
                                password: password_acomodador,
                                nombre: acomodador.nombre,
                                correo: acomodador.correo
                            })

                            await new_acomodador.save()
                                .catch(error => { throw new Error(error) })
                        })
                    })
                    .catch(error => { throw new Error(error) })
            })
            .catch(error => { throw new Error(error) })  
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