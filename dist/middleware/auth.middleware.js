"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = require("../utils/app-error");
const config_service_1 = require("../config/config.service");
const configService = new config_service_1.ConfigService();
const AuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization ?? req.headers.Authorization;
        if (!authHeader) {
            throw app_error_1.AppError.unauthorized('Authentication required');
        }
        if (typeof authHeader !== 'undefined') {
            // Ensure authHeader is a string
            if (typeof authHeader !== 'string') {
                throw app_error_1.AppError.unauthorized('Invalid authorization header format');
            }
            // Check if the header starts with 'Bearer '
            if (!authHeader.startsWith('Bearer ')) {
                throw app_error_1.AppError.unauthorized('Invalid authorization header format');
            }
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw app_error_1.AppError.unauthorized('Authentication required');
        }
        // eslint-disable-next-line no-undef
        const JWT_SECRET = configService.get('JWT_SECRET');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Add user info to request object
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError') {
            next(app_error_1.AppError.unauthorized('Invalid or expired token'));
        }
        else {
            next(error);
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
