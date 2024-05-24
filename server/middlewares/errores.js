const { ResponseAPI } = require("../classes/ResponseAPI")

const errores = async (err, req, res, next) => {
    await res.status(500).send(new ResponseAPI('error', 'Error en el servidor', err.message))
}

module.exports = { errores }