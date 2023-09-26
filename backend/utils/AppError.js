//Custom error class
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

module.exports = AppError;