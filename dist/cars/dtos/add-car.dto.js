"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCarDto = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AddCarDto = joi_1.default.object({
    make: joi_1.default.string().min(2).max(50).required(),
    model: joi_1.default.string().min(2).max(50).required(),
    year: joi_1.default.number().integer().min(1886).max(new Date().getFullYear()).required(),
    vin: joi_1.default.string().length(17).required(), // VIN must be exactly 17 characters
    color: joi_1.default.string().min(3).max(30).required(),
    mileage: joi_1.default.number().integer().min(0).required(),
    price: joi_1.default.number().positive().required(),
    description: joi_1.default.string().max(500).optional()
});
