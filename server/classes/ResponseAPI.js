const ResponseAPI = class {
    constructor (status, message, results) {
        this.status = status
        this.message = message
        this.results = results
    }
}

module.exports = { ResponseAPI }