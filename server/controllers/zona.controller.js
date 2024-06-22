const { ResponseAPI } = require('../classes/ResponseAPI')
const { Zona } = require('../models/Zona')
const { Parcela } = require('../models/Parcela')

/**
 * Registra varias zonas con sus respectivas parcelas en la BBDD.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const registrarZonas = (req, res, next) => {
    try {
        const { zonas, id_camping } = req.body

        const results_zonas = new Array()
        const results_parcelas = new Array()

        zonas.forEach(async zona => {
            const new_zona = new Zona({ 
                nombre: zona.nombre,
                tipos: zona.tipos,
                id_camping: id_camping
            })

            await new_zona.save()
                .then(results => {
                    results_zonas.push(results)
                    const id_zona = results._id

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
                            .then(resultsParcela => results_parcelas.push(resultsParcela))
                            .catch(error => { throw new Error(error) })
                    })
                })
                .catch(error => { throw new Error(error) })
        })

        res.status(200).send(new ResponseAPI('ok', 'Zonas creadas correctamente', { resultadoZonas: results_zonas, resultadoParcelas: results_parcelas }))
    } catch (error) {
        next(error)
    }
}

/**
 * Actualiza zonas y parcelas de un camping.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const actualizarZonas = async (req, res, next) => {
    try {
        const { zonas } = req.body
        const { id_camping } = req.params

        const lista_id_zonas = zonas.map(zona => zona.id)

        let resultado = true

        await Zona.find({ id_camping }).exec()
            .then(async results_zonas_camping => {
                if (results_zonas_camping.length > 0) {
                    const lista_id_zonas_bbdd = results_zonas_camping.map(zona => zona._id.toString())

                    const zonas_nuevas = zonas.filter(zona => !lista_id_zonas_bbdd.includes(zona.id))
                    const zonas_eliminadas = lista_id_zonas_bbdd.filter(id_zona => !lista_id_zonas.includes(id_zona))
                    const zonas_modificadas = zonas.filter(zona => lista_id_zonas_bbdd.includes(zona.id))

                    // Eliminando zonas
                    if (zonas_eliminadas.length > 0) {
                        zonas_eliminadas.forEach(async id_zona => {
                            await Zona.findByIdAndDelete(id_zona).exec()
                                .catch(e => { throw new Error(e) })
                            
                            await Parcela.deleteMany({ id_zona }).exec()
                                .catch(e => { throw new Error(e) })
                        })
                    }

                    // Creando zonas nuevas
                    if (zonas_nuevas.length > 0) {
                        zonas_nuevas.forEach(async zona => {
                            const obj_zona = new Zona({
                                nombre: zona.nombre,
                                tipos: zona.tipos,
                                id_camping: id_camping
                            })

                            await obj_zona.save()
                                .then(results_zona => {
                                    const id_zona = results_zona._id

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
                    }

                    // Actualizando zonas
                    if (zonas_modificadas.length > 0) {
                        zonas_modificadas.forEach(async zona => {
                            await Zona.findByIdAndUpdate(zona.id, { nombre: zona.nombre, tipos: zona.tipos }).exec()
                                .catch(error => { throw new Error(error) })

                            const lista_parcelas = zona.parcelas.map(parcela => parcela.id)

                            await Parcela.find({ id_zona: zona.id }).exec()    
                                .then(async results_parcelas => {
                                    const lista_id_parcelas_bbdd = results_parcelas.map(parcela => parcela._id.toString())

                                    const parcelas_nuevas = zona.parcelas.filter(parcela => !lista_id_parcelas_bbdd.includes(parcela.id))
                                    const parcelas_eliminadas = lista_id_parcelas_bbdd.filter(id_parcela => !lista_parcelas.includes(id_parcela))
                                    const parcelas_modificadas = zona.parcelas.filter(parcela => lista_id_parcelas_bbdd.includes(parcela.id))

                                    console.log(lista_parcelas, lista_id_parcelas_bbdd, parcelas_nuevas, parcelas_eliminadas, parcelas_modificadas)
                                    // Eliminando parcelas
                                    if (parcelas_eliminadas.length > 0) {
                                        parcelas_eliminadas.forEach(async id_parcela => {
                                            await Parcela.findByIdAndDelete(id_parcela).exec()
                                                .catch(e => { throw new Error(e) })
                                        })
                                    }

                                    // Creando parcelas nuevas
                                    if (parcelas_nuevas.length > 0) {
                                        parcelas_nuevas.forEach(async parcela => {
                                            const obj_parcela = new Parcela({
                                                nombre: parcela.nombre,
                                                tamano: parcela.tamano,
                                                electricidad: parcela.electricidad,
                                                tipos: parcela.tipos,
                                                caracteristicas: parcela.caracteristicas,
                                                id_zona: zona.id
                                            })

                                            await obj_parcela.save()
                                                .catch(e => { throw new Error(e) })
                                        })
                                    }

                                    // Modificando parcelas
                                    if (parcelas_modificadas.length > 0) {
                                        parcelas_modificadas.forEach(async parcela => {
                                            const updates = {
                                                nombre: parcela.nombre,
                                                tamano: parcela.tamano,
                                                electricidad: parcela.electricidad,
                                                tipos: parcela.tipos,
                                                caracteristicas: parcela.caracteristicas
                                            }

                                            await Parcela.findByIdAndUpdate(parcela.id, updates, { returnDocument: 'after' }).exec()
                                                .catch(e => { throw new Error(e) })
                                        })
                                    }
                                })
                        })
                    }
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen zonas en el camping con id "${id_camping}"`, null))
                }
            })
            .catch(() => {
                throw new Error(error)
            })
            .finally(() => {
                resultado ? res.status(200).send(new ResponseAPI('ok', 'Zonas aztualizadas correctamente', [])) : res.status(500).send(new ResponseAPI('error', 'No se han podido actualñizar las parcelas', []))
            })
    } catch (error) {
        next(error)
    }
}

/**
 * Devuelve las zonas de un camping.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverZonas = async (req, res, next) => {
    try {
        const { id_camping } = req.params

        await Zona.find({ id_camping }).exec()
            .then(results => {
                if (results.length != 0) {
                    res.status(200).send(new ResponseAPI('ok', `Zonas del camping con id "${id_camping}"`, results))
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen zonas que pertenezcan al camping con id "${id_camping}"`, null))
                }
            })
            .catch(error => {
                res.status(404).send(new ResponseAPI('not-found', `No existe ningún camping con id "${id_camping}"`, null))
            })
    } catch(error) {
        next(error)
    }
}

module.exports = { registrarZonas, devolverZonas, actualizarZonas }