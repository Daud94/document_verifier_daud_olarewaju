import jwt, {JwtPayload} from 'jsonwebtoken'
import {AppError} from "../utils/app-error";
import {NextFunction, Request, Response} from "express";
import {ConfigService} from "../config/config.service";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const configService = new ConfigService()


export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader =
            req.headers.authorization ?? req.headers.Authorization
        if (!authHeader) {
            throw AppError.unauthorized('Authentication required')
        }

        if (typeof authHeader !== 'undefined') {
            if (typeof authHeader !== 'string') {
                throw AppError.unauthorized('Invalid authorization header format')
            }

            // Check if the header starts with 'Bearer '
            if (!authHeader.startsWith('Bearer ')) {
                throw AppError.unauthorized('Invalid authorization header format')
            }
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw AppError.unauthorized('Authentication required')
        }

        const JWT_SECRET: string = configService.get('JWT_SECRET')
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (error: any) {
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError'
        ) {
            next(AppError.unauthorized('Invalid or expired token'))
        } else {
            next(error)
        }
    }
}
