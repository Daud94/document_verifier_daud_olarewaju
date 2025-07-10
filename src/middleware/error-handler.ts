import Joi from 'joi'
import {NextFunction, Request, Response} from "express";
import {AppError} from "../utils/app-error";

export const errorHandler = (err: any,req: Request, res: Response, next: NextFunction) => {
    // Log error with more context
    console.error({
        message: err?.message,
        stack: err?.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
    })

    // Handle AppError instances
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    // Default error response
    const statusCode = err.statusCode || err.status || 500
    const message = statusCode === 500 ? 'Internal server error' : err.message

    return res.status(statusCode).json({
        success: false,
        message
    })
}

