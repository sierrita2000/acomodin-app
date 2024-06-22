const { ResponseAPI } = require('../classes/ResponseAPI')
const { Estancia } = require('../models/Estancia')

const devolverEstanciasDeParcela = async (req, res, next) => {
    try {
        const { id_parcela } = req.params
        const fecha_actual = new Date()

        // Estancias que incluyan la parcela con id "id_parcela" y que sean de hoy o más adelante. 
        await Estancia.find({ parcelas: { $in: [id_parcela] }, fecha_fin: { $gt: fecha_actual } }).exec()
            .then(results => {
                if(results.length > 0) {
                    res.status(200).send(new ResponseAPI('ok', `Reservas de la parcela con id ${id_parcela}`, results))
                } else {
                    res.status(404).send(new ResponseAPI('not-found', `No existen reservas para la parcela con id ${id_parcela}`, []))
                }
            })
            .catch(error => { throw new Error(error) })
    } catch (error) {
        next(error)
    }
}

module.exports = { devolverEstanciasDeParcela }