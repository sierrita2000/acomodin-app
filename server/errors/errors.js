class ValidationError extends Error {
    constructor(path, message) {
        super()
        this.path = path,
        this.message = message,
        this.name = 'ValidationError'
    }
}

class DuplicatedError extends Error {
    constructor(path, message) {
        super()
        this.path = path,
        this.message = message,
        this.name = 'DuplicatedError'
    }
}

module.exports = { ValidationError, DuplicatedError }