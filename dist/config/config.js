"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_service_1 = require("./config.service");
const connectDatabase = async () => {
    try {
        const configService = new config_service_1.ConfigService();
        const connectionString = configService.get('CONNECTION_STRING');
        await mongoose_1.default.connect(connectionString, {
            dbName: configService.get('DATABASE'),
        });
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
};
exports.connectDatabase = connectDatabase;
