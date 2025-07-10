"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_1 = require("../utils/app-error");
const errorHandler = (err, req, res, next) => {
    // Log error with more context
    console.error({
        message: err?.message,
        stack: err?.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    // Handle AppError instances
    if (err instanceof app_error_1.AppError) {
        console.log("is an AppError");
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    console.log(err.statusCode);
    // Default error response
    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;
    return res.status(statusCode).json({
        success: false,
        message
    });
};
exports.errorHandler = errorHandler;
