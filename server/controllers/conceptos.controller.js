const { ResponseAPI } = require('../classes/ResponseAPI')
const { Concepto } = require('../models/Conceptos')

/**
 * Creación de conceptos con su nombre e imagen.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const crearConceptos = async (req, res, next) => {
    try {
        const { conceptos } = req.body

        const results = new Array()

        conceptos.forEach(async c => {
            let concepto = new Concepto({ nombre: c[0], imagen: c[1] })
            await concepto.save()
                .then( result => console.log(results.push(result)))
                .catch(error => { throw new Error(error) })
        })
    } catch(error) {
        next(error)
    }
}

/**
 * Devuelve todos los conceptos.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const devolverConceptos = async (req, res, next) => {
    try {
        await Concepto.find().exec()
            .then(results => res.status(200).send(new ResponseAPI('ok', 'Conceptos', results)))
            .catch(error => { throw new Error(error) })
    } catch(error) {
        next(error)
    }
}

module.exports = { crearConceptos,devolverConceptos }