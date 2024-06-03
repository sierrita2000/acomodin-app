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

module.exports = { registrarZonas }