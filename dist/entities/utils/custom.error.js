export class CustomError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.name = "CustomError";
        this.statusCode = statusCode || 500;
    }
}
