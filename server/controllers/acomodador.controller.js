const { ResponseAPI } = require('../classes/ResponseAPI')
const { Acomodador } = require('../models/Acomodador')
const bcrypt = require('bcrypt')

/**
 * Registra en la BBDD varios acomodadores.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const registrarAcomodadores = (req, res, next) => {
    try {
        const { acomodadores, id_camping, nombre_camping } = req.body

        const results_acomodadores = new Array()

        acomodadores.forEach(async acomodador => {
            const usuario_acomodador = `${acomodador.nombre}_${nombre_camping.replaceAll(' ', '_')}`
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
                        .then(results => results_acomodadores.push(results))
                        .catch(error => { throw new Error(error) })
                })
        })

        res.status(200).send(new ResponseAPI('ok', 'Acomodadores creados correctamente', results_acomodadores))
    } catch(error) {
        next(error)
    }
}

module.exports = { registrarAcomodadores }

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