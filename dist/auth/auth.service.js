"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const users_service_1 = require("../users/users.service");
const app_error_1 = require("../utils/app-error");
const bcrypt = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_service_1 = require("../config/config.service");
class AuthService {
    constructor() {
        this.usersService = new users_service_1.UsersService();
        this.configService = new config_service_1.ConfigService();
    }
    async login(data) {
        const existingUser = await this.usersService.getUserByEmail(data.email);
        if (!existingUser) {
            throw app_error_1.AppError.notFound('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(data.password, existingUser.password);
        if (!isMatch) {
            throw app_error_1.AppError.badRequest('Invalid credentials');
        }
        const jwtSecret = this.configService.get('JWT_SECRET');
        const jwtExpiration = this.configService.get('JWT_EXPIRATION');
        const payload = { userId: existingUser._id, role: existingUser.role };
        const token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
        return {
            token,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                role: existingUser.role
            }
        };
    }
    async register(userData) {
        const existingUser = await this.usersService.getUserByEmail(userData.email);
        if (existingUser) {
            throw app_error_1.AppError.conflict('Email already exists');
        }
        const saltRounds = +this.configService.get('SALT_ROUNDS');
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const newUser = {
            ...userData,
            password: hashedPassword
        };
        await this.usersService.createUser(newUser);
    }
}
exports.AuthService = AuthService;
