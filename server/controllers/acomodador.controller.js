const { ResponseAPI } = require('../classes/ResponseAPI')
const { Acomodador } = require('../models/Acomodador')
const bcrypt = require('bcrypt')
const { transporter } = require('../email/transporter')
const { Camping } = require('../models/Camping')
const { DuplicatedError } = require('../errors/errors')
require('dotenv/config')

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
            let usuario_acomodador = `${acomodador.nombre}_${nombre_camping.replaceAll(' ', '_')}`.toLowerCase()
            let existe = false

            do {
                comprobarExistenciaNombreUsuario(usuario_acomodador)
                    .then(existe_nombre_usuario => {
                        if(existe_nombre_usuario) {
                            usuario_acomodador += Math.floor(Math.random() * (9 - 1 + 1)) + 1
                            existe = true
                        } else {
                            existe = false
                        }
                    })
            } while(existe)
            
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
                        .then(results => {
                            results_acomodadores.push(results)
                            enviarEmail(acomodador.correo, acomodador.nombre, usuario_acomodador, password_acomodador, nombre_camping)
                        })
                        .catch(error => { throw new Error(error) })
                })
        })

        res.status(200).send(new ResponseAPI('ok', 'Acomodadores creados correctamente', results_acomodadores))
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve un usuario acomodador si el usuario y contraseña son correctos.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverAcomodador = async (req, res, next) => {
    try {
        const { usuario, password } = req.params

        await Acomodador.findOne({ usuario }).exec()
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
 * Devuelve los datos del acomodador por su ID.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverAcomodadorPorID = async (req, res, next) => {
    try {
        const { id_acomodador } = req.params

        await Acomodador.findById(id_acomodador).exec()
            .then(results => {
                if(results) {
                    res.status(200).send(new ResponseAPI('ok', `Acomodador con id "${id_acomodador}"`, results))
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No se encunetra el acomodador con id "${id_acomodador}"`, null))
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
 * Devuelve los acomodadores de un camping.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverAcomodadoresCamping = async (req, res, next) => {
    try {
        const { id_camping } = req.params

        await Acomodador.find({ id_camping }).exec()
            .then(results => {
                if(results) {
                    res.status(200).send(new ResponseAPI('ok', `Acomodadores del camping con id "${id_camping}"`, results))
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No se encunetran acomodadores en el camping con id "${id_acomodador}"`, null))
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
 * Devuelve la informacion de un camping de un acomodador.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverCampingDeAcomodador = async (req, res, next) => {
    try {
        const { id } = req.params

        await Acomodador.findById(id).exec()
            .then(async resultsAcomodador => {
                await Camping.findById(resultsAcomodador.id_camping).exec()
                    .then(results => res.status(200).send(new ResponseAPI('ok', `Camping con id ${resultsAcomodador.id_camping}`, results)))
                    .catch(error => { throw new Error(error) })
            })
            .catch(error => { throw new Error(error) })
    } catch (error) {
        next(error)
    }
}

/**
 * Actualiza los datos de un acomodador.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const actualizarDatosAcomodador = async (req, res, next) => {
    try {
        const { id } = req.params
        const imagen = req.file ? req.file.filename : null

        const datosAcomodador = JSON.parse(req.body.datos)

        const objUpdate = { ...datosAcomodador }
        if (imagen) objUpdate.imagen = imagen

        comprobarExistenciaNombreUsuario(objUpdate.usuario, id)
            .then(async existe_nombre_usuario => {
                if(!existe_nombre_usuario) {
                    await Acomodador.findByIdAndUpdate(id, objUpdate, { returnDocument: 'after' }).exec()
                        .then(results => {
                            res.status(200).send(new ResponseAPI('ok', `Acomodador con id ${id} actualizado correctamente`, results))
                        })
                        .catch(error => {
                            throw new Error(error)
                        })
                } else {
                    next(new DuplicatedError('usuario', `El nombre del usuario ya existe. Escoge otro.`))
                }
            })

    } catch (error) {
        next(error)
    }
}

/**
 * Actualiza la contraseña de un acomodador.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const actualizarPasswordAcomodador = async (req, res, next) => {
    try {
        const { id } = req.params
        const { new_password } = req.body

        await bcrypt.hash(new_password, 10)
            .then(async new_password_hasheada => {
                await Acomodador.findByIdAndUpdate(id, { password: new_password_hasheada }, { returnDocument: 'after' }).exec()
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

/**
 * Actualiza los acomodadores de un camping
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const actualizarAcomodadoresCamping = async (req, res, next) => {
    try {
        const { id_camping } = req.params
        const { acomodadores } = req.body

        const lista_id_acomodadores = acomodadores.map(acomodador => acomodador.id)

        let resultado = true

        const camping = await Camping.findById(id_camping).exec()

        await Acomodador.find({ id_camping }).exec()
            .then(results_acomodadores => {
                const lista_id_acomodadores_bbdd = results_acomodadores.map(acomodador => acomodador._id.toString())

                const acomodadores_eliminados = lista_id_acomodadores_bbdd.filter(id_acomodador => !lista_id_acomodadores.includes(id_acomodador))
                const acomodadores_nuevos = acomodadores.filter(acomodador => !lista_id_acomodadores_bbdd.includes(acomodador.id))
                const acomodadores_modificados = acomodadores.filter(acomodador => lista_id_acomodadores_bbdd.includes(acomodador.id))

                // Eliminado acomodadores
                if (acomodadores_eliminados.length > 0) {
                    acomodadores_eliminados.forEach(async id_acomodador => {
                        await Acomodador.findByIdAndDelete(id_acomodador)
                            .catch(e => { resultado = false; throw new Error(e) })
                    })
                }
                
                // Creando nuevos acomodadores
                if (acomodadores_nuevos.length > 0) {
                    acomodadores_nuevos.forEach(async acomodador => {
                        let usuario_acomodador = `${acomodador.nombre}_${camping.nombre.replaceAll(' ', '_')}`.toLowerCase()
                        let existe = false

                        do {
                            comprobarExistenciaNombreUsuario(usuario_acomodador)
                                .then(existe_nombre_usuario => {
                                    if(existe_nombre_usuario) {
                                        usuario_acomodador += Math.floor(Math.random() * (9 - 1 + 1)) + 1
                                        existe = true
                                    } else {
                                        existe = false
                                    }
                                })
                        } while(existe)
                        const password_acomodador = crearPasswordAleatorio()

                        console.log(usuario_acomodador, password_acomodador)

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
                                    .then(() => {
                                        enviarEmail(acomodador.correo, acomodador.nombre, usuario_acomodador, password_acomodador, '')
                                    })
                                    .catch(error => { resultado = false; throw new Error(error) })
                            })
                    })
                }

                // Modificando los datos de los acomodadores ya existentes
                if (acomodadores_modificados.length > 0) {
                    acomodadores_modificados.forEach(async acomodador => {
                        let usuario_acomodador = acomodador.nombre
                        let existe = false

                        do {
                            comprobarExistenciaNombreUsuario(usuario_acomodador, acomodador.id)
                                .then(existe_nombre_usuario => {
                                    if(existe_nombre_usuario) {
                                        usuario_acomodador += Math.floor(Math.random() * (9 - 1 + 1)) + 1
                                        existe = true
                                    } else {
                                        existe = false
                                    }
                                })
                        } while(existe)

                        await Acomodador.findByIdAndUpdate(acomodador.id, { nombre: usuario_acomodador, correo: acomodador.correo }, {returnDocument: 'after'}).exec()
                            .catch(e => { resultado = false; throw new Error(e) })
                    })
                }
            })
            .catch(error => {
                throw new Error(error)
            })
            .finally(() => resultado ? res.status(200).send(new ResponseAPI('ok', 'Acomodadores actualizados', true)) : res.status(500).send(new ResponseAPI('error', 'No se han podido actualizar los acomodadores', false)))
    } catch (error) {
        next(error)
    }
}

module.exports = { registrarAcomodadores, devolverAcomodador, devolverAcomodadorPorID, actualizarDatosAcomodador, actualizarPasswordAcomodador, devolverAcomodadoresCamping, actualizarAcomodadoresCamping, devolverCampingDeAcomodador }

/**
 * Comprueba si existe ese nombre de usuario
 * @param {String} usuario 
 * @returns boolean
 */
const comprobarExistenciaNombreUsuario = async (usuario, id = null) => {
    const acomodador = await Acomodador.find({ usuario: usuario, _id: { $ne: id } }).exec()
    return (acomodador.length > 0) ? true : false
}

/**
 * Genera una contraseña de 12 caracteres aleatoria.
 * @returns String
 */
const crearPasswordAleatorio = () => {
    const letras = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']
    const numeros = new Array(10).fill(0).map((n, indice) => n = indice)

    const caracteres = [...letras, ...numeros]

    let password = ''

    for(let i = 0; i < 12; i++) {
        const caracter = caracteres[Math.floor(Math.random() * (caracteres.length - 1))]
        password += caracter
    }

    return password
}

const enviarEmail = (correo, nombre, usuario, password, nombre_camping) => {
    const plantilla = `<!doctype html>
        <html lang='es'>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                    .plantilla {
                        height: fit-content;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .plantilla__logo {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .plantilla__logo img {
                        height: 8rem;
                    }
                    
                    .plantilla__logo h1 {
                        color: rgb(58, 82, 135);
                        margin: 0 0 2rem;
                    }
                    
                    .plantilla > p {
                        font-style: italic;
                        margin: 2rem 0;
                    }
                    
                    .plantilla__credenciales {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .plantilla__credenciales div {
                        display: flex;
                        align-items: center;
                        margin: .2rem 0;
                    }
                    
                    .plantilla__credenciales div .plantilla__credenciales__texto {
                        font-weight: bolder;
                        margin: 0 .7rem 0 0 ;
                    }
                    
                    .plantilla a {
                        padding: .4rem 2rem;
                        background-color: rgb(58, 82, 135);
                        color: whitesmoke;
                        font-size: 25px;
                        font-weight: bolder;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="plantilla">
                    <div class="plantilla__logo">
                        <img src="http://localhost:3000/static/figura-logo-circulo.png" />
                        <h1>ACOMODIN</h1>
                    </div>
                    <h2>¡Bienvenido a Acomodin ${nombre}!</h2>
                    <p>Aquí tienes tu usuario y contraseña para acceder a la web.</p>
                    <div class="plantilla__credenciales">
                        <div>
                            <p class="plantilla__credenciales__texto">Usuario: </p>
                            <p>${usuario}</p>
                        </div>
                        <div>
                            <p class="plantilla__credenciales__texto">Contraseña: </p>
                            <p>${password}</p>
                        </div>
                    </div>
                    <p>Te recomendamos que cambies estos campos desde tu Perfil lo antes posible.</p>
                    <a href="http://localhost:5173/login">INICIAR SESIÓN</a>
                </div>
            </body>
        </html>
    `

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: correo,
        subject: `Credenciales acomodador ${nombre}. Camping "${nombre_camping}"`,
        html: plantilla
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully: " + data);
        }
    })
}