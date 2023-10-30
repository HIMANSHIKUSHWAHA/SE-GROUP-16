//Custom error class
class AppError extends Error {
    constructor(message, status) {
        super(message);
        console.log(message);
        this.status = status;
    }
}

module.exports = AppError;