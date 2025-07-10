"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarDto = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UpdateCarDto = joi_1.default.object({
    make: joi_1.default.string().min(2).max(50).optional(),
    model: joi_1.default.string().min(2).max(50).optional(),
    year: joi_1.default.number().integer().min(1886).max(new Date().getFullYear()).optional(),
    vin: joi_1.default.string().length(17).optional(), // VIN must be exactly 17 characters
    color: joi_1.default.string().min(3).max(30).optional(),
    mileage: joi_1.default.number().integer().min(0).optional(),
    price: joi_1.default.number().positive().optional(),
    description: joi_1.default.string().max(500).optional(),
    status: joi_1.default.string().valid('sold', 'available', 'ordered').optional()
});
