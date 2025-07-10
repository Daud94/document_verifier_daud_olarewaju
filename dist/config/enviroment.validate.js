"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.environmentSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: joi_1.default.number().default(3000),
    CONNECTION_STRING: joi_1.default.string().uri().required(),
    DATABASE: joi_1.default.string().default('car-buddy'),
    JWT_SECRET: joi_1.default.string().min(32).required(),
    JWT_EXPIRATION: joi_1.default.string().default('1h'),
    SALT_ROUNDS: joi_1.default.number().required(),
});
