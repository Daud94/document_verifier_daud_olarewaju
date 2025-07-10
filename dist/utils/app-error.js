"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            ...(process.env.NODE_ENV === 'development' && {
                stack: this.stack,
            }),
        };
    }
    static badRequest(message = 'Bad Request') {
        return new AppError(message, 400);
    }
    static unauthorized(message = 'Unauthorized') {
        return new AppError(message, 401);
    }
    static forbidden(message = 'Forbidden') {
        return new AppError(message, 403);
    }
    static notFound(message = 'Not Found') {
        return new AppError(message, 404);
    }
    static conflict(message = 'Conflict') {
        return new AppError(message, 409);
    }
    static validation(message = 'Validation Error') {
        return new AppError(message, 422);
    }
    static internal(message = 'Internal Server Error') {
        return new AppError(message, 500);
    }
}
exports.AppError = AppError;
