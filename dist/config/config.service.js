"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const enviroment_validate_1 = require("./enviroment.validate");
const app_error_1 = require("../utils/app-error");
const envConfig = dotenv_1.default.config();
class ConfigService {
    constructor() {
        this.config = {};
        this.loadConfig();
    }
    loadConfig() {
        const { error, value } = enviroment_validate_1.environmentSchema.validate(envConfig.parsed);
        if (error) {
            throw app_error_1.AppError.badRequest(`Invalid configuration: ${error.message}`);
        }
        this.config = value;
    }
    get(key) {
        return this.config[key];
    }
}
exports.ConfigService = ConfigService;
